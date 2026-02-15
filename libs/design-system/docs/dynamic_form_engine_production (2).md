# Dynamic Form Engine — UI Resource Renderer Mode

## Strategic Clarification

At this stage your library is:

→ A UI Design System with dynamic rendering capabilities\
→ NOT yet a full enterprise framework runtime

If the system:

- Receives a `resource.ts`
- Interprets its structure
- Renders layouts, tables and forms
- Applies validations

Then you are still inside the **UI orchestration layer**, not a full framework.

The moment you introduce:

- Global runtime lifecycle
- Plugin loading
- Cross-module state orchestration
- Rule engines
- Bootstrap initialization contracts

That is when it becomes a framework.

Right now, what you are building is:

# A Schema-Driven UI System

And that is perfectly valid.

---

# 1. Recommended Architecture (Current Stage)

Keep it simple and controlled.

```
libs/design-system/src/lib/

  atoms/
  molecules/
  organisms/
  templates/
  layout/
  styles/
  tokens/

  schema-rendering/
    form/
    table/
    layout/
    resource/

  registry/

  public-api.ts
```

Notice:

No bootstrap\
No global state layer\
No runtime service

Because you don’t need them yet.

---

# 2. What "Resource.ts" Represents

Your `resource.ts` becomes the contract between domain and UI.

Example conceptual contract:

```ts
export interface ResourceDefinition {
  name: string;
  fields: FieldSchema[];
  table?: TableSchema;
  layout?: LayoutSchema;
}
```

The design-system should:

- Accept this object
- Render forms
- Render tables
- Apply field-level validation
- Emit UI events

Nothing more.

No business logic. No API calls. No persistence rules.

---

# 3. Where Form & Table Engines Fit (Now)

They live as rendering engines only.

```
schema-rendering/
  form/
    form-renderer.component.ts
    form-builder.service.ts

  table/
    table-renderer.component.ts
    table-state.service.ts

  resource/
    resource-renderer.component.ts
```

These are NOT enterprise engines. They are UI interpreters.

That distinction is critical.

---

# 4. When It Officially Becomes a Framework

It becomes a framework when:

- Resources self-register
- Modules auto-wire
- Plugins extend behavior
- State becomes global
- Initialization lifecycle exists

Until then, you are building a powerful dynamic UI system.

---

# 5. Recommended Next Step (Practical)

Do this in order:

1️⃣ Finalize `ResourceDefinition` contract\
2️⃣ Build `resource-renderer.component`\
3️⃣ Build form/table renderers that consume that contract\
4️⃣ Keep everything local and stateless

Only after that is stable should we introduce:

- Rule engine
- Global state
- Plugin system

---

# Final Answer

What you described:

"Recibe un resource.ts y lo muestra en pantalla"

Is still Design System + Schema Rendering.

It is NOT yet a framework.

And that is the correct level of complexity for your current stage.

Build the UI interpreter first. Stabilize the contracts. Then evolve it into a framework intentionally — not accidentally.

