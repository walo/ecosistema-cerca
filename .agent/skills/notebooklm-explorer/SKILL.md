---
name: notebooklm-explorer
description: Experto en la gestión de cuadernos, fuentes y generación de contenido mediante el MCP de NotebookLM.
---

# NotebookLM Explorer Skill

Esta habilidad permite interactuar de forma avanzada con el MCP de NotebookLM para gestionar el ciclo de vida de la información: desde la investigación profunda hasta la generación de artefactos multimedia.

## Disparador Semántico
Se activa cuando el usuario solicita realizar investigaciones, gestionar cuadernos de Google NotebookLM, analizar fuentes (PDFs, URLs, Drive) o generar resúmenes, cuestionarios, audios o videos basados en información estructurada.

## Herramientas y Capacidades

### 🔐 Autenticación y Gestión
- **`refresh_auth`**: Recarga tokens o inicia re-autenticación automática (headless). usar después de `notebooklm-mcp-auth`.
- **`save_auth_tokens`**: Método de respaldo para guardar cookies manualmente si falla el CLI.

### 📚 Gestión de Cuadernos
- **`notebook_list`**: Lista todos los cuadernos disponibles.
- **`notebook_create`**: Crea un nuevo cuaderno.
- **`notebook_get`**: Obtiene detalles y fuentes de un cuaderno.
- **`notebook_describe`**: Genera un resumen IA y temas sugeridos.
- **`notebook_rename`** / **`notebook_delete`**: Operaciones de gestión.

### 📄 Gestión de Fuentes
- **`notebook_add_url`**: Agrega sitios web o YouTube.
- **`notebook_add_text`**: Agrega texto pegado.
- **`notebook_add_drive`**: Integra documentos de Google Drive (Doc, Slide, Sheet, PDF).
- **`source_get_content`**: Extrae texto plano original (rápido, sin IA).
- **`source_describe`**: Resume una fuente con palabras clave.
- **`source_list_drive`** / **`source_sync_drive`**: Sincroniza cambios desde Drive.

### 🔍 Investigación Avanzada
- **`research_start`**: Inicia investigación profunda (Deep) o rápida (Fast) buscando nuevas fuentes en la web.
- **`research_status`**: Monitorea el progreso de la investigación.
- **`research_import`**: Importa los hallazgos en el cuaderno.
- **`notebook_query`**: Pregunta a la IA sobre fuentes **existentes** (no para buscar nuevas).

### 🎨 Generación de Contenido (Studio)
Genera artefactos basados en las fuentes del cuaderno:
- **`audio_overview_create`**: Resumen en audio (Podcast style).
- **`video_overview_create`**: Video explicativo con diferentes estilos visuales.
- **`infographic_create`**: Infografías visuales.
- **`slide_deck_create`**: Presentaciones de diapositivas.
- **`report_create`**: Blogs, guías de estudio o briefing docs.
- **`flashcards_create`** / **`quiz_create`**: Material para aprendizaje.
- **`mind_map_create`** / **`data_table_create`**: Estructuración de datos.

## Flujos Recomendados

### Ciclo de Investigación
1. `research_start(query="...", mode="deep")`
2. Pollear `research_status` hasta que esté completo.
3. `research_import(notebook_id, task_id)`
4. `notebook_query` para sintetizar la información.

### Generación de Material de Estudio
1. `notebook_add_drive` con los documentos base.
2. `flashcards_create` para repasar conceptos clave.
3. `quiz_create` para validar el conocimiento.
4. `audio_overview_create` para repaso pasivo.

## Notas Importantes
- Siempre solicitar confirmación del usuario para acciones de **borrado** o **gastos de créditos/generación** (confirm=True).
- Prefiere `source_get_content` si el objetivo es solo exportar el texto sin análisis.
