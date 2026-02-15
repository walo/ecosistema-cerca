# @cerca/design-system

Librería compartida de componentes del Design System para el ecosistema Cerca. Implementa **Atomic Design** con componentes basados en ng-zorro-antd para mantener uniformidad visual en todas las aplicaciones.

---

## 📦 Instalación

### Como Librería Local (Monorepo)

La librería ya está configurada en el monorepo. Solo necesitas configurar el path mapping en tu proyecto:

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@cerca/design-system": [
        "../../libs/design-system/src/public-api.ts"
      ]
    }
  }
}
```

### Build de la Librería

```bash
# Desde la raíz del monorepo
cd libs
ng build design-system

# Output: libs/dist/design-system/
```

---

## 🎨 Estructura de Componentes

La librería sigue la metodología **Atomic Design**:

### Atoms (Componentes Básicos)
- `ButtonComponent` - Botones con variantes (primary, secondary, danger, etc.)
- `InputComponent` - Campos de entrada de texto
- `SelectComponent` - Selectores dropdown
- `BadgeComponent` - Insignias y etiquetas
- `LabelComponent` - Etiquetas de texto
- `IconComponent` - Iconos de Ant Design

### Molecules (Componentes Compuestos)
- `CardComponent` - Tarjetas de contenido
- `FormFieldComponent` - Campo de formulario con label + input + validación
- `SearchBarComponent` - Barra de búsqueda

### Organisms (Componentes Complejos)
- `DataTableComponent` - Tabla de datos con paginación, ordenamiento y filtros
- `HeaderComponent` - Encabezado de página
- `SidebarComponent` - Barra lateral de navegación
- `ModalComponent` - Ventanas modales

### Templates (Plantillas de Página)
- `AdminLayoutComponent` - Layout principal de administración
- `AuthLayoutComponent` - Layout para páginas de autenticación
- `DashboardTemplateComponent` - Plantilla de dashboard
- `FormPageTemplateComponent` - Plantilla para páginas de formularios
- `ListPageTemplateComponent` - Plantilla para páginas de listados

### Layout (Componentes de Disposición)
- `ContainerComponent` - Contenedor principal
- `GridComponent` - Sistema de grilla
- `StackComponent` - Apilamiento vertical/horizontal
- `InlineComponent` - Disposición en línea

### Tokens (Variables de Diseño)
- `_colors.scss` - Paleta de colores
- `_typography.scss` - Tipografía y fuentes
- `_spacing.scss` - Espaciados y márgenes
- `_shadows.scss` - Sombras y elevaciones
- `_radius.scss` - Bordes redondeados
- `_theme-strategy.scss` - Estrategia de temas

---

## 🚀 Uso

### Importar Componentes

```typescript
import { 
  ButtonComponent,
  InputComponent,
  CardComponent,
  DataTableComponent,
  AdminLayoutComponent
} from '@cerca/design-system';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  template: `
    <cc-card>
      <cc-input placeholder="Nombre" />
      <cc-button type="primary">Guardar</cc-button>
    </cc-card>
  `
})
export class MyPageComponent {}
```

### Importar Tokens SCSS

```scss
// En tu archivo SCSS
@import '@cerca/design-system/tokens';

.my-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

---

## 🎯 Componentes Disponibles

### ButtonComponent

**Selector:** `cc-button`

**Props:**
- `type`: `'primary' | 'secondary' | 'danger' | 'link'` (default: `'primary'`)
- `size`: `'small' | 'medium' | 'large'` (default: `'medium'`)
- `disabled`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`)
- `icon`: `string` (nombre del icono de Ant Design)

**Ejemplo:**
```html
<cc-button type="primary" size="large" icon="save">
  Guardar
</cc-button>
```

### InputComponent

**Selector:** `cc-input`

**Props:**
- `type`: `'text' | 'password' | 'email' | 'number'` (default: `'text'`)
- `placeholder`: `string`
- `disabled`: `boolean` (default: `false`)
- `required`: `boolean` (default: `false`)
- `prefix`: `string` (icono prefijo)
- `suffix`: `string` (icono sufijo)

**Ejemplo:**
```html
<cc-input 
  type="email" 
  placeholder="correo@ejemplo.com"
  prefix="mail"
  required
