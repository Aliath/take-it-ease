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

export const MergeStrategies = {
  INSERT_WITH_FIRST_TICK: "INSERT_WITH_FIRST_TICK",
  INSERT_WITH_LAST_TICK: "INSERT_WITH_LAST_TICK",
} as const;

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
  strategy?: (typeof MergeStrategies)[keyof typeof MergeStrategies];
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
    strategy = MergeStrategies.INSERT_WITH_FIRST_TICK,
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
    const animationFinished = ellapsedTimeFraction === 1;

    include.forEach((key) => {
      const typedFrom = from as T;
      const typedTo = to as D;
      const typedCurrentTarget = currentTarget as D;
      const alreadyExist = key in typedFrom;

      if (!alreadyExist) {
        if (
          strategy === MergeStrategies.INSERT_WITH_LAST_TICK &&
          !animationFinished
        ) {
          return;
        }
      }

      const previousValue = (
        alreadyExist ? typedFrom[key as keyof T] : typedTo[key]
      ) as number;
      const targetValue = typedTo[key] as number;

      const valueDelta = targetValue - previousValue;
      const easedDelta = valueDelta * ellapsedTimeFraction;

      typedCurrentTarget[key] = (previousValue + easedDelta) as D[typeof key];
    });

    onUpdate(currentTarget as Parameters<typeof onUpdate>[0]);

    if (animationFinished) {
      if (onFinish) {
        onFinish();
      }

      controller.deregisterUpdateFunction(update);
    }
  };

  controller.registerUpdateFunction(update);
}
