import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

        const payload = await req.json()
        const { event, data } = payload

        if (event === 'transaction.updated') {
            const transaction = data.transaction
            const invoiceNumber = transaction.reference // Asumimos que la referencia es el número de factura

            if (transaction.status === 'APPROVED') {
                // 1. Obtener ID de estado 'pagada'
                const { data: paidStatus } = await supabaseClient
                    .from('catalog_items')
                    .select('id')
                    .eq('code', 'pagada')
                    .single()

                // 2. Actualizar factura
                const { data: invoice, error: invError } = await supabaseClient
                    .from('invoices')
                    .update({
                        status_id: paidStatus.id,
                        payment_date: new Date().toISOString()
                    })
                    .eq('invoice_number', invoiceNumber)
                    .select()
                    .single()

                if (invError) throw invError

                // 3. Registrar en auditoría
                await supabaseClient
                    .from('subscription_history')
                    .insert({
                        client_id: invoice.client_id,
                        change_type: 'BILLING',
                        notes: `Pago aprobado vía Wompi para factura ${invoiceNumber}. Ref: ${transaction.id}`
                    })
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
