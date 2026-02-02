/**
 * Definición del Tenant (Conjunto Residencial) en el ecosistema Cerca.
 */
export interface Tenant {
  id: string; // UUID
  nombre: string;
  nit?: string;
  direccion?: string;
  subdominio?: string;
  status: 'activo' | 'mora' | 'suspendido';
  created_at: string;
}

export interface Plan {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_mensual: number;
  limites_json?: any;
  features_json?: any;
}

export interface Subscription {
  id: string;
  conjunto_id: string;
  plan_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  status: 'activo' | 'mora' | 'suspendido';
}
