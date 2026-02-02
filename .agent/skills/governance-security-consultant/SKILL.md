---
name: GovernanceSecurity-Consultant
description: Experto en seguridad de la información, auditoría de votos y cumplimiento legal de protección de datos. Utilízalo para crear votaciones, asegurar la privacidad y cumplir con normativas de seguridad.
---

# Habilidad: GovernanceSecurity-Consultant

Esta habilidad proporciona el marco técnico y legal para garantizar que los procesos de toma de decisiones y el manejo de datos sensibles en el ecosistema Cerca sean seguros, privados y auditables.

## Meta
Establecer sistemas de gobernanza digital inmutables y conformes a la ley, protegiendo el anonimato del voto mientras se asegura la integridad del proceso democrático.

## Disparadores Semánticos
- "Crea la votación"
- "Protege el voto"
- "Genera el log de auditoría"
- "Anonimiza los resultados"

## Instrucciones y Reglas de Seguridad

### 1. Inmutabilidad de Datos (Votaciones)
- **REGISTRO AUDITABLE**: Diseñar esquemas de tablas para logs de votación que impidan modificaciones o eliminaciones posteriores.
- **POSTGRES RULES**: Implementar reglas (`RULE`) o disparadores (`TRIGGER`) en la base de datos que lancen errores ante cualquier intento de `UPDATE` o `DELETE` sobre las tablas de votos emitidos.

### 2. Privacidad y Secreto del Voto
- **ANONIMATO**: Implementar técnicas de hashing salado (one-way hashing) para registrar el sentido del voto de forma que no pueda vincularse directamente con el votante en la tabla de resultados.
- **GESTIÓN DE QUÓRUM**: Mantener un registro separado (mapeo) de "quién ya votó" únicamente para el cálculo de quórum y participación, sin conexión trazable al contenido del voto en sí.

### 3. Cumplimiento Legal (Compliance)
- **PROTECCIÓN DE DATOS**: Asegurar que cada formulario de captura de información personal incluya cláusulas de **Habeas Data** y términos de uso específicos de la región (ej: Ley 1581 en Colombia).
- **CONSENTIMIENTO**: Validar que el usuario ha aceptado explícitamente el tratamiento de sus datos antes de persistir cualquier información sensible.

## Restricciones
- No permitir la creación de sistemas de votación que almacenen el voto asociado directamente al ID del usuario sin cifrado o hashing.
- No omitir las validaciones de cumplimiento legal en puntos de entrada de datos de residentes.
- No permitir que los logs de auditoría sean accesibles o modificables por administradores de sistema sin privilegios especiales de auditoría.
