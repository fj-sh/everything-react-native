import React, { memo } from 'react';
import { type StyleProp, type TextStyle, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedDigitProps {
  index: number;
  count: Animated.SharedValue<number>;
  height: number;
  width: number;
  textStyle: StyleProp<TextStyle>;
  maxDigits: number;
}

const getDigitByIndex = ({
  digitIndex,
  count,
  maxDigits,
}: {
  digitIndex: number;
  count: number;
  maxDigits: number;
}) => {
  'worklet';

  // Ensure the number is zero-padded to the maxDigits length, then extract the digit at the given index.
  const paddedValue = count.toString().padStart(maxDigits, '0');

  return parseInt(paddedValue.toString().split('')?.[maxDigits - 1 - digitIndex] ?? 0, 10);
};

const AnimatedDigit = memo(
  ({ height, width, textStyle, index, count, maxDigits }: AnimatedDigitProps) => {
    const digit = useDerivedValue(() => {
      return getDigitByIndex({
        digitIndex: index,
        count: count.value,
        maxDigits,
      });
    }, [index]);

    // Calculate the amount of invisible (leading) digits.
    // for instance, if the maxDigits is 5 and the count is 123, then the invisible digits are 2.
    // Since count -> 00123
    const invisibleDigitsAmount = useDerivedValue(() => {
      return maxDigits - count.value.toString().length;
    }, [maxDigits]);

    const isVisible = useDerivedValue(() => {
      const isZero = digit.value === 0;

      if (!isZero) return true;

      return index < maxDigits - invisibleDigitsAmount.value;
    }, [index, maxDigits]);

    const flattenedTextStyle = React.useMemo(() => {
      return StyleSheet.flatten(textStyle);
    }, [textStyle]);

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(-height * digit.value, {
              mass: 0.6,
            }),
          },
        ],
      };
    }, [height]);

    const opacity = useDerivedValue(() => {
      return withTiming(isVisible.value ? 1 : 0);
    }, []);

    const rContainerStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [
          {
            translateX: withTiming((-width * invisibleDigitsAmount.value) / 2),
          },
        ],
      };
    });

    return (
      <Animated.View
        style={[
          {
            height,
            width,
            overflow: 'hidden',
          },
          rContainerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'column',
            },
            rStyle,
          ]}
        >
          {new Array(10).fill(0).map((_, textIndex) => {
            return (
              <Text
                key={textIndex}
                style={{
                  ...flattenedTextStyle,
                  width,
                  height,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                {textIndex}
              </Text>
            );
          })}
        </Animated.View>
      </Animated.View>
    );
  }
);

AnimatedDigit.displayName = 'AnimatedDigit';

export { AnimatedDigit };
