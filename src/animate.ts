import deepCloneBuilder from "rfdc";
const deepClone = deepCloneBuilder();
import {
  AnimationParams,
  Strategies,
  ObjectToAnimate,
  AnimationControllerProps,
} from "./types";

export function createAnimation<T extends ObjectToAnimate, D extends T>(
  controller: AnimationControllerProps,
  {
    from,
    to,
    easingFunction = controller.easingFunction,
    include,
    time,
    onUpdate,
    onFinish,
    mergeStrategy = controller.mergeStrategy,
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
      const typedFrom = from;
      const typedTo = to;
      const typedCurrentTarget = currentTarget;
      const alreadyExist = key in typedFrom;

      if (!alreadyExist) {
        if (
          mergeStrategy === Strategies.MERGE_WITH_LAST_TICK &&
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
