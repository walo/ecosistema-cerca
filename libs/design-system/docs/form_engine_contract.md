# 1. Dynamic Form Engine – Exact Contract

## Objective
Provide a fully metadata-driven reactive form engine with strong typing, extensibility, and rule evaluation support.

---

# 1.1 Core Interfaces

## FormFieldSchema

```ts
export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'boolean'
  | 'date'
  | 'textarea'
  | 'custom';

export interface FormFieldSchema<T = any> {
  key: keyof T & string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  visible?: boolean;
  disabled?: boolean;
  required?: boolean;
  validators?: ValidatorSchema[];
  asyncValidators?: AsyncValidatorSchema[];
  ui?: FieldUIConfig;
  dataSource?: FieldDataSource;
  rules?: FieldRule[];
  renderer?: string; // custom renderer key
}
```

---

## ValidatorSchema

```ts
export interface ValidatorSchema {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
```

---

## FieldUIConfig

```ts
export interface FieldUIConfig {
  placeholder?: string;
  hint?: string;
  appearance?: 'outline' | 'fill';
  gridColumn?: number;
}
```

---

# 1.2 Engine Public Contract

## FormEngine

```ts
export interface FormEngine<T = any> {
  buildForm(schema: FormFieldSchema<T>[]): FormGroup;
  patchValue(value: Partial<T>): void;
  getValue(): T;
  validate(): boolean;
  reset(): void;
}
```

---

# 1.3 Internal Responsibilities

- Map metadata → FormControl
- Attach sync/async validators
- Evaluate dynamic rules
- Expose reactive state via Signals
- Notify rule engine on value changes

---

# 1.4 Rendering Contract

Dynamic form component must accept:

```ts
@Input() schema: FormFieldSchema[];
@Input() form: FormGroup;
```

Renderer resolution flow:

1. If `renderer` defined → resolve via RendererRegistry
2. Else → use default renderer for field type

---

# 1.5 Strict Typing Strategy

Consumers define domain model:

```ts
interface ClienteForm {
  cliente: string;
  estado: boolean;
}
```

Schema becomes:

```ts
FormFieldSchema<ClienteForm>[]
```

Compile-time safety ensured.

---

# 1.6 Performance Rules

- OnPush strategy
- Signals for field visibility
- No dynamic component recreation unless schema changes
- Memoized validator mapping

---

This contract ensures deterministic behavior, strict typing, and enterprise-grade scalability.

