type Serializable = unknown

interface ILocalCache {
  get(key: string): Promise<string | null>
  set(key: string, value: Serializable, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  getOrLoad<T = Serializable>(key: string, loader: () => Promise<T>, ttlSeconds?: number): Promise<T>
}

class LocalCache implements ILocalCache {
  private store = new Map<string, { value: string; expiresAt: number | null }>()
  private inflight = new Map<string, Promise<unknown>>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  async set(key: string, value: Serializable, ttlSeconds?: number): Promise<void> {
    const expiresAt = typeof ttlSeconds === "number" && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null
    this.store.set(key, { value: JSON.stringify(value), expiresAt })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async getOrLoad<T = Serializable>(key: string, loader: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const raw = await this.get(key)
    if (raw !== null) {
      try {
        return JSON.parse(raw) as T
      } catch { }
    }
    const existing = this.inflight.get(key) as Promise<T> | undefined
    if (existing) return existing
    const p = (async () => {
      try {
        const data = await loader()
        await this.set(key, data, ttlSeconds)
        return data
      } finally {
        this.inflight.delete(key)
      }
    })()
    this.inflight.set(key, p)
    return p
  }
}

const cache = new LocalCache()
export { cache }
