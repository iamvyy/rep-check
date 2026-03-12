export const createMMKV = () => {
  const storage = new Map<string, any>();

  return {
    set: jest.fn((key: string, value: any) => {
      storage.set(key, value);
    }),

    getString: jest.fn((key: string) => {
      const value = storage.get(key);
      return typeof value === 'string' ? value : undefined;
    }),

    getNumber: jest.fn((key: string) => {
      const value = storage.get(key);
      return typeof value === 'number' ? value : undefined;
    }),

    getBoolean: jest.fn((key: string) => {
      const value = storage.get(key);
      return typeof value === 'boolean' ? value : undefined;
    }),

    remove: jest.fn((key: string) => {
      storage.delete(key);
    }),

    clearAll: jest.fn(() => {
      storage.clear();
    }),
  };
};
