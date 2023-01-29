import { type AnimationParams, createAnimation } from "./animation";
import { EasingFunctions } from "./easings";
import {
  ControllerUpdateFunction,
  ObjectToAnimate,
  SharedProperties,
  TimestampGetter,
} from "./types";

export type ControllerParams = SharedProperties & {
  getTimestamp?: TimestampGetter;
};

export function createController({
  easingFunction = EasingFunctions.LINEAR,
  getTimestamp = performance.now,
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
        registerUpdateFunction,
        deregisterUpdateFunction,
      },
      props
    );
  };

  return {
    tick,
    animate,
  } as const;
}
