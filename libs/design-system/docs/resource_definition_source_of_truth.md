# ResourceDefinition — Official Contract

This document defines the canonical contract for the Schema‑Driven UI System.

This is the single source of truth for how screens are described and rendered.

The Design System MUST only interpret this contract. It must never embed business logic.

---

# 1. Design Principles

1. Pure configuration — no imperative logic inside resources
2. Strong typing — full TypeScript safety
3. UI-only responsibility
4. Deterministic rendering
5. Extensible without breaking existing resources

---

# 2. Root Contract

```ts
export interface ResourceDefinition {
  meta: ResourceMeta;
  layout?: LayoutSchema;
  form?: FormSchema;
  table?: TableSchema;
  actions?: ActionSchema[];
}
```

---

# 3. Meta Section

```ts
export interface ResourceMeta {
  name: string;
  title: string;
  version: string;
  feature?: string;
  permissions?: string[];
}
```

Purpose:

- Unique identification
- Feature grouping
- Version traceability

---

# 4. Form Schema

```ts
export interface FormSchema {
  mode?: 'create' | 'edit' | 'view';
  fields: FieldSchema[];
  sections?: FormSection[];
}
```

## 4.1 Field Schema

```ts
export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  validators?: ValidatorSchema[];
  ui?: FieldUIConfig;
}
```

## 4.2 Field Types

```ts
export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'date'
  | 'custom';
```

## 4.3 Validators

```ts
export interface ValidatorSchema {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
```

---

# 5. Table Schema

```ts
export interface TableSchema {
  columns: TableColumnSchema[];
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  serverMode?: boolean;
}
```

## 5.1 Column Schema

```ts
export interface TableColumnSchema {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  type?: 'text' | 'number' | 'boolean' | 'date';
}
```

---

# 6. Layout Schema

```ts
export interface LayoutSchema {
  type: 'single-column' | 'two-column' | 'grid';
  gap?: string;
}
```

---

# 7. Action Schema

```ts
export interface ActionSchema {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  visible?: boolean;
  disabled?: boolean;
}
```

Actions emit events. They do not execute business logic.

---

# 8. Rendering Contract Rules

The Design System MUST:

- Render strictly based on this schema
- Never mutate the resource
- Never call APIs
- Never contain business rules

The consuming application is responsible for:

- Providing data
- Handling events
- Managing persistence

---

# 9. Evolution Strategy

When extending this contract:

1. Add optional properties
2. Never remove existing keys
3. Version via ResourceMeta.version

Breaking changes require major version bump.

---

# 10. Conclusion

ResourceDefinition is the boundary between domain and UI.

If this contract remains stable, the entire system remains scalable.

This document governs all dynamic rendering inside the design-system library.

