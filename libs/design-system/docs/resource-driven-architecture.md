# Arquitectura Resource-Driven para `@cerca/design-system`

## Problema Actual

Los componentes del design system (`cc-input`, `cc-data-table`, `cc-form-field`) están **hardcodeados** con textos fijos. No existe un mecanismo declarativo para que cada pantalla defina sus labels, mensajes de validación y columnas de tabla desde un único archivo de recursos. Además, el `ValidatorsService` heredado depende de `@ngx-translate`, que no se usa en el ecosistema Cerca.

## Visión

> **Un archivo de recurso (`.resource.ts`) por pantalla, que alimenta todos los controles del design system automáticamente.**

```
┌─────────────────────────────────────────────────────────┐
│  App (cerca-citofonia / saas-admin)                     │
│                                                         │
│  residentes.resource.ts  ◄── Fuente de verdad           │
│       │                                                 │
│       ▼                                                 │
│  ResidentesComponent                                    │
│       │  [resource]="resource"                          │
│       ├──► <cc-data-table>  → columnas, filtros, anchos │
│       ├──► <cc-form-field>  → labels, validaciones      │
│       └──► <cc-input>       → placeholder, tipo, error  │
│                                                         │
│  Librería: @cerca/design-system                         │
│       ├── interfaces/screen-resource.model.ts           │
│       ├── core/cc-base.resource.ts                      │
│       └── services/cc-validators.service.ts             │
└─────────────────────────────────────────────────────────┘
```

---

## Paso 1: Interfaces tipadas (Contratos)

Crear en la librería las interfaces que definen la estructura de un recurso de pantalla. Son el **contrato** entre la app y la librería.

### Archivo: `libs/design-system/src/lib/core/models/screen-resource.model.ts`

```typescript
// ═══════════════════════════════════════════
// Columnas de tabla (Átomos de datos)
// ═══════════════════════════════════════════

export interface CcTableColumn {
  /** Nombre visible de la columna */
  col_name: string;
  /** Clave del campo en el objeto de datos (ej: 'name', 'contact_email') */
  col_ref: string;
  /** Tipo de renderizado */
  col_type?: 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'custom';
  /** ¿Es parámetro de filtro? */
  is_filter_parameter?: boolean;
  /** ¿Es visible como columna en la tabla? */
  is_visible_column?: boolean;
  /** Ancho de la columna */
  col_width?: string;
  /** ¿Es campo obligatorio? */
  is_mandatory?: boolean;
  /** Mensaje cuando el campo obligatorio está vacío */
  is_mandatory_message?: string | null;
  /** Etiqueta para valores boolean afirmativo */
  boolean_label_affirmative?: string | null;
  /** Etiqueta para valores boolean negativo */
  boolean_label_negative?: string | null;
  /** ¿Es ordenable? */
  sortable?: boolean;
  /** Pipe a aplicar al valor */
  pipe_to_apply?: string | null;
  /** Función personalizada a ejecutar sobre el valor */
  func_to_execute?: string | null;
}

// ═══════════════════════════════════════════
// Campos de formulario (Definición de Inputs)
// ═══════════════════════════════════════════

export interface CcFieldDefinition {
  /** Nombre técnico del control en el FormGroup */
  key: string;
  /** Label visible del campo */
  label: string;
  /** Placeholder del input */
  placeholder?: string;
  /** Tipo de input: text, email, password, number, date, select, textarea */
  type?: string;
  /** ¿Es requerido? */
  required?: boolean;
  /** Longitud mínima */
  minLength?: number;
  /** Longitud máxima */
  maxLength?: number;
  /** Patrón regex */
  pattern?: string;
  /** Ícono prefijo del input (nombre del nz-icon) */
  prefix?: string;
  /** Ícono sufijo del input */
  suffix?: string;
  /** Opciones para selects */
  options?: { value: any; label: string }[];
  /** Mensaje de error personalizado por validación */
  errorMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    email?: string;
    custom?: string;
  };
}

// ═══════════════════════════════════════════
// Mensajes de validaciones genéricos
// ═══════════════════════════════════════════

export interface CcValidationMessages {
  required?: string;
  maxLength?: string;
  minLength?: string;
  email?: string;
  militaryTime?: string;
  patterns?: Record<string, string>;
}

// ═══════════════════════════════════════════
// Recurso de Pantalla (Screen Resource)
// ═══════════════════════════════════════════

export interface CcScreenResource {
  /** Título de la pantalla */
  scr_title: string;
  /** Descripción de la pantalla */
  scr_description?: string;

  // -- Botones y acciones --
  scr_action_label?: string;
  scr_search_button?: string;
  scr_clear_button?: string;
  scr_actions_label?: string;

  // -- Confirmaciones --
  scr_button_save_title?: string;
  scr_button_cancel_label?: string;
  scr_button_cancel_title?: string;
  scr_button_delete_label?: string;

  // -- Tabla --
  scr_table_columns?: CcTableColumn[];

  // -- Formulario --
  scr_fields?: CcFieldDefinition[];

  // -- Labels sueltos (compatibilidad con formato legacy) --
  scr_labels?: { label_name: string }[];

  // -- Mensajes de la pantalla --
  scr_messages?: { message: string }[];

  // -- Validaciones --
  scr_messages_erros_form?: CcValidationMessages;

  // -- Extensible: cualquier propiedad adicional --
  [key: string]: any;
}

// ═══════════════════════════════════════════
// Modelo de Pantalla por país
// ═══════════════════════════════════════════

export interface CcScreenConfig {
  countryCode: string[];
  screens: CcScreenResource;
}
```

