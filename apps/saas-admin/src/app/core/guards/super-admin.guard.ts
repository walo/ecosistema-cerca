import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, first } from 'rxjs';

export const superAdminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Esperar a que el servicio de autenticación esté listo
    return toObservable(authService.authReady).pipe(
        filter(ready => ready === true),
        first(),
        map(() => {
            if (authService.isSuperAdmin()) {
                return true;
            }
            return router.parseUrl('/auth');
        })
    );
};
