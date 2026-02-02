-- 0000_initial_schema.sql
-- Inicialización del esquema base multi-tenant para el ecosistema Cerca.

-- 1. ENUMS
CREATE TYPE public.user_role AS ENUM ('admin', 'portero', 'residente');
CREATE TYPE public.sub_status AS ENUM ('activo', 'mora', 'suspendido');

-- 2. CORE SAAS (Tenants & Plans)

-- Tabla de Conjuntos (Tenants)
CREATE TABLE public.conjuntos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    nit TEXT UNIQUE,
    direccion TEXT,
    subdominio TEXT UNIQUE,
    status public.sub_status DEFAULT 'activo',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Planes
CREATE TABLE public.planes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio_mensual NUMERIC(15, 2) NOT NULL,
    limites_json JSONB,
    features_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Suscripciones
CREATE TABLE public.suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conjunto_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.planes(id),
    fecha_inicio TIMESTAMPTZ DEFAULT now(),
    fecha_fin TIMESTAMPTZ,
    status public.sub_status DEFAULT 'activo',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DOMINIO CERCA

-- Tabla de Unidades
CREATE TABLE public.unidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conjunto_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
    bloque TEXT,
    numero TEXT NOT NULL,
    coeficiente NUMERIC(10, 5),
    area NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Perfiles de Usuario
CREATE TABLE public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    conjunto_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    rol public.user_role NOT NULL,
    unidad_id UUID REFERENCES public.unidades(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SEGURIDAD (RLS) - Basado en MultiTenantArchitect skill

-- Habilitar RLS
ALTER TABLE public.conjuntos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Usuarios pueden ver su propio perfil" 
ON public.perfiles FOR SELECT 
USING (auth.uid() = id);

-- Políticas Multi-tenant (Aislamiento por conjunto_id)

-- Unidades
CREATE POLICY "Usuarios pueden ver unidades de su propio conjunto" 
ON public.unidades FOR SELECT 
USING (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);

CREATE POLICY "Admins pueden gestionar unidades de su conjunto" 
ON public.unidades FOR ALL 
USING (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid)
WITH CHECK (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);

-- Suscripciones
CREATE POLICY "Admins pueden ver su suscripción" 
ON public.suscripciones FOR SELECT 
USING (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);

-- Perfiles del conjunto
CREATE POLICY "Usuarios pueden ver perfiles de su mismo conjunto" 
ON public.perfiles FOR SELECT 
USING (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);

-- 5. INDEXACIÓN
CREATE INDEX idx_unidades_conjunto_id ON public.unidades(conjunto_id);
CREATE INDEX idx_perfiles_conjunto_id ON public.perfiles(conjunto_id);
CREATE INDEX idx_suscripciones_conjunto_id ON public.suscripciones(conjunto_id);
