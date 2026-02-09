# Supabase Project Infrastructure Rules

## 1. Separación de Responsabilidades

| Capa | Responsabilidad | Supabase | App Angular |
|------|-----------------|----------|-------------|
| **Suscripciones** | Clientes, planes, facturación, billing | Acciona → suscripciones | saas-admin |
| **Conjuntos** | Unidades, residentes, citofonía, tesorería, etc. | Cerca → Ecosistema-Cerca | admin-web |

---

## 2. Project Roles

### Organization: Acciona
- **Project: suscripciones** (ID: `fervyhznyunpyunevmzb`)
- **Única fuente de verdad** para: `clients`, `plans`, `client_subscriptions`, `invoices`, `payments`, `plan_features`, `catalog_*`.
- **Edge Functions**: `validate-subscription`, `check-feature-access`, `process-billing`, `wompi-webhook`.

### Organization: cerca
- **Project: Ecosistema-Cerca** (ID: `tmahegehoshaciodewzm`)
- **Única fuente de verdad** para: `conjuntos`, `units`, `residents`, `zones`, `visitors`, `visits`, `devices`, `call_logs`, `access_logs`, `packages`, `bills`, `reservations`, `common_areas`, `marketplace_*`, `treasury_payments`, `financial_config`.

---

## 3. Cross-Project Interactions

- **admin-web** usa **Ecosistema-Cerca** para todos los datos operativos (conjuntos, unidades, residentes, etc.).
- **admin-web** obtiene `client_id` desde la tabla `conjuntos` (en Cerca) y llama a **suscripciones** (Acciona) para validar la suscripción vía `validate-subscription` con header `x-client-id`.
- **saas-admin** usa exclusivamente **suscripciones** (Acciona).

### Regla de ligadura
- La tabla `conjuntos` en Ecosistema-Cerca tiene `client_id` que referencia conceptualmente a `clients` en Acciona (no hay FK cross-DB; se aplica en lógica de aplicación).
- Ecosistema-Cerca puede incluir una tabla `clients` local mínima para integridad FK; el origen de verdad sigue siendo Acciona.

---

## 4. Deployment Rules

- **Migraciones de suscripciones** (`0001_subscription_schema`, etc.) → solo en **suscripciones** (Acciona).
- **Migraciones de conjuntos** (`0000_initial_schema`, `0002_citofonia_schema`, `0003_operational_modules`, `0004_payments_schema`, etc.) → en **Ecosistema-Cerca**.
- **Edge Functions** de billing, validación de suscripción y feature access → **suscripciones** (Acciona).
- NO desplegar en Ecosistema-Cerca Edge Functions que consulten `client_subscriptions` o `plan_features`; admin-web debe invocar Acciona.
