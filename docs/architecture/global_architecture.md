# Arquitectura Global del Ecosistema Cerca

Este documento define la arquitectura de alto nivel del ecosistema Cerca, detallando la interacción entre los diferentes clientes, el backend (Supabase) y los servicios externos.

## Diagrama de Interacción del Sistema

```mermaid
graph TD
    subgraph "Clientes (Frontends)"
        WA["Admin Web / SaaS Admin
(Angular 17+)"]
        MA["Resident App
(Flutter)"]
        PA["Porter App
(Kotlin/Android)"]
    end

    subgraph "Gateway & Backend (Supabase)"
        Auth["Supabase Auth
(JWT & RLS)"]
        DB[("PostgreSQL Database
Multi-tenant")]
        Edge["Edge Functions
(Deno)"]
        Realtime[Realtime Engine]
        Storage[Storage Buckets]
    end

    subgraph "Servicios Externos"
        Wompi["Pasarela Wompi
(Pagos)"]
        FCM["Firebase Cloud Messaging
(Push Notifications)"]
    end

    %% Flujos de Comunicación
    WA -->|HTTPS / REST| Edge
    WA -->|Supabase Client| DB
    MA -->|Supabase Client| DB
    PA -->|Supabase Client| DB
    
    %% Autenticación
    WA -.->|Auth Token| Auth
    MA -.->|Auth Token| Auth
    PA -.->|Auth Token| Auth

    %% Pagos
    MA -->|Tokenización| Wompi
    Wompi -->|Webhook| Edge
    Edge -->|Update Status| DB

    %% Notificaciones
    Edge -->|Trigger| FCM
    FCM -->|Push| MA
    FCM -->|Push| PA
```

## Componentes Principales

### 1. Sistema de Gestión de Suscripciones (SaaS Core)
Responsable de la lógica multi-tenant, planes y facturación del software.
-   **Base de Datos**: Esquema dedicado (`clients`, `plans`, `invoices`).
-   **Acceso**: Gestionado vía RLS basado en `client_id` (Tenant ID).

### 2. Panel Administrativo (Angular)
Interfaz para administradores de conjunto y "Súper Admin" del SaaS.
-   **Tecnología**: Angular 17+ con Signals.
-   **Comunicación**: Directa con Supabase y Edge Functions para lógica de negocio compleja (ej. cierre de mes).

### 3. Aplicación de Residentes (Flutter)
Punto de contacto para los copropietarios.
-   **Tecnología**: Flutter.
-   **Offline-first**: Sincronización de datos críticos (facturas, noticias) para acceso sin conexión.
-   **Pagos**: Integración con Wompi para pago de administración.

### 4. Aplicación de Portería (Kotlin)
Herramienta de control de acceso y seguridad física.
-   **Tecnología**: Nativo Android (Kotlin).
-   **Hardware**: Integración directa con lectores NFC, Biometría y Cámaras.

## Flujo de Datos
1.  **Multi-tenancy**: Todas las consultas a la base de datos deben incluir el `tenant_id` (o `client_id`) en el contexto de la sesión o en la consulta explícita, forzado por políticas RLS.
2.  **Seguridad**:
    -   Autenticación vía Supabase Auth.
    -   Autorización vía RLS en PostgreSQL.
    -   Secretos gestionados en Supabase Vault / Environment Variables.
