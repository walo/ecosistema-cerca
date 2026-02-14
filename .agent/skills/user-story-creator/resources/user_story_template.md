# Historia de Usuario: [Título de la Historia]

**ID**: US-[NÚMERO]
**Prioridad**: [Alta/Media/Baja]

## 1. Definición (Como/Quiero/Para)
**Como**: [Rol del usuario]
**Quiero**: [Acción o funcionalidad]
**Para**: [Beneficio o valor de negocio]

## 2. Contexto de Negocio y PH (Ley 675)
[Descripción de cómo esta funcionalidad encaja en la Propiedad Horizontal y cumplimiento legal si aplica].

## 3. Criterios de Aceptación (Gherkin)
-   **Escenario 1**: [Título del escenario]
    -   **Dado** [Contexto inicial]
    -   **Cuando** [Acción realizada]
    -   **Entonces** [Resultado esperado]

## 4. Tareas Técnicas (Arquitectura Cerca)

### Backend (Supabase/Edge Functions)
- [ ] [ ] Definir tabla/campos en PostgreSQL (Multi-tenancy con `tenant_id`).
- [ ] [ ] Configurar RLS (Row Level Security).
- [ ] [ ] Crear/Actualizar Edge Function en Deno (si aplica).

### Frontend (Angular Admin)
- [ ] [ ] Implementar componentes siguiendo **Atomic Design** (Atoms/Molecules/Organisms).
- [ ] [ ] Gestión de estado con Signals.
- [ ] [ ] Separación de archivos (.ts, .html, .scss).

### App Móvil (Flutter)
- [ ] [ ] Implementar UI con Riverpod/Bloc.

## 5. Validación de Seguridad y Privacidad
- [ ] [ ] Verificación de permisos por rol.
- [ ] [ ] Auditoría de cambios (Audit log).
