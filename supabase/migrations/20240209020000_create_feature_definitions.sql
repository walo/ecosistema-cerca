-- Create feature_definitions table
CREATE TABLE IF NOT EXISTS public.feature_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    description TEXT,
    data_type TEXT NOT NULL DEFAULT 'boolean' CHECK (data_type IN ('boolean', 'number', 'text')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.feature_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read (needed for plan forms)
CREATE POLICY "Enable read access for all users" ON public.feature_definitions
    FOR SELECT USING (true);

-- Allow only admins to insert/update/delete (assuming role based)
-- For now, let's allow authenticated users as admins based on previous patterns
CREATE POLICY "Enable all access for authenticated users" ON public.feature_definitions
    FOR ALL USING (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE public.feature_definitions IS 'Catalog of available features for subscription plans';
COMMENT ON COLUMN public.feature_definitions.key IS 'Unique identifier for the feature (e.g. max_users)';
COMMENT ON COLUMN public.feature_definitions.data_type IS 'Type of value expected: boolean, number, or text';
