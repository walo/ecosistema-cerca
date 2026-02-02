---
name: CercaNotionGitSync
description: Sincronizador de flujo de trabajo encargado de mantener la paridad entre el código (Git) y la gestión del proyecto (Notion). Utilízalo para automatizar el cierre de tareas y el registro de auditoría técnica.
---

# Habilidad: CercaNotionGitSync

Esta habilidad actúa como el puente de automatización entre el desarrollo técnico en Git y la gestión estratégica en Notion, asegurando que ambos sistemas estén siempre sincronizados sin intervención manual.

## Meta
Mantener una fuente de verdad coherente donde cada commit técnico tenga una representación directa y actualizada en el tablero de gestión de Notion.

## Disparadores Semánticos
- "Haz commit"
- "Actualiza la tarea en Notion"
- "Genera el reporte de cambios técnico"

## Instrucciones y Lógica de Sincronización

### 1. Paridad Git-Notion (Sync Logic)
- **DETECCIÓN DE TAREA**: Al preparar un commit, el asistente debe buscar en el mensaje del commit o en el contexto actual un ID de página o base de datos de Notion.
- **ESTADO DE TAREA**: Una vez detectado el commit exitoso, se debe utilizar el servidor MCP de Notion para localizar la tarea correspondiente y actualizar su propiedad de estado (Status) a "Done" o "Completado".

### 2. Auditoría Técnica (Audit Trail)
- **REGISTRO DE CAMBIOS**: Por cada acción relevante en el código, se debe insertar un bloque de información en la página de Notion asociada que incluya:
  - El **Hash del commit**.
  - Un breve resumen de los módulos o archivos afectados (e.g., `apps/admin-web`, `supabase/migrations`).
  - Un enlace al commit si el repositorio es accesible vía web.
- **HISTORIAL**: Asegurar que los comentarios o logs insertados en Notion sean cronológicos para facilitar la revisión por parte de otros miembros del equipo.

### 3. Reporte de Cambios
- **RESUMEN TÉCNICO**: Capacidad de generar un resumen consolidado de los últimos commits para pegarlo como una nota de actualización o "Changelog" en Notion.

## Restricciones
- No intentar actualizar tareas en Notion si no se ha confirmado primero la identidad del workspace mediante el comando de búsqueda del MCP.
- No duplicar logs de auditoría si el commit es una corrección menor de un commit anterior (amend).
- Asegurarse de que el bot de Notion (`Antigravity`) tenga permisos de edición en las bases de datos de tareas.
