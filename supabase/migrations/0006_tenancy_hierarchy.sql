-- =====================================================
-- MIGRACIÓN 0006: JERARQUÍA DE TENANCY 1:N
-- Responsabilidad: Vincular la capa SaaS (Clients) con la capa Operativa (Conjuntos)
-- =====================================================

-- 1. Agregar client_id a la tabla de conjuntos
-- Esto permite que un cliente corporativo (inmobiliaria/empresa) gestione múltiples conjuntos
ALTER TABLE public.conjuntos 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- 2. Índice para optimizar consultas por cliente
CREATE INDEX IF NOT EXISTS idx_conjuntos_client_id ON public.conjuntos(client_id);

-- 3. Comentario descriptivo
COMMENT ON COLUMN public.conjuntos.client_id IS 'Identificador del cliente corporativo (SaaS Client) propietario o administrador del conjunto';

-- 4. Opcional: Vincular suscripción activa directamente al conjunto para acceso rápido
ALTER TABLE public.conjuntos 
ADD COLUMN IF NOT EXISTS active_subscription_id UUID REFERENCES public.client_subscriptions(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.conjuntos.active_subscription_id IS 'Referencia a la suscripción activa actual para validación rápida de features';
