import deepCloneBuilder from "rfdc";
const deepClone = deepCloneBuilder();
import {
  ControllerUpdateFunction,
  EasingFunction,
  KeysOfType,
  ObjectToAnimate,
  SharedProperties,
  TimestampGetter,
} from "./types";

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

export function createAnimation<T extends ObjectToAnimate, D extends T>(
  controller: {
    getTimestamp: TimestampGetter;
    easingFunction: EasingFunction;
    registerUpdateFunction: (update: ControllerUpdateFunction) => void;
    deregisterUpdateFunction: (update: ControllerUpdateFunction) => void;
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
