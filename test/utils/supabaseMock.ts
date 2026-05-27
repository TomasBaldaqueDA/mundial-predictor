type Row = Record<string, unknown>
type TableStore = Record<string, Row[]>

type SupabaseMockOptions = {
  user?: { id: string } | null
  tables?: TableStore
  rpcHandlers?: Record<string, (args?: unknown) => { data?: unknown; error?: { message: string } | null }>
}

function cloneRows(rows: Row[] = []): Row[] {
  return rows.map((r) => ({ ...r }))
}

class QueryBuilder {
  private mode: "select" | "update" | "delete" = "select"
  private filters: Array<(row: Row) => boolean> = []
  private orderBy: { col: string; ascending: boolean }[] = []
  private limitN: number | null = null
  private rangeFrom: number | null = null
  private rangeTo: number | null = null
  private updatePayload: Row | null = null

  constructor(
    private readonly table: string,
    private readonly store: TableStore
  ) {}

  select() {
    this.mode = "select"
    return this
  }

  eq(col: string, val: unknown) {
    this.filters.push((row) => row[col] === val)
    return this
  }

  in(col: string, vals: unknown[]) {
    this.filters.push((row) => vals.includes(row[col]))
    return this
  }

  not(col: string, op: string, val: unknown) {
    if (op === "eq") this.filters.push((row) => row[col] !== val)
    return this
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderBy.push({ col, ascending: opts?.ascending !== false })
    return this
  }

  range(from: number, to: number) {
    this.rangeFrom = from
    this.rangeTo = to
    return this
  }

  limit(n: number) {
    this.limitN = n
    return this
  }

  insert(payload: Row | Row[]) {
    const rows = Array.isArray(payload) ? payload : [payload]
    this.store[this.table] = [...(this.store[this.table] ?? []), ...rows.map((r) => ({ ...r }))]
    return Promise.resolve({ data: null, error: null })
  }

  upsert(payload: Row | Row[]) {
    const rows = Array.isArray(payload) ? payload : [payload]
    this.store[this.table] = [...(this.store[this.table] ?? []), ...rows.map((r) => ({ ...r }))]
    return Promise.resolve({ data: null, error: null })
  }

  update(payload: Row) {
    this.mode = "update"
    this.updatePayload = payload
    return this
  }

  delete() {
    this.mode = "delete"
    return this
  }

  single() {
    return this.execute().then((res) => ({ data: res.data[0] ?? null, error: res.error }))
  }

  maybeSingle() {
    return this.execute().then((res) => ({ data: res.data[0] ?? null, error: res.error }))
  }

  then<TResult1 = { data: Row[]; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: Row[]; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected)
  }

  private getFiltered(): Row[] {
    let rows = cloneRows(this.store[this.table] ?? [])
    for (const f of this.filters) rows = rows.filter(f)
    if (this.orderBy.length) {
      rows.sort((a, b) => {
        for (const { col, ascending } of this.orderBy) {
          const av = a[col]
          const bv = b[col]
          if (av === bv) continue
          if (av == null) return 1
          if (bv == null) return -1
          const cmp = String(av).localeCompare(String(bv))
          return ascending ? cmp : -cmp
        }
        return 0
      })
    }
    if (this.rangeFrom != null && this.rangeTo != null) {
      rows = rows.slice(this.rangeFrom, this.rangeTo + 1)
    }
    if (this.limitN != null) rows = rows.slice(0, this.limitN)
    return rows
  }

  private async execute() {
    if (this.mode === "select") {
      return { data: this.getFiltered(), error: null as null }
    }

    if (this.mode === "delete") {
      const toDelete = new Set(this.getFiltered().map((r) => JSON.stringify(r)))
      this.store[this.table] = (this.store[this.table] ?? []).filter((r) => !toDelete.has(JSON.stringify(r)))
      return { data: [], error: null as null }
    }

    if (this.mode === "update") {
      const targets = this.getFiltered()
      const lookup = new Set(targets.map((r) => JSON.stringify(r)))
      this.store[this.table] = (this.store[this.table] ?? []).map((r) =>
        lookup.has(JSON.stringify(r)) ? { ...r, ...(this.updatePayload ?? {}) } : r
      )
      return { data: targets, error: null as null }
    }

    return { data: [], error: null as null }
  }
}

export function createSupabaseMock(options: SupabaseMockOptions = {}) {
  const store: TableStore = {}
  for (const [table, rows] of Object.entries(options.tables ?? {})) {
    store[table] = cloneRows(rows)
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: options.user ?? null } }),
    },
    from: (table: string) => new QueryBuilder(table, store),
    rpc: async (name: string, args?: unknown) => {
      const handler = options.rpcHandlers?.[name]
      if (!handler) return { data: null, error: null }
      const out = handler(args)
      return { data: out.data ?? null, error: out.error ?? null }
    },
    __store: store,
  }
}
