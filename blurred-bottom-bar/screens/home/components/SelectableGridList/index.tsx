import React, { useCallback, useImperativeHandle } from 'react';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  scrollTo,
} from 'react-native-reanimated';
import { FlatListProps, useWindowDimensions } from 'react-native';

import {
  FlatList,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  calculateGridItemIndex,
  generateNumbersInRange,
  sameElements,
} from './util';

type CustomRenderItemParams<T> = {
  index: number;
  activeIndexes: Animated.SharedValue<number[]>;
  item: T;
};

type CustomRenderItem<T> = (
  params: CustomRenderItemParams<T>,
) => React.ReactElement;

type CustomFlatListProps<T> = Omit<FlatListProps<T>, 'renderItem'> & {
  renderItem: CustomRenderItem<T>;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as FlatList;

export type GridListRefType = {
  reset: () => void;
};

type GridListProps<T> = CustomFlatListProps<T> & {
  itemSize: number;
  containerHeight?: number;
  onSelectionChange?: (indexes: number[]) => void;
  gridListRef?: React.RefObject<GridListRefType>;
};

function SelectableGridList<T>({
  itemSize,
  containerHeight: containerHeightProp,
  onSelectionChange,
  gridListRef,
  ...rest
}: GridListProps<T>) {
  const itemsPerRow = rest.numColumns ?? 1;
  const { height: windowHeight } = useWindowDimensions();
  const containerHeight = containerHeightProp ?? windowHeight;
  const flatListRef = useAnimatedRef<Animated.FlatList<T>>();

  const contentOffsetY = useSharedValue(0);

  const currentActiveIndexes = useSharedValue<number[]>([]);

  const pendingIndexes = useSharedValue<number[]>([]);

  const totalActiveIndexes = useDerivedValue(() => {
    const combinedIndexes = [
      ...currentActiveIndexes.value,
      ...pendingIndexes.value,
    ];

    return [...new Set(combinedIndexes)];
  }, []);

  const calculateGridItemPosition = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      'worklet';
      return calculateGridItemIndex({
        x,
        y,
        itemWidth: itemSize,
        itemHeight: itemSize,
        itemsPerRow: itemsPerRow,
      });
    },
    [itemSize, itemsPerRow],
  );

  const reset = useCallback(() => {
    currentActiveIndexes.value = [];
    pendingIndexes.value = [];
  }, []);

  useImperativeHandle(
    gridListRef,
    () => ({
      reset,
    }),
    [reset],
  );

  useAnimatedReaction(
    () => {
      return totalActiveIndexes.value;
    },
    (updatedActiveIndexes, prevActiveIndexes) => {
      if (
        onSelectionChange &&
        !sameElements(updatedActiveIndexes, prevActiveIndexes ?? [])
      ) {
        runOnJS(onSelectionChange)(updatedActiveIndexes);
      }
    },
  );

  const initialSelectedIndex = useSharedValue<number | null>(null);

  const toggleIndex = useCallback((index: number) => {
    'worklet';
    if (currentActiveIndexes.value.includes(index)) {
      currentActiveIndexes.value = currentActiveIndexes.value.filter(
        i => i !== index,
      );
    } else {
      currentActiveIndexes.value = [...currentActiveIndexes.value, index];
    }

    pendingIndexes.value = [];
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(event => {
      initialSelectedIndex.value = calculateGridItemPosition({
        x: event.x,
        y: event.y + contentOffsetY.value,
      });
    })
    .onUpdate(event => {
      if (initialSelectedIndex.value == null) return;

      const pendingFinalIndex = calculateGridItemPosition({
        x: event.x,
        y: event.y + contentOffsetY.value,
      });

      pendingIndexes.value = generateNumbersInRange(
        initialSelectedIndex.value,
        pendingFinalIndex,
      );

      currentActiveIndexes.value = currentActiveIndexes.value.filter(
        index => !pendingIndexes.value.includes(index),
      );

      const lowerBound = contentOffsetY.value + itemSize;
      const upperBound = lowerBound + containerHeight - 2 * itemSize;

      const scrollSpeed = itemSize * 0.15;
      if (event.y + contentOffsetY.value <= lowerBound) {
        scrollTo(flatListRef, 0, contentOffsetY.value - scrollSpeed, false);
      } else if (event.y + contentOffsetY.value >= upperBound) {
        scrollTo(flatListRef, 0, contentOffsetY.value + scrollSpeed, false);
      }
    })
    .onEnd(event => {
      if (initialSelectedIndex.value == null) return;

      const finalIndex = calculateGridItemPosition({
        x: event.x,
        y: event.y + contentOffsetY.value,
      });

      pendingIndexes.value = generateNumbersInRange(
        initialSelectedIndex.value,
        finalIndex,
      );

      if (pendingIndexes.value.length === 1) {
        const index = pendingIndexes.value[0];
        toggleIndex(index);
        return;
      }

      currentActiveIndexes.value = [
        ...new Set([...currentActiveIndexes.value, ...pendingIndexes.value]),
      ];
    })
    .onFinalize(() => {
      pendingIndexes.value = [];
      initialSelectedIndex.value = null;
    });

  const tapGesture = Gesture.Tap()
    .maxDeltaY(5)
    .maxDeltaX(5)
    .onStart(event => {
      initialSelectedIndex.value = calculateGridItemPosition({
        x: event.x,
        y: event.y + contentOffsetY.value,
      });
    })
    .onEnd(event => {
      const index = calculateGridItemPosition({
        x: event.x,
        y: event.y + contentOffsetY.value,
      });
      toggleIndex(index);
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  const renderItem = useCallback(
    (defaultRenderItemParams: { index: number; item: T }) => {
      return rest.renderItem({
        ...defaultRenderItemParams,
        activeIndexes: totalActiveIndexes,
      });
    },
    [rest, totalActiveIndexes],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => {
      return {
        length: itemSize,
        offset: itemSize * index,
        index,
      };
    },
    [itemSize],
  );

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedFlatList<T>
        {...rest}
        ref={flatListRef as any}
        scrollEventThrottle={16}
        onScroll={event => {
          contentOffsetY.value = event.nativeEvent.contentOffset.y;
          return rest?.onScroll?.(event);
        }}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </GestureDetector>
  );
}

export { SelectableGridList };
