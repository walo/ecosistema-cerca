# Análisis de Requerimientos - Módulos Adicionales
## Contexto
Ampliación del esquema de base de datos para cubrir funcionalidades operativas y comerciales del Ecosistema Cerca.

## 1. Gestión de Paquetería (`packages`)
Fundamental para la operación de portería.

*   **Entidades**:
    *   `packages`: Registro individual de correspondencia.
*   **Propiedades Clave**:
    *   `conjunto_id` (Obligatorio, RLS).
    *   `unit_id` (Destino).
    *   `resident_id` (Destinatario específico, opcional).
    *   `receptionist_guard_id` (Guarda que recibe).
    *   `carrier` (Empresa: Servientrega, Amazon, etc.).
    *   `tracking_number` (Opcional, para scanner OCR en futuro).
    *   `status`: 'Received', 'Notified', 'Delivered', 'Returned'.
    *   `photo_url`: Evidencia de recepción.
    *   `delivered_at`, `picked_up_by`.

## 2. Reservas de Zonas Comunes (`reservations`)
Gestión de amenities (Salones comunales, BBQ, Piscinas).

*   **Entidades**:
    *   `common_areas`: Definición de espacios.
        *   `name`, `description`, `capacity`, `hourly_cost`, `requires_approval`, `opening_hours` (JSON).
    *   `reservations`: El bloqueo del espacio.
        *   `common_area_id`.
        *   `resident_id`.
        *   `start_time`, `end_time`.
        *   `status`: 'Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'.
        *   `cost` (Cálculo inicial, *facturación vendrá después*).
        *   `attendees_count`.

## 3. Marketplace (`marketplace`)
Comercio vecinal y aliados.

*   **Entidades**:
    *   `marketplace_categories`: Categorización (Comida, Servicios, Segunda Mano).
    *   `marketplace_listings`: Productos o Servicios ofrecidos.
        *   `seller_id` (Residente o Aliado Externo).
        *   `title`, `description`, `price`.
        *   `images` (Array).
        *   `status`: 'Active', 'Sold', 'Paused'.
        *   `is_verified_neighbor` (Check contra tabla residents).
    *   `marketplace_orders`: Intención de compra (Simple por ahora).
        *   `listing_id`.
        *   `buyer_id`.
        *   `status`: 'Pending', 'Accepted', 'Completed', 'Cancelled'.
        *   `delivery_method`: 'Porteria', 'Directo'.

## Consideraciones Técnicas
*   **RLS**: Todo aislado por `conjunto_id`.
*   **Indices**: Por `conjunto_id`, `status` y fechas.
*   **Marketplace Geo**: Preparar campos de lat/long en Listings si es Aliado Externo (aunque inicialmente es interno).
