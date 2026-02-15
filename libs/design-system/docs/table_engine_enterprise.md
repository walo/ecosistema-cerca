# 2. Enterprise Table Engine

## Objective

Provide a scalable table engine supporting:

- Client-side mode
- Server-side mode
- Sorting
- Filtering
- Pagination
- Column-level metadata control

---

# 2.1 Table Schema

```ts
export interface TableColumnSchema<T = any> {
  key: keyof T & string;
  header: string;
  visible?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  pipe?: string;
  func_to_execute?: string;
  booleanLabels?: { true: string; false: string };
  renderer?: string;
}
```

---

## TableSchema

```ts
export interface TableSchema<T = any> {
  columns: TableColumnSchema<T>[];
  mode: 'client' | 'server';
  pageSize?: number;
}
```

---

# 2.2 Query Model (Server Mode)

```ts
export interface TableQuery {
  page: number;
  size: number;
  sort?: { active: string; direction: 'asc' | 'desc' };
  filters?: Record<string, any>;
}
```

---

# 2.3 Engine Contract

```ts
export interface TableEngine<T = any> {
  setData(data: T[]): void;
  setQuery(query: TableQuery): void;
  getVisibleColumns(): TableColumnSchema<T>[];
  connect(): Observable<T[]>;
}
```

---

# 2.4 Behavior Rules

Client Mode:

- In-memory sorting
- In-memory filtering
- In-memory pagination

Server Mode:

- Emits TableQuery
- Consumer handles HTTP
- Table only renders returned data

---

# 2.5 Enterprise Features

- Column visibility toggling
- Persisted user preferences
- Virtual scroll compatibility
- Lazy renderer resolution
- Immutable data updates

---

This design avoids coupling the table to data sources while supporting enterprise scalability.

