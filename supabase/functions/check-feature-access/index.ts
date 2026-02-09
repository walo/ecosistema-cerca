import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-conjunto-id',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { feature_key } = await req.json()
        const conjuntoId = req.headers.get('x-conjunto-id')

        if (!feature_key || !conjuntoId) {
            return new Response(
                JSON.stringify({ error: 'Missing feature_key or x-conjunto-id' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Obtener la suscripción activa del conjunto
        const { data: conjunto, error: conjError } = await supabaseClient
            .from('conjuntos')
            .select(`
                active_subscription_id,
                client_subscriptions (
                    status_id,
                    trial_end_date,
                    plans (
                        plan_features ( key )
                    )
                )
            `)
            .eq('id', conjuntoId)
            .single()

        if (conjError || !conjunto?.active_subscription_id) {
            return new Response(
                JSON.stringify({ allowed: false, reason: 'No active subscription' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        const sub = conjunto.client_subscriptions
        const features = sub.plans?.plan_features?.map((f: any) => f.key) || []

        const isAllowed = features.includes(feature_key)

        return new Response(
            JSON.stringify({
                allowed: isAllowed,
                feature_key,
                reason: isAllowed ? null : 'Feature not included in current plan',
                upgrade_required: !isAllowed
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
