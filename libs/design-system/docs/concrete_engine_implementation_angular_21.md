# Concrete Engine Implementation (Angular 21+)

## Objective
Define real implementation strategy using:

- Standalone APIs
- Signals
- OnPush
- Strict typing

---

# 1. Form Engine Service (Implementation Skeleton)

```ts
@Injectable({ providedIn: 'root' })
export class FormEngineService<T> implements FormEngine<T> {

  private form!: FormGroup;
  private schema!: FormFieldSchema<T>[];

  readonly visibleFields = signal<FormFieldSchema<T>[]>([]);

  buildForm(schema: FormFieldSchema<T>[]): FormGroup {
    this.schema = schema;

    const group: Record<string, FormControl> = {};

    for (const field of schema) {
      group[field.key] = new FormControl(
        field.defaultValue ?? null,
        this.mapValidators(field.validators)
      );
    }

    this.form = new FormGroup(group);
    this.setupVisibility();
    return this.form;
  }

  private mapValidators(validators?: ValidatorSchema[]) {
    if (!validators) return [];

    return validators.map(v => {
      switch (v.type) {
        case 'required': return Validators.required;
        case 'minLength': return Validators.minLength(v.value);
        case 'maxLength': return Validators.maxLength(v.value);
        default: return null;
      }
    }).filter(Boolean);
  }

  private setupVisibility() {
    this.visibleFields.set(this.schema.filter(f => f.visible !== false));
  }

  patchValue(value: Partial<T>) {
    this.form.patchValue(value);
  }

  getValue(): T {
    return this.form.getRawValue();
  }

  validate(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  reset() {
    this.form.reset();
  }
}
```

---

# 2. Dynamic Form Component

```ts
@Component({
  selector: 'ui-dynamic-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let field of engine.visibleFields()">
      <ui-field-renderer
        [field]="field"
        [form]="form">
      </ui-field-renderer>
    </ng-container>
  `
})
export class DynamicFormComponent<T> {
  @Input() schema!: FormFieldSchema<T>[];

  form!: FormGroup;

  constructor(public engine: FormEngineService<T>) {}

  ngOnInit() {
    this.form = this.engine.buildForm(this.schema);
  }
}
```

---

# 3. Table Engine (Server Mode Strategy)

- Use signal<TableQuery>
- Emit query changes
- Consumer performs HTTP
- Table only renders data

---

# 4. Performance Principles

- No heavy logic in template
- Signals instead of manual subscriptions
- Immutable schema
- Lazy renderer resolution via registry

---

This document establishes the real Angular implementation baseline for the framework.

