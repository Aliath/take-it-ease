<p align="center">
  <img height="50" alt="Take it ease logo" src="https://user-images.githubusercontent.com/28493823/215351667-485a9612-a102-4fa3-b3b2-4095f49fde83.png" />
</p>

<p align="center">
<a aria-label="License" href="https://github.com/Aliath/take-it-ease/blob/main/LICENSE.md">
<img alt="" height="28" src="https://img.shields.io/npm/l/take-it-ease.svg?style=for-the-badge">
</a>
<a aria-label="Test coverage" href="https://github.com/Aliath/take-it-ease">
<img alt="" height="28" src="https://img.shields.io/coverallsCoverage/github/Aliath/take-it-ease?style=for-the-badge">
</a>
<a aria-label="NPM version" href="https://www.npmjs.com/package/take-it-ease">
<img alt="" height="28" src="https://img.shields.io/npm/v/take-it-ease.svg?style=for-the-badge">
</a>
<a aria-label="Test coverage" href="https://github.com/Aliath/take-it-ease">
<img alt="" height="28" src="https://img.shields.io/bundlephobia/minzip/take-it-ease?style=for-the-badge">
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

## Motivation

This library was created to address the limitations of [tween.js](https://github.com/tweenjs/tween.js/), such as the silent merging of properties, lack of clear typing and mutating original values.

This library offers better TypeScript compatibility, customizable merging strategies, and improved typing for a more intuitive and reliable animation experience.

## Usage

### Simple example

```tsx
import { createController } from "take-it-ease";

const controller = createController();

controller.animate({
  time: 1_000,
  from: { x: 20, y: -10 },
  to: { x: -10, y: 20 },
  include: ["x", "y"], // animation target 🎯
  onUpdate: (updatedObject) => {
    // updatedObject: { x: number; y: number }
  },
});

// prefferable way to call tick, but you can use anything else 😎
const animate = () => {
  controller.tick();

  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
```

### More advanced example

```tsx
import { createController, EasingFunctions, Strategies } from "take-it-ease";

const controller = createController();

controller.animate({
  time: 1_000,
  from: { name: "Bob", salary: 21_000 },
  to: { name: "Bob", salary: 37_000, bonus: 500 },
  include: ["salary", "bonus"],
  mergeStrategy: Strategies.MERGE_WITH_LAST_TICK,
  easingFunction: EasingFunctions.CUBIC_OUT,
  onUpdate: (updatedObject) => {
    // updatedObject before last tick: { name: "Bob"; salary: number }
    // last tick: { name: "Bob"; salary: 37_000, bonus: 500 }
  },
});

someApi.on("idle", controller.tick);
```

### Animating arrays

```tsx
import { createController, EasingFunctions, Strategies } from "take-it-ease";

const controller = createController();

controller.animateArray({
  time: 1_000,
  from: [
    { name: "Bob", salary: 21_000 },
    { name: "Alice", salary: 0 },
  ],
  to: [
    { name: "Bob", salary: 37_000, bonus: 500 },
    { name: "Mark", salary: 42_000 },
  ],
  keyExtractor: (item) => item.name,
  include: ["salary", "bonus"],
  mergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
  arrayMergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
  easingFunction: EasingFunctions.CUBIC_OUT,
  onUpdate: (updatedArray) => {
    /*
      updatedObject before last tick:
      [
        { name: "Bob", salary: number },
        { name: "Alice", salary: 0 },
      ]
    */
    /*
      last tick:
      [
        { name: "Bob", salary: 37_000, bonus: 500 },
        { name: "Alice", salary: 0 },
        { name: "Mark", salary: 42_000 },
      ]
    */
  },
});
```

## Strategies

When using a library you can decide when to insert properties that haven't existed before.

`Strategies` is an object with following properties:

- `MERGE_WITH_FIRST_TICK` – applies non-existing properties from target with the first tick,
- `MERGE_WITH_LAST_TICK` – applies non-existing properties from target with the last tick

Strategies can be used to describe both:

- `mergeStrategy`,
- `arrayMergeStrategy`
