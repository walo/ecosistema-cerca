---
name: ui-ux-cerca
description: Especialista en diseño de interfaces modernas con Angular (ng-zorro-antd). Utilízalo para crear componentes premium, diseñar pantallas accesibles y mejorar la experiencia de usuario siguiendo el manual de marca de Cerca.
---

# Habilidad: UI-UX-Cerca

Esta habilidad garantiza que todas las interfaces de usuario del ecosistema Cerca sean visualmente impresionantes, altamente funcionales y sigan los estándares de diseño de la marca.

## Meta
Proveer una experiencia de usuario (UX) fluida y una interfaz (UI) moderna, centrada en la accesibilidad y la consistencia visual.

## Disparadores Semánticos
- "Crea un componente UI con Ng-Zorro"
- "Diseña la pantalla de... usando Ant Design"
- "Estiliza esta vista con Zorro"
- "Mejora la experiencia de usuario con componentes de Ant"
- "Revisar documentación de Ng-Zorro"

## Instrucciones y Reglas de Diseño

### 1. Design Tokens (Paleta de Colores)
Es OBLIGATORIO utilizar los siguientes colores para mantener la consistencia de marca:
- **Fondo General**: `Stone-50`
- **Color Primario (Acciones/Botones)**: `Sky-600`
- **Éxito (Confirmaciones/Check)**: `Emerald-500`
- **Alertas / Estado de Mora**: `Rose-500`

### 2. Implementación Técnica (Frameworks y Estilos)
- **COMPONENTES**: Utilizar **ng-zorro-antd** para componentes estructurales (formularios, tablas, layouts, feedbacks).
- **ESTILOS**: Utilizar **SCSS / Vanilla CSS** para el layout (grid/flex), espaciado, tipografía y personalización de componentes.
- **CLASES**: No utilizar frameworks de utilidades. Definir clases semánticas en archivos `.scss`.
- **DOCUMENTACIÓN OFICIAL**: [NG-ZORRO Components](https://ng.ant.design/components/overview/en) - Consultar SIEMPRE para asegurar el uso correcto de directivas y propiedades.
- **ESTRUCTURA**: Separación obligatoria de archivos: `.ts`, `.html` y `.scss` por componente.

### 3. Responsividad y Accesibilidad
- **MOBILE-FIRST**: Diseñar siempre pensando primero en dispositivos móviles y luego escalar a pantallas más grandes.
- **OBJETIVOS TÁCTILES**: Asegurar que todos los elementos interactuables (botones, links, iconos) tengan un área táctil mínima de **44x44px**.
- **CONTRASTE**: Mantener niveles de contraste adecuados para personas con visibilidad reducida.

### 4. Feedback al Usuario (UX)
- **CARGA**: Implementar estados de carga visuales (**skeletons**) mientras se esperan datos de la red.
- **INTERACCIÓN**: Añadir micro-interacciones (efectos de hover, transiciones suaves, cambios de escala sutiles) para cada acción o entrada del usuario.
- **CLARIDAD**: Mostrar mensajes de error o éxito claros y contextuales.

## Restricciones
- No utilizar estilos en línea (inline-styles).
- No utilizar frameworks de utilidades CSS (como Tailwind).
- No ignorar la adaptabilidad a diferentes tamaños de pantalla (Mobile-First).
- No crear componentes sin feedback visual ante interacciones.
- No duplicar lógica de componentes de Ant Design con CSS personalizado innecesario.
