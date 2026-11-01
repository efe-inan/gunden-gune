/**
 * Minimal browser environment shim for Node 24 native test runner.
 */
export function installBrowserMock({ url = 'http://localhost:5173/#landing', prefersDark = false } = {}) {
  const store = new Map();

  const localStorageMock = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };

  const listeners = new Map();
  const parsedUrl = new URL(url);

  const documentElement = {
    attributes: new Map(),
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); },
    },
    setAttribute(name, val) {
      this.attributes.set(name, String(val));
    },
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    },
  };

  const documentMock = {
    documentElement,
    body: {
      appendChild() {},
      removeChild() {},
    },
    getElementById() {
      return null;
    },
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        textContent: '',
        attributes: new Map(),
        setAttribute(k, v) { this.attributes.set(k, String(v)); },
        getAttribute(k) { return this.attributes.get(k) ?? null; },
        click() {},
      };
    },
    addEventListener(type, fn) {
      if (!listeners.has(`doc:${type}`)) listeners.set(`doc:${type}`, new Set());
      listeners.get(`doc:${type}`).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(`doc:${type}`)?.delete(fn);
    },
  };

  const windowMock = {
    location: {
      href: parsedUrl.href,
      hash: parsedUrl.hash,
      search: parsedUrl.search,
      reload() {},
    },
    pageYOffset: 0,
    scrollTo() {},
    matchMedia() {
      return {
        matches: prefersDark,
        addEventListener() {},
        removeEventListener() {},
      };
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(evt) {
      const set = listeners.get(evt.type);
      if (set) {
        for (const fn of [...set]) fn(evt);
      }
      return true;
    },
    __listenerCount(type) {
      return listeners.get(type)?.size ?? 0;
    },
  };

  class CustomEventMock {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail ?? null;
    }
  }

  globalThis.localStorage = localStorageMock;
  globalThis.document = documentMock;
  globalThis.window = windowMock;
  globalThis.CustomEvent = CustomEventMock;

  return { localStorage: localStorageMock, window: windowMock, document: documentMock };
}
