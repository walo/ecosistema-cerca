---
trigger: always_on
---

# Reglas Globales: SaaS Propiedad Horizontal

## Arquitectura Mandatoria
- **Multi-tenancy:** Todo desarrollo debe incluir `tenant_id` y respetar el aislamiento por RLS.
- **Backend:** Supabase (PostgreSQL) + Edge Functions (Deno).
- **Frontend Admin:** Angular 17+ (Signals, Standalone, Deferrable Views). Estructura mandatoria de archivos separados: `.ts`, `.html` y `.scss` por componente.
- **Metodología UI:** Todo desarrollo en Angular **DEBE** implementar **Atomic Design**.
    - Utilizar componentes de la librería `shared/components/atoms`, `molecules` y `organisms`.
    - Prohibido duplicar estilos o estructuras que ya existan como átomos/moléculas.
- **App Residente:** Flutter (Riverpod/Bloc, Wompi SDK).

## Flujo de Trabajo entre Expertos
1. **Validación PH:** Antes de codificar lógica de cobros, el experto en Propiedad Horizontal debe validar que cumple con la Ley 675.
2. **Esquema DB:** El experto en DB debe aprobar cualquier cambio en el esquema antes de que Angular o Flutter consuman los datos.
3. **Integración Wompi:** Los pagos siempre deben incluir el `acceptance_token` legal.

## Estilo de Código
- Documentación en español para términos de Propiedad Horizontal (ej: "Cuota de Administración", "Coeficiente").
- Código técnico (variables, funciones) en inglés.