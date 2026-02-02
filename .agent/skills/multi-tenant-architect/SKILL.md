---
name: multi-tenant-architect
description: Especialista en la implementación técnica de arquitecturas multi-inquilino (SaaS). Se encarga de la segregación estricta de datos, configuración de RLS en Supabase, y manejo del contexto de conjunto_id en todo el stack tecnológico.
---

# Habilidad: MultiTenantArchitect

Esta habilidad es responsable de garantizar que el ecosistema Cerca funcione como un SaaS seguro, donde la información de un conjunto residencial es inaccesible para otros.

## Meta
Automatizar la creación de esquemas de base de datos protegidos y asegurar que cada flujo de datos (Frontend -> Edge Function -> DB) transporte y valide correctamente el identificador del conjunto (`conjunto_id`).

## Disparadores Semánticos
- "Crea la migración para la tabla..."
- "Configura la seguridad de..."
- "Añade aislamiento a..."
- "Implementa el filtrado por conjunto en..."
- "Genera las políticas RLS para..."

## Instrucciones y Reglas Obligatorias

### 1. Nivel de Base de Datos (Supabase / PostgreSQL)
- **Schema Design**: Toda tabla nueva debe incluir `conjunto_id UUID NOT NULL DEFAULT auth.jwt()->>'conjunto_id'::uuid`.
- **Relaciones**: El campo `conjunto_id` debe ser una llave foránea vinculada a la tabla maestra `public.conjuntos(id)`.
- **Automatización de RLS**: Al crear o modificar tablas, generar siempre el siguiente bloque SQL:
  ```sql
  ALTER TABLE "nombre_tabla" ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Usuarios pueden ver datos de su propio conjunto" 
  ON "nombre_tabla" FOR SELECT 
  USING (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);

  CREATE POLICY "Usuarios pueden insertar datos en su propio conjunto" 
  ON "nombre_tabla" FOR INSERT 
  WITH CHECK (conjunto_id = (auth.jwt() ->> 'conjunto_id')::uuid);
  ```
- **Indexación**: Crear automáticamente índices para la columna `conjunto_id` para optimizar las consultas filtradas.

### 2. Nivel de Backend (Supabase Edge Functions)
- **Validación de Token**: Implementar validación de JWT para extraer el `conjunto_id` de los claims del usuario antes de procesar cualquier lógica de negocio.
- **Service Role**: Si se usa el `service_role` para operaciones administrativas, el desarrollador debe pasar explícitamente el `conjunto_id` y la función debe validar que el recurso afectado pertenece a dicho ID.

### 3. Nivel de Frontend (Angular / Mobile)
- **Tenant Context Service**: Crear un servicio que almacene el `conjunto_id` actual tras el login.
- **HTTP Interceptor**: Generar un interceptor que adjunte automáticamente el `X-Conjunto-Id` en las cabeceras si la API lo requiere para validaciones adicionales.
- **Storage**: Nunca persistir datos de diferentes conjuntos en el mismo espacio de `localStorage` sin prefijos que incluyan el ID del conjunto.

### 4. Lógica de Negocio y SaaS
- **Suscripciones**: Antes de permitir un `INSERT`, verificar si el conjunto tiene una suscripción activa y si ha alcanzado el límite de registros permitidos por su plan (Feature Flags).
- **Logs de Auditoría**: Cada registro en la tabla de auditoría debe capturar el `conjunto_id` y el `user_id` para trazabilidad completa.

## Restricciones
- **PROHIBIDO** generar consultas `SELECT` sin la cláusula `WHERE conjunto_id = ...` a menos que RLS esté explícitamente confirmado.
- **PROHIBIDO** usar IDs incrementales simples (Integer) para identificar conjuntos; usar siempre UUID para evitar ataques de enumeración.
- No permitir que un usuario cambie su propio `conjunto_id` mediante una petición `UPDATE`.

## Relación con Arquitecto-Cerca
- **MultiTenantArchitect** se encarga del **CÓMO** se aíslan los datos.
- **Arquitecto-Cerca** se encarga del **QUÉ** se construye y cómo se estructuran los patrones (SOLID, Repositorios).
