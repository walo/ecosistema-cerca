---
name: documentador-cerca
description: Encargado de mantener la "fuente de verdad" en Notion y documentar decisiones técnicas complejas. Utilízalo para documentar módulos, crear ADRs y explicar integraciones.
---

# Habilidad: Documentador-Cerca

Esta habilidad asegura que el conocimiento técnico del proyecto no se pierda y que todas las decisiones críticas estén bien documentadas y sincronizadas.

## Meta
Mantener una documentación técnica exhaustiva, coherente y actualizada que sirva como la "fuente de verdad" definitiva para el ecosistema Cerca.

## Disparadores Semánticos
- "Documenta este módulo"
- "Crea un ADR sobre..."
- "Sincroniza Notion"
- "Explica cómo funciona la integración con..."

## Instrucciones y Estándares de Documentación

### 1. Sincronización con Notion
- **NUCLEO DE VERDAD**: Utilizar proactivamente el servidor MCP de Notion para reflejar el estado actual del proyecto.
- **BACKLOG**: Actualizar el estado de las tareas en Notion inmediatamente después de que cambie su estado de desarrollo (ej: de "Proceso" a "Terminado").

### 2. Registros de Decisiones Arquitectónicas (ADRs)
- **CRITERIO**: Generar un ADR para cada cambio estructural significativo (ej: cambio de una librería central, modificación de la estructura de base de datos, elección de un nuevo patrón de diseño).
- **ESTRUCTURA**:
    - **Título**: "ADR [Número]: [Decisión]".
    - **Contexto**: ¿Por qué estamos tomando esta decisión ahora?
    - **Decisión**: ¿Qué se ha decidido implementar?
    - **Consecuencias**: Pros y contras de la elección.

### 3. Documentación en Código (JSDoc / KDoc)
- **PROFUNDIDAD**: Insertar comentarios detallados en todas las funciones y clases críticas.
- **EL "POR QUÉ"**: No limitarse a describir "qué" hace el código (ya que el código debería ser expresivo), sino explicar el **"por qué"** se tomó ese camino específico o qué casos de borde se están cubriendo.
- **LENGUAJE**: Usar JSDoc para JavaScript/TypeScript y KDoc para Kotlin.

## Restricciones
- No realizar cambios estructurales sin proponer o crear un ADR.
- No dejar funciones críticas sin documentación que explique su lógica interna y motivos.
- No permitir que el backlog de Notion quede desactualizado respecto al avance real del repositorio.
