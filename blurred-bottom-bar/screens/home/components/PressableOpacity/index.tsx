import { ViewProps } from 'react-native';
import { memo, PropsWithChildren, useCallback } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type PressableOpacityProps = ViewProps &
  PropsWithChildren<{
    onPress: () => void;
    minOpacity?: number;
  }>;

const PressableOpacity = memo((props: PressableOpacityProps) => {
  const { children, onPress, style, minOpacity = 0.9, ...otherProps } = props;

  const onPressWrapper = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const opacity = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      opacity.value = withTiming(minOpacity);
    })
    .onTouchesUp(() => {
      runOnJS(onPressWrapper)();
    })
    .onFinalize(() => {
      opacity.value = withTiming(1);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View {...props} style={[style, rStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

export { PressableOpacity };
