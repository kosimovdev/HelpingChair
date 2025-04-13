const isBrowser = typeof window !== 'undefined';

const storage = {
  get: (key: string) => {
    if (isBrowser) {
      return localStorage.getItem(key) || null;
    }
    return null;
  },
  set: (key: string, value: string): void => {
    if (isBrowser && value && value.length > 0) {
      localStorage.setItem(key, value);
    }
  },
  remove: (key: string): void => {
    if (isBrowser && localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  },
};

export default storage;