---

## Paso 2: Clase base `CcBaseResource`

Reemplaza el `BaseResource` actual del app. Vive **dentro de la librería** para que todas las apps la reutilicen.

### Archivo: `libs/design-system/src/lib/core/cc-base.resource.ts`

```typescript
import { CcScreenConfig, CcScreenResource, CcTableColumn, CcFieldDefinition } from './models/screen-resource.model';

/**
 * Clase base abstracta para recursos de pantalla.
 *
 * Cada pantalla de la app define su propio Resource extendiéndola.
 * Es agnóstica al país: la resolución por countryCode se hace aquí.
 */
export abstract class CcBaseResource {
  protected abstract screens: CcScreenConfig[];

  /** País por defecto cuando no se pasa */
  protected defaultCountry = 'CO';

  /**
   * Retorna la configuración de pantalla para un país.
   */
  getScreen(country?: string): CcScreenResource {
    const code = country ?? this.defaultCountry;
    const config = this.screens.find(s => s.countryCode.includes(code));
    return config?.screens ?? ({} as CcScreenResource);
  }

  /**
   * Retorna las columnas de tabla listas para renderizar.
   */
  getTableColumns(country?: string): CcTableColumn[] {
    return this.getScreen(country).scr_table_columns ?? [];
  }

  /**
   * Retorna las definiciones de campos del formulario.
   */
  getFields(country?: string): CcFieldDefinition[] {
    return this.getScreen(country).scr_fields ?? [];
  }

  /**
   * Retorna un campo específico por su key.
   */
  getField(key: string, country?: string): CcFieldDefinition | undefined {
    return this.getFields(country).find(f => f.key === key);
  }

  /**
   * Retorna los títulos de las columnas (útil para exportar a Excel).
   */
  getColumnTitles(country?: string): string[] {
    return this.getTableColumns(country)
      .filter(c => c.is_visible_column !== false)
      .map(c => c.is_mandatory ? `${c.col_name} *` : c.col_name);
  }
}
```

---

## Paso 3: Servicio de validaciones `CcValidatorsService`

Reemplaza el `ValidatorsService` actual (que dependía de `@ngx-translate`). Consume las interfaces del design system y los mensajes del recurso directamente.

### Archivo: `libs/design-system/src/lib/core/cc-validators.service.ts`

```typescript
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CcValidationMessages } from './models/screen-resource.model';

/**
 * Servicio de validaciones del Design System.
 *
 * No depende de translate ni de storageService.
 * Los mensajes vienen del CcScreenResource de cada pantalla.
 */
@Injectable({ providedIn: 'root' })
export class CcValidatorsService {

  // ── Patrones comunes ──
  readonly emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
  readonly alphanumericPattern =
    /^[0-9a-zA-ZäÄëËïÏöÖüÜáéíóúñÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙÑ ]+$/;

  // ── Mensajes por defecto (fallback) ──
  private defaultMessages: CcValidationMessages = {
    required: 'Campo obligatorio',
    maxLength: 'Máximo {0} caracteres',
    minLength: 'Mínimo {0} caracteres',
    email: 'Correo electrónico inválido',
  };

  /**
   * Obtiene el mensaje de error para un control de formulario.
   *
   * @param form - El FormGroup
   * @param controlName - Nombre del control
   * @param messages - Mensajes del recurso de pantalla (scr_messages_erros_form)
   */
  getFieldError(
    form: FormGroup,
    controlName: string,
    messages?: CcValidationMessages
  ): string | null {
    const control = form.get(controlName);
    if (!control || !control.errors || !control.touched) return null;

    const msgs = { ...this.defaultMessages, ...messages };
    const errors = control.errors;

    if (errors['required']) {
      return msgs.required ?? 'Campo obligatorio';
    }
    if (errors['minlength']) {
      return (msgs.minLength ?? 'Mínimo {0} caracteres')
        .replace('{0}', errors['minlength'].requiredLength);
    }
    if (errors['maxlength']) {
      return (msgs.maxLength ?? 'Máximo {0} caracteres')
        .replace('{0}', errors['maxlength'].requiredLength);
    }
    if (errors['email']) {
      return msgs.email ?? 'Correo inválido';
    }
    if (errors['pattern'] && msgs.patterns?.[controlName]) {
      return msgs.patterns[controlName];
    }

    return null;
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado.
   */
  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control?.errors && control.touched && control.dirty);
  }

  /**
   * Marca todos los controles como pristine y untouched (reset visual).
   */
  markFormClean(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormClean(control);
      } else {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }
}
```

