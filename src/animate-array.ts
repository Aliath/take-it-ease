import {
  AnimationControllerProps,
  ArrayAnimationParams,
  ControllerUpdateFunction,
  KeysOfType,
  ObjectToAnimate,
  Strategies,
} from "./types";
import deepCloneBuilder from "rfdc";
import { createAnimation } from "./animate";
const deepClone = deepCloneBuilder();

export function createArrayAnimation<T extends ObjectToAnimate, D extends T>(
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
    keyExtractor,
    arrayMergeStrategy = controller.arrayMergeStrategy,
  }: ArrayAnimationParams<T, D>
) {
  const registeredUpdateFunctions = new Set<ControllerUpdateFunction>();

  const arrayController: AnimationControllerProps = {
    ...controller,
    registerUpdateFunction: (handler) => {
      registeredUpdateFunctions.add(handler);
    },
    deregisterUpdateFunction: (handler) => {
      registeredUpdateFunctions.delete(handler);
    },
  };

  let registeredItemsCount = 0;
  let finishedItemsCount = 0;
  let initUpdateFinished = false;
  const fromArrayItemsByKey = new Map<ReturnType<typeof keyExtractor>, T>();
  const updatedItemsByKey = new Map<ReturnType<typeof keyExtractor>, D>();

  from.forEach((item) => {
    const key = keyExtractor(item);

    fromArrayItemsByKey.set(key, item);
    updatedItemsByKey.set(key, item as D);
  });

  const { foundToEntries, notFoundToEntries } = to.reduce(
    (result, item) => {
      const key = keyExtractor(item);
      const fromItem = fromArrayItemsByKey.get(key);

      if (!fromItem) {
        return {
          ...result,
          notFoundToEntries: [...result.notFoundToEntries, item],
        };
      }

      return { ...result, foundToEntries: [...result.foundToEntries, item] };
    },
    {
      foundToEntries: [] as D[],
      notFoundToEntries: [] as D[],
    }
  );

  foundToEntries.forEach((toItem) => {
    const toItemKey = keyExtractor(toItem);
    const fromItem = fromArrayItemsByKey.get(toItemKey)!;

    createAnimation(arrayController, {
      easingFunction,
      mergeStrategy,
      from: fromItem,
      to: toItem,
      time,
      include: include as KeysOfType<D, number>[],
      onUpdate: (updatedItem) => {
        updatedItemsByKey.set(toItemKey, updatedItem);
      },
      onFinish: () => {
        finishedItemsCount++;
      },
    });
    registeredItemsCount++;
  });

  const insertNotFoundItems = () => {
    notFoundToEntries.forEach((item) => {
      const key = keyExtractor(item);

      updatedItemsByKey.set(key, item);
    });
  };

  const updateArray = () => {
    if (!initUpdateFinished) {
      if (arrayMergeStrategy === Strategies.MERGE_WITH_FIRST_TICK) {
        insertNotFoundItems();
      }

      initUpdateFinished = true;
    }

    [...registeredUpdateFunctions.values()].forEach((updateFunction) => {
      updateFunction();
    });

    const finished = finishedItemsCount === registeredItemsCount;

    if (finished) {
      if (arrayMergeStrategy === Strategies.MERGE_WITH_LAST_TICK) {
        insertNotFoundItems();
      }
    }

    onUpdate([...updatedItemsByKey.values()]);

    if (finished) {
      if (onFinish) {
        onFinish();
      }

      controller.deregisterUpdateFunction(updateArray);
    }
  };

  controller.registerUpdateFunction(updateArray);
}
