# Framework Initialization — Production Implementation

## Objective
Define the full bootstrap pipeline of the enterprise framework with explicit wiring, provider isolation, and deterministic startup.

---

# 1. Folder Structure

```
projects/framework-core/src/lib/

  bootstrap/
    provide-framework.ts
    framework-config.token.ts
    framework-initializer.service.ts

  registry/
    resource-registry.service.ts
    plugin-registry.service.ts

  runtime/
    framework-runtime.service.ts

  tokens/
    framework.tokens.ts
```

---

# 2. Public Bootstrap API

## 2.1 FrameworkConfig Contract

```ts
export interface FrameworkConfig {
  debug?: boolean;
  resources?: ResourceDefinition[];
  plugins?: FrameworkPlugin[];
}
```

---

## 2.2 Injection Token

```ts
export const FRAMEWORK_CONFIG = new InjectionToken<FrameworkConfig>(
  'FRAMEWORK_CONFIG'
);
```

---

# 3. provideFramework()

Single entry point for app integration.

```ts
export function provideFramework(config: FrameworkConfig): Provider[] {
  return [
    { provide: FRAMEWORK_CONFIG, useValue: config },
    ResourceRegistryService,
    PluginRegistryService,
    FrameworkRuntimeService,
    FrameworkInitializerService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (init: FrameworkInitializerService) => () => init.init(),
      deps: [FrameworkInitializerService]
    }
  ];
}
```

---

# 4. Initialization Lifecycle

## 4.1 FrameworkInitializerService

Responsibilities:

1. Register resources
2. Register plugins
3. Freeze registry
4. Enable runtime

```ts
@Injectable()
export class FrameworkInitializerService {
  constructor(
    @Inject(FRAMEWORK_CONFIG) private config: FrameworkConfig,
    private resources: ResourceRegistryService,
    private plugins: PluginRegistryService,
    private runtime: FrameworkRuntimeService
  ) {}

  async init(): Promise<void> {
    this.registerResources();
    this.registerPlugins();
    this.resources.freeze();
    this.runtime.enable(this.config.debug ?? false);
  }

  private registerResources() {
    this.config.resources?.forEach(r => this.resources.register(r));
  }

  private registerPlugins() {
    this.config.plugins?.forEach(p => this.plugins.register(p));
  }
}
```

---

# 5. Runtime Service

```ts
@Injectable()
export class FrameworkRuntimeService {
  private readonly enabled = signal(false);
  private readonly debugMode = signal(false);

  enable(debug: boolean) {
    this.debugMode.set(debug);
    this.enabled.set(true);
  }

  isEnabled() {
    return this.enabled();
  }

  isDebug() {
    return this.debugMode();
  }
}
```

---

# 6. Application Integration

## main.ts

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideFramework({
      debug: true,
      resources: [UserResource, OrderResource],
      plugins: [AuditPlugin]
    })
  ]
});
```

---

# 7. Enterprise Guarantees

- Deterministic startup
- No lazy hidden registration
- Immutable registry after bootstrap
- All wiring visible at root
- No side-effect module loading

---

Initialization is now production-ready and enforceable across teams.

