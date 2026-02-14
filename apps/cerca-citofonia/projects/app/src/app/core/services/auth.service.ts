import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;
    private _user = new BehaviorSubject<User | null>(null);

    user$ = this._user.asObservable();
    isAuthenticated$ = this.user$.pipe(map(user => !!user));

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            }
        );

        // Listen to auth changes and initialize user
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event);
            this._user.next(session?.user ?? null);
        });
    }

    get currentUser(): User | null {
        return this._user.value;
    }

    login(email: string, password: string) {
        return from(this.supabase.auth.signInWithPassword({ email, password }));
    }

    logout() {
        return from(this.supabase.auth.signOut());
    }
}
