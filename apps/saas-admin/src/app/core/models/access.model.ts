
export interface Permission {
    id: string;
    module: string; // e.g., 'BILLING', 'CATALOG'
    option: string; // e.g., 'READ', 'WRITE'
    route?: string; // e.g., '/billing/coupons'
    description?: string;
    status_id: number; // 1: Active, 2: Inactive
    created_at?: string;
}

export interface PlanPermission {
    id: string;
    plan_id: string;
    permission_id: string;

    // Join
    permission?: Permission;
}

export interface AdminUser {
    user_id: string;
    role: 'super_admin' | 'admin' | 'viewer';
    created_at?: string;
    updated_at?: string;

    // Join from auth.users (handled via view or separate call usually, 
    // but here we might just show email if we can join or store it)
    email?: string;
}

export interface CreatePermissionDTO extends Omit<Permission, 'id' | 'created_at'> { }
export interface UpdatePermissionDTO extends Partial<CreatePermissionDTO> { }
