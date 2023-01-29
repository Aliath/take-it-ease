<p align="center">

  <img height="50" alt="Take it ease logo" src="https://user-images.githubusercontent.com/28493823/214970747-42e75b8e-f9c4-4efc-87c1-63f93a591b2a.png" />

</p>

---

### Installation

```bash
# npm
npm install --save take-it-ease

# yarn
yarn add take-it-ease

# pnpm
pnpm add take-it-ease
```

---

### Motivation

This library was created to address the limitations of [tween.js](https://github.com/tweenjs/tween.js/), such as the silent merging of properties, lack of clear typing and mutating original values. This library offers better TypeScript compatibility, customizable merging strategies, and improved typing for a more intuitive and reliable animation experience.

---

### Usage

```tsx
import { createController } from "take-it-ease";

const controller = createController();
controller.animate({
  time: 300,
  from: { x: 20, y: -10 },
  to: { x: -10, y: 20 },
  include: ["x", "y"] // strictly define animation target
  onUpdate: (result) => {
    // result is inferred, you don't have to type it!
  },
});
```

---

### Terminology

> What is controller?

Controler is an instance that allows you to group animated elements. You can set their detault values (such as `easingFunction`). A controller runs every animation within its tick, making it much easier to control.

> Can I animate an array

Not yet, it will come up with higher versions of library.
