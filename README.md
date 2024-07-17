# **Cona**

[![npm version](https://img.shields.io/npm/v/@pinjs/cona?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)
[![npm downloads](https://img.shields.io/npm/dm/@pinjs/cona?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)

**Web Component Nano Simple API inspired from Vue typescript friendly**

## **Table of Contents**

- [Why Cona?](#why-cona)
- [Features](#features)
- [Usage](#usage)
  - [Installation](#installation)
  - [Using CDN](#using-cdn)
- [Example](#example)
- [Development](#development)

## **Why Cona?**

- Writing a Web Component (WC) using vanilla JavaScript can be tedious. Alternatively, popular WC libraries can be overkill and overweight (4KB+) for creating small components like a `"Buy now" button` or a `cart listing`.
- `Cona` simplifies the process by staying lightweight, removing unnecessary APIs, and using a simple DOM diffing algorithm.

## **Features**
- No dependencies
- **1.3KB** gzipped.
- Simple API inspired by `Vue`.

## **Usage**

### **Installation**

```sh
# ✨ Auto-detect
npx nypm install @pinjs/cona

# npm
npm install @pinjs/cona

# yarn
yarn add @pinjs/cona

# pnpm
pnpm install @pinjs/cona

# bun
bun install @pinjs/cona
```

## Using CDN
First, add the script to the HTML file:
```<script src="https://unpkg.com/@pinjs/cona"></script>```
Then, add your component script:
```html
<script>
  let Cona = cona.Cona;
  class MyCounterChild extends Cona {}
</script>
```
```html
<script>
  let Cona = cona.Cona;
  class MyCounterChild extends Cona {}
</script>
```
## Example
```js
/* main.js */

/* Declare global style. Styles will be injected to all Cona Elements */
Cona.style = `
  .box {
    background: blue;
    color: yellow;
  }
`

class MyCounterChild extends Cona {
  render(h) {
    /* Bind value from props */
    return h`<div>Child: ${this.props.count}</div>`
  }
}

class MyCounter extends Cona {
  setup() {
    /* This method runs before mount */

    /* Create component state using "this.reactive", state must be an object */
    this.state = this.reactive({ count: 1 });

    /* Only use ref for storing DOM reference */
    this.pRef = this.ref();

    /* Effect */
    this.effect(
      // Effect value: fn -> value
      () => this.state.count,
      // Effect callback: fn(old value, new value)
      (oldValue, newValue) => {
        console.log(oldValue, newValue)
      }
    )

    /* Watch */
    this.watch(
      () => this.state.count,
      (newValue, oldValue) => {
        console.log(`Count changed from ${oldValue} to ${newValue}`);
      }
    );
  }

  onMounted() {
    /* This method runs after mount */
    console.log('Mounted');
  }

  onUpdated() {
    /* This method runs after each update. */
    console.log('Updated');

    /* P tag ref */
    console.log('P Ref', this.pRef?.current);
  }

  onUnmounted() {
    /* This method runs before unmount */
    console.log('Before unmount');
  }

  addCount() {
    /* Update state by redeclaring its key-value. Avoid updating the whole state. */
    this.state.count += 1;
  }

  render(h) {
    /* This method is used to render */

    /*
      JSX template alike
      - Must have only 1 root element
      - Bind state / event using value in literal string
      - Pass state to child element using props with 'p:' prefix
    */
    return h`
      <div class="box">
        <p ref=${this.pRef}>Name: ${this.state.count}</p>
        <button onclick=${this.addCount}>Add count</button>
        <my-counter-child p:count=${this.state.count + 5}></my-counter-child>
      </div>
    `
  }
}

customElements.define("my-counter", MyCounter);
customElements.define("my-counter-child", MyCounterChild);
```
```html
/* index.html */
<my-counter />
```
## Computed
```js
class CounterComponent extends Cona {
  private state: { count: number; doubleCount: () => number };

  constructor() {
    super();
    this.state = this.reactive({ count: 0 });
    this.state.doubleCount = this.computed(() => this.state.count * 2);
  }

  setup() {
    // Watching the state.count property
    this.watch(
      () => this.state.count,
      (newValue, oldValue) => {
        console.log(`Count changed from ${oldValue} to ${newValue}`);
      }
    );

    // Watching the computed doubleCount property
    this.watch(
      this.state.doubleCount,
      (newValue, oldValue) => {
        console.log(`DoubleCount changed from ${oldValue} to ${newValue}`);
      }
    );
  }

  render() {
    return this._render`
      <div>
        <button p:onclick=${this.increment}>Increment</button>
        <p>Count: ${this.state.count}</p>
        <p>Double Count: ${this.state.doubleCount()}</p>
      </div>
    `;
  }

  private increment() {
    this.state.count++;
  }
}

// Define the custom element
customElements.define('counter-component', CounterComponent);

```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/pin705/cf-scraper-bypass/blob/main/LICENSE) license.
Made by [community](https://github.com/pin705/cf-scraper-bypass/graphs/contributors) 💛
<br><br>
<a href="https://github.com/pin705/cf-scraper-bypass/graphs/contributors">
<img src="https://contrib.rocks/image?repo=pin705/cf-scraper-bypass" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->
