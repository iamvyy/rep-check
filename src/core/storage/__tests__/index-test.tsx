import { storage } from '@/core/storage/mmkv-storage';
import { z } from 'zod';

describe('StorageEngine', () => {
  const testKey = 'test-key';

  afterEach(() => {
    storage.clearAll();
    jest.clearAllMocks();
  });

  describe('set & getString', () => {
    it('should store and retrieve string', () => {
      storage.set(testKey, 'hello');

      const result = storage.getString(testKey);

      expect(result).toBe('hello');
    });

    it('should store object as JSON string', () => {
      const value = { name: 'john' };

      storage.set(testKey, value);

      const stored = storage.getString(testKey);

      expect(stored).toBe(JSON.stringify(value));
    });
  });

  describe('validatedObject', () => {
    const schema = z.object({
      name: z.string(),
    });

    it('should return validated object', () => {
      const data = { name: 'Alice' };

      storage.set(testKey, data);

      const result = storage.validatedObject(testKey, schema);

      expect(result).toEqual(data);
    });

    it('should return null if schema invalid', () => {
      const data = { age: 20 };

      storage.set(testKey, data);

      const result = storage.validatedObject(testKey, schema);

      expect(result).toBeNull();
    });

    it('should return null if invalid JSON', () => {
      storage.set(testKey, '{bad json');

      const result = storage.validatedObject(testKey, schema);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should remove stored key', () => {
      storage.set(testKey, 'value');

      storage.delete(testKey);

      const result = storage.getString(testKey);

      expect(result).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('should clear storage', () => {
      storage.set('a', '1');
      storage.set('b', '2');

      storage.clearAll();

      expect(storage.getString('a')).toBeUndefined();
      expect(storage.getString('b')).toBeUndefined();
    });
  });

  describe('zustandAdapter', () => {
    it('should work with zustand storage interface', () => {
      const adapter = storage.zustandAdapter;

      adapter.setItem('zustand-key', 'value');

      const result = adapter.getItem('zustand-key');

      expect(result).toBe('value');

      adapter.removeItem('zustand-key');

      const afterDelete = adapter.getItem('zustand-key');

      expect(afterDelete).toBeNull();
    });
  });
});
