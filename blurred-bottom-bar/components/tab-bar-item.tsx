import { memo, PropsWithChildren, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { PressableScale } from './pressable-scale';

type TabBarItemProps = PropsWithChildren<{
  onPress: () => void;
  focusedIndex: Animated.SharedValue<number>;
  index: number;
  screenName: string;
}>;

export const TabBarItem = memo(
  ({ onPress, focusedIndex, index, screenName }: TabBarItemProps) => {
    const isFocused = useDerivedValue(() => {
      return focusedIndex.value === index;
    }, [index]);

    const rStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isFocused.value ? 1 : 0.3),
      };
    }, []);

    const getIconByScreenName = useCallback((pageName: string) => {
      return (
        <MaterialIcons
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name={pageName.toLowerCase()}
          size={25}
          color={'white'}
        />
      );
    }, []);

    return (
      <Animated.View>
        <PressableScale style={localStyles.filCenter} onPress={onPress}>
          {getIconByScreenName(screenName)}
        </PressableScale>
      </Animated.View>
    );
  },
);

const localStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  filCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
