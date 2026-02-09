import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { TenantService } from './tenant.service';
import { Observable, tap, catchError, of, map } from 'rxjs';

export interface SubscriptionStatus {
    valid: boolean;
    status: string;
    message: string;
    planCode: string;
    planName: string;
    features: string[];
    trialEndDate?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private supabase = inject(SupabaseService);
    private tenantService = inject(TenantService);

    // Estado reactivo (Signals - ArquitecturaLimpia)
    private _subscriptionStatus = signal<SubscriptionStatus | null>(null);
    private _loading = signal<boolean>(false);

    readonly subscriptionStatus = this._subscriptionStatus.asReadonly();
    readonly isLoading = this._loading.asReadonly();
    readonly isActive = computed(() => this._subscriptionStatus()?.valid === true);

    constructor() { }

    /**
     * Carga el estado de suscripción del conjunto actual
     */
    checkSubscriptionStatus(): Observable<SubscriptionStatus> {
        const clientId = this.tenantService.currentClientId();

        if (!clientId) {
            return of({ valid: false, message: 'No client context' } as SubscriptionStatus);
        }

        this._loading.set(true);

        return this.supabase.invokeAccionaFunction('validate-subscription', {}, {
            headers: { 'x-client-id': clientId }
        }).pipe(
            map(response => {
                const status = response.data as SubscriptionStatus;
                this._subscriptionStatus.set(status);
                this._loading.set(false);
                return status;
            }),
            catchError(err => {
                console.error('Error validating subscription', err);
                const errorStatus = { valid: false, message: 'Error de conexión con Acciona' } as SubscriptionStatus;
                this._subscriptionStatus.set(errorStatus);
                this._loading.set(false);
                return of(errorStatus);
            })
        );
    }

    /**
     * Verifica si una feature específica está habilitada en el plan actual
     */
    hasFeature(featureKey: string): boolean {
        const status = this._subscriptionStatus();
        return status?.features?.includes(featureKey) ?? false;
    }

    /**
     * Limpia el estado (para logout o cambio de tenant)
     */
    clearStatus() {
        this._subscriptionStatus.set(null);
    }
}
