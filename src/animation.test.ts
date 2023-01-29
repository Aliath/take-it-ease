import { AnimationParams, createAnimation } from "./animation";
import { ControllerUpdateFunction, ObjectToAnimate } from "./types";

const getMockedAnimation = <T extends ObjectToAnimate, D extends T>(
  props: AnimationParams<T, D>
) => {
  const registerUpdateFunction = vi.fn();
  const deregisterUpdateFunction = vi.fn();
  const easingFunction = vi.fn((value: number) => value);
  const getTimestamp = vi.fn(() => 0);

  createAnimation(
    {
      getTimestamp,
      easingFunction,
      registerUpdateFunction,
      deregisterUpdateFunction,
    },
    props
  );

  return {
    registerUpdateFunction,
    deregisterUpdateFunction,
    easingFunction,
    getTimestamp,
    updateFunction: registerUpdateFunction.mock
      .calls[0]![0] as ControllerUpdateFunction,
  };
};

describe("animation", () => {
  it("registers update function to controller", () => {
    const { registerUpdateFunction } = getMockedAnimation({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      include: ["x"],
    });

    expect(registerUpdateFunction).toBeCalled();
  });

  it("handles ticks properly", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedAnimation({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate,
      include: ["x"],
    });

    // "empty" update with no time ellapsed
    updateFunction();
    expect(onUpdate).toBeCalledWith({ x: 0 });

    // "meaningful" update
    getTimestamp.mockReturnValue(500);
    updateFunction();
    expect(onUpdate).toBeCalledWith({ x: 50 });
  });

  it("handles ticks properly for multiple fields", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedAnimation({
      from: { x: 0, y: 50 },
      to: { x: 100, y: 100 },
      time: 1000,
      onUpdate,
      include: ["x", "y"],
    });

    // "empty" update with no time ellapsed
    updateFunction();
    expect(onUpdate).toBeCalledWith({ x: 0, y: 50 });

    // "meaningful" update
    getTimestamp.mockReturnValue(500);
    updateFunction();
    expect(onUpdate).toBeCalledWith({ x: 50, y: 75 });
  });

  it("respects `includes` property", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedAnimation({
      from: { x: 0, y: 50 },
      to: { x: 100, y: 100 },
      time: 1000,
      onUpdate,
      include: ["x"],
    });

    // "meaningful" update
    getTimestamp.mockReturnValue(1000);
    updateFunction();

    expect(onUpdate).toBeCalledWith({
      x: 100,
      y: 50,
    });
  });

  it("handles onFinish properly", () => {
    const onFinish = vi.fn();

    const { updateFunction, getTimestamp } = getMockedAnimation({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      onFinish,
      include: ["x"],
    });

    // "empty" update with no time ellapsed
    updateFunction();
    expect(onFinish).not.toBeCalled();

    // "meaningful" update
    getTimestamp.mockReturnValue(1000);
    updateFunction();
    expect(onFinish).toBeCalled();
  });

  it("applies easingFunction", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedAnimation({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate,
      easingFunction: () => 1,
      include: ["x"],
    });

    // "empty" update with no time ellapsed
    updateFunction();
    getTimestamp.mockReturnValue(0);
    expect(onUpdate).toBeCalledWith({ x: 100 });
  });

  it("deregisters animation when finished", () => {
    const { deregisterUpdateFunction, getTimestamp, updateFunction } =
      getMockedAnimation({
        from: { x: 0 },
        to: { x: 100 },
        time: 1000,
        onUpdate: () => {},
        include: ["x"],
      });

    // run tick to make sure animation finishes
    getTimestamp.mockReturnValueOnce(1000);
    updateFunction();
    expect(deregisterUpdateFunction).toBeCalledWith(updateFunction);
  });
});
