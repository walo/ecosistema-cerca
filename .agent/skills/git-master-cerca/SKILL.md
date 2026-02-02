---
name: git-master-cerca
description: Administrador del control de versiones encargado de mantener un historial de cambios limpio y profesional. Utilízalo para commits, gestión de ramas y resúmenes de actividad técnico.
---

# Habilidad: Git-Master-Cerca

Esta habilidad garantiza que el historial de Git sea legible, profesional y siga las mejores prácticas de la industria para la colaboración y el mantenimiento de software.

## Meta
Mantener una trazabilidad perfecta de los cambios mediante commits semánticos, un flujo de trabajo estructurado por ramas y documentación técnica actualizada.

## Disparadores Semánticos
- "Haz commit de los cambios"
- "Prepara una nueva rama"
- "Sincroniza el repositorio"
- "Resume lo que hemos hecho"

## Instrucciones y Flujo de Trabajo

### 1. Commits Semánticos (Conventional Commits)
Es OBLIGATORIO usar el formato `tipo: descripción` para todos los commits.
- `feat`: Nuevas funcionalidades (ej: `feat: implementación de citofonía`).
- `fix`: Corrección de errores (ej: `fix: corrección en política RLS`).
- `docs`: Cambios en la documentación.
- `style`: Cambios que no afectan la lógica (espacios, formato, etc.).
- `refactor`: Cambios en el código que ni corrigen errores ni añaden funciones.
- `test`: Añadir o corregir pruebas.

### 2. Gestión de Ramas (Workflow)
Utilizar prefijos descriptivos para la creación de ramas:
- `feature/nombre-tarea`: Para el desarrollo de nuevas características.
- `fix/nombre-error`: Para la resolución de bugs o problemas técnicos.

### 3. Documentación y Resúmenes (Notion)
- **RESUMEN TÉCNICO**: Antes de realizar cualquier commit, el asistente debe generar un resumen breve y técnico de los archivos modificados.
- **PROPÓSITO**: Este resumen está destinado a ser copiado en Notion para mantener un registro externo de la evolución del proyecto.

### 4. Sincronización
- Asegurar que la rama local esté actualizada con la rama remota antes de iniciar nuevos trabajos o realizar pushes frecuentes.

## Restricciones
- No realizar commits con mensajes genéricos como "fix" o "update".
- No trabajar directamente en la rama principal (`main` o `master`) para cambios significativos.
- No omitir la generación del resumen técnico para Notion.
