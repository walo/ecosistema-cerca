# Plan de Ejecución - Ecosistema Cerca

Plan de implementación ordenado: **Bases de Datos → Edge Functions → Frontend**, alineado con la fuente de verdad y la arquitectura global.

---

## Estado de ejecución (revisión)

| Fase | Estado | Notas |
|------|--------|--------|
| **1. Bases de datos** | ✅ Hecho | Acciona: esquema 0001 + políticas RLS. Cerca: 0000–0006 aplicados; `conjuntos` tiene `client_id` y `active_subscription_id`. |
| **2. Edge Functions** | ✅ Hecho | En Acciona: `validate-subscription`, `check-feature-access`, `process-billing`, `wompi-webhook` desplegadas y activas. |
| **3. Frontend** | ✅ Configurado | saas-admin: env → Acciona; rutas (dashboard, plans, clients, audit, billing). admin-web: env dual (Cerca + Acciona); SubscriptionService con `x-client-id`; TenantService obtiene `client_id` desde `conjuntos`. |

**Nota:** `validate-subscription` en Acciona debe poder consultar por `client_id` sin JWT de usuario (admin-web no tiene sesión en Acciona). Si falla, usar `SUPABASE_SERVICE_ROLE_KEY` dentro de la función para la rama que solo recibe `x-client-id`.

---

## Fase 1: Bases de Datos

### 1.1 Proyecto **suscripciones** (Acciona) — `fervyhznyunpyunevmzb`

| Orden | Migración | Contenido | Estado |
|-------|-----------|-----------|--------|
| 1 | `0001_subscription_schema.sql` | `catalog_categories`, `catalog_items`, `clients`, `plans`, `plan_features`, `permissions`, `client_subscriptions`, `invoices`, `payments` y RLS | Aplicar en orden |

**Pasos:**
1. `supabase link --project-ref fervyhznyunpyunevmzb`
2. `supabase db push` o aplicar migraciones manualmente en el orden definido en el schema.
3. Verificar que existan datos de catálogo (status, billing_cycle) y al menos un plan con `plan_features` para validación.

---

### 1.2 Proyecto **Ecosistema-Cerca** (cerca) — `tmahegehoshaciodewzm`

| Orden | Migración | Contenido | Estado |
|-------|-----------|-----------|--------|
| 1 | `0000_initial_schema.sql` | ENUMs, `conjuntos`, `planes`, `suscripciones`, `unidades`, `perfiles`, RLS base | Base |
| 2 | `0002_citofonia_schema.sql` | Dispositivos, citofonía, logs | Depende 0000 |
| 3 | `0003_operational_modules.sql` | Visitas, paquetería, zonas, áreas comunes, marketplace, reservas | Depende 0000 |
| 4 | `0004_payments_schema.sql` | `bills`, `treasury_payments`, `financial_config` | Depende 0000 |
| 5 | `0005_subscription_rls_policies.sql` | RLS para suscripciones (si hay esquema local de referencia) | Opcional según diseño |
| 6 | `0006_tenancy_hierarchy.sql` | `client_id`, `active_subscription_id` en `conjuntos` (ligadura con Acciona) | Tras 0000 |

**Pasos:**
1. `supabase link --project-ref tmahegehoshaciodewzm`
2. Aplicar migraciones en el orden indicado: `0000` → `0002`, `0003`, `0004` → `0006` (y `0005` si aplica).
3. Verificar RLS: aislamiento por `conjunto_id` y, donde aplique, por `client_id`/suscripción activa.

**Criterio de éxito Fase 1:** Ambos proyectos con esquemas aplicados, RLS activo y sin errores de FK. Conjuntos en Cerca con `client_id` poblado para poder llamar a `validate-subscription`.

---

## Fase 2: Edge Functions

### 2.1 Proyecto **suscripciones** (Acciona)

Todas estas funciones se despliegan en el proyecto **suscripciones** (`fervyhznyunpyunevmzb`).

| Orden | Función | Propósito | Invocada por |
|-------|---------|-----------|--------------|
| 1 | `validate-subscription` | Devuelve estado de suscripción y features habilitados por `client_id` (header `x-client-id`) | admin-web |
| 2 | `check-feature-access` | Validación granular de feature key para operaciones sensibles | admin-web / backend |
| 3 | `process-billing` | Procesamiento de ciclos de facturación / cobro | Cron / saas-admin |
| 4 | `wompi-webhook` | Recibe webhooks de Wompi; actualiza estado de pagos | Wompi |

**Pasos:**
1. Configurar secrets/variables de entorno por función (Wompi, etc.) en el proyecto Acciona.
2. Desplegar en este orden: `validate-subscription` → `check-feature-access` → `process-billing` → `wompi-webhook`.
3. Probar `validate-subscription` con `x-client-id` desde admin-web (o Postman) y validar que devuelva `planCode` y `features`.

