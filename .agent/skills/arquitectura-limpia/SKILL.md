---
name: arquitectura-limpia
description: Implementar patrones de diseño (SOLID) y excelencia técnica en frontend y mobile. Enfocado en código desacoplado, tipado estricto y gestión de estado moderna.
---

# Habilidad: ArquitecturaLimpia

Esta habilidad establece los estándares de excelencia técnica para el desarrollo de aplicaciones cliente (Frontend y Mobile) dentro del ecosistema Cerca, asegurando que el código sea mantenible, testeable y escalable.

## Meta
Garantizar la aplicación rigurosa de principios SOLID y Clean Architecture en todas las capas de las aplicaciones, utilizando los patrones y herramientas de estado más eficientes de la industria.

## Disparadores Semánticos
- "Aplica Clean Architecture a este módulo"
- "Implementa el patrón Repository para..."
- "Refactoriza usando Signals"
- "Configura Riverpod en..."

## Instrucciones y Patrones de Diseño

### 1. Patrones Fundamentales (Comunes)
- **Repository Pattern**: Separar la lógica de obtención de datos (API, Local Storage) de la lógica de negocio.
- **Factory Pattern**: Centralizar la creación de objetos complejos o entidades de dominio.
- **SOLID**:
  - **S**: Una clase/función debe tener una única responsabilidad.
  - **O**: Abierto a extensión, cerrado a modificación.
  - **L**: Subtipos deben ser sustituibles por sus tipos base.
  - **I**: No obligar a implementar interfaces que no se usan.
  - **D**: Depender de abstracciones, no de concreciones.

### 2. Frontend (Angular)
- **Signals**: Uso mandatorio de `signal()`, `computed()` y `effect()` para la gestión de estados reactivos en lugar de RxJS (donde sea posible).
- **Dependency Injection**: Utilizar la función `inject()` para la obtención de servicios y dependencias.
- **Strict Typing**: Forzar interfaces claras para todos los DTOs y modelos de dominio. No usar `any`.

### 3. Mobile (Flutter)
- **Layered Architecture**: Estructura de carpetas por `Data`, `Domain` y `Presentation`.
- **State Management**: Implementar **Riverpod** para la inyección de dependencias y la gestión del estado reactivo.
- **Domain Driven**: Las reglas de negocio deben residir exclusivamente en la capa de Domain (Usecases).

### 4. Mobile (Android - Kotlin)
- **MVVM/MVI**: Implementar flujos de datos unidireccionales.
- **UI**: Uso exclusivo de **Jetpack Compose** para interfaces declarativas.
- **ViewModel**: Centralizar la lógica de UI y persistencia del estado ante cambios de configuración.

## Restricciones
- **PROHIBIDO** el uso de lógica de negocio dentro de componentes de UI o Widgets (Flutter).
- **PROHIBIDO** el uso de inyección por constructor en Angular si el estándar del proyecto define `inject()`.
- No permitir estados mutables globales sin el uso de un gestor de estado (Riverpod/Signals).
- No ignorar el tipado estricto en el intercambio de datos entre capas.