---

## Paso 4: Integración en los componentes del Design System

### 4.1 — `cc-data-table` ahora entiende `CcTableColumn[]`

El componente recibe directamente el arreglo de columnas del recurso:

```typescript
// data-table.component.ts
import { Component, input, output, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcTableColumn } from '../../core/models/screen-resource.model';

@Component({
  selector: 'cc-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class CcDataTableComponent {
  // ← Ahora acepta CcTableColumn[] directamente del recurso
  columns = input<CcTableColumn[]>([]);
  data    = input<any[]>([]);
  loading = input<boolean>(false);

  rowClick    = output<any>();
  actionClick = output<{ action: string; row: any }>();

  customCellTemplate = contentChild<TemplateRef<any>>('customCell');
  rowActionsTemplate = contentChild<TemplateRef<any>>('rowActions');
}
```

Template (simplificado):

```html
<table class="cc-data-table">
  <thead>
    <tr>
      @for (col of columns(); track col.col_ref) {
        <th [style.width]="col.col_width ?? 'auto'">
          {{ col.col_name }}
        </th>
      }
    </tr>
  </thead>
  <tbody>
    @for (row of data(); track $index) {
      <tr (click)="rowClick.emit(row)">
        @for (col of columns(); track col.col_ref) {
          <td>
            @if (col.col_type === 'boolean') {
              {{ row[col.col_ref] ? col.boolean_label_affirmative : col.boolean_label_negative }}
            } @else {
              {{ row[col.col_ref] }}
            }
          </td>
        }
      </tr>
    }
  </tbody>
</table>
```

### 4.2 — `cc-form-field` usa `CcFieldDefinition`

```typescript
// form-field.component.ts
import { Component, input, computed } from '@angular/core';
import { CcFieldDefinition } from '../../core/models/screen-resource.model';

@Component({
  selector: 'cc-form-field',
  standalone: true,
  imports: [CommonModule, CcLabelComponent],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class CcFormFieldComponent {
  // Opción A: recibir una definición completa
  fieldDef   = input<CcFieldDefinition | null>(null);

  // Opción B: las propiedades individuales se mantienen para flexibilidad
  label        = input<string>('');
  errorMessage = input<string | null>(null);
  required     = input<boolean>(false);

  // Las propiedades computadas resuelven desde fieldDef o inputs directos
  resolvedLabel = computed(() => this.fieldDef()?.label ?? this.label());
  resolvedRequired = computed(() => this.fieldDef()?.required ?? this.required());
}
```

---

## Paso 5: Cómo una app lo consume

### 5.1 — Crear el Resource de la pantalla

```typescript
// apps/cerca-citofonia/src/app/pages/residentes/residentes.resource.ts
import { CcBaseResource } from '@cerca/design-system';

export class ResidentesResource extends CcBaseResource {
  protected screens = [
    {
      countryCode: ['CO'],
      screens: {
        scr_title: 'Gestión de Residentes',
        scr_description: 'Administra los residentes del conjunto.',
        scr_action_label: 'Nuevo Residente',
        scr_search_button: 'Buscar',
        scr_clear_button: 'Limpiar',
        scr_messages_erros_form: {
          required: 'Este campo es obligatorio',
          email: 'Ingrese un correo válido',
        },
        scr_fields: [
          {
            key: 'full_name',
            label: 'Nombre Completo',
            placeholder: 'Ingrese el nombre',
            type: 'text',
            required: true,
            maxLength: 100,
            prefix: 'user',
            errorMessages: {
              required: 'El nombre es obligatorio',
              maxLength: 'Máximo 100 caracteres',
            },
          },
          {
            key: 'email',
            label: 'Correo Electrónico',
            placeholder: 'usuario@dominio.com',
            type: 'email',
            required: true,
            prefix: 'mail',
            errorMessages: {
              required: 'El correo es obligatorio',
              email: 'Formato de correo inválido',
            },
          },
          {
            key: 'unit_number',
            label: 'Número Unidad',
            placeholder: 'Ej: 101',
            type: 'text',
            required: true,
            prefix: 'home',
          },
        ],
        scr_table_columns: [
          {
            col_name: 'Nombre',
            col_ref: 'full_name',
            is_visible_column: true,
            is_mandatory: true,
            col_width: 'auto',
            sortable: true,
          },
          {
            col_name: 'Email',
            col_ref: 'email',
            is_visible_column: true,
            col_width: 'auto',
          },
          {
            col_name: 'Unidad',
            col_ref: 'unit_number',
            is_visible_column: true,
            col_width: '120px',
          },
          {
            col_name: 'Estado',
            col_ref: 'is_active',
            col_type: 'boolean',
            is_visible_column: true,
            col_width: '100px',
            boolean_label_affirmative: 'Activo',
            boolean_label_negative: 'Inactivo',
          },
        ],
      },
    },
  ];
}
```