/>
```

### CardComponent

**Selector:** `cc-card`

**Props:**
- `title`: `string`
- `bordered`: `boolean` (default: `true`)
- `hoverable`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`)

**Ejemplo:**
```html
<cc-card title="Información del Usuario" hoverable>
  <p>Contenido de la tarjeta</p>
</cc-card>
```

### DataTableComponent

**Selector:** `cc-data-table`

**Props:**
- `data`: `any[]` (datos de la tabla)
- `columns`: `TableColumn[]` (configuración de columnas)
- `loading`: `boolean` (default: `false`)
- `pageSize`: `number` (default: `10`)
- `showPagination`: `boolean` (default: `true`)

**Ejemplo:**
```typescript
columns = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role', filterable: true }
];

data = [
  { name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
  { name: 'María García', email: 'maria@ejemplo.com', role: 'User' }
];
```

```html
<cc-data-table 
  [data]="data" 
  [columns]="columns"
  [pageSize]="20"
/>
```

---

## 🎨 Tokens de Diseño

### Colores

```scss
// Primarios
--color-primary: #1890ff;
--color-secondary: #52c41a;
--color-danger: #ff4d4f;
--color-warning: #faad14;
--color-info: #13c2c2;

// Grises
--color-text-primary: #262626;
--color-text-secondary: #8c8c8c;
--color-border: #d9d9d9;
--color-background: #f5f5f5;
```

### Espaciados

```scss
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### Tipografía

```scss
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-md: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Sombras

```scss
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 🔧 Desarrollo

### Estructura del Proyecto

```
libs/design-system/
├── src/
│   ├── lib/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   ├── layout/
│   │   ├── tokens/
│   │   └── public-api.ts
│   └── public-api.ts
├── ng-package.json
├── package.json
├── tsconfig.lib.json
└── README.md
```

### Agregar Nuevo Componente

1. **Crear el componente en la carpeta correspondiente:**
   ```bash
   cd libs/design-system/src/lib/atoms
   ng generate component my-atom --standalone
   ```

2. **Exportar en `public-api.ts`:**
   ```typescript
   // libs/design-system/src/lib/public-api.ts
   export * from './atoms/my-atom/my-atom.component';
   ```

3. **Rebuild la librería:**
   ```bash
   ng build design-system
   ```

### Testing

```bash
# Ejecutar tests de la librería
ng test design-system
```

---

## 📋 Peer Dependencies

La librería requiere las siguientes dependencias en el proyecto consumidor:

```json
{
  "@angular/common": "^21.1.0",
  "@angular/core": "^21.1.0",
  "ng-zorro-antd": "^21.1.0",
  "@ant-design/icons-angular": "^21.0.0"
}
```

---

## 📝 Versionado

La librería sigue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Cambios incompatibles en la API
- **MINOR** (x.1.x): Nueva funcionalidad compatible
- **PATCH** (x.x.1): Correcciones de bugs

**Versión actual:** `1.0.0`

---

## 🤝 Contribuir

### Reglas de Contribución

1. **Atomic Design:** Todos los componentes deben seguir la metodología Atomic Design
2. **Standalone Components:** Usar componentes standalone de Angular
3. **ng-zorro-antd:** Basar componentes en ng-zorro cuando sea posible
4. **TypeScript Strict:** Código con tipado estricto
5. **SCSS Tokens:** Usar variables de diseño definidas en `tokens/`

### Proceso de Desarrollo

1. Crear rama feature: `git checkout -b feature/nuevo-componente`
2. Desarrollar componente siguiendo las reglas
3. Exportar en `public-api.ts`
4. Rebuild: `ng build design-system`
5. Commit: `git commit -m "feat: agregar nuevo componente"`
6. Push y crear PR

---

## 📄 Licencia

Propiedad de Cerca Ecosystem. Uso interno únicamente.

---

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo de Cerca.
