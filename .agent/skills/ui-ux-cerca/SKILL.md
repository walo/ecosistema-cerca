---
name: ui-ux-cerca
description: Especialista en diseño de interfaces modernas, accesibilidad y consistencia visual basada en el manual de marca de Cerca. Utilízalo para crear componentes, diseñar pantallas y mejorar la UX.
---

# Habilidad: UI-UX-Cerca

Esta habilidad garantiza que todas las interfaces de usuario del ecosistema Cerca sean visualmente impresionantes, altamente funcionales y sigan los estándares de diseño de la marca.

## Meta
Proveer una experiencia de usuario (UX) fluida y una interfaz (UI) moderna, centrada en la accesibilidad y la consistencia visual.

## Disparadores Semánticos
- "Crea un componente UI"
- "Diseña la pantalla de..."
- "Estiliza esta vista"
- "Mejora la experiencia de usuario en..."

## Instrucciones y Reglas de Diseño

### 1. Design Tokens (Paleta de Colores)
Es OBLIGATORIO utilizar los siguientes colores para mantener la consistencia de marca:
- **Fondo General**: `Stone-50`
- **Color Primario (Acciones/Botones)**: `Sky-600`
- **Éxito (Confirmaciones/Check)**: `Emerald-500`
- **Alertas / Estado de Mora**: `Rose-500`

### 2. Implementación Técnica (Tailwind CSS)
- **TECNOLOGÍA**: Prohibido el uso de CSS en línea (inline-styles) o archivos `.css` externos.
- **CLASES**: Utilizar exclusivamente las clases de utilidad de **Tailwind CSS**.
- **ESTRUCTURA**: Mantener el código limpio y semántico.

### 3. Responsividad y Accesibilidad
- **MOBILE-FIRST**: Diseñar siempre pensando primero en dispositivos móviles y luego escalar a pantallas más grandes.
- **OBJETIVOS TÁCTILES**: Asegurar que todos los elementos interactuables (botones, links, iconos) tengan un área táctil mínima de **44x44px**.
- **CONTRASTE**: Mantener niveles de contraste adecuados para personas con visibilidad reducida.

### 4. Feedback al Usuario (UX)
- **CARGA**: Implementar estados de carga visuales (**skeletons**) mientras se esperan datos de la red.
- **INTERACCIÓN**: Añadir micro-interacciones (efectos de hover, transiciones suaves, cambios de escala sutiles) para cada acción o entrada del usuario.
- **CLARIDAD**: Mostrar mensajes de error o éxito claros y contextuales.

## Restricciones
- No utilizar frameworks de UI que no permitan personalización total con Tailwind.
- No ignorar la adaptabilidad a diferentes tamaños de pantalla.
- No crear interfaces estáticas sin feedback visual ante interacciones.
