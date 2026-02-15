# Framework Global State Architecture

## Objective

Provide controlled shared state without turning the framework into a monolith.

State must be:

- Predictable
- Scoped
- Signal-driven
- Immutable by default

---

# 1. State Layers

## 1.1 Screen State (Scoped)

- Current resource
- Current mode (create/edit/view)
- Form dirty state
- Table query state

## 1.2 Session State (Optional)

- User preferences (column visibility)
- Tenant context
- Country context

## 1.3 Framework Internal State

- Registry snapshot
- Plugin map
- Debug mode flag

---

# 2. State Management Strategy

Use Signals + Service Containers. No global store like NgRx unless required by application layer.

---

# 3. ScreenStateService

```ts
@Injectable()
export class ScreenStateService {

  readonly mode = signal<'create' | 'edit' | 'view'>('create');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  setMode(mode: 'create' | 'edit' | 'view') {
    this.mode.set(mode);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setError(message: string | null) {
    this.error.set(message);
  }
}
```

Provided at component level to avoid global coupling.

---

# 4. TableStateService

```ts
@Injectable()
export class TableStateService {
  readonly query = signal<TableQuery>({ page: 0, size: 10 });

  updateQuery(query: Partial<TableQuery>) {
    this.query.update(q => ({ ...q, ...query }));
  }
}
```

---

# 5. Multi-Tenant Context

Optional TenantContextService:

- tenantId signal
- countryCode signal
- role signal

Used to resolve dynamic resources.

---

# 6. Enterprise Constraints

- No hidden shared mutable state
- No static singletons
- Explicit provider scoping
- Clear ownership boundaries

---

This architecture ensures scalable shared state without introducing unintended coupling.

