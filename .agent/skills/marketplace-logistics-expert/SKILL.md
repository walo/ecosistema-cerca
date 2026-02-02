---
name: MarketplaceLogistics-Expert
description: Especialista en reglas de negocio para el comercio entre vecinos y geolocalización de aliados comerciales. Utilízalo cuando necesites implementar mercados internos, logística de proximidad o geofencing.
---

# Habilidad: MarketplaceLogistics-Expert

Esta habilidad gestiona la lógica de negocio necesaria para crear un ecosistema de comercio seguro y eficiente dentro de las comunidades residenciales de Cerca.

## Meta
Establecer un marketplace de confianza que fomente el comercio de proximidad (vecino a vecino) y conecte a los aliados comerciales con los residentes basándose en su ubicación geográfica.

## Disparadores Semánticos
- "Crea el marketplace"
- "Añade un producto"
- "Muestra los locales de la zona"
- "Califica al vecino"

## Instrucciones y Reglas de Negocio

### 1. Validación Social (Protocolo de Confianza)
- **VECINO VERIFICADO**: Antes de permitir que un usuario publique un producto o servicio en el marketplace interno, se DEBE consultar su estado de residencia activa en la base de datos central.
- **RESTRICTIVIDAD**: Si el usuario no tiene una unidad asignada con estado "Activo", su perfil debe marcarse como "No Verificado" o restringir su capacidad de venta para prevenir fraudes.
- **REPUTACIÓN**: Implementar sistemas de calificación que dependan de transacciones completadas exitosamente entre residentes del mismo conjunto.

### 2. Geofencing y Comercio de Proximidad
- **FILTRADO GEOGRÁFICO**: Estructurar las consultas a locales comerciales de aliados utilizando cálculos de distancia (Haversine o extensiones PostGIS en Supabase).
- **RADIO DE CERCANÍA**: Mostrar únicamente los negocios que se encuentren dentro del radio de influencia definido para el conjunto residencial (ej: 2km - 5km).
- **ORDENAMIENTO**: Los resultados deben priorizar la cercanía física y los beneficios exclusivos para el "Cercanito" (convenios activos).

### 3. Logística de Entrega
- **PUNTOS DE RECOGIDA**: Facilitar la configuración de "Portería" o "Locker" como puntos de entrega seguros para transacciones entre vecinos.
- **ESTADOS DE PEDIDO**: Manejar estados de transacción claros: `Pendiente`, `En Camino`, `Entregado en Portería`, `Completado`.

## Restricciones
- No permitir el registro de productos sin una categoría válida del catálogo maestro.
- No mostrar locales comerciales que no tengan coordenadas geográficas válidas.
- No permitir transacciones comerciales si el conjunto tiene la funcionalidad de Marketplace deshabilitada en su `subscription_tier`.
