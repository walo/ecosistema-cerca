-- Semilla de datos para caracteristicas comunes de SaaS
INSERT INTO public.feature_definitions (key, label, description, data_type)
VALUES 
    ('max_users', 'Usuarios Máximos', 'Límite de usuarios administrativos permitidos', 'number'),
    ('storage_limit_gb', 'Límite de Almacenamiento (GB)', 'Espacio disponible para archivos', 'number'),
    ('custom_domain', 'Dominio Personalizado', 'Permite usar su propio dominio', 'boolean'),
    ('priority_support', 'Soporte Prioritario', 'Acceso a fila rápida de soporte', 'boolean'),
    ('api_access', 'Acceso a API', 'Permite integración vía API', 'boolean'),
    ('remove_branding', 'Marca Blanca', 'Elimina la marca de Cerca', 'boolean')
ON CONFLICT (key) DO NOTHING;
