import { useWindowDimensions, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  GridListRefType,
  SelectableGridList,
} from './components/SelectableGridList';
import { useCallback, useRef } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BOTTOM_BAR_HEIGHT } from '../../hooks/use-bottom-bar-height';
import { SelectableListItem } from './components/SelectableListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette } from './constants';
import { PressableOpacity } from './components/PressableOpacity';
import { ReText } from 'react-native-redash';
import { MaterialIcons } from '@expo/vector-icons';

const GridConfig = {
  itemsPerRow: 4,
  internalPadding: 5,
};

export const Home = () => {
  const { width } = useWindowDimensions();

  const itemSize = width / GridConfig.itemsPerRow;
  const selectedIndexesAmount = useSharedValue(0);
  const selectedIndexesAmountText = useDerivedValue(() => {
    return selectedIndexesAmount.value.toString();
  });

  const gridListRef = useRef<GridListRefType>(null);

  const safeBottomBarHeight = useBottomTabBarHeight();
  const rFloatingButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(
            selectedIndexesAmount.value === 0 ? 0 : -BOTTOM_BAR_HEIGHT * 3,
          ),
        },
      ],
    };
  }, [safeBottomBarHeight]);

  const renderItem = useCallback(
    ({
      index,
      activeIndexes,
    }: {
      index: number;
      activeIndexes: Animated.SharedValue<number[]>;
    }) => {
      return (
        <SelectableListItem
          index={index}
          internalPadding={GridConfig.internalPadding}
          containerWidth={width}
          containerHeight={itemSize}
          activeIndexes={activeIndexes}
        />
      );
    },
    [itemSize],
  );

  const { top: safeTop } = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.background,
        paddingTop: safeTop,
      }}>
      <SelectableGridList
        data={new Array(50).fill(0) as number[]}
        gridListRef={gridListRef}
        numColumns={GridConfig.itemsPerRow}
        itemSize={itemSize}
        onSelectionChange={indexes => {
          selectedIndexesAmount.value = indexes.length;
        }}
        renderItem={renderItem}
      />
      <PressableOpacity
        onPress={() => {
          gridListRef.current?.reset();
        }}
        style={[
          styles.floating,
          rFloatingButtonStyle,
          {
            bottom: -BOTTOM_BAR_HEIGHT,
            right: '15%',
          },
        ]}>
        <MaterialIcons name="clear" size={20} color={Palette.background} />
        {/*
            Note: We're using ReText since we want to listen the updates on the UI Thread.
            selectedIndexesAmountText is a derived value from selectedIndexesAmount.
        */}
        <ReText
          text={selectedIndexesAmountText}
          style={{
            fontSize: 20,
          }}
        />
      </PressableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floating: {
    zIndex: 1000,
    position: 'absolute',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowOpacity: 0.5,
    height: 64,
    width: 96,
    borderRadius: 20,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
