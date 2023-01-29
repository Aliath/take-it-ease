<p align="center">
  <img height="50" alt="Take it ease logo" src="https://user-images.githubusercontent.com/28493823/215351667-485a9612-a102-4fa3-b3b2-4095f49fde83.png" />
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/next">
    <img alt="" src="https://img.shields.io/npm/v/take-it-ease.svg?style=for-the-badge">
  </a>
  <a aria-label="License" href="https://github.com/Aliath/take-it-ease">
    <img alt="" src="https://img.shields.io/npm/l/take-it-ease.svg?style=for-the-badge">
  </a>
  <a aria-label="Test coverage" href="https://github.com/Aliath/take-it-ease">
    <img alt="" src="https://img.shields.io/coverallsCoverage/github/Aliath/take-it-ease?style=for-the-badge">
  </a>
</p>

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

const { animate, tick } = createController();

animate({
  time: 300,
  from: { x: 20, y: -10 },
  to: { x: -10, y: 20 },
  include: ["x", "y"], // strictly define animation target
  onUpdate: (result) => {
    // result is inferred, you don't have to type it!
  },
});

requestAnimationFrame(tick);
```