**Criterio de éxito Fase 2:** admin-web puede llamar a `validate-subscription` con el `client_id` del conjunto y recibir plan y features; webhook de Wompi actualiza pagos en DB.

---

### 2.2 Proyecto **Ecosistema-Cerca** (cerca)

- **No** se despliegan aquí funciones de suscripción/billing.
- Las validaciones de suscripción se hacen invocando el proyecto **suscripciones** (Acciona) desde admin-web.
- En fases posteriores se podrán añadir funciones propias de Cerca (ej. notificaciones, agregados) en este proyecto.

---

## Fase 3: Frontend

### 3.1 Apps y proyectos Supabase

| App | Supabase principal | Supabase secundario (solo validación) |
|-----|--------------------|----------------------------------------|
| **saas-admin** | suscripciones (Acciona) | — |
| **admin-web** | Ecosistema-Cerca (cerca) | suscripciones (Acciona) para `validate-subscription` |

### 3.2 saas-admin (SuperAdmin)

| Orden | Tarea | Detalle |
|-------|--------|---------|
| 1 | Entorno | `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` apuntando a **suscripciones** (Acciona). |
| 2 | Auth | Login con Supabase Auth; protección de rutas con guard de sesión. |
| 3 | CRUD clients | Listar/crear/editar clientes (tenants) en tabla `clients`. |
| 4 | CRUD plans | Listar/crear/editar planes; asociar `plan_features` por plan. |
| 5 | Suscripciones por cliente | Vincular `client_subscriptions` a clientes; ver estado (activo/mora/suspendido). |
| 6 | Facturación / billing | Pantallas de facturas e integración con `process-billing` si aplica. |
| 7 | Métricas | Dashboard básico (clientes activos, ingresos, etc.) según modelo de datos. |

**Stack:** Angular 17+, Standalone, Signals, servicios con `@supabase/supabase-js`.

---

### 3.3 admin-web (Administradores de Conjunto)

| Orden | Tarea | Detalle |
|-------|--------|---------|
| 1 | Entorno | `supabaseUrl`/`supabaseKey` → Ecosistema-Cerca; `accionaSupabaseUrl`/`accionaSupabaseKey` → suscripciones (Acciona). |
| 2 | Auth y tenant | Login; obtener `conjunto_id` (y `client_id`) del perfil o contexto. |
| 3 | Servicio de suscripción | Llamar a `validate-subscription` (Acciona) con header `x-client-id`; cachear resultado (plan, features, estado). |
| 4 | Guards | `AuthGuard` (sesión); `SubscriptionGuard` (suscripción activa); uso de `requiredFeature` en rutas. |
| 5 | Directiva/pipe de features | `*hasFeature="'citofonia_voip'"` (u otro key) para mostrar/ocultar UI según plan. |
| 6 | CRUD conjuntos | Mantener `conjuntos` (incl. `client_id`, `active_subscription_id` si aplica) en Ecosistema-Cerca. |
| 7 | CRUD unidades | Por `conjunto_id`; coeficiente, bloque, número. |
| 8 | CRUD residentes/perfiles | Tabla `perfiles` y relación con `unidades`; roles admin/portero/residente. |
| 9 | Módulos operativos | Visitantes, paquetería, citofonía (logs), pagos/tesorería según migraciones 0002–0004. |
| 10 | Integración feature flags | Rutas protegidas por `SubscriptionGuard` + `requiredFeature`; elementos por `*hasFeature`. |

**Stack:** Angular 17+, Standalone, Signals, Supabase Client; TenantInterceptor si se inyecta `conjunto_id` en requests.

---

### 3.4 Criterios de éxito Fase 3

- **saas-admin:** Gestión completa de clientes, planes y suscripciones contra **suscripciones** (Acciona); facturación operativa si está en alcance.
- **admin-web:** Operación contra **Ecosistema-Cerca**; validación de suscripción y features contra **suscripciones** (Acciona); RLS respetado por `conjunto_id`; UI condicionada por feature flags.

---

## Resumen de dependencias

```
Fase 1 (DB)
  ├── suscripciones (Acciona): 0001
  └── Ecosistema-Cerca: 0000 → 0002, 0003, 0004 → [0005] → 0006

Fase 2 (Functions)
  └── suscripciones (Acciona): validate-subscription, check-feature-access, process-billing, wompi-webhook

Fase 3 (Frontend)
  ├── saas-admin → solo suscripciones (Acciona)
  └── admin-web → Ecosistema-Cerca + validate-subscription (Acciona)
```

---

## Referencias

- Fuente de verdad: `fuente_verdad_cerca.md`
- Arquitectura global: `docs/architecture/global_architecture.md`
- Frontend: `docs/architecture/frontend_architecture.md`
- Feature flags: `docs/architecture/feature_flags.md`
- Despliegue: `docs/DEPLOYMENT.md`
- Reglas Supabase: `.agent/supabase_projects.md`
