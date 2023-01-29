import * as animation from "./animation";
import { createController } from "./controller";

describe("controller", () => {
  it("returns `tick` and `animate` methods", () => {
    const controller = createController();

    expect(controller).toHaveProperty("tick");
    expect(controller).toHaveProperty("animate");
  });

  it("exposes methods to register and deregister", () => {
    const spy = vi.spyOn(animation, "createAnimation");

    const controller = createController();

    controller.animate({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      easingFunction: () => 1,
      include: ["x"],
    });

    const args = spy.mock.calls[0]![0];

    expect(args.registerUpdateFunction).toBeTypeOf("function");
    expect(args.deregisterUpdateFunction).toBeTypeOf("function");
  });

  it("implements proper mechanism of registration", () => {
    const spy = vi.spyOn(animation, "createAnimation");
    const update = vi.fn();

    const controller = createController();

    controller.animate({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      easingFunction: () => 1,
      include: ["x"],
    });

    const { registerUpdateFunction, deregisterUpdateFunction } =
      spy.mock.calls[0]![0];

    registerUpdateFunction(update);
    controller.tick();
    expect(update).toBeCalled();

    deregisterUpdateFunction(update);
    controller.tick();
    expect(update).toBeCalledTimes(1);
  });

  it("passes `getTimestamp` and `easingFunction` to animation", () => {
    const getTimestamp = vi.fn();
    const easingFunction = vi.fn();
    const spy = vi.spyOn(animation, "createAnimation");

    const controller = createController({
      getTimestamp,
      easingFunction,
    });

    controller.animate({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      easingFunction: () => 1,
      include: ["x"],
    });

    const args = spy.mock.calls[0]![0];

    expect(args.getTimestamp).toBe(getTimestamp);
    expect(args.easingFunction).toBe(easingFunction);
  });

  it("fallbacks `getTimestamp` and `easingFunction` if not passed", () => {
    const spy = vi.spyOn(animation, "createAnimation");

    const controller = createController();

    controller.animate({
      from: { x: 0 },
      to: { x: 100 },
      time: 1000,
      onUpdate: () => {},
      easingFunction: () => 1,
      include: ["x"],
    });

    const args = spy.mock.calls[0]![0];

    expect(args.getTimestamp).toBeTypeOf("function");
    expect(args.easingFunction).toBeTypeOf("function");
  });
});