### 5.2 — Consumir en el componente

```typescript
// residentes.component.ts
@Component({ ... })
export class ResidentesComponent {
  private resource = new ResidentesResource();

  // Traer la configuración de pantalla
  screen = this.resource.getScreen('CO');

  // Variables derivadas para el template
  tableColumns = this.resource.getTableColumns('CO');
  fields       = this.resource.getFields('CO');

  // datos de Supabase
  residents = signal<any[]>([]);
}
```

```html
<!-- residentes.component.html -->
<h1>{{ screen.scr_title }}</h1>
<p>{{ screen.scr_description }}</p>

<!-- Tabla renderizada desde el recurso -->
<cc-data-table
  [columns]="tableColumns"
  [data]="residents()"
/>

<!-- Formulario renderizado desde el recurso -->
@for (field of fields; track field.key) {
  <cc-form-field [fieldDef]="field">
    <cc-input
      [type]="field.type ?? 'text'"
      [placeholder]="field.placeholder ?? ''"
      [prefix]="field.prefix"
    />
  </cc-form-field>
}
```

---

## Paso 6: Qué exportar desde el `public-api.ts`

```typescript
// libs/design-system/src/lib/public-api.ts — agregar:

// Core / Resource
export * from './core/models/screen-resource.model';
export * from './core/cc-base.resource';
export * from './core/cc-validators.service';
```

---

## Resumen de archivos a crear en la librería

| Archivo | Tipo | Propósito |
|---------|------|-----------|
| `core/models/screen-resource.model.ts` | **[NEW]** | Interfaces tipadas para recursos de pantalla |
| `core/cc-base.resource.ts` | **[NEW]** | Clase base abstracta para recursos |
| `core/cc-validators.service.ts` | **[NEW]** | Servicio de validaciones sin dependencias externas |
| `helpers/form-validator.helper.ts` | **[DELETE]** | Reemplazado por `CcValidatorsService` |

---

## Diagrama de flujo de datos

```
                App Layer                              Library Layer
  ┌──────────────────────────┐        ┌────────────────────────────────────┐
  │  residentes.resource.ts  │        │   @cerca/design-system             │
  │  extends CcBaseResource  │───────►│                                    │
  │                          │        │   CcBaseResource (abstract)        │
  │  ┌─ scr_fields ──────────┼───┐    │     ├── getScreen()               │
  │  ├─ scr_table_columns ───┼──┐│    │     ├── getTableColumns()         │
  │  └─ scr_messages_erros ──┼─┐││    │     └── getFields()               │
  └──────────────────────────┘ │││    │                                    │
                               │││    │   CcValidatorsService              │
                               │││    │     └── getFieldError(form,ctrl,   │
                               ││└───►│              messages)             │
                               ││     │                                    │
                               ││     │   <cc-data-table>                  │
                               │└────►│     [columns]: CcTableColumn[]    │
                               │      │                                    │
                               │      │   <cc-form-field>                  │
                               └─────►│     [fieldDef]: CcFieldDefinition │
                                      │                                    │
                                      └────────────────────────────────────┘
```

---

## Beneficios

1. **Fuente de verdad única**: Todo texto, label y columna se declara en un solo `.resource.ts` por pantalla.
2. **Tipado fuerte**: Errores de compilación si falta un campo o el tipo no coincide. Adiós `any[]`.
3. **Zero-translate**: Sin dependencia de `@ngx-translate`. Los mensajes del recurso **son** la traducción.
4. **Reutilizable**: La misma `CcBaseResource` sirve para `saas-admin`, `cerca-citofonia` y cualquier app futura.
5. **Compatible con legacy**: Los campos `scr_labels`, `scr_messages` y el patrón `countryCode` se mantienen.
