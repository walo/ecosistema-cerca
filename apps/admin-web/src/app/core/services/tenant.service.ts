import { Injectable, signal, inject } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    private supabase = inject(SupabaseService);
    private subService = inject(SubscriptionService);

    // Estado reactivo usando Angular Signals
    private _currentConjuntoId = signal<string | null>(null);
    private _currentClientId = signal<string | null>(null);

    readonly currentConjuntoId = this._currentConjuntoId.asReadonly();
    readonly currentClientId = this._currentClientId.asReadonly();

    async setTenant(id: string) {
        this._currentConjuntoId.set(id);

        // Cargar client_id desde el proyecto operativo (Cerca)
        const { data, error } = await this.supabase.client
            .from('conjuntos')
            .select('client_id')
            .eq('id', id)
            .single();

        if (!error && data) {
            this._currentClientId.set((data as any).client_id);
        }

        this.subService.clearStatus();
    }

    clearTenant() {
        this._currentConjuntoId.set(null);
        this._currentClientId.set(null);
        this.subService.clearStatus();
    }
}
