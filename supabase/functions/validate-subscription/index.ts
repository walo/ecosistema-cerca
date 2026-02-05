import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-conjunto-id',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Get Conjunto ID (Client ID) from Header
        const conjuntoId = req.headers.get('x-conjunto-id')

        if (!conjuntoId) {
            return new Response(
                JSON.stringify({ error: 'Missing x-conjunto-id header' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // 2. Query Client Subscription
        // Check if there is an ACTIVE subscription for this client
        const { data: subscription, error } = await supabaseClient
            .from('client_subscriptions')
            .select(`
        id,
        status_id,
        plans ( name, code ),
        catalog_items!status_id ( code )
      `)
            .eq('client_id', conjuntoId)
            // We look for the most active/relevant subscription. 
            // Assumption: A client might have multiple records (history), we want the current one.
            // Filter by status where code is 'ACTIVE' or 'TRIAL'
            // Ideally we should know the ID of the 'Active' status or join with catalog.
            // For performance, we can fetch all and filter in code or use a known status ID if fixed.
            // Let's join with catalog_items which holds the status codes.
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !subscription) {
            console.error("Subscription Error:", error)
            return new Response(
                JSON.stringify({ valid: false, message: 'No subscription found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
            )
        }

        const statusCode = subscription.catalog_items?.code?.toUpperCase()

        // 3. Validate Status
        if (statusCode !== 'ACTIVE' && statusCode !== 'TRIAL') {
            return new Response(
                JSON.stringify({
                    valid: false,
                    message: `Subscription is ${statusCode}`,
                    plan: subscription.plans?.name
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
            )
        }

        // 4. Return Success
        return new Response(
            JSON.stringify({
                valid: true,
                plan: subscription.plans?.code,
                planName: subscription.plans?.name
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
