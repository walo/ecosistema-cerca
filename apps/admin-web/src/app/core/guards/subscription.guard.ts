import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { map, of } from 'rxjs';

/**
 * Guard para validar si el conjunto tiene una suscripción activa
 * y acceso a la feature específica (opcional via data.requiredFeature)
 */
export const subscriptionGuard: CanActivateFn = (route, state) => {
    const subService = inject(SubscriptionService);
    const router = inject(Router);

    const requiredFeature = route.data['requiredFeature'] as string;

    // Si ya tenemos el estado cargado
    const currentStatus = subService.subscriptionStatus();

    if (currentStatus) {
        return validate(currentStatus, requiredFeature, router);
    }

    // Si no, lo cargamos
    return subService.checkSubscription().pipe(
        map(status => validate(status, requiredFeature, router))
    );
};

function validate(status: any, requiredFeature: string, router: Router): boolean {
    if (!status.valid) {
        router.navigate(['/upgrade-prompt'], { queryParams: { reason: 'subscription_expired' } });
        return false;
    }

    if (requiredFeature && !status.features?.includes(requiredFeature)) {
        router.navigate(['/upgrade-prompt'], { queryParams: { feature: requiredFeature } });
        return false;
    }

    return true;
}
