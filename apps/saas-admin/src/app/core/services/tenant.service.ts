import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    // Estado reactivo usando Angular Signals (ArquitecturaLimpia Skill)
    private _currentConjuntoId = signal<string | null>(null);

    readonly currentConjuntoId = this._currentConjuntoId.asReadonly();

    setTenant(id: string) {
        this._currentConjuntoId.set(id);
    }

    clearTenant() {
        this._currentConjuntoId.set(null);
    }
}
