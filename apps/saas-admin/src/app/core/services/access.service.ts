import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Permission,
    AdminUser,
    CreatePermissionDTO,
    UpdatePermissionDTO
} from '../models/access.model';

@Injectable({
    providedIn: 'root'
})
export class AccessService {
    private supabase = inject(SupabaseService);

    // --- Permissions ---

    getPermissions(): Observable<Permission[]> {
        return from(
            this.supabase.client
                .from('permissions')
                .select('*')
                .order('module', { ascending: true })
        ).pipe(map(res => res.data || []));
    }

    createPermission(permission: CreatePermissionDTO): Observable<Permission | null> {
        return from(
            this.supabase.client
                .from('permissions')
                .insert(permission)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updatePermission(id: string, permission: UpdatePermissionDTO): Observable<Permission | null> {
        return from(
            this.supabase.client
                .from('permissions')
                .update(permission)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deletePermission(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('permissions')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    // --- Admin Users ---

    getAdminUsers(): Observable<AdminUser[]> {
        // Note: Joining with auth.users is not directly possible via client in many cases 
        // unless there is a public view. We will fetch admin_users and maybe display ID 
        // or rely on a view if it existed. For now, we return admin_users.
        return from(
            this.supabase.client
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    // In a real app, you'd have a function to invite/create admin which handles auth + db
    // Here we just manage the role record for existing users or manual inserts.

    updateAdminUserRole(userId: string, role: 'super_admin' | 'admin' | 'viewer'): Observable<AdminUser | null> {
        return from(
            this.supabase.client
                .from('admin_users')
                .update({ role, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    removeAdminUser(userId: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('admin_users')
                .delete()
                .eq('user_id', userId)
        ).pipe(map(res => !res.error));
    }
}
