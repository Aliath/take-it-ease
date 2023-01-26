import { createController } from "./index";

describe("make-it-easier", () => {
  let currentTimestamp: number;
  let onUpdate: ReturnType<typeof vitest.fn>;
  let controller: ReturnType<typeof createController>;

  beforeEach(() => {
    currentTimestamp = 0;
    onUpdate = vitest.fn();
    controller = createController({
      getTimestamp: () => currentTimestamp,
    });
  });

  it("animates single property", () => {
    controller.animate({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate,
      include: ["x"],
    });

    expect(onUpdate).not.toBeCalled();

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      x: 50,
    });

    currentTimestamp = 600;
    controller.tick();

    expect(onUpdate).toBeCalledTimes(2);
    expect(onUpdate).toBeCalledWith({
      x: 60,
    });
  });

  it("animates multiple properties", () => {
    controller.animate({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 200 },
      time: 1000,
      onUpdate,
      include: ["x", "y"],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 50,
      y: 100,
    });

    currentTimestamp = 600;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 60,
      y: 120,
    });
  });

  it("does not animate not-included properties", () => {
    controller.animate({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 200 },
      time: 1000,
      onUpdate,
      include: ["x"],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 50,
      y: 0,
    });
  });

  it("works even when include array is empty", () => {
    controller.animate({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 200 },
      time: 1000,
      onUpdate,
      include: [],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 0,
      y: 0,
    });
  });

  it("applies easingFunction", () => {
    controller.animate({
      from: { x: 21 },
      to: { x: 37 },
      time: 1000,
      onUpdate,
      easingFunction: () => 0,
      include: ["x"],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 21,
    });

    currentTimestamp = 600;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 21,
    });
  });

  it("calls onFinish method when animation ends", () => {
    const onFinish = vitest.fn();

    controller.animate({
      from: { x: 21 },
      to: { x: 37 },
      time: 1000,
      onUpdate,
      onFinish,
      include: ["x"],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onFinish).not.toBeCalled();

    currentTimestamp = 999.99;
    controller.tick();

    expect(onFinish).not.toBeCalled();

    currentTimestamp = 1000 + 2137;
    controller.tick();

    expect(onFinish).toBeCalled();
  });

  it("fallbacks non-existing value from `from` with `to`", () => {
    const onFinish = vitest.fn();

    controller.animate({
      from: { x: 0 },
      to: { x: 100, y: 100 },
      time: 1000,
      onUpdate,
      onFinish,
      include: ["x", "y"],
    });

    currentTimestamp = 500;
    controller.tick();

    expect(onUpdate).toBeCalledWith({
      x: 50,
      y: 100,
    });
  });
});
