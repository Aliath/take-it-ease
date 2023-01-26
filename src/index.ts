import deepCloneBuilder from "rfdc";
const deepClone = deepCloneBuilder();

type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
type EasingFunction = (x: number) => number;
type UpdateFunction = () => void;
type ObjectToAnimate = { [key: string]: unknown };

export const EasingFunctions = {
  LINEAR: (x: number) => x,
} as const;

type SharedProperties = {
  easingFunction?: EasingFunction;
};

type AnimationParams<
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

function createAnimation<T extends ObjectToAnimate, D extends T>(
  controller: {
    getTimestamp: ReturnType<typeof createController>["getTimestamp"];
    easingFunction: ReturnType<typeof createController>["easingFunction"];
    registerUpdateFunction: (update: UpdateFunction) => void;
    deregisterUpdateFunction: (update: UpdateFunction) => void;
  },
  {
    from,
    to,
    easingFunction = controller.easingFunction,
    include,
    time,
    onUpdate,
    onFinish,
  }: AnimationParams<T, D>
) {
  const startTickTimestamp = controller.getTimestamp();
  const animationTarget = deepClone(from) as typeof to;

  const update = () => {
    const currentTarget = deepClone(animationTarget);
    const tickTimestamp = controller.getTimestamp();
    const timeDelta = tickTimestamp - startTickTimestamp;

    const ellapsedTimeFraction = easingFunction(
      Math.min(1, Math.max(0, timeDelta / time))
    );

    include.forEach((key) => {
      const typedFrom = from as T;
      const typedTo = to as D;
      const typedCurrentTarget = currentTarget as D;

      const previousValue = (
        key in typedFrom ? typedFrom[key as keyof T] : typedTo[key]
      ) as number;
      const targetValue = typedTo[key] as number;

      const valueDelta = targetValue - previousValue;
      const easedDelta = valueDelta * ellapsedTimeFraction;

      typedCurrentTarget[key] = (previousValue + easedDelta) as D[typeof key];
    });

    onUpdate(currentTarget as Parameters<typeof onUpdate>[0]);

    if (ellapsedTimeFraction === 1) {
      if (onFinish) {
        onFinish();
      }

      controller.deregisterUpdateFunction(update);
    }
  };

  controller.registerUpdateFunction(update);
}

type ControllerParams = SharedProperties & {
  getTimestamp?: () => number;
};

export function createController({
  easingFunction = EasingFunctions.LINEAR,
  getTimestamp = performance.now,
}: ControllerParams = {}) {
  const activeAnimations = new Set<UpdateFunction>();

  const registerUpdateFunction = (updateFunction: UpdateFunction) => {
    activeAnimations.add(updateFunction);
  };

  const deregisterUpdateFunction = (updateFunction: UpdateFunction) => {
    activeAnimations.delete(updateFunction);
  };

  const tick = () => {
    activeAnimations.forEach((updateFunction) => {
      updateFunction();
    });
  };

  const animate = <T extends ObjectToAnimate, D extends T>(
    props: AnimationParams<T, D>
  ) => {
    return createAnimation<T, D>(
      {
        easingFunction,
        getTimestamp,
        registerUpdateFunction,
        deregisterUpdateFunction,
      },
      props
    );
  };

  return {
    tick,
    getTimestamp,
    easingFunction,
    animate,
  } as const;
}
