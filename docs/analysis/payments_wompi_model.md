# Análisis de Requerimientos - Pagos y Cartera (Wompi Integration)

## Contexto
El módulo financiero es el corazón de la sostenibilidad del conjunto. Se requiere factura de administración, control de cartera y pagos en línea via Wompi.

## 1. Integración Wompi (Pasarela de Pagos)
Referencia: [Wompi Docs](https://docs.wompi.co/docs/colombia/inicio-rapido/)

*   **Modelo de Integración**: Widget/Web Checkout con redirección o API (versión inicial Widget es más sencillo, pero para App Móvil se prefiere API o Webview controlado).
*   **Integridad de Datos**: Se debe usar `Integrity Signature` (Cadena concatenada SHA256) para evitar manipulación de montos.

## 2. Entidades de Base de Datos

### A. Cartera y Facturación (`bills`)
Cuentas de cobro mensuales generadas automáticamente o manualmente.

*   `bills` (Factura/Cuenta de Cobro)
    *   `id` (uuid)
    *   `conjunto_id` (uuid)
    *   `unit_id` (uuid)
    *   `period` (date): Ej: '2023-11-01' (Mes facturado)
    *   `amount` (numeric): Valor base (ej: cuota administración).
    *   `interest` (numeric): Intereses de mora calculados.
    *   `total_amount` (numeric): Total a pagar.
    *   `status`: 'Pending', 'Paid', 'Overdue', 'Annulled'.
    *   `due_date` (date): Fecha límite pago oportuno.
    *   `description` (text): "Administración Noviembre 2023".

### B. Pagos de Tesorería (`treasury_payments`)
Registro de pagos de residentes (B2C). Se usa prefijo `treasury_` para diferenciar de `public.payments` (SaaS B2B).

*   `treasury_payments`
    *   `id` (uuid)
    *   `conjunto_id` (uuid)
    *   `unit_id` (uuid)
    *   `bill_id` (uuid, opcional, un pago puede cubrir varias facuras o ser un abono).
    *   `amount` (numeric)
    *   `payment_method`: 'Wompi', 'Consignacion', 'Efectivo'.
    *   `status`: 'Approved', 'Pending', 'Declined', 'Voided'.
    *   `reference_code`: Referencia única enviada a Wompi (Ej: `PAY-UN-123-TS-999`).
    *   `wompi_transaction_id`: ID retornado por Wompi.
    *   `proof_url`: Foto del comprobante (si es consignación manual).
    *   `paid_at`: Timestamp confirmación.

### C. Configuración Financiera (`financial_config`)
Datos para conectar con Wompi por conjunto.

*   `financial_config`
    *   `conjunto_id` (PK)
    *   `wompi_pub_key`: Llave pública del comercio (Wompi).
    *   `wompi_events_url`: URL de webhook (si se personaliza).
    *   `monthly_fee`: Valor cuota administración por defecto (si es fija) o por coeficiente.
    *   `interest_rate`: Tasa interés mora mensual.

## 3. Lógica de Negocio
1.  **Checkout**: Frontend genera referencia única -> Backend calcula firma de integridad -> Frontend lanza Widget Wompi.
2.  **Confirmación**: Wompi redirige a Frontend O notifica Webhook (Edge Function).
3.  **Conciliación**: Webhook actualiza `treasury_payments.status` y `bills.status`.
4.  **Mora**: Job programado (pg_cron o Edge Function diaria) revisa `bills` vencidos y aplica intereses.

## 4. Consideraciones de Seguridad
*   Las llaves privadas de Wompi (Integrity Secret, Private Key) NUNCA van en la DB expuesta al cliente. Deben estar en **Vault (Supabase Secrets)** y usarse solo en Edge Functions.
*   En `financial_config` solo guardamos la `wompi_pub_key`.
*   RLS estricto: Residentes solo ven sus facturas. Admin ve todas.
