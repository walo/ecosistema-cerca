import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TenantService } from '../services/tenant.service';
import { SupabaseService } from '../services/supabase.service';
import { map, catchError, of, switchMap } from 'rxjs';

/**
 * Guard que verifica si el Tenant actual tiene una suscripción activa
 * Consultando la Edge Function 'validate-subscription'
 */
export const subscriptionGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const tenantService = inject(TenantService);
    const supabase = inject(SupabaseService);

    const conjuntoId = tenantService.currentConjuntoId();

    if (!conjuntoId) {
        // Si no hay conjunto seleccionado, redirigir a selección o login
        return router.createUrlTree(['/auth/login']);
    }

    // Llamar a Edge Function validate-subscription
    // Nota: Asumimos que SupabaseService tiene un método para invocar funciones o usamos el cliente directo
    return supabase.invokeFunction('validate-subscription', {}, {
        headers: { 'x-conjunto-id': conjuntoId }
    }).pipe(
        map((response: any) => {
            if (response.data?.valid) {
                return true;
            }
            // Si no es válido, redirigir a página de pago/bloqueo
            return router.createUrlTree(['/subscription/expired']);
        }),
        catchError((error) => {
            console.error('Subscription Check Failed', error);
            // Fail open or closed? Closed for security.
            return of(router.createUrlTree(['/subscription/error']));
        })
    );
};
