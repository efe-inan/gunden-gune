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

/**
 * Lightweight interactive container for controller render + event tests without external DOM libs.
 */
export function createContainer() {
  let html = '';
  let elements = [];

  function parseElements(markup) {
    const parsed = [];
    const tagRe = /<(button|textarea|input|a)\b([^>]*)>([\s\S]*?)<\/\1>|<(input)\b([^>]*?)\s*\/?>/gi;
    let m;
    while ((m = tagRe.exec(markup)) !== null) {
      const tagName = (m[1] || m[4]).toUpperCase();
      const attrStr = m[2] ?? m[5] ?? '';
      const inner = m[3] ?? '';
      const attrs = new Map();
      const attrRe = /([a-zA-Z0-9_-]+)(?:="([^"]*)")?/g;
      let am;
      while ((am = attrRe.exec(attrStr)) !== null) {
        attrs.set(am[1], am[2] ?? '');
      }
      const handlers = new Map();
      const classSet = new Set((attrs.get('class') || '').split(/\s+/).filter(Boolean));
      const el = {
        tagName,
        id: attrs.get('id') || '',
        value: tagName === 'TEXTAREA' ? inner : (attrs.get('value') || ''),
        textContent: inner.replace(/<[^>]+>/g, '').trim(),
        innerHTML: inner,
        dataset: {},
        classList: {
          add(c) { classSet.add(c); },
          remove(c) { classSet.delete(c); },
          contains(c) { return classSet.has(c); },
        },
        hasAttribute(name) {
          return attrs.has(name);
        },
        getAttribute(name) {
          return attrs.has(name) ? attrs.get(name) : null;
        },
        setAttribute(name, val) {
          attrs.set(name, String(val));
        },
        removeAttribute(name) {
          attrs.delete(name);
        },
        addEventListener(type, fn) {
          if (!handlers.has(type)) handlers.set(type, []);
          handlers.get(type).push(fn);
        },
        click() {
          for (const fn of handlers.get('click') || []) {
            fn({ target: el, preventDefault() {} });
          }
        },
        closest() {
          return null;
        },
      };
      for (const [k, v] of attrs.entries()) {
        if (k.startsWith('data-')) {
          const camel = k.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
          el.dataset[camel] = v;
        }
      }
      parsed.push(el);
    }
    return parsed;
  }

  function matches(el, selector) {
    if (selector.startsWith('#')) {
      return el.id === selector.slice(1);
    }
    if (selector.startsWith('.')) {
      return el.classList.contains(selector.slice(1));
    }
    const attrMatch = selector.match(/^\[([a-zA-Z0-9_-]+)(?:="([^"]*)")?\]$/);
    if (attrMatch) {
      const val = el.getAttribute(attrMatch[1]);
      return attrMatch[2] !== undefined ? val === attrMatch[2] : val !== null;
    }
    return el.tagName.toLowerCase() === selector.toLowerCase();
  }

  return {
    get innerHTML() {
      return html;
    },
    set innerHTML(val) {
      html = String(val);
      elements = parseElements(html);
    },
    querySelector(selector) {
      return elements.find(el => matches(el, selector)) || null;
    },
    querySelectorAll(selector) {
      return elements.filter(el => matches(el, selector));
    },
  };
}
