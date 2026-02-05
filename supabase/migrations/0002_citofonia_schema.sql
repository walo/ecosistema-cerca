-- =====================================================
-- MIGRACIÓN 0002: CITOFONÍA Y CONTROL DE ACCESO
-- Proyecto: Ecosistema Cerca
-- Dependencias: 0000_initial_schema (auth.users, public.profiles)
-- =====================================================

-- 1. ZONAS (Torres, Interiores, Manzanas)
CREATE TABLE public.zones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL, -- Multi-tenancy crítico
  name text NOT NULL, -- "Torre A", "Interior 1"
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT zones_pkey PRIMARY KEY (id)
);
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- 2. UNIDADES (Apartamentos, Casas, Locales)
CREATE TABLE public.units (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  zone_id uuid, -- Opcional, una unidad puede no estar en una zona específica
  name text NOT NULL, -- "101", "201"
  type text NOT NULL CHECK (type IN ('Apartamento', 'Casa', 'Local', 'Oficina', 'Deposito')),
  intercom_code text NOT NULL, -- Código para marcado rápido desde portería (ej: "1101")
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT units_pkey PRIMARY KEY (id),
  CONSTRAINT units_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON DELETE SET NULL,
  CONSTRAINT units_unique_code_per_conjunto UNIQUE (conjunto_id, intercom_code)
);
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- 3. RESIDENTES (Vínculo Usuarios - Unidades)
CREATE TABLE public.residents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  user_id uuid, -- Puede ser NULL si es un residente sin App (gestión manual)
  unit_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('Propietario', 'Arrendatario', 'Familiar', 'Encargado')),
  is_authorized_voice boolean DEFAULT true, -- ¿Puede contestar el citófono?
  is_primary_contact boolean DEFAULT false, -- ¿Es el primero al que intenta llamar el sistema?
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT residents_pkey PRIMARY KEY (id),
  CONSTRAINT residents_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE,
  -- Foreign Key a auth.users o public.profiles dependerá de la estrategia de perfiles global
  -- Asumiremos vínculo a public.profiles si existe, o auth.users. Usaremos user_id como referencia lógica.
  CONSTRAINT residents_unique_primary_contact EXCLUDE (unit_id WITH =) WHERE (is_primary_contact = true) -- Postgres 15+ o validación por trigger
);
-- Nota: La restricción EXCLUDE puede ser compleja en algunos entornos SaaS, se puede manejar via Trigger o App Logic.
-- Para simplicidad inicial, usaremos un índice único parcial si solo permitimos 1. 
-- CREATE UNIQUE INDEX idx_unique_primary_contact ON public.residents (unit_id) WHERE is_primary_contact = true;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;


