---
name: user-story-creator
description: Genera historias de usuario completas y detalladas siguiendo los estándares de arquitectura, diseño atómico y legalidad PH del ecosistema Cerca. Actívala cuando el usuario proporcione una descripción breve de una funcionalidad ("Yo como...").
---

# Habilidad: Creador de Historias de Usuario

Esta habilidad automatiza la creación de documentación técnica y de negocio para nuevas funcionalidades, asegurando que se cumplan todas las reglas del ecosistema.

## Meta
Transformar requerimientos breves en historias de usuario robustas con criterios de aceptación Gherkin, desgloses técnicos (Backend/Frontend) y validaciones legales de Propiedad Horizontal.

## Instrucciones

1.  **Analizar el Requerimiento**: Identificar los roles involucrados y el impacto en el sistema multi-tenant.
2.  **Cargar Plantilla**: Utilizar la estructura de `resources/user_story_template.md`.
3.  **Aplicar Reglas PH**: Si la historia involucra cobros, sanciones o administración, citar la Ley 675 o principios de PH.
4.  **Aplicar Estándares Técnicos**:
    -   Backend: Referenciar `tenant_id` y RLS.
    -   Frontend: Referenciar **Atomic Design** y Signals.
5.  **Generar Gherkin**: Escribir al menos 2 escenarios de criterios de aceptación claros.
6.  **Desglosar Tareas**: Dividir el trabajo en Backend, Frontend Admin y App Residente si aplica.

## Ejemplo de Activación
-   **Usuario**: "Crea una historia de usuario: Yo como administrador quiero registrar un residente".
-   **Acción**: Generar el documento siguiendo la plantilla y las reglas de PH/Arquitectura.

## Restricciones
-   **No** omitir la sección de RLS/Multi-tenancy.
-   **No** duplicar componentes si ya existen en la arquitectura atómica.
-   El lenguaje de la historia (Negocio) debe ser en español, pero los términos técnicos se mantienen en inglés.
