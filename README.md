# **Cona**

[![npm version](https://img.shields.io/npm/v/@pinjs/cona?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)
[![npm downloads](https://img.shields.io/npm/dm/@pinjs/cona?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)

**Web Component Nano - Simple API inspired by Vue**

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
```
<script>
  let Cona = cona.Cona;
  class MyCounterChild extends Cona {}
</script>
```
```
<script>
  let Cona = cona.Cona;
  class MyCounterChild extends Cona {}
</script>
```
## Example
```
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
```
/* index.html */
<my-counter />
```
## Development
<details>
<summary>Local Development</summary>
Clone this repository <br />
Install the latest LTS version of Node.js<br />
Enable Corepack using corepack enable<br />
Install dependencies using pnpm install<br />
Run interactive tests using pnpm dev
</details>
