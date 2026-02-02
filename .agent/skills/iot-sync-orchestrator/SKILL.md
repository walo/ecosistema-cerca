---
name: IoTSyncOrchestrator
description: Orquestador de datos en tiempo real para la integración de sensores físicos y tableros de control. Utilízalo para conectar sensores, mostrar consumos y gestionar alertas de hardware.
---

# Habilidad: IoTSyncOrchestrator

Esta habilidad está diseñada para gestionar la capa de comunicación en tiempo real entre el hardware físico (sensores/actuadores) y las interfaces de gestión del ecosistema Cerca.

## Meta
Establecer un flujo de datos reactivo y eficiente que permita la monitorización y control de dispositivos IoT con latencia mínima y máxima fiabilidad.

## Disparadores Semánticos
- "Conecta el sensor de agua"
- "Muestra el consumo de energía"
- "Notifica si el tanque está vacío"

## Instrucciones y Protocolos

### 1. Protocolos de Comunicación (MQTT)
- **ESTANDARIZACIÓN**: Diseñar esquemas JSON estructurados para la mensajería MQTT. Cada mensaje debe incluir:
    - `sensor_id`: Identificador único del dispositivo.
    - `timestamp`: Marca de tiempo en formato ISO.
    - `payload`: Datos específicos del sensor (ej: `{ "level": 85, "unit": "percent" }`).
- **TÓPICOS**: Seguir una jerarquía de tópicos clara: `cerca/[conjunto_id]/[zona]/[sensor_type]/[sensor_id]`.

### 2. Sincronización en Tiempo Real (Supabase + Signals)
- **SUSCRIPCIONES**: Generar suscriptores de Supabase (`onSnapshot` o `channel().on()`) para escuchar cambios en las tablas de estado de dispositivos.
- **REACTIVIDAD**: Vincular las actualizaciones de base de datos directamente con **Angular Signals** en el panel administrativo. El cambio en la DB debe reflejarse en la UI sin necesidad de refrescar la página.
- **OPTIMIZACIÓN**: Implementar mecanismos de "throttling" o "debouncing" si la frecuencia de actualización de los sensores es extremadamente alta para evitar sobrecargar la UI.

### 3. Lógica de Alertas
- **UMBRALES**: Definir lógica para disparar notificaciones cuando un sensor cruce un umbral crítico (ej: tanque < 10%).
- **HISTORIAL**: Asegurar que cada evento significativo sea registrado en la base de datos para análisis histórico de consumo.

## Restricciones
- No utilizar protocolos propietarios que no sean compatibles con MQTT estándar.
- No permitir que la latencia entre la detección del sensor y la actualización visual supere el segundo.
- Nunca procesar datos de sensores sin validar el esquema JSON de entrada.
