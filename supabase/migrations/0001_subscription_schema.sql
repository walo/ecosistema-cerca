-- =====================================================
-- BASE DE DATOS: SISTEMA DE SUSCRIPCIONES
-- Responsabilidad: Gestión de clientes, planes, suscripciones y facturación
-- =====================================================

-- 1. Categorías de catálogo (compartido) - Dependencia base
CREATE TABLE public.catalog_categories (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT catalog_categories_pkey PRIMARY KEY (id)
);
ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;

-- 2. Ítems de catálogo (compartido) - Dependencia base
CREATE TABLE public.catalog_items (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  category_id smallint NOT NULL,
  code character varying NOT NULL,
  name character varying NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  sort_order smallint NOT NULL DEFAULT 1,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT catalog_items_pkey PRIMARY KEY (id),
  CONSTRAINT catalog_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.catalog_categories(id)
);
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- 3. Tabla de Clientes (Tenants del sistema SaaS)
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  contact_name character varying,
  contact_email character varying NOT NULL,
  contact_phone character varying,
  status_id smallint NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT clients_pkey PRIMARY KEY (id),
  CONSTRAINT clients_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 4. Tabla de Planes de Suscripción
CREATE TABLE public.plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  billing_cycle smallint NOT NULL, -- Referencia a catalog_items (mensual, anual, etc)
  is_active boolean NOT NULL DEFAULT true,
  trial_days integer DEFAULT 0,
  max_users integer,
  max_branches integer,
  max_appointments_per_month integer,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT plans_pkey PRIMARY KEY (id),
  CONSTRAINT plans_billing_cycle_fkey FOREIGN KEY (billing_cycle) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 5. Características de los Planes
CREATE TABLE public.plan_features (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  description text,
  CONSTRAINT plan_features_pkey PRIMARY KEY (id),
  CONSTRAINT plan_features_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE
);
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- 6. Permisos disponibles en el sistema
CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  option text NOT NULL,
  route text,
  description text,
  module text NOT NULL, -- Para agrupar permisos por módulo
  status_id smallint NOT NULL,
  CONSTRAINT permissions_pkey PRIMARY KEY (id),
  CONSTRAINT permissions_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- 7. Permisos asociados a cada Plan
CREATE TABLE public.plan_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  CONSTRAINT plan_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT plan_permissions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE,
  CONSTRAINT plan_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE,
  CONSTRAINT plan_permissions_unique UNIQUE (plan_id, permission_id)
);
ALTER TABLE public.plan_permissions ENABLE ROW LEVEL SECURITY;

-- 8. Suscripciones de Clientes
CREATE TABLE public.client_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  status_id smallint NOT NULL, -- activa, cancelada, suspendida, en_prueba
  start_date timestamp without time zone NOT NULL DEFAULT now(),
  end_date timestamp without time zone,
  trial_end_date timestamp without time zone,
  auto_renew boolean NOT NULL DEFAULT true,
  cancellation_reason text,
  cancelled_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT client_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT client_subscriptions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE,
  CONSTRAINT client_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id),
  CONSTRAINT client_subscriptions_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. Historial de cambios de suscripción
CREATE TABLE public.subscription_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  status_id smallint NOT NULL,
  change_type smallint NOT NULL, -- upgrade, downgrade, cancelación, renovación
  changed_by uuid, -- Referencia al usuario que hizo el cambio
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT subscription_history_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_history_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.client_subscriptions(id) ON DELETE CASCADE,
  CONSTRAINT subscription_history_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id),
  CONSTRAINT subscription_history_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id),
  CONSTRAINT subscription_history_change_type_fkey FOREIGN KEY (change_type) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- 10. Facturas
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_number character varying NOT NULL UNIQUE,
  subscription_id uuid NOT NULL,
  client_id uuid NOT NULL,
  amount numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  currency character varying(3) DEFAULT 'COP',
  status_id smallint NOT NULL, -- pendiente, pagada, vencida, cancelada
  issue_date timestamp without time zone NOT NULL DEFAULT now(),
  due_date timestamp without time zone NOT NULL,
  paid_date timestamp without time zone,
  payment_method_id smallint, -- tarjeta, transferencia, etc
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.client_subscriptions(id),
  CONSTRAINT invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT invoices_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id),
  CONSTRAINT invoices_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 11. Pagos
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL,
  payment_gateway character varying, -- stripe, paypal, wompi, etc
  transaction_id character varying,
  amount numeric NOT NULL,
  currency character varying(3) DEFAULT 'COP',
  status_id smallint NOT NULL, -- aprobado, rechazado, pendiente
  payment_date timestamp without time zone NOT NULL DEFAULT now(),
  payment_method_id smallint,
  metadata jsonb, -- Datos adicionales del gateway de pago
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT payments_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.catalog_items(id),
  CONSTRAINT payments_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 12. Uso de recursos por cliente (para planes con límites)
CREATE TABLE public.client_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  resource_type character varying NOT NULL, -- users, branches, appointments
  current_usage integer NOT NULL DEFAULT 0,
  limit_value integer,
  period_start timestamp without time zone NOT NULL,
  period_end timestamp without time zone NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT client_usage_pkey PRIMARY KEY (id),
  CONSTRAINT client_usage_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE
);
ALTER TABLE public.client_usage ENABLE ROW LEVEL SECURITY;

-- 13. Cupones de descuento
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  description text,
  discount_type smallint NOT NULL, -- porcentaje, monto_fijo
  discount_value numeric NOT NULL,
  max_redemptions integer,
  current_redemptions integer DEFAULT 0,
  valid_from timestamp without time zone NOT NULL,
  valid_until timestamp without time zone NOT NULL,
  applicable_plans uuid[], -- Array de IDs de planes aplicables
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id),
  CONSTRAINT coupons_discount_type_fkey FOREIGN KEY (discount_type) REFERENCES public.catalog_items(id)
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 14. Uso de cupones
CREATE TABLE public.coupon_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL,
  client_id uuid NOT NULL,
  subscription_id uuid NOT NULL,
  used_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT coupon_usage_pkey PRIMARY KEY (id),
  CONSTRAINT coupon_usage_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id),
  CONSTRAINT coupon_usage_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT coupon_usage_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.client_subscriptions(id)
);
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Índices para mejorar rendimiento
CREATE INDEX idx_client_subscriptions_client_id ON public.client_subscriptions(client_id);
CREATE INDEX idx_client_subscriptions_status ON public.client_subscriptions(status_id);
CREATE INDEX idx_client_subscriptions_dates ON public.client_subscriptions(start_date, end_date);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX idx_invoices_status ON public.invoices(status_id);
CREATE INDEX idx_client_usage_client_id ON public.client_usage(client_id);
CREATE INDEX idx_plan_permissions_plan_id ON public.plan_permissions(plan_id);

-- Índice GIN para metadata de pagos (Optimización solicitada)
CREATE INDEX idx_payments_metadata ON public.payments USING GIN (metadata);
