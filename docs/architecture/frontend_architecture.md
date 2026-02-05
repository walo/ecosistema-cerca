# Arquitectura Frontend (Angular)

Este documento define la arquitectura técnica para los proyectos web del ecosistema: `admin-web`, `saas-admin` y `suscripciones-admin`.

## Estrategia Tecnológica
-   **Framework**: Angular 17+
-   **Paradigma**: Reactividad granular con **Signals**.
-   **Estructura**: **Standalone Components** (Sin NgModules).
-   **Rendimiento**: **Deferrable Views** (`@defer`) y Lazy Loading agresivo.

## Estructura de Proyectos (Monorepo NX o Multi-repo)

```
apps/
  admin-web/          # Dashboard para Administradores de Conjunto
  saas-admin/         # Dashboard para Super Admin del SaaS
libs/
  ui-kit/             # Componentes visuales reutilizables (Design System)
  auth/               # Lógica de autenticación compartida
  data-access/        # Servicios y Stores de Supabase
  utils/              # Helpers y Pipes puros
```

## Patrones de Diseño

### 1. Gestión de Estado (Signals)
Se utilizará un patrón de "Data Service with Signals" o una librería ligera basada en Signals (ej. NgRx SignalStore).
```typescript
// Ejemplo conceptual de Store con Signals
@Injectable({ providedIn: 'root' })
export class ResidentStore {
  private state = signal<ResidentState>({ users: [], loading: false });

  // Selectors
  readonly users = computed(() => this.state().users);
  readonly isLoading = computed(() => this.state().loading);

  constructor(private api: ResidentApiService) {}

  // Actions
  async loadResidents(tenantId: string) {
    this.state.update(s => ({ ...s, loading: true }));
    const data = await this.api.getAll(tenantId);
    this.state.update(s => ({ ...s, users: data, loading: false }));
  }
}
```

### 2. Control Flow & Views
Reemplazo total de `*ngIf`, `*ngFor` por sintaxis de control de flujo. Uso de `@defer` para componentes no críticos.

```html
@if (store.isLoading()) {
  <app-spinner />
} @else {
  @defer (on viewport) {
    <app-resident-chart [data]="store.users()" />
  } @placeholder {
    <div>Cargando gráfica...</div>
  }
}
```

### 3. Seguridad e Interceptors
-   **AuthGuard**: Validar sesión activa.
-   **RoleGuard**: Validar permisos específicos (Admin vs Revisor).
-   **TenantInterceptor**: Inyectar el `tenant_id` (si aplica) o validar que el usuario pertenezca al contexto actual.

## Comunicación con Backend
-   Uso directo de `@supabase/supabase-js` encapsulado en servicios de Angular (`Access Data Object`).
-   Tipado estricto generado a partir de la DB (Supabase Types).
