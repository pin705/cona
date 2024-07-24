type EffectCallback = (oldValue: any, newValue: any) => void;
type EffectFunction = () => any;
type RefObject<T> = { current: T };

interface Props {
  [key: string]: any;
}

interface State {
  [key: string]: any;
}

interface Computed<T> {
  get: () => T;
}

let conaKey = 0;

export class Cona extends HTMLElement {
  private _op: Props;
  private props: Props;
  private _ef: Map<EffectFunction, EffectCallback>;
  private _ev: Map<EffectFunction, any>;
  private _sr?: ShadowRoot | null = undefined;
  private _t?: number | null = undefined;

  /* LifecycleMethods */
  public setup?(): void;
  public render?(
    _render: (
      stringArray: TemplateStringsArray,
      ...valueArray: any[]
    ) => string,
  ): string;
  public onUpdated?(): void;
  public onMounted?(): void;
  public onUnmounted?(): void;

  static style = "";
  static _c: { [key: string]: any } = {};

  constructor() {
    super();
    /* Default props */
    this._op = {};

    /* Current props */
    this.props = {};

    /*
      key: effect function, value: effect callback
      e.g: () => this.state.count : (oldValue, newValue) => console.log(oldValue, newValue)
    */
    this._ef = new Map();

    /*
      key: effect function, value: effect function value
      e.g: () => this.state.count : 100
    */
    this._ev = new Map();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._sr = this.shadowRoot;

    this._getAttributes((this._sr?.host.attributes as NamedNodeMap) || []);
    this.setup?.();
    this._update();
    this.onMounted?.();
  }

  disconnectedCallback() {
    this.onUnmounted?.();
  }

  /**
   * Updates the component by performing a diffing algorithm on the rendered HTML.
   *
   * @param shouldShallowCompareProps - Optional parameter indicating whether to perform a shallow comparison of props before updating.
   * @returns void
   */
  private _update(shouldShallowCompareProps = false) {
    if (shouldShallowCompareProps && this._shadowCompareObject(this._op, this.props)) return;
    const renderString = this.render?.(this._render.bind(this));
    const { body } = new DOMParser().parseFromString(
      renderString || "",
      "text/html",
    );
    const styleElement = document.createElement("style");
    styleElement.innerHTML = Cona.style;
    this._pathDomDiffing(this._sr!, body, styleElement);
    this._event();
    this.onUpdated?.();

    for (const [valueFn, callback] of this._ef.entries()) {
      const valueBeforeUpdate = this._ev.get(valueFn);
      const valueAfterUpdate = valueFn.bind(this)();
      if (valueBeforeUpdate !== valueAfterUpdate) {
        callback.bind(this)(valueBeforeUpdate, valueAfterUpdate);
      }

      this._ev.set(valueFn, valueAfterUpdate);
    }
  }

  /**
   * Performs a diffing operation between two DOM nodes and updates the current node accordingly.
   * @param current - The current DOM node.
   * @param next - The next DOM node.
   * @param styleNode - Optional style node to be inserted at the beginning of the next node's child nodes.
   */
  private _pathDomDiffing(current: Node, next: Node, styleNode?: Node) {
    const cNodes = this._nodeMap(current.childNodes);
    const nNodes = this._nodeMap(next.childNodes);
    if (styleNode) nNodes.unshift(styleNode);
    let gap = cNodes.length - nNodes.length;
    if (gap > 0) for (; gap > 0; gap--) current.lastChild!.remove();
    for (const [i] of nNodes.entries()) {
      const c = cNodes[i];
      const n = nNodes[i];
      const clonedNewNode = n.cloneNode(true);
      const replace = () => c.parentNode!.replaceChild(clonedNewNode, c);
      if (!c) (current as Element).append(clonedNewNode);
      else if (c.nodeName !== n.nodeName) replace();
      else if (n.childNodes.length > 0) this._pathDomDiffing(c, n);
      else if ((c as any)._render) {
        (c as any)._getAttributes(n?.attributes);
        (c as any)._update(true);
      } else if (c.textContent !== n.textContent) replace();

      if (c?.attributes) {
        while (c.attributes.length > 0) c.removeAttribute(c.attributes[0].name);

        for (const { name, value } of this._nodeMap(n?.attributes)) {
          c.setAttribute(name, value);
        }
      }
    }
  }

  private _shadowCompareObject<T extends Record<string, any>, U extends Record<string, any>>(obj1: T, obj2: U): boolean {
    return Object.keys(obj1).every((key) => key in obj2 && obj1[key] === obj2[key]);
  }

