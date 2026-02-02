---
name: SaaSGatewayValidator
description: Validador de acceso a funciones basado en niveles de suscripción y planes de pago del conjunto. Utilízalo para añadir restricciones por plan, validar suscripciones y gestionar Feature Flags.
---

# Habilidad: SaaSGatewayValidator

Esta habilidad gestiona el acceso dinámico a las funcionalidades del sistema basándose en la capa comercial (SaaS) contratada por el cliente.

## Meta
Garantizar que el acceso a los módulos y herramientas del ecosistema Cerca esté correctamente alineado con el plan de suscripción y el estado de pago de cada cliente corporativo.

## Disparadores Semánticos
- "Añade una restricción por plan"
- "Valida la suscripción antes de..."
- "Oculta el módulo si no han pagado"

## Instrucciones y Lógica de Acceso

### 1. Validación en el Servidor (Edge Functions)
- **TECNOLOGÍA**: Usar **Zod** para definir esquemas que incluyan la verificación de la capa de suscripción.
- **FLUJO**: Consultar el campo `subscription_tier` de la tabla de conjuntos en la base de datos central antes de permitir la ejecución de lógica de negocio crítica.
- **RESPUESTA**: Si el nivel de suscripción es insuficiente, retornar un error `403 Forbidden` con un mensaje indicando que la funcionalidad requiere un plan superior.

### 2. Lógica de Interfaz (Angular)
- **FEATURE FLAGS**: Implementar un servicio central de permisos que cargue las capacidades permitidas del conjunto.
- **VISIBILIDAD**: Utilizar directivas o guards para ocultar o deshabilitar elementos de la interfaz (botones, opciones de menú, vistas completas) si la funcionalidad no está incluida en el contrato.
- **FEEDBACK**: Mostrar de forma elegante (ej: mediante un tooltip o un banner sutil) que ciertas funciones están bloqueadas por el plan actual para incentivar la mejora (upselling).

## Restricciones
- No depender exclusivamente de la validación en el frontend; la validación en las Edge Functions es obligatoria para la seguridad.
- No utilizar lógica "hardcoded" para planes específicos que dificulte la adición futura de nuevas capas de suscripción.
- No bloquear funcionalidades esenciales de seguridad o mantenimiento por falta de pago, priorizando la estabilidad del sistema.
