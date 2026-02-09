import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-conjunto-id, x-client-id',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Obtener Identificadores del Header
        const conjuntoId = req.headers.get('x-conjunto-id')
        const clientId = req.headers.get('x-client-id')

        if (!conjuntoId && !clientId) {
            return new Response(
                JSON.stringify({ error: 'Missing x-conjunto-id or x-client-id header' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // 2. Consulta de Suscripción
        let query = supabaseClient
            .from('client_subscriptions')
            .select(`
                id,
                status_id,
                trial_end_date,
                plans ( 
                    name, 
                    code,
                    plan_features ( key, value )
                ),
                catalog_items!status_id ( code )
            `)

        if (conjuntoId) {
            // Si viene conjunto_id, buscamos la suscripción activa vinculada al conjunto
            const { data: conjunto, error: conjuntoError } = await supabaseClient
                .from('conjuntos')
                .select('active_subscription_id')
                .eq('id', conjuntoId)
                .single()

            if (conjuntoError || !conjunto?.active_subscription_id) {
                return new Response(
                    JSON.stringify({ valid: false, message: 'Conjunto has no active subscription' }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
                )
            }
            query = query.eq('id', conjunto.active_subscription_id)
        } else {
            // Si solo viene client_id, es una consulta de nivel corporativo
            query = query.eq('client_id', clientId).order('created_at', { ascending: false }).limit(1)
        }

        const { data: subscription, error } = await query.single()

        if (error || !subscription) {
            return new Response(
                JSON.stringify({ valid: false, message: 'Subscription not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
            )
        }

        const statusCode = subscription.catalog_items?.code?.toUpperCase()
        const now = new Date()
        const trialExpired = subscription.trial_end_date && new Date(subscription.trial_end_date) < now

        // 3. Validar Estado y Trial
        let isValid = (statusCode === 'ACTIVE') || (statusCode === 'TRIAL' && !trialExpired)
        let message = isValid ? 'Subscription valid' : `Subscription is ${statusCode}`
        if (statusCode === 'TRIAL' && trialExpired) {
            isValid = false
            message = 'Trial period expired'
        }

        // 4. Mapear Features
        const features = subscription.plans?.plan_features?.map((f: any) => f.key) || []

        return new Response(
            JSON.stringify({
                valid: isValid,
                status: statusCode,
                message,
                planCode: subscription.plans?.code,
                planName: subscription.plans?.name,
                features,
                trialEndDate: subscription.trial_end_date
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
