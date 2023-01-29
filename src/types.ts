export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type ControllerUpdateFunction = () => void;
export type ObjectToAnimate = { [key: string]: unknown };
export type EasingFunction = (x: number) => number;
export type TimestampGetter = () => number;

export type SharedProperties = {
  easingFunction?: EasingFunction;
};
