-- =====================================================
-- MIGRACIÓN 0003: MÓDULOS OPERATIVOS (Paquetería, Reservas, Marketplace)
-- Proyecto: Ecosistema Cerca
-- Dependencias: 0002_citofonia_schema (units, residents, guards)
-- =====================================================

-- -----------------------------------------------------
-- 1. GESTIÓN DE PAQUETERÍA (Packages)
-- -----------------------------------------------------
CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  resident_id uuid, -- Opcional, si va dirigido a alguien específico
  receptionist_guard_id uuid, -- Guarda que recibe el paquete
  carrier text, -- "Servientrega", "DHL", "Amazon", "Mensajero"
  tracking_number text,
  photo_url text, -- Evidencia de estado al recibir
  status text NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Notified', 'Delivered', 'Returned')),
  notes text,
  received_at timestamp with time zone DEFAULT now(),
  delivered_at timestamp with time zone,
  picked_up_by uuid, -- Residente que retiró (si aplica)
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT packages_pkey PRIMARY KEY (id),
  CONSTRAINT packages_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE,
  CONSTRAINT packages_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.residents(id) ON DELETE SET NULL,
  -- CONSTRAINT packages_guard_id_fkey FOREIGN KEY (receptionist_guard_id) REFERENCES public.guards(id) -- Si existe tabla guards o users
  CONSTRAINT packages_picked_up_by_fkey FOREIGN KEY (picked_up_by) REFERENCES public.residents(id)
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Índices Paquetería
CREATE INDEX idx_packages_conjunto ON public.packages(conjunto_id);
CREATE INDEX idx_packages_unit ON public.packages(unit_id);
CREATE INDEX idx_packages_status ON public.packages(status);


-- -----------------------------------------------------
-- 2. RESERVAS DE ZONAS COMUNES (Reservations)
-- -----------------------------------------------------

-- 2.1 Zonas Comunes (Maestro)
CREATE TABLE public.common_areas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  name text NOT NULL, -- "Salón Social", "BBQ Torre 1"
  description text,
  capacity integer,
  hourly_cost numeric DEFAULT 0, -- Costo por hora (si aplica)
  requires_approval boolean DEFAULT true, -- Si requiere validación manual del admin
  opening_hours jsonb, -- Estructura: { "mon": {"start": "08:00", "end": "22:00"}, ... }
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT common_areas_pkey PRIMARY KEY (id)
);
ALTER TABLE public.common_areas ENABLE ROW LEVEL SECURITY;

-- 2.2 Reservas
CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  common_area_id uuid NOT NULL,
  resident_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed')),
  cost numeric DEFAULT 0,
  attendees_count integer,
  purpose text, -- "Cumpleaños", "Asamblea"
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_area_fkey FOREIGN KEY (common_area_id) REFERENCES public.common_areas(id) ON DELETE CASCADE,
  CONSTRAINT reservations_resident_fkey FOREIGN KEY (resident_id) REFERENCES public.residents(id)
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Índices Reservas
CREATE INDEX idx_common_areas_conjunto ON public.common_areas(conjunto_id);
CREATE INDEX idx_reservations_conjunto ON public.reservations(conjunto_id);
CREATE INDEX idx_reservations_area_date ON public.reservations(common_area_id, start_time);
CREATE INDEX idx_reservations_resident ON public.reservations(resident_id);


-- -----------------------------------------------------
-- 3. MARKETPLACE (Comercio Vecinal)
-- -----------------------------------------------------

-- 3.1 Categorías Marketplace
CREATE TABLE public.marketplace_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL, -- "Alimentos", "Servicios", "Segunda Mano"
  icon_key text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT marketplace_categories_pkey PRIMARY KEY (id)
);
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
-- Nota: Las categorías podrían ser globales (sin conjunto_id) o por conjunto. 
-- Asumiremos globales para el sistema, pero RLS podría restringir edición.
-- Para simplificar SaaS: Datos maestros globales suelen estar en esquema público pero solo editables por SuperAdmin.

-- 3.2 Listados (Productos/Servicios)
CREATE TABLE public.marketplace_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  seller_id uuid NOT NULL, -- Residente vendedor
  category_id uuid,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  images text[], -- Array de URLs
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Paused', 'Banned')),
  is_verified_neighbor boolean DEFAULT false, -- Copia estado del residente al publicar para visualización rápida
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT listings_pkey PRIMARY KEY (id),
  CONSTRAINT listings_seller_fkey FOREIGN KEY (seller_id) REFERENCES public.residents(id),
  CONSTRAINT listings_category_fkey FOREIGN KEY (category_id) REFERENCES public.marketplace_categories(id)
);
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- 3.3 Pedidos / Interés de Compra
CREATE TABLE public.marketplace_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  buyer_id uuid NOT NULL, -- Residente comprador
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Completed', 'Cancelled', 'Disputed')),
  delivery_method text CHECK (delivery_method IN ('Porteria', 'Directo', 'Domicilio')),
  chat_session_id uuid, -- Referencia futura a chat
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_listing_fkey FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id),
  CONSTRAINT orders_buyer_fkey FOREIGN KEY (buyer_id) REFERENCES public.residents(id)
);
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Índices Marketplace
CREATE INDEX idx_listings_conjunto ON public.marketplace_listings(conjunto_id);
CREATE INDEX idx_listings_seller ON public.marketplace_listings(seller_id);
CREATE INDEX idx_orders_conjunto ON public.marketplace_orders(conjunto_id);
CREATE INDEX idx_orders_listing ON public.marketplace_orders(listing_id);
CREATE INDEX idx_orders_buyer ON public.marketplace_orders(buyer_id);
