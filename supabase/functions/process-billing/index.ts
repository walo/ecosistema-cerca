import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-id',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Obtener IDs de estados necesarios
        const { data: activeStatus } = await supabaseClient
            .from('catalog_items')
            .select('id')
            .eq('code', 'activa')
            .single()

        const { data: pendingStatus } = await supabaseClient
            .from('catalog_items')
            .select('id')
            .eq('code', 'pendiente')
            .single()

        if (!activeStatus || !pendingStatus) {
            throw new Error('Catalog statuses not found')
        }

        // 2. Obtener suscripciones activas que requieran facturación
        const { data: subscriptions, error: subError } = await supabaseClient
            .from('client_subscriptions')
            .select(`
        id,
        client_id,
        plan_id,
        plans ( price )
      `)
            .eq('status_id', activeStatus.id)

        if (subError) throw subError

        const results = []
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        for (const sub of subscriptions) {
            // Verificar si ya existe factura este mes
            const { data: existingInvoice } = await supabaseClient
                .from('invoices')
                .select('id')
                .eq('subscription_id', sub.id)
                .gte('issue_date', `${currentYear}-${currentMonth}-01`)
                .lte('issue_date', `${currentYear}-${currentMonth}-31`)
                .maybeSingle()

            if (!existingInvoice) {
                // Crear factura
                const { data: newInvoice, error: invError } = await supabaseClient
                    .from('invoices')
                    .insert({
                        client_id: sub.client_id,
                        subscription_id: sub.id,
                        amount: sub.plans.price,
                        total_amount: sub.plans.price,
                        status_id: pendingStatus.id,
                        due_date: new Date(now.setDate(now.getDate() + 5)).toISOString(), // 5 días para pagar
                        invoice_number: `INV-${sub.client_id.slice(0, 4)}-${Date.now().toString().slice(-6)}`
                    })
                    .select()
                    .single()

                if (invError) {
                    results.push({ sub_id: sub.id, status: 'error', message: invError.message })
                } else {
                    results.push({ sub_id: sub.id, status: 'created', invoice_id: newInvoice.id })
                }
            } else {
                results.push({ sub_id: sub.id, status: 'skipped', message: 'Invoice already exists for this month' })
            }
        }

        return new Response(
            JSON.stringify({ success: true, processed: results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
