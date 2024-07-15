### Why Cona?

- Writing a Web Component (WC) using vanilla JavaScript can be such tedious. Alternatively, popular WC libraries can be overkill and overweighted (4KB+) for creating small components like a `"Buy now" button` or a `cart listing`.

- `Cona` simplifies the process by staying lightweight, removing unnecessary APIs, and using a simple DOM diffing algorithm.

### Features

- `1.3KB` gzipped.
- Simple API inspired from `Vue`.

# Cona

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://www.npmjs.com/package/@pinjs/cona)

<!-- /automd -->

Web Component Nano Simple API inspired from Vue

## Usage

Install package:

<!-- automd:pm-install -->

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


```js
import { Cona } from '@pinjs/cona';
class MyCounterChild extends Cona {}
```


#### using `CDN`
First, add `script` to the `html` file
```html
<script src="https://unpkg.com/cona"></script>
```

then, add `script` to the `html` file

```html
<script>
  let Cona = cona.Cona;
  class MyCounterChild extends Cona {}
</script>
```

### Usage

```js
/* main.js */

/* declare global style. Styles will be injected to all Cona Elements */
Cona.style = `
  .box {
    background: blue;
    color: yellow;
  }
`

class MyCounterChild extends Cona {
  render(h) {
    /* bind value from props */
    return h`<div>Child: ${this.props.count}</div>`
  }
}

class MyCounter extends Cona {
  setup() {
    /* this method runs before mount */

    /* create component state using "this.reactive", state must be an object */
    this.state = this.reactive({ count: 1 });

    /* only use ref for storing DOM reference */
    this.pRef = this.ref();

    /* effect */
    this.effect(
      // effect value: fn -> value
      () => this.state.count,
      // effect callback: fn(old value, new value)
      (oldValue, newValue) => {
        console.log(oldValue, newValue)
      }
    )
  }

  onMounted() {
    /* this method runs after mount */
    console.log('Mounted');
  }

  onUpdated() {
    /* this method runs after each update. */
    console.log('Updated');

    /* P tag ref */
    console.log('P Ref', this.pRef?.current);
  }

  onUnmounted() {
    /* this method runs before unmount */
    console.log('Before unmount');
  }

  addCount() {
    /* update state by redeclaring its key-value. Avoid updating the whole state. */
    this.state.count += 1;
  }

  render(h) {
    /* this method is used to render */

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

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.
Made by [community](https://github.com/unjs/packageName/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/packageName/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/packageName" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
