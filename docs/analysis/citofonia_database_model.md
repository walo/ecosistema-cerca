# Análisis de Requerimientos de Base de Datos - Sistema de Citofonía y Control de Acceso

## 1. Contexto y Alcance
Este documento define las entidades, relaciones y consideraciones de seguridad necesarias para implementar el módulo de **Citofonía** y **Control de Acceso** dentro del Ecosistema Cerca. Se rige bajo la arquitectura **Multi-tenant** (SaaS) y las normativas de Propiedad Horizontal.

## 2. Entidades Principales

### A. Estructura Física (Propiedad Horizontal)
Estas entidades modelan la infraestructura del conjunto.

*   **`zones` (Zonas/Torres)**: Agrupación lógica de unidades.
    *   *Propiedades*: `id`, `conjunto_id`, `name` (Torre A, Interior 1), `description`.
*   **`units` (Unidades Privadas)**: Apartamentos, casas o locales.
    *   *Propiedades*: `id`, `conjunto_id`, `zone_id`, `name` (101, 201), `type` (Apto, Local), `intercom_code` (Código rápido para marcar).
    *   *Nota*: No almacena teléfonos directamente. Se conecta con los residentes.

### B. Actores (Usuarios)
*   **`profiles` (Perfiles de Usuario)**: Extensión de la tabla `auth.users` de Supabase.
    *   *Propiedades*: `id` (FK auth.users), `first_name`, `last_name`, `avatar_url`, `phone_number`.
*   **`residents` (Residentes)**: Relación entre Usuarios y Unidades.
    *   *Propiedades*: `id`, `conjunto_id`, `user_id` (FK), `unit_id` (FK), `type` (Propietario, Arrendatario, Familiar), `is_authorized_voice` (Puede contestar citófono), `is_primary_contact` (Es el contacto principal para marcado rápido), `status` (Active, Inactive).
    *   *Lógica de Llamada*: Al marcar el `intercom_code` de la unidad, el sistema buscará primero al residente con `is_primary_contact=true`. Si no contesta o no existe, intentará con los demás `is_authorized_voice=true`.
*   **`guards` (Personal de Seguridad)**:
    *   *Propiedades*: `id`, `conjunto_id`, `user_id` (FK), `shift_start`, `shift_end`, `device_id` (Tablet asignada).

### C. Citofonía (VoIP y Comunicación)
*   **`devices` (Dispositivos Físicos)**: Tablets de portería o citófonos IP.
    *   *Propiedades*: `id`, `conjunto_id`, `name` (Portería Principal), `ip_address`, `mac_address`, `status` (Online, Offline), `sip_extension`.
*   **`call_logs` (Historial de Llamadas)**:
    *   *Propiedades*: `id`, `conjunto_id`, `source_device_id` (o user_id), `destination_unit_id` (o user_id), `start_time`, `end_time`, `duration`, `status` (Answered, Missed, Rejected, Failed), `recording_url` (Opcional, seguridad), `webrtc_session_id`.

### D. Control de Acceso y Visitas
*   **`visitors` (Base de Datos de Visitantes)**: Historial único de personas para agilizar ingresos.
    *   *Propiedades*: `id`, `document_number` (Cédula), `document_type`, `full_name`, `photo_url` (Foto ingreso), `vehicle_plate`.
*   **`visits` (Registro de Visitas)**:
    *   *Propiedades*: `id`, `conjunto_id`, `unit_id`, `visitor_id`, `resident_id` (Quien autoriza), `entry_time`, `exit_time`, `type` (Social, Domicilio, Servicio), `status` (Pending, Approved, Rejected, Active, Completed), `notes`.
*   **`access_logs` (Eventos de Hardware)**:
    *   *Propiedades*: `id`, `conjunto_id`, `device_id`, `event_type` (Door Open, Access Denied), `timestamp`, `details`.

### E. Gestión de Paquetería (`packages`)
*   **`packages` (Paquetería)**: Registro de recepción en portería.
    *   *Propiedades*: `id`, `conjunto_id`, `unit_id`, `resident_id` (Opcional), `receptionist_guard_id`, `carrier` (Empresa), `tracking_number`, `status` (Received, Delivered), `photo_url`, `delivered_at`.

### F. Reservas de Zonas Comunes
*   **`common_areas` (Zonas Comunes)**: Salones, BBQ, Piscinas.
    *   *Propiedades*: `id`, `conjunto_id`, `name`, `capacity`, `hourly_cost`, `opening_hours` (JSON).
*   **`reservations` (Reservas)**:
    *   *Propiedades*: `id`, `conjunto_id`, `common_area_id`, `resident_id`, `start_time`, `end_time`, `status` (Pending, Approved), `cost`, `attendees_count`.

### G. Marketplace (Comercio Vecinal)
*   **`marketplace_listings` (Clasificados)**:
    *   *Propiedades*: `id`, `conjunto_id`, `seller_id` (Residente), `title`, `price`, `status` (Active, Sold), `is_verified_neighbor`, `category`.
*   **`marketplace_orders` (Pedidos)**:
    *   *Propiedades*: `id`, `listing_id`, `buyer_id`, `status` (Pending, Completed).

## 3. Seguridad y Multi-tenancy (RLS)
Todas las tablas deben tener habilitado **RLS (Row Level Security)**.

### Políticas Críticas:
1.  **Aislamiento Total**: `conjunto_id` es obligatorio en todas las consultas.
    *   `auth.jwt() ->> 'conjunto_id'` debe coincidir con el registro.
2.  **Privacidad de Residentes**:
    *   Los **Guardas** pueden VER unidades y residentes (limitado a nro apto y nombre principal) para anunciar visitas.
    *   Los **Residentes** solo pueden ver SUS propias visitas y SU historial de llamadas.
    *   Los **Administradores** pueden ver toda la actividad operativa pero NO escuchar grabaciones de llamadas privadas (salvo auditoría legal).

## 4. Requerimientos Técnicos
1.  **Real-time**: Uso de Supabase Realtime para notificar llamadas entrantes (`call_logs`) y solicitudes de acceso (`visits`).
2.  **Push Notifications**: Integración con FCM/APNs para "despertar" apps de residentes (CallKit).
3.  **Auditoría**: `created_by` y `updated_by` en registros sensibles (Visitas).

## 5. Próximos Pasos (Workflow)
1.  Aprobar este modelo de datos.
2.  Crear la migración SQL (`0002_citofonia_schema.sql`).
3.  Implementar los triggers de seguridad RLS.
4.  Generar los tipos de TypeScript para el Frontend.
