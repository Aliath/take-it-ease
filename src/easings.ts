export const EasingFunctions = {
  LINEAR: (t: number) => t,
  QUADRATIC_IN: (t: number) => t * t,
  QUADRATIC_OUT: (t: number) => t * (2 - t),
  QUADRATIC_IN_OUT: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  CUBIC_IN: (t: number) => t * t * t,
  CUBIC_OUT: (t: number) => --t * t * t + 1,
  CUBIC_IN_OUT: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  SINE_IN: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  SINE_OUT: (t: number) => Math.sin((t * Math.PI) / 2),
  SINE_IN_OUT: (t: number) => (1 - Math.cos(Math.PI * t)) / 2,
} as const;
