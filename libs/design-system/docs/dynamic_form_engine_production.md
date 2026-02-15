# Dynamic Form Engine — Production Implementation

## Objective
Provide a fully wired, enterprise-ready dynamic form engine using Angular standalone + signals.

---

# 1. Folder Structure

```
projects/framework-core/src/lib/

  form-engine/
    contracts/
      form-schema.ts
      field-schema.ts
    engine/
      dynamic-form-engine.service.ts
      form-renderer.component.ts
    components/
      field-host.component.ts
    registry/
      field-registry.service.ts
    tokens/
      field-renderer.token.ts
```

---

# 2. Core Contracts

## form-schema.ts

```ts
export interface FormSchema {
  id: string;
  fields: FieldSchema[];
}
```

## field-schema.ts

```ts
export interface FieldSchema {
  key: string;
  type: string;
  label: string;
  defaultValue?: any;
  validators?: ValidatorFn[];
}
```

---

# 3. Field Registry (Extensible)

```ts
@Injectable({ providedIn: 'root' })
export class FieldRegistryService {
  private readonly registry = new Map<string, Type<any>>();

  register(type: string, component: Type<any>) {
    this.registry.set(type, component);
  }

  resolve(type: string): Type<any> {
    const component = this.registry.get(type);
    if (!component) {
      throw new Error(`Field type not registered: ${type}`);
    }
    return component;
  }
}
```

---

# 4. DynamicFormEngineService

```ts
@Injectable()
export class DynamicFormEngineService {

  private readonly formGroup = signal<FormGroup | null>(null);

  build(schema: FormSchema): FormGroup {
    const group: Record<string, FormControl> = {};

    schema.fields.forEach(field => {
      group[field.key] = new FormControl(
        field.defaultValue ?? null,
        field.validators ?? []
      );
    });

    const form = new FormGroup(group);
    this.formGroup.set(form);
    return form;
  }

  get form() {
    return this.formGroup.asReadonly();
  }
}
```

---

# 5. Renderer Component

```ts
@Component({
  selector: 'fw-form-renderer',
  standalone: true,
  template: `
    <form *ngIf="form()" [formGroup]="form()">
      <fw-field-host
        *ngFor="let field of schema.fields"
        [field]="field"
        [form]="form()">
      </fw-field-host>
    </form>
  `,
  imports: [CommonModule, ReactiveFormsModule, FieldHostComponent],
  providers: [DynamicFormEngineService]
})
export class FormRendererComponent {
  @Input({ required: true }) schema!: FormSchema;

  constructor(private engine: DynamicFormEngineService) {}

  readonly form = this.engine.form;

  ngOnInit() {
    this.engine.build(this.schema);
  }
}
```

---

# 6. Field Host Component

```ts
@Component({
  selector: 'fw-field-host',
  standalone: true,
  template: `
    <ng-container *ngComponentOutlet="component; injector: injector"></ng-container>
  `,
  imports: [CommonModule]
})
export class FieldHostComponent {
  @Input({ required: true }) field!: FieldSchema;
  @Input({ required: true }) form!: FormGroup;

  component!: Type<any>;
  injector!: Injector;

  constructor(
    private registry: FieldRegistryService,
    private parentInjector: Injector
  ) {}

  ngOnInit() {
    this.component = this.registry.resolve(this.field.type);
    this.injector = Injector.create({
      providers: [
        { provide: 'FIELD_SCHEMA', useValue: this.field },
        { provide: FormGroup, useValue: this.form }
      ],
      parent: this.parentInjector
    });
  }
}
```

---

# 7. Enterprise Characteristics

- Fully standalone
- Scoped engine per form instance
- Extensible via registry
- No static field mapping
- Plugin-ready architecture

---

Dynamic Form Engine is now production-structured and ready for rule integration and server binding.

