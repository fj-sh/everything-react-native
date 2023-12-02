import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { between } from 'react-native-redash';
import { border, circleSize, circleTotalSize, spacing, types } from '../constants';
import { View } from 'react-native';

interface SwatchProps {
  color: string; // assuming color is a string like '#FFFFFF'
  index: number; // assuming index is a number
  newX: Animated.SharedValue<number>; // assuming newX is a reanimated shared value of type number
}
export const Swatch = ({ color, index, newX }: SwatchProps) => {
  const xxx = useDerivedValue(() => {
    const isBetween = between(
      newX.value,
      (index - 0.5) * circleTotalSize,
      (index + 0.5) * circleTotalSize
    );
    if (isBetween) {
      return withTiming(1, { duration: 200 });
    } else {
      return withTiming(0, { duration: 200 });
    }
  }, []);

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(xxx.value, [0, 1], [1, 1.1]),
        },
      ],
      backgroundColor: interpolateColor(xxx.value, [0, 1], ['#000', color]),
      borderColor: color,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(xxx.value, [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(xxx.value, [0, 1], [-2, 0]),
        },
        {
          scale: interpolate(xxx.value, [0, 1], [0.9, 1.1]),
        },
      ],
    };
  });

  return (
    <View
      style={{
        width: circleTotalSize,
        height: circleTotalSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.Text
        style={[
          {
            fontSize: 13,
            fontWeight: '800',
            fontFamily: 'Menlo',
            marginBottom: spacing / 2,
            color: 'white',
          },
          textStyle,
        ]}
      >
        {types[index]}
      </Animated.Text>
      <Animated.View
        style={[
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize,
            borderWidth: border,
          },
          stylez,
        ]}
      />
    </View>
  );
};
