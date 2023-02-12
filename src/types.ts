export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type ControllerUpdateFunction = () => void;
export type ObjectToAnimate = { [key: string]: unknown };
export type EasingFunction = (x: number) => number;
export type TimestampGetter = () => number;

export type SharedProperties = {
  easingFunction?: EasingFunction;
  mergeStrategy?: Strategy;
};

export const Strategies = {
  MERGE_WITH_FIRST_TICK: "MERGE_WITH_FIRST_TICK",
  MERGE_WITH_LAST_TICK: "MERGE_WITH_LAST_TICK",
} as const;
export type Strategy = (typeof Strategies)[keyof typeof Strategies];

export type AnimationParams<
  T extends ObjectToAnimate,
  D extends T
> = SharedProperties & {
  time: number;
  include: KeysOfType<D, number>[];
  onUpdate: (updatedValue: D) => void;
  onFinish?: () => void;
  from: T;
  to: D;
};

export type ArrayAnimationParams<T extends ObjectToAnimate, D extends T> = Omit<
  AnimationParams<T, D>,
  "from" | "to" | "include" | "onUpdate"
> & {
  from: T[];
  to: D[];
  include: (keyof D)[];
  onUpdate: (updatedValue: D[]) => void;
  keyExtractor: (item: T) => string | number;
  arrayMergeStrategy?: Strategy;
};

export type AnimationControllerProps = {
  getTimestamp: TimestampGetter;
  easingFunction: EasingFunction;
  mergeStrategy: Strategy;
  arrayMergeStrategy: Strategy;
  registerUpdateFunction: (update: ControllerUpdateFunction) => void;
  deregisterUpdateFunction: (update: ControllerUpdateFunction) => void;
};
