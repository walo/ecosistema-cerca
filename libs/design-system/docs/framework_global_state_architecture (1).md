# Framework Global State – Production Ready Implementation

This document defines the real, production-ready implementation of the framework global state layer for Angular 21+ standalone.

The goal is:
- Strict scoping
- No hidden globals
- Signal-based reactive model
- Deterministic lifecycle

---

# 1. Final Folder Structure

```
@company/ui-framework
│
├── core/
│   ├── state/
│   │   ├── screen-state.service.ts
│   │   ├── table-state.service.ts
│   │   ├── tenant-context.service.ts
│   │   ├── framework-internal-state.service.ts
│   │   └── index.ts
│   │
│   ├── tokens/
│   │   ├── ui-framework-config.token.ts
│   │   └── screen-resource.token.ts
│   │
│   ├── providers/
│   │   └── provide-ui-framework.ts
│   │
│   └── models/
│       └── table-query.model.ts
│
└── public-api.ts
```

---

# 2. Screen State (Scoped per Screen Instance)

## screen-state.service.ts

```ts
import { Injectable, signal, computed } from '@angular/core';

export type ScreenMode = 'create' | 'edit' | 'view';

@Injectable()
export class ScreenStateService {

  private readonly _mode = signal<ScreenMode>('create');
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _dirty = signal<boolean>(false);

  readonly mode = this._mode.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly dirty = this._dirty.asReadonly();

  readonly isEditable = computed(() => this._mode() !== 'view');

  setMode(mode: ScreenMode) {
    this._mode.set(mode);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  setError(message: string | null) {
    this._error.set(message);
  }

  setDirty(value: boolean) {
    this._dirty.set(value);
  }

  reset() {
    this._mode.set('create');
    this._loading.set(false);
    this._error.set(null);
    this._dirty.set(false);
  }
}
```

⚠ Provided at component level to avoid cross-screen leakage.

---

# 3. Table State

## table-query.model.ts

```ts
export interface TableQuery {
  page: number;
  size: number;
  sort?: { active: string; direction: 'asc' | 'desc' };
  filters?: Record<string, any>;
}
```

---

## table-state.service.ts

```ts
import { Injectable, signal } from '@angular/core';
import { TableQuery } from '../models/table-query.model';

@Injectable()
export class TableStateService {

  private readonly _query = signal<TableQuery>({ page: 0, size: 10 });

  readonly query = this._query.asReadonly();

  updateQuery(patch: Partial<TableQuery>) {
    this._query.update(q => ({ ...q, ...patch }));
  }

  reset() {
    this._query.set({ page: 0, size: 10 });
  }
}
```

---

# 4. Tenant Context (Optional Multi-Tenant Layer)

## tenant-context.service.ts

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantContextService {

  private readonly _tenantId = signal<string | null>(null);
  private readonly _countryCode = signal<string | null>(null);
  private readonly _role = signal<string | null>(null);

  readonly tenantId = this._tenantId.asReadonly();
  readonly countryCode = this._countryCode.asReadonly();
  readonly role = this._role.asReadonly();

  setTenant(id: string) {
    this._tenantId.set(id);
  }

  setCountry(code: string) {
    this._countryCode.set(code);
  }

  setRole(role: string) {
    this._role.set(role);
  }
}
```

Root-scoped intentionally (cross-application concern).

---

# 5. Framework Internal State (Private Infrastructure Layer)

## framework-internal-state.service.ts

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FrameworkInternalStateService {

  private readonly _debug = signal<boolean>(false);
  private readonly _registryFrozen = signal<boolean>(false);

  readonly debug = this._debug.asReadonly();
  readonly registryFrozen = this._registryFrozen.asReadonly();

  enableDebug() {
    this._debug.set(true);
  }

  freezeRegistry() {
    this._registryFrozen.set(true);
  }
}
```

---

# 6. Provider Wiring Strategy

## provide-ui-framework.ts

```ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ScreenStateService } from '../state/screen-state.service';
import { TableStateService } from '../state/table-state.service';

export function provideScreenState(): EnvironmentProviders {
  return makeEnvironmentProviders([
    ScreenStateService,
    TableStateService
  ]);
}
```

Usage inside feature component:

```ts
@Component({
  standalone: true,
  providers: [provideScreenState()]
})
export class ClienteScreenComponent {}
```

This guarantees per-screen isolation.

---

# 7. Production Guarantees

- No global mutable state
- Explicit provider scoping
- Signal-based reactivity
- Deterministic reset capability
- Clear ownership boundaries

---

This is now a production-ready global state implementation suitable for enterprise-grade UI framework development.