-- 4. DISPOSITIVOS (Tablets Portería, Citófonos IP)
CREATE TABLE public.devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  name text NOT NULL, -- "Portería Principal", "Recepción Torre B"
  device_type text NOT NULL DEFAULT 'Tablet' CHECK (device_type IN ('Tablet', 'IPPhone', 'Softphone')),
  ip_address inet,
  mac_address macaddr,
  sip_extension text, -- Extensión SIP si aplica
  status text NOT NULL DEFAULT 'Offline' CHECK (status IN ('Online', 'Offline', 'Busy', 'Maintenance')),
  last_ping timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT devices_pkey PRIMARY KEY (id)
);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- 5. HISTORIAL DE LLAMADAS (Citofonía Logs)
CREATE TABLE public.call_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  source_device_id uuid, -- Desde qué dispositivo se llamó (Portería)
  destination_unit_id uuid, -- A qué unidad se llamó
  answered_by_resident_id uuid, -- Quién contestó (si contestaron)
  start_time timestamp with time zone DEFAULT now(),
  end_time timestamp with time zone,
  duration_seconds integer,
  status text NOT NULL CHECK (status IN ('Answered', 'Missed', 'Rejected', 'Failed', 'Busy')),
  recording_url text, -- URL firmada en Storage (si aplica auditoría)
  webrtc_session_id text, -- ID de sesión para debug
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT call_logs_pkey PRIMARY KEY (id),
  CONSTRAINT call_logs_source_fkey FOREIGN KEY (source_device_id) REFERENCES public.devices(id),
  CONSTRAINT call_logs_unit_fkey FOREIGN KEY (destination_unit_id) REFERENCES public.units(id),
  CONSTRAINT call_logs_resident_fkey FOREIGN KEY (answered_by_resident_id) REFERENCES public.residents(id)
);
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- 6. VISITANTES (Base de Datos Global del Conjunto)
CREATE TABLE public.visitors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  -- conjunto_id uuid NOT NULL, -- ¿Deben ser compartidos entre conjuntos? Por privacidad (Habeas Data), mejor aislados por conjunto.
  conjunto_id uuid NOT NULL, 
  document_type text NOT NULL CHECK (document_type IN ('CC', 'TI', 'CE', 'PASAPORTE', 'NIT')),
  document_number text NOT NULL,
  full_name text NOT NULL,
  photo_url text, -- Foto tomada en portería
  vehicle_plate text, -- Placa si entra en vehículo
  is_banned boolean DEFAULT false, -- ¿Está vetado?
  banned_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT visitors_pkey PRIMARY KEY (id),
  CONSTRAINT visitors_unique_document UNIQUE (conjunto_id, document_type, document_number)
);
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 7. REGISTRO DE VISITAS (Entradas/Salidas)
CREATE TABLE public.visits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  visitor_id uuid NOT NULL,
  authorized_by_resident_id uuid, -- Residente que autorizó (puede ser NULL si fue pre-autorizada por Admin)
  registered_by_guard_id uuid, -- Guarda que registró el ingreso
  entry_time timestamp with time zone,
  exit_time timestamp with time zone,
  type text NOT NULL CHECK (type IN ('Social', 'Domicilio', 'Servicio', 'Mantenimiento', 'Inmobiliaria')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Active', 'Completed')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT visits_pkey PRIMARY KEY (id),
  CONSTRAINT visits_unit_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT visits_visitor_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id),
  CONSTRAINT visits_resident_fkey FOREIGN KEY (authorized_by_resident_id) REFERENCES public.residents(id)
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- 8. LOGS DE ACCESO (Hardware Events)
CREATE TABLE public.access_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  device_id uuid, -- Puerta/Talanquera/Tablet
  event_type text NOT NULL, -- 'Door Open', 'Tag Read', 'Fingerprint Match', 'Access Denied'
  actor_description text, -- "Residente 101", "Visitante 12345"
  details jsonb, -- Metadata técnica
  occurred_at timestamp with time zone DEFAULT now(),
  CONSTRAINT access_logs_pkey PRIMARY KEY (id),
  CONSTRAINT access_logs_device_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- INDICES PARA RENDIMIENTO (Multi-tenant)
CREATE INDEX idx_zones_conjunto ON public.zones(conjunto_id);
CREATE INDEX idx_units_conjunto ON public.units(conjunto_id);
CREATE INDEX idx_units_zone ON public.units(zone_id);
CREATE INDEX idx_residents_conjunto ON public.residents(conjunto_id);
CREATE INDEX idx_residents_unit ON public.residents(unit_id);
CREATE INDEX idx_residents_user ON public.residents(user_id);
CREATE INDEX idx_devices_conjunto ON public.devices(conjunto_id);
CREATE INDEX idx_call_logs_conjunto ON public.call_logs(conjunto_id);
CREATE INDEX idx_call_logs_dates ON public.call_logs(start_time);
CREATE INDEX idx_visitors_conjunto ON public.visitors(conjunto_id);
CREATE INDEX idx_visitors_document ON public.visitors(document_number);
CREATE INDEX idx_visits_conjunto ON public.visits(conjunto_id);
CREATE INDEX idx_visits_status ON public.visits(status);
CREATE INDEX idx_visits_dates ON public.visits(entry_time);
CREATE INDEX idx_access_logs_conjunto ON public.access_logs(conjunto_id);

-- Restricción de Contacto Principal Único (Implementación Index Parcial)
CREATE UNIQUE INDEX idx_unique_primary_contact ON public.residents (unit_id) WHERE is_primary_contact = true;

