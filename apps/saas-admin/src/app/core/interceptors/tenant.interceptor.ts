import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';

/**
 * Interceptor para inyectar automáticamente el 'X-Conjunto-Id' en las cabeceras.
 * Aplica el principio de MultiTenantArchitect para asegurar el contexto del tenant.
 */
export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
    const tenantService = inject(TenantService);
    const conjuntoId = tenantService.currentConjuntoId();

    if (conjuntoId) {
        const clonedReq = req.clone({
            setHeaders: {
                'X-Conjunto-Id': conjuntoId
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
