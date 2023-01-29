<p align="center">
  <img height="50" alt="Take it ease logo" src="https://user-images.githubusercontent.com/28493823/215351667-485a9612-a102-4fa3-b3b2-4095f49fde83.png" />
</p>

<p align="center">
<a aria-label="NPM version" href="https://www.npmjs.com/package/take-it-ease">
<img alt="" height="28" src="https://img.shields.io/npm/v/take-it-ease.svg?style=for-the-badge">
</a>
<a aria-label="License" href="https://github.com/Aliath/take-it-ease/blob/main/LICENSE.md">
<img alt="" height="28" src="https://img.shields.io/npm/l/take-it-ease.svg?style=for-the-badge">
</a>
<a aria-label="Test coverage" href="https://github.com/Aliath/take-it-ease">
<img alt="" height="28" src="https://img.shields.io/coverallsCoverage/github/Aliath/take-it-ease?style=for-the-badge">
</a>
</p>

## Installation

```bash
# npm
npm install --save take-it-ease

# yarn
yarn add take-it-ease

# pnpm
pnpm add take-it-ease
```

---

## Motivation

This library was created to address the limitations of [tween.js](https://github.com/tweenjs/tween.js/), such as the silent merging of properties, lack of clear typing and mutating original values. This library offers better TypeScript compatibility, customizable merging strategies, and improved typing for a more intuitive and reliable animation experience.

---

## Usage

```tsx
import {
  createController,
  EasingFunctions,
  MergeStrategies,
} from "take-it-ease";

const controller = createController();

controller.animate({
  time: 300,
  from: { x: 20, y: -10 },
  to: { x: -10, y: 20 },
  include: ["x", "y"], // define animation target 🎯
  easingFunction: EasingFunctions.LINEAR, // not required, default one
  strategy: MergeStrategies.INSERT_WITH_FIRST_TICK, // not required, default one
  onUpdate: (result) => {
    // result: { x: number; y: number }
  },
});

// prefferable way to call tick, but you can use anything else 😎
requestAnimationFrame(controller.tick);
```

---

## Strategies

When using a library you can decide when to insert properties that haven't existed before.

- With `MergeStrategies.INSERT_WITH_FIRST_TICK` difference from target object will be added with the first tick
- With `MergeStrategies.INSERT_WITH_LAST_TICK` difference from target object will be added with the last tick