  /**
   * Renders a template string by replacing placeholders with corresponding values.
   * @param stringArray - The template string array.
   * @param valueArray - The values to be inserted into the template string.
   * @returns The rendered template string.
   */
  private _render(stringArray: TemplateStringsArray, ...valueArray: any[]) {
    return stringArray
      .map((s, index) => {
        const currentValue = valueArray[index] || "";
        let valueString = currentValue;

        if (s.endsWith("=")) {
          if (/(p:|on|ref).*$/.test(s)) {
            valueString = conaKey++;
            Cona._c[valueString] =
              typeof currentValue === "function"
                ? currentValue.bind(this)
                : currentValue;
          } else valueString = JSON.stringify(currentValue);
        } else if (Array.isArray(currentValue)) {
          valueString = currentValue.join("");
        }

        return s + valueString;
      })
      .join("");
  }

  /**
   * Handles event binding and sets the ref property for Cona component.
   * @private
   */
  private _event() {
    if (!this._sr) return;
    for (const node of this._sr.querySelectorAll("*")) {
      for (const { name, value } of this._nodeMap(node.attributes)) {
        if (name.startsWith("on")) {
          (node as any)[name] = (e: Event) => Cona._c[value].call(this, e);
        }

        if (name === "ref") Cona._c[value].current = node;
      }
    }
  }

  /**
   * Sets the effect function and callback for a given value function.
   * The effect function is called immediately and whenever the value function changes.
   *
   * @param valueFn - The value function to track for changes.
   * @param callback - The callback function to execute when the value function changes.
   */
  effect(valueFn: EffectFunction, callback: EffectCallback) {
    this._ef.set(valueFn, callback);
    this._ev.set(valueFn, valueFn.bind(this)());
  }

  /**
   * Creates a new reference object with the specified initial value.
   * @param initialValue - The initial value for the reference object.
   * @returns A reference object with the specified initial value.
   * @template T - The type of the initial value.
   */
  ref<T>(initialValue: T): RefObject<T> {
    return { current: initialValue };
  }

  /**
   * Creates a reactive proxy for the given state object.
   * @param state - The state object to make reactive.
   * @returns A reactive proxy object.
   */
  reactive<T extends State>(state: T): T {
    return new Proxy(state, {
      set: (target, key: string | symbol, value: any) => {
        if (!(key in target) || target[key as keyof T] !== value) {
          target[key as keyof T] = value;
          if (this._t) cancelAnimationFrame(this._t);
          this._t = requestAnimationFrame(() => this._update());
        }

        return true;
      },
      get: (target, key: string | symbol) => {
        return target[key as keyof T];
      },
    });
  }

  /**
   * Watches for changes in the value returned by the getter function and invokes the callback function when a change occurs.
   * @param getter - A function that returns the value to watch for changes.
   * @param callback - A function that will be called when a change occurs, with the new value and the old value as arguments.
   * @typeparam T - The type of the value returned by the getter function.
   */
  watch<T>(getter: () => T, callback: (newValue: T, oldValue: T) => void) {
    this.effect(getter, (oldValue, newValue) => {
      callback(newValue, oldValue);
    });
  }

  computed<T>(getter: () => T): () => T {
    let cachedValue: T = getter();
    this.effect(getter, (_, newValue) => {
      cachedValue = newValue;
    });
    return () => cachedValue;
  }

  /**
   * Converts a NamedNodeMap or NodeListOf<ChildNode> to an array.
   *
   * @param attributes - The NamedNodeMap or NodeListOf<ChildNode> to convert.
   * @returns An array containing the converted elements.
   */
  private _nodeMap(
    attributes: NamedNodeMap | NodeListOf<ChildNode>,
  ): Array<any> {
    return [...(attributes as any)];
  }

  private _getAttributes(attributes: NamedNodeMap) {
    this._op = this.props;

    const createAttributeObject = (
      acc: Props,
      { nodeName, nodeValue }: { nodeName: string; nodeValue: any },
    ) => ({
      ...acc,
      [nodeName.startsWith("p:") ? nodeName.slice(2) : nodeName]:
        Cona._c[nodeValue],
    });

    // eslint-disable-next-line unicorn/no-array-reduce
    this.props = this._nodeMap(attributes).reduce(
      (accumulator, element) => createAttributeObject(accumulator, element),
      {},
    );
  }
}
