# Sistema de Feature Flags y Control de Suscripciones

Este documento describe la arquitectura técnica para el control de acceso a funcionalidades basado en el plan de suscripción contratado por cada conjunto residencial.

## Arquitectura de Validación

La validación ocurre en tres niveles para garantizar seguridad y rendimiento:

1.  **Base de Datos (Supabase/RLS)**: Las políticas RLS impiden la lectura/escritura de datos si no existe una suscripción activa vinculada al `client_id` o `conjunto_id`.
2.  **Backend (Edge Functions)**:
    -   `validate-subscription`: Retorna el estado global y el set completo de features habilitados.
    -   `check-feature-access`: Validación granular para operaciones costosas.
3.  **Frontend (Angular)**:
    -   `SubscriptionGuard`: Protege rutas completas.
    -   `*hasFeature`: Oculta/vuelve a mostrar elementos de la UI dinámicamente.

## Catálogo de Feature Keys

| Key | Descripción | Plan Mínimo |
| :--- | :--- | :--- |
| `citofonia_voip` | Llamadas IP nativas a residentes | Pro |
| `marketplace` | Comercio interno entre vecinos | Básico |
| `governance_voting` | Votaciones digitales asambleas | Pro |
| `iot_access_control` | Integración de sensores de acceso | Premium |

## Cómo agregar una nueva Feature Flag

1.  **DB**: Registrar el nuevo key en la tabla `plan_features` para los planes correspondientes.
2.  **Edge Functions**: No requiere cambios (es dinámico), pero se pueden añadir validaciones extra en `check-feature-access`.
3.  **Frontend**: 
    -   Usar la directiva: `<div *hasFeature="'nuevo_key'">...</div>`
    -   Usar en rutas: `{ path: 'ruta', data: { requiredFeature: 'nuevo_key' }, canActivate: [subscriptionGuard] }`

## Gestión Administrativa (saas-admin)

El panel `saas-admin` permite:
-   Crear/Editar Planes y sus precios.
-   Asociar planes a Clientes Corporativos.
-   Auditar cambios en el historial de suscripciones.
