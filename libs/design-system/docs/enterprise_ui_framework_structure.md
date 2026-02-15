# Enterprise Internal UI Framework

## 1. High-Level Architecture

The framework is designed as a metadata-driven UI rendering engine for Angular 21+ (standalone). It is domain-agnostic and consumes typed screen resource definitions.

```
@company/ui-framework
│
├── core/
│   ├── tokens/
│   ├── services/
│   ├── engines/
│   ├── models/
│   └── utils/
│
├── form/
│   ├── components/
│   ├── directives/
│   ├── renderers/
│   └── form-engine.service.ts
│
├── table/
│   ├── components/
│   ├── renderers/
│   └── table-engine.service.ts
│
├── layout/
│   ├── components/
│   └── layout-engine.service.ts
│
├── resources/
│   ├── screen-resource.interface.ts
│   ├── form-schema.interface.ts
│   ├── table-schema.interface.ts
│   └── button-schema.interface.ts
│
├── i18n/
│   ├── translation.service.ts
│   └── i18n.token.ts
│
└── public-api.ts
```

---

# 2. Core Layer

## 2.1 Tokens

- `SCREEN_RESOURCE_TOKEN`
- `UI_FRAMEWORK_CONFIG_TOKEN`
- `CUSTOM_RENDERERS_TOKEN`

Purpose: Complete decoupling between feature modules and framework internals.

---

## 2.2 Models (Strict Typing)

### ScreenResource

```ts
export interface ScreenResource {
  id: string;
  title: string;
  layout?: LayoutSchema;
  form?: FormSchema;
  table?: TableSchema;
  actions?: ButtonSchema[];
  messages?: Record<string, string>;
}
```

---

### FormSchema

```ts
export interface FormSchema {
  fields: FormFieldSchema[];
  mode: 'create' | 'edit' | 'filter';
}
```

---

### TableSchema

```ts
export interface TableSchema {
  columns: TableColumnSchema[];
  selectable?: boolean;
  pageable?: boolean;
}
```

---

# 3. Form Engine

Responsible for:

- Building reactive FormGroup
- Mapping validators
- Handling dynamic visibility
- Resolving custom renderers

## Responsibilities

- Metadata → FormControl
- Metadata → UI Renderer
- Metadata → Validation Messages

---

# 4. Table Engine

Responsible for:

- Column rendering
- Sorting
- Filtering
- Dynamic pipes
- Boolean mapping

---

# 5. Layout Engine

Optional grid system abstraction.

```ts
export interface LayoutSchema {
  type: 'grid' | 'tabs' | 'accordion';
  columns?: number;
}
```

---

# 6. Resource Strategy

Resources must live OUTSIDE the framework.

Example:

```
/apps/logistica/resources/ingreso-logistica.resource.ts
```

Injected using:

```ts
providers: [
  { provide: SCREEN_RESOURCE_TOKEN, useValue: ingresoLogisticaResource }
]
```

---

# 7. Rendering Flow

1. Feature provides ScreenResource
2. Framework injects resource via token
3. Engines interpret metadata
4. Components render dynamically

---

# 8. Advanced Extension Points

- Custom Field Renderer Registry
- Dynamic Async Data Sources
- Conditional Rules Engine
- Audit Hook System
- Plugin System

---

# 9. Performance Strategy

- OnPush everywhere
- Signals for state
- Memoized schema parsing
- Lazy renderer resolution

---

# 10. Enterprise Concerns

- Strict typing
- No `any`
- No business logic inside framework
- Pure UI metadata interpretation
- Multi-tenant ready
- Multi-country ready

---

# 11. Future Evolution

- Backend-driven JSON schema
- Schema validation layer
- Low-code internal builder
- Visual screen designer

---

This structure transforms your library into an internal enterprise-grade UI rendering framework rather than a simple component collection.

