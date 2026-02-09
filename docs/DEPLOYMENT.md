# Guía de Despliegue - Ecosistema Cerca

Este documento define qué migraciones y Edge Functions aplicar a cada proyecto Supabase.

## Mapeo App ↔ Proyecto Supabase

| App | Proyecto Supabase | Organización |
|-----|-------------------|--------------|
| **saas-admin** | suscripciones | Acciona |
| **admin-web** | Ecosistema-Cerca | cerca |

admin-web además invoca Edge Functions en **suscripciones** (Acciona) para validación de suscripciones.

---

## Proyectos Supabase

### 1. suscripciones (Acciona)

| Atributo | Valor |
|----------|-------|
| **ID** | `fervyhznyunpyunevmzb` |
| **URL** | `https://fervyhznyunpyunevmzb.supabase.co` |
| **Región** | us-east-2 |

**Migraciones a aplicar:**
- `0001_subscription_schema.sql` — clients, plans, client_subscriptions, invoices, payments, catalog, etc.

**Edge Functions a desplegar:**
- `validate-subscription`
- `check-feature-access`
- `process-billing`
- `wompi-webhook`

**Comando link:**
```bash
supabase link --project-ref fervyhznyunpyunevmzb
```

---

### 2. Ecosistema-Cerca (cerca)

| Atributo | Valor |
|----------|-------|
| **ID** | `tmahegehoshaciodewzm` |
| **URL** | `https://tmahegehoshaciodewzm.supabase.co` |
| **Región** | us-east-1 |

**Migraciones a aplicar (orden):**
1. `0000_initial_schema.sql` — conjuntos, planes, suscripciones base, unidades, perfiles
2. `0002_citofonia_schema.sql` — dispositivos, citofonía
3. `0003_operational_modules.sql` — visitas, paquetería, zonas, áreas comunes, marketplace, reservas
4. `0004_payments_schema.sql` — bills, treasury_payments, financial_config
5. `0005_subscription_rls_policies.sql` — políticas RLS (si aplica esquema local de suscripciones)
6. `0006_tenancy_hierarchy.sql` — client_id y active_subscription_id en conjuntos

> **Nota:** Ecosistema-Cerca puede incluir tablas `clients` y `client_subscriptions` como réplica local (referencia a Acciona) si se usan FKs. En ese caso las migraciones `0005` y `0006` aplican. Ver [.agent/supabase_projects.md](../.agent/supabase_projects.md) para reglas de ligadura.

**Edge Functions a desplegar:**
- Ninguna relacionada con suscripciones. Las funciones de validación deben invocarse contra **suscripciones** (Acciona).

**Comando link:**
```bash
supabase link --project-ref tmahegehoshaciodewzm
```

---

## Variables de Entorno por App

### saas-admin
- `VITE_SUPABASE_URL` / `supabaseUrl`: URL de **suscripciones** (Acciona)
- `VITE_SUPABASE_ANON_KEY` / `supabaseKey`: anon key de **suscripciones**

### admin-web
- `supabaseUrl`: URL de **Ecosistema-Cerca** (Cerca)
- `supabaseKey`: anon key de **Ecosistema-Cerca**
- `accionaSupabaseUrl`: URL de **suscripciones** (Acciona)
- `accionaSupabaseKey`: anon key de **suscripciones**

---

## Flujo de Datos

```
saas-admin ──────────► suscripciones (Acciona)
                           clients, plans, invoices, validate-subscription

admin-web ───────────► Ecosistema-Cerca (Cerca)
                       conjuntos, units, residents, etc.

admin-web ───────────► suscripciones (Acciona)
                       validate-subscription (con x-client-id)
```
