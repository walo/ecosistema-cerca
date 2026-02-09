-- =====================================================
-- MIGRACIÓN 0005: POLÍTICAS RLS PARA SUSCRIPCIONES
-- Responsabilidad: Garantizar el aislamiento de datos y el acceso jerárquico (Corporativo vs Operativo)
-- =====================================================

-- Asegurar que RLS esté habilitado en todas las tablas críticas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_usage ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- 1. POLÍTICAS PARA CLIENTES (NIVEL CORPORATIVO)
-- -----------------------------------------------------

-- Un cliente corporativo solo puede ver su propia información de empresa
CREATE POLICY "Clientes pueden ver su propia data corporativa"
ON public.clients FOR SELECT
USING (id = (auth.jwt() ->> 'client_id')::uuid);

-- -----------------------------------------------------
-- 2. POLÍTICAS PARA SUSCRIPCIONES
-- -----------------------------------------------------

-- Acceso Corporativo: Puede ver todas las suscripciones de sus conjuntos
CREATE POLICY "Clientes corporativos ven todas sus suscripciones"
ON public.client_subscriptions FOR SELECT
USING (client_id = (auth.jwt() ->> 'client_id')::uuid);

-- Acceso Operativo (Administrador de Conjunto): Solo ve la suya
-- Nota: Usamos una subconsulta para verificar que la suscripción pertenece al conjunto actual del usuario
CREATE POLICY "Admins de conjunto ven solo su suscripción activa"
ON public.client_subscriptions FOR SELECT
USING (
    id IN (
        SELECT active_subscription_id FROM public.conjuntos 
        WHERE id = (auth.jwt() ->> 'conjunto_id')::uuid
    )
);

-- -----------------------------------------------------
-- 3. POLÍTICAS PARA FACTURACIÓN (INVOICES & PAYMENTS)
-- -----------------------------------------------------

-- Invoices: Visibilidad corporativa total
CREATE POLICY "Clientes corporativos ven todas sus facturas"
ON public.invoices FOR SELECT
USING (client_id = (auth.jwt() ->> 'client_id')::uuid);

-- Invoices: Visibilidad operativa limitada al conjunto
CREATE POLICY "Admins de conjunto ven facturas de su conjunto"
ON public.invoices FOR SELECT
USING (
    subscription_id IN (
        SELECT active_subscription_id FROM public.conjuntos 
        WHERE id = (auth.jwt() ->> 'conjunto_id')::uuid
    )
);

-- Payments: Sigue la misma lógica que Invoices
CREATE POLICY "Clientes corporativos ven todos sus pagos"
ON public.payments FOR SELECT
USING (
    invoice_id IN (
        SELECT id FROM public.invoices 
        WHERE client_id = (auth.jwt() ->> 'client_id')::uuid
    )
);

-- -----------------------------------------------------
-- 4. POLÍTICAS PARA CATÁLOGO (LECTURA PÚBLICA)
-- -----------------------------------------------------

CREATE POLICY "Cualquier usuario autenticado puede ver planes"
ON public.plans FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Cualquier usuario autenticado puede ver features de planes"
ON public.plan_features FOR SELECT
TO authenticated
USING (true);

-- -----------------------------------------------------
-- 5. POLÍTICAS PARA USO DE RECURSOS (QUOTAS)
-- -----------------------------------------------------

CREATE POLICY "Conjuntos ven su propio uso de recursos"
ON public.client_usage FOR SELECT
USING (client_id = (auth.jwt() ->> 'client_id')::uuid);
