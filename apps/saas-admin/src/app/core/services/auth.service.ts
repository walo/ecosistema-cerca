import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, map, Observable, of, tap } from 'rxjs';
import { User } from '@supabase/supabase-js';

export interface AdminProfile {
    user_id: string;
    role: 'super_admin' | 'billing_admin' | 'viewer';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService);

    // Estado reactivo de la sesión
    private _currentUser = signal<User | null>(null);
    private _profile = signal<AdminProfile | null>(null);
    private _authReady = signal<boolean>(false);

    readonly currentUser = this._currentUser.asReadonly();
    readonly profile = this._profile.asReadonly();
    readonly isSuperAdmin = signal<boolean>(false);
    readonly authReady = this._authReady.asReadonly();

    constructor() {
        this.initializeAuth();
    }

    private async initializeAuth() {
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this._currentUser.set(session.user);
            await this.loadProfile(session.user.id);
        } else {
            this._authReady.set(true);
        }

        this.supabase.auth.onAuthStateChange(async (event, session) => {
            this._authReady.set(false);
            if (session) {
                this._currentUser.set(session.user);
                await this.loadProfile(session.user.id);
            } else {
                this._currentUser.set(null);
                this._profile.set(null);
                this.isSuperAdmin.set(false);
                this._authReady.set(true);
            }
        });
    }

    private async loadProfile(uid: string) {
        try {
            const { data, error } = await this.supabase.client
                .from('admin_users')
                .select('*')
                .eq('user_id', uid)
                .single();

            if (!error && data) {
                this._profile.set(data as AdminProfile);
                this.isSuperAdmin.set(data.role === 'super_admin');
            } else {
                this._profile.set(null);
                this.isSuperAdmin.set(false);
            }
        } finally {
            this._authReady.set(true);
        }
    }

    signOut() {
        return from(this.supabase.auth.signOut());
    }
}
