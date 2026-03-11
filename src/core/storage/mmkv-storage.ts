import { createMMKV, MMKV } from 'react-native-mmkv';
import { z } from 'zod';
import { StateStorage } from 'zustand/middleware';

export const mmkv = createMMKV({
  id: 'app-storage',
});

class StorageEngine {
  private instance: MMKV;

  constructor(storageInstance: MMKV) {
    this.instance = storageInstance;
  }

  set(key: string, value: string | number | boolean | object): void {
    try {
      if (typeof value === 'object') {
        this.instance.set(key, JSON.stringify(value));
      } else {
        this.instance.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
    }
  }

  validatedObject<T>(key: string, schema: z.Schema<T>): T | null {
    const data = this.instance.getString(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      const result = schema.safeParse(parsed);

      if (!result.success) {
        return null;
      }
      return result.data;
    } catch {
      return null;
    }
  }

  getString(key: string): string | undefined {
    return this.instance.getString(key);
  }

  delete(key: string): void {
    this.instance.remove(key);
  }

  clearAll(): void {
    this.instance.clearAll();
  }

  get zustandAdapter(): StateStorage {
    return {
      setItem: (name, value) => this.set(name, value),
      getItem: (name) => this.getString(name) ?? null,
      removeItem: (name) => this.delete(name),
    };
  }
}

export const storage = new StorageEngine(mmkv);
