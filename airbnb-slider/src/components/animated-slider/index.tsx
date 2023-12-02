import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { Palette } from '../../constants';
import { useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  interpolate,
  runOnJS,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SliderProps {
  pickerSize?: number;
  sliderHeight?: number;
  minValue?: number;
  maxValue?: number;
  color?: string;
  style: StyleProp<Omit<ViewStyle, 'width' | 'height'> & { width: number; height?: number }>;
  onUpdate?: (progress: number) => void;
  initialProgress?: number;
}

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet';
  return Math.min(Math.max(value, lowerBound), upperBound);
};

const AnimatedSlider = ({
  pickerSize = 35,
  minValue = 0,
  maxValue = 1,
  color = Palette.primary,
  style,
  onUpdate,
  initialProgress = 0,
}: SliderProps) => {
  const flattenedStyle = useMemo(() => {
    return StyleSheet.flatten(style);
  }, [style]);

  const sliderHeight = flattenedStyle?.height ?? 4;
  const sliderWidth = flattenedStyle.width;

  const defaultPickerBorderRadius = pickerSize / 2;

  const defaultScale = 0.8;

  const translateX = useSharedValue(initialProgress * sliderWidth);
  const contextX = useSharedValue(0);
  const scale = useSharedValue(defaultScale);

  const clampedTranslateX = useDerivedValue(() => {
    return clamp(translateX.value, 0, sliderWidth);
  }, []);

  useAnimatedReaction(
    () => {
      return clampedTranslateX.value;
    },
    (translation) => {
      const progress = interpolate(
        translation,
        [0, sliderWidth],
        [minValue, maxValue],
        Extrapolate.CLAMP
      );
      if (onUpdate != null) {
        runOnJS(onUpdate)(progress);
      }
    }
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withTiming(1);
      contextX.value = clampedTranslateX.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
    })
    .onFinalize(() => {
      scale.value = withTiming(defaultScale);
    });

  const rPickerStyle = useAnimatedStyle(() => {
    return {
      borderRadius: defaultPickerBorderRadius,
      transform: [{ translateX: clampedTranslateX.value - pickerSize / 2 }, { scale: scale.value }],
    };
  }, []);

  const rProgressBarStyle = useAnimatedStyle(() => {
    return {
      width: clampedTranslateX.value,
    };
  }, []);

  return (
    <Animated.View
      style={{
        borderRadius: 5,
        backgroundColor: Palette.secondary,
        ...flattenedStyle,
        height: sliderHeight,
        width: sliderWidth,
      }}
    >
      <Animated.View style={[{ backgroundColor: color }, styles.progressBar, rProgressBarStyle]} />
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              height: pickerSize,
              top: -pickerSize / 2 + sliderHeight / 2,
            },
            styles.picker,
            rPickerStyle,
          ]}
        />
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  picker: {
    aspectRatio: 1,
    backgroundColor: Palette.primary,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});

export { AnimatedSlider };
