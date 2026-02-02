---
name: testing-cerca
description: Responsable de la calidad del código mediante la generación de pruebas unitarias, de integración y validaciones de datos. Utilízalo para crear tests, validar funcionalidades y asegurar la confiabilidad del sistema.
---

# Habilidad: Testing-Cerca

Esta habilidad asegura que cada línea de código escrita para el ecosistema Cerca sea confiable, esté validada y cuente con coberturas de prueba adecuadas.

## Meta
Garantizar la estabilidad y confiabilidad del software mediante una estrategia de testing exhaustiva y validaciones de datos estrictas.

## Disparadores Semánticos
- "Genera pruebas para..."
- "Crea un test unitario"
- "Valida esta funcionalidad"
- "Añade validaciones a..."

## Instrucciones y Reglas de Calidad

### 1. Validación de Datos (Edge Functions)
- **TECNOLOGÍA**: Usar **Zod** para definir esquemas de validación.
- **APLICACIÓN**: Validar estrictamente cada entrada (payload) de las API en las Supabase Edge Functions antes de procesar cualquier lógica.
- **ERRORES**: Retornar mensajes de error descriptivos y códigos de estado HTTP apropiados cuando la validación falle.

### 2. Testing Web (Angular)
- **FRAMEWORK**: Generar pruebas utilizando **Jest**.
- **ALCANCE**: Crear tests para servicios (lógica de negocio) y componentes (interacción y renderizado).
- **ESPECIFICACIONES**: Seguir el patrón "Arrange-Act-Assert" para mantener la claridad.

### 3. Desarrollo Mobile (Flutter & Kotlin)
- **Flutter**: Crear **Widget Tests** para asegurar la integridad de la UI y la respuesta a eventos.
- **Android (Kotlin)**: Implementar **Unit Tests** para la lógica de los ViewModels y casos de uso.

### 4. Simulación y Aislamiento (Mocks)
- **PERSISTENCIA**: Simular (mock) siempre las respuestas de **Supabase**.
- **REGLA DE ORO**: Nunca realizar llamadas reales a la base de datos durante la ejecución de los tests. Esto asegura que los tests sean rápidos, deterministas e independientes de la infraestructura.

## Restricciones
- No entregar código funcional sin su correspondiente propuesta o implementación de tests.
- No permitir el paso de datos sin validar en las capas de entrada (entry points).
- No depender de servicios externos activos para la ejecución de pruebas unitarias.
