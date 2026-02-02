# 📂 Fuente de Verdad: Ecosistema "Cerca"

**Versión:** 1.0  
**Estado:** Definición Arquitectónica  
**Tecnologías:** Angular, Kotlin, Flutter, Supabase, Deno.

---

## 1. Definición y Visión del Proyecto

Cerca es una plataforma SaaS (Software as a Service) multi-tenant diseñada para la gestión integral de comunidades residenciales. Su objetivo es centralizar la comunicación, seguridad, finanzas y gobernanza, eliminando la fragmentación tecnológica actual en la Propiedad Horizontal.

### Propuesta de Valor
- **Seguridad Garantizada:** Citofonía híbrida que no depende de internet local.
- **Transparencia Financiera:** Lógica de morosidad vinculada al acceso a servicios.
- **Comunidad Activa:** Marketplace y directorio comercial integrado.
- **Gobernanza Digital:** Votaciones legales inalterables por coeficiente.

---

## 2. Alcance del Sistema

### 2.1 Componentes del Ecosistema
- **SaaS Admin (SuperAdmin):** Gestión de planes, suscripciones, facturación y métricas globales de negocio.
- **Admin Web (Conjunto):** Gestión operativa, financiera e IoT del conjunto residencial.
- **Porter App (Android Nativo):** Terminal de seguridad para control de acceso, citofonía y paquetería.
- **Resident App (Híbrida):** Interfaz para residentes (pagos, marketplace, citofonía nativa, reservas).
- **Core Gateway (Supabase Edge):** Validación de reglas SaaS y seguridad multi-tenant.

### 2.2 Requerimientos No Funcionales
- **Aislamiento Multi-tenant:** Los datos de un conjunto son invisibles para otros mediante RLS.
- **Alta Disponibilidad:** Redundancia de comunicación vía SIM Card en portería.
- **Escalabilidad:** Arquitectura basada en microservicios (Edge Functions) y eventos en tiempo real.

---

## 3. Estructura del Proyecto (Monorepo)

```text
/cerca-ecosystem
  ├── /apps
  │   ├── /saas-admin      (Angular - Gestión de Suscripciones)
  │   ├── /admin-web       (Angular - Gestión de Conjunto)
  │   ├── /porter-app      (Kotlin  - Seguridad y Citofonía)
  │   └── /resident-app    (Flutter - Residentes)
  ├── /supabase
  │   ├── /migrations      (Esquemas SQL, RLS y Triggers)
  │   ├── /functions       (Edge Functions: Gateway, VoIP, Payments)
  │   └── config.toml
  ├── /shared
  │   └── /models          (Interfaces y DTOs comunes)
  └── /docs                (Especificaciones y ADRs)
```

---

## 4. Arquitectura de Datos (Modelo ER)

### 4.1 Core SaaS (Genérico)
- **conjuntos (tenants):** id, nombre, nit, direccion, subdominio, status, created_at.
- **planes:** id, nombre, descripcion, precio_mensual, limites_json, features_json.
- **suscripciones:** id, conjunto_id, plan_id, fecha_inicio, fecha_fin, status (activo/mora/suspendido).

### 4.2 Dominio Cerca
- **unidades:** id, conjunto_id, bloque, numero, coeficiente, area.
- **usuarios_perfiles:** id, conjunto_id, user_id, nombre, rol (admin/portero/residente), unidad_id.
- **pagos:** id, conjunto_id, unidad_id, monto, periodo, estado (pagado/pendiente).
- **citofonia_logs:** id, conjunto_id, unidad_id, portero_id, duracion, tipo (entrada/salida).
- **iot_sensores:** id, conjunto_id, tipo (agua/luz), valor_actual, ultima_lectura.
- **asambleas_votos:** id, conjunto_id, asamblea_id, unidad_id, opcion_id, hash_voto.

---

## 5. Mapas de Procesos Críticos

### 5.1 Flujo de Citofonía Híbrida
1. Porter App marca el número de unidad.
2. Gateway verifica si la unidad está en mora y si la suscripción del conjunto está activa.
3. Si es válido, intenta llamada vía WebRTC/VoIP.
4. Si no hay respuesta en 10s o falla internet, dispara llamada vía GSM (SIM Card) al número del residente.
5. Resident App despierta mediante CallKit/ConnectionService para mostrar interfaz nativa.

### 5.2 Flujo de Votación (Gobernanza)
1. Admin abre votación en el Panel Web.
2. Supabase Realtime notifica a todas las Resident Apps.
3. Residente vota; el sistema valida que no haya votado previamente.
4. Se genera un hash del voto vinculado a la unidad_id y asamblea_id.
5. El resultado se calcula multiplicando cada voto por el coeficiente de la unidad.

---

## 6. Diagrama de Clases (Abstracto)

### Capa de Dominio (Shared)
- **Tenant:** Maneja la identidad del conjunto y su estado SaaS.
- **Unity:** Representa el apartamento/casa y su estado financiero (`is_moroso`).
- **Person:** Clase base para residentes y staff con permisos específicos.
- **AccessControl:** Gestiona logs de visitantes y apertura de puertas.

### Capa de Infraestructura
- **SupabaseRepository:** Implementación concreta de la persistencia con RLS.
- **VoIPProvider:** Abstracción para el manejo de llamadas (Twilio/Asterisk/Nativo).
- **IoTGateway:** Transformador de señales MQTT a modelos de datos.

---

## 7. Product Backlog (Priorizado)

### Sprint 1: El Cerebro (SaaS & Core)
- Configuración de Supabase Multi-tenant.
- App `saas-admin` básica para crear conjuntos y planes.
- Implementación del Gateway de validación de suscripciones.

### Sprint 2: Operación Base (Admin & Portería)
- CRUD de unidades y residentes en `admin-web`.
- Registro de visitantes y paquetería en `porter-app`.
- Sincronización de estados de pago (Mora Checker).

### Sprint 3: Comunicación (Citofonía & Mobile)
- Integración de CallKit/ConnectionService en `resident-app`.
- Lógica de marcado GSM/VoIP en `porter-app`.
- Marketplace básico (CRUD de productos).

---

## 8. Reglas de Negocio Universales

1. **Principio de Mora:** Si `unidad.saldo_pendiente > 0`, entonces `unidad.can_reserve = false`.
2. **Principio de Suscripción:** Si `suscripcion.status != 'activo'`, las Apps de portería y residentes entran en modo "Solo Lectura".
3. **Privacidad:** Un administrador de conjunto NO puede ver datos de otro conjunto. Solo el SuperAdmin ve métricas agregadas.
