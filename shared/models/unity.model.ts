/**
 * Definición de la Unidad (Apartamento/Casa) en el ecosistema Cerca.
 */
export interface Unity {
    id: string; // UUID
    conjunto_id: string; // Tenant isolation
    bloque?: string;
    numero: string;
    coeficiente?: number;
    area?: number;
    is_moroso: boolean;
    created_at: string;
}

export type UserRole = 'admin' | 'portero' | 'residente';

export interface UserProfile {
    id: string; // Auth User ID
    conjunto_id: string;
    nombre: string;
    rol: UserRole;
    unidad_id?: string;
}
