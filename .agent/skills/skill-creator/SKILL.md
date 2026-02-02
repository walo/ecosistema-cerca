---
name: creador-de-habilidades
description: Utiliza esta habilidad cuando necesites crear, modificar o diseñar nuevas habilidades (skills) para el asistente Antigravity en español. Ayuda a estructurar el archivo SKILL.md, definir el disparador semántico y organizar los directorios necesarios.
---

# Habilidad: Creador de Habilidades

Esta habilidad guía al asistente en la creación de nuevas capacidades modulares siguiendo los estándares de Antigravity AI.

## Meta
Proveer una estructura clara, instrucciones precisas y plantillas para expandir las capacidades del asistente mediante habilidades personalizadas.

## Instrucciones

1.  **Identificar el Propósito**: Determina qué tarea específica automatizará la nueva habilidad.
2.  **Estructura de Directorios**:
    -   Crea una carpeta en `.agent/skills/<nombre-de-la-habilidad>`.
    -   El archivo principal DEBE llamarse `SKILL.md`.
3.  **Configurar Frontmatter (YAML)**:
    -   `name`: Identificador único (minúsculas, guiones).
    -   `description`: **CRÍTICO**. Debe ser una frase que describa cuándo usar la habilidad. Funciona como el activador semántico.
4.  **Cuerpo del Markdown**:
    -   **Meta**: Objetivo de alto nivel.
    -   **Instrucciones**: Pasos lógicos que el asistente debe seguir al ejecutar la habilidad.
    -   **Ejemplos**: Casos de uso prácticos.
    -   **Restricciones**: Qué NO debe hacer el asistente.
5.  **Componentes Opcionales**:
    -   `scripts/`: Si la habilidad requiere ejecutar código (Python, Bash, Node).
    -   `resources/`: Para archivos de apoyo, plantillas o documentación extensa.

## Ejemplos de Uso

### Usuario solicita: "Crea una habilidad para gestionar despliegues en AWS"
**Acción**: El asistente crea `.agent/skills/aws-deploy/SKILL.md` con instrucciones sobre el uso de AWS CLI y verificaciones de seguridad.

## Restricciones
-   **No** crear habilidades que dupliquen herramientas nativas de Antigravity.
-   **No** incluir secretos o credenciales en los archivos de la habilidad.
-   Todas las instrucciones deben ser claras y evitar ambigüedades.
