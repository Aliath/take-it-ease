import { createArrayAnimation } from "./animate-array";
import {
  ArrayAnimationParams,
  ControllerUpdateFunction,
  ObjectToAnimate,
  Strategies,
} from "./types";

const getMockedArrayAnimation = <T extends ObjectToAnimate, D extends T>(
  props: ArrayAnimationParams<T, D>
) => {
  const registerUpdateFunction = vi.fn();
  const deregisterUpdateFunction = vi.fn();
  const easingFunction = vi.fn((value: number) => value);
  const getTimestamp = vi.fn(() => 0);

  createArrayAnimation(
    {
      getTimestamp,
      easingFunction,
      registerUpdateFunction,
      deregisterUpdateFunction,
      arrayMergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
      mergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
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

describe("array animation", () => {
  it("registers update function to controller", () => {
    const { registerUpdateFunction } = getMockedArrayAnimation({
      from: [
        { x: 0, identifier: "A" },
        { x: 50, identifier: "B" },
      ],
      to: [
        { x: 150, identifier: "B" },
        { x: 100, identifier: "A" },
      ],
      time: 1000,
      onUpdate: () => {},
      keyExtractor: (item) => item.identifier,
      include: ["x"],
    });

    expect(registerUpdateFunction).toBeCalled();
  });

  it("handles ticks properly", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedArrayAnimation({
      from: [
        { x: 0, identifier: "A" },
        { x: 50, identifier: "B" },
      ],
      to: [
        { x: 150, identifier: "B" },
        { x: 100, identifier: "A" },
      ],
      time: 1000,
      onUpdate: onUpdate,
      keyExtractor: (item) => item.identifier,
      include: ["x"],
    });

    updateFunction();
    expect(onUpdate).toBeCalledWith([
      { x: 0, identifier: "A" },
      { x: 50, identifier: "B" },
    ]);

    getTimestamp.mockReturnValue(500);
    updateFunction();
    expect(onUpdate).toBeCalledWith([
      { x: 50, identifier: "A" },
      { x: 100, identifier: "B" },
    ]);
  });

  it("respects `includes` property", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedArrayAnimation({
      from: [{ x: 50, identifier: "A" }],
      to: [{ x: 100, y: 100, identifier: "A" }],
      time: 1000,
      onUpdate,
      keyExtractor: (item) => item.identifier,
      arrayMergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
      include: ["x"],
    });

    updateFunction();
    expect(onUpdate).toBeCalledWith([{ x: 50, identifier: "A" }]);

    getTimestamp.mockReturnValue(500);
    updateFunction();
    expect(onUpdate).toBeCalledWith([{ x: 75, identifier: "A" }]);

    getTimestamp.mockReturnValue(1000);
    updateFunction();
    expect(onUpdate).toBeCalledWith([{ x: 100, identifier: "A" }]);
  });

  it("respects `arrayMergeStrategy={MERGE_WITH_FIRST_TICK}` property", () => {
    const onUpdate = vi.fn();

    const { updateFunction } = getMockedArrayAnimation({
      from: [
        { x: 50, identifier: "A" },
        { x: 50, identifier: "B" },
      ],
      to: [
        { x: 100, y: 10, identifier: "A" },
        { x: 100, y: 20, identifier: "B" },
        { x: 100, y: 20, identifier: "C" },
      ],
      time: 1000,
      onUpdate,
      keyExtractor: (item) => item.identifier,
      arrayMergeStrategy: Strategies.MERGE_WITH_FIRST_TICK,
      include: ["x"],
    });

    updateFunction();

    expect(onUpdate).toBeCalledWith([
      { x: 50, identifier: "A" },
      { x: 50, identifier: "B" },
      { x: 100, y: 20, identifier: "C" },
    ]);
  });

  it("respects `arrayMergeStrategy={MERGE_WITH_LAST_TICK}` property", () => {
    const onUpdate = vi.fn();

    const { updateFunction, getTimestamp } = getMockedArrayAnimation({
      from: [
        { x: 50, identifier: "A" },
        { x: 50, identifier: "B" },
      ],
      to: [
        { x: 100, identifier: "A" },
        { x: 100, identifier: "B" },
        { x: 21, y: 37, identifier: "C" },
      ],
      time: 1000,
      onUpdate,
      keyExtractor: (item) => item.identifier,
      include: ["x"],
      arrayMergeStrategy: Strategies.MERGE_WITH_LAST_TICK,
    });

    updateFunction();

    expect(onUpdate).toBeCalledWith([
      { x: 50, identifier: "A" },
      { x: 50, identifier: "B" },
    ]);

    getTimestamp.mockReturnValue(500);
    updateFunction();

    expect(onUpdate).toBeCalledWith([
      { x: 75, identifier: "A" },
      { x: 75, identifier: "B" },
    ]);

    getTimestamp.mockReturnValue(1000);
    updateFunction();

    expect(onUpdate).toBeCalledWith([
      { x: 100, identifier: "A" },
      { x: 100, identifier: "B" },
      { x: 21, y: 37, identifier: "C" },
    ]);
  });

  it("calls finish when items are updated", () => {
    const onFinish = vi.fn();

    const { updateFunction, getTimestamp } = getMockedArrayAnimation({
      from: [{ x: 50, identifier: "A" }],
      to: [
        { x: 100, identifier: "A" },
        { x: 21, y: 37, identifier: "C" },
      ],
      time: 1000,
      onUpdate: () => {},
      keyExtractor: (item) => item.identifier,
      include: ["x"],
      arrayMergeStrategy: Strategies.MERGE_WITH_LAST_TICK,
      onFinish,
    });

    getTimestamp.mockReturnValue(999);
    updateFunction();
    expect(onFinish).not.toBeCalled();

    getTimestamp.mockReturnValue(1000);
    updateFunction();

    expect(onFinish).toBeCalledTimes(1);
  });

  it("works with empty arrays", () => {
    expect(() => {
      getMockedArrayAnimation({
        from: [],
        to: [],
        time: 1000,
        onUpdate: () => {},
        keyExtractor: () => "",
        include: ["x"],
        arrayMergeStrategy: Strategies.MERGE_WITH_LAST_TICK,
      });
    }).not.toThrow();
  });
});
