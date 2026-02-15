# Framework Initialization Flow

## Objective
Define deterministic startup lifecycle for the enterprise UI framework in Angular 21+ standalone.

---

# 1. Initialization Phases

## Phase 1 — Core Bootstrapping

- Load framework configuration (UI_FRAMEWORK_CONFIG_TOKEN)
- Initialize Registry
- Register built-in renderers
- Register built-in validators
- Register built-in rule operators

---

## Phase 2 — Plugin Registration

- Resolve UI_PLUGINS multi-provider
- Execute plugin.register(registry)
- Validate duplicate keys
- Freeze registry (immutability after bootstrap)

---

## Phase 3 — Resource Resolution

- Resolve SCREEN_RESOURCE_TOKEN
- Validate schema structure
- Normalize metadata
- Precompute visibility maps
- Precompile validator mappings

---

## Phase 4 — Engine Instantiation

- Instantiate FormEngine
- Instantiate TableEngine
- Instantiate RulesEngine
- Wire engines together

---

# 2. Angular Integration Strategy

## provideUiFramework()

```ts
export function provideUiFramework(config: UiFrameworkConfig) {
  return [
    { provide: UI_FRAMEWORK_CONFIG_TOKEN, useValue: config },
    RegistryService,
    FormEngineService,
    TableEngineService,
    RulesEngineService
  ];
}
```

Used inside bootstrapApplication().

---

# 3. Deterministic Order Guarantee

1. Registry ready
2. Plugins registered
3. Resource validated
4. Engines created
5. Component renders

No engine should execute before registry is frozen.

---

# 4. Failure Strategy

- Schema validation error → throw at bootstrap
- Duplicate renderer → explicit error
- Missing renderer → fallback strategy or fail-fast (configurable)

---

# 5. Enterprise Constraints

- No dynamic mutation after initialization
- Immutable metadata
- Explicit lifecycle hooks
- Logging in debug mode

---

This flow guarantees predictable startup behavior and avoids runtime instability.

