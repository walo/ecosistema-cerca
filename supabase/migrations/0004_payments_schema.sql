-- =====================================================
-- MIGRACIÓN 0004: PAGOS Y CARTERA (B2C - Operativo)
-- Proyecto: Ecosistema Cerca
-- Dependencias: 0002_citofonia_schema (units, residents)
-- Descripción: Módulo financiero para cobro de administración y reservas.
--             Usa 'treasury_payments' para no colisionar con 'payments' del SaaS (B2B).
-- =====================================================

-- -----------------------------------------------------
-- 1. CONFIGURACIÓN FINANCIERA (Por Conjunto)
-- -----------------------------------------------------
CREATE TABLE public.financial_config (
  conjunto_id uuid NOT NULL,
  wompi_pub_key text, -- Llave pública para el Widget de Wompi
  wompi_integrity_secret text, -- (Opcional) Solo si se valida integridad en Front (mejor en Edge Functions)
  monthly_fee numeric DEFAULT 0, -- Cuota fija (si aplica)
  interest_rate numeric DEFAULT 0, -- Tasa de mora mensual (ej: 1.5)
  account_number text, -- Para consignaciones manuales
  bank_name text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financial_config_pkey PRIMARY KEY (conjunto_id)
  -- No FK a conjunto_id tabla, ya que el ID es la partición lógica
);
ALTER TABLE public.financial_config ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- 2. FACTURAS / CUENTAS DE COBRO (Bills)
-- -----------------------------------------------------
CREATE TABLE public.bills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  period date NOT NULL, -- Primer día del mes facturado (2025-01-01)
  description text NOT NULL, -- "Administración Enero 2025"
  amount numeric NOT NULL, -- Valor capital
  interest numeric DEFAULT 0, -- Intereses de mora
  total_amount numeric GENERATED ALWAYS AS (amount + interest) STORED,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Annulled', 'Partial')),
  due_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT bills_pkey PRIMARY KEY (id),
  CONSTRAINT bills_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT bills_unique_period_unit UNIQUE (conjunto_id, unit_id, period) -- Evitar doble facturación mismo mes
);
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Índices Bills
CREATE INDEX idx_bills_conjunto ON public.bills(conjunto_id);
CREATE INDEX idx_bills_unit ON public.bills(unit_id);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_period ON public.bills(period);

-- -----------------------------------------------------
-- 3. PAGOS DE TESORERÍA (Treasury Payments - B2C)
-- -----------------------------------------------------
CREATE TABLE public.treasury_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conjunto_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  bill_id uuid, -- Opcional: puede ser un abono general o pago de una factura específica
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('Wompi', 'Consignacion', 'Efectivo', 'Transferencia', 'Datafono')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Approved', 'Pending', 'Declined', 'Voided')),
  
  -- Campos Wompi / Pasarela
  reference_code text NOT NULL, -- Referencia enviada a la pasarela (PAY-XXX)
  wompi_transaction_id text, -- ID de transacción de Wompi
  
  -- Campos Manuales
  proof_url text, -- URL de foto del comprobante
  approved_by uuid, -- Admin que aprobó manualmente (si aplica)
  
  paid_at timestamp with time zone, -- Fecha real del pago
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  
  CONSTRAINT treasury_payments_pkey PRIMARY KEY (id),
  CONSTRAINT treasury_payments_unit_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT treasury_payments_bill_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(id),
  CONSTRAINT treasury_payments_unique_ref UNIQUE (conjunto_id, reference_code) -- Integridad
);
ALTER TABLE public.treasury_payments ENABLE ROW LEVEL SECURITY;

-- Índices Treasury Payments
CREATE INDEX idx_treasury_payments_conjunto ON public.treasury_payments(conjunto_id);
CREATE INDEX idx_treasury_payments_unit ON public.treasury_payments(unit_id);
CREATE INDEX idx_treasury_payments_status ON public.treasury_payments(status);
CREATE INDEX idx_treasury_payments_wompi_id ON public.treasury_payments(wompi_transaction_id);
