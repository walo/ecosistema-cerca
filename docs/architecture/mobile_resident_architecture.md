# Arquitectura App Residentes (Flutter)

Este documento define la arquitectura técnica para la aplicación móvil de residentes (`resident-app`).

## Estrategia Tecnológica
-   **Framework**: Flutter (iOS & Android).
-   **Gestión de Estado**: **Riverpod** (Recomendado) o Bloc.
-   **Arquitectura**: Clean Architecture (Presentation, Domain, Data).

## Diagrama de Componentes

```mermaid
graph TD
    UI[UI Layer<br/>(Widgets)] --> State[State Management<br/>(Riverpod/Bloc)]
    State --> UseCases[Domain Layer<br/>(Use Cases)]
    UseCases --> Repository[Repository Interface]
    Repository --> DataSource[Data Layer<br/>(Data Sources)]
    
    DataSource -->|Local| LocalDB[(Hive/Sqflite)]
    DataSource -->|Remote| RemoteAPI[Supabase Client]
    
    subgraph "Capacidades Offline"
        RemoteAPI -- Sincronización --> LocalDB
        LocalDB -- Lectura --> Repository
    end
```

## Módulos Principales

### 1. Pagos (Wompi)
-   Integración de SDK de Wompi o WebView controlado.
-   **Flujo Crítico**:
    1.  Obtener deuda desde Supabase.
    2.  Iniciar transacción Wompi con `integrity_signature`.
    3.  Confirmar estado de transacción.
    4.  Actualizar Supabase (vía Webhook o confirmación cliente segura).

### 2. Noticias y Comunicados (Offline)
-   Descarga de noticias en segundo plano.
-   Almacenamiento local para lectura sin conexión.

### 3. Notificaciones (FCM)
-   Recepción de alertas de portería (Llegada de visita, paquete).
-   Deep linking para navegar a la sección relevante.

## Manejo de Datos
-   **Repositorios**: Abstracción de la fuente de datos. Deciden si servir datos locales (cache) o remotos.
-   **Modelos**: Clases inmutables con `freezed` para seguridad de tipos.
