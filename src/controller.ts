import { createAnimation } from "./animate";
import { createArrayAnimation } from "./animate-array";
import { EasingFunctions } from "./easings";
import {
  AnimationParams,
  ArrayAnimationParams,
  ControllerUpdateFunction,
  ObjectToAnimate,
  SharedProperties,
  Strategies,
  Strategy,
  TimestampGetter,
} from "./types";

export type ControllerParams = SharedProperties & {
  getTimestamp?: TimestampGetter;
  arrayMergeStrategy?: Strategy;
};

export function createController({
  easingFunction = EasingFunctions.LINEAR,
  getTimestamp = performance.now,
  mergeStrategy = Strategies.MERGE_WITH_FIRST_TICK,
  arrayMergeStrategy = Strategies.MERGE_WITH_FIRST_TICK,
}: ControllerParams = {}) {
  const activeAnimations = new Set<ControllerUpdateFunction>();

  const registerUpdateFunction = (updateFunction: ControllerUpdateFunction) => {
    activeAnimations.add(updateFunction);
  };

  const deregisterUpdateFunction = (
    updateFunction: ControllerUpdateFunction
  ) => {
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
        mergeStrategy,
        arrayMergeStrategy,
        registerUpdateFunction,
        deregisterUpdateFunction,
      },
      props
    );
  };

  const animateArray = <T extends ObjectToAnimate, D extends T>(
    props: ArrayAnimationParams<T, D>
  ) => {
    return createArrayAnimation<T, D>(
      {
        easingFunction,
        getTimestamp,
        mergeStrategy,
        arrayMergeStrategy,
        registerUpdateFunction,
        deregisterUpdateFunction,
      },
      props
    );
  };

  return {
    tick,
    animate,
    animateArray,
  } as const;
}
