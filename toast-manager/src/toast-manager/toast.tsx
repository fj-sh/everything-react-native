import type { ToastType } from './context';
import { useWindowDimensions, StyleSheet, View, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// Define the props for the Toast component
type ToastProps = {
  index: number;
  toast: ToastType;
  onDismiss: (toastId: number) => void;
};

// Constants for toast styling
const ToastOffset = 20;
const ToastHeight = 70;
const HideToastOffset = ToastOffset + ToastHeight;
const BaseSafeArea = 50;

const Toast: React.FC<ToastProps> = ({ toast, index, onDismiss }) => {
  // Get the width of the window using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  const isActiveToast = toast.id === 0;

  // Shared values for animation
  // That's the "initial" position of the toast
  // After that, the toast will be animated to the bottom
  const initialBottomPosition = isActiveToast
    ? // Not an elegant way to handle the first toast.
      // Basically the purpose is that the initial position of the toast
      // should be the same as the last toast that is being dismissed
      // Except for the first toast, that should be animated from the bottom
      // of the screen (so -HideToastOffset)
      -HideToastOffset
    : BaseSafeArea + (toast.id - 1) * ToastOffset;

  const bottom = useSharedValue(initialBottomPosition);

  // Update the bottom position when the toast id changes
  // After the "mount" animation, the toast will be animated to the
  // right bottom value.
  // To be honest that's not an easy solution, but it seems to work fine
  useEffect(() => {
    bottom.value = withSpring(BaseSafeArea + toast.id * ToastOffset);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  // Callback to dismiss the toast with animation
  const dismissItem = useCallback(() => {
    'worklet';
    translateX.value = withTiming(-windowWidth, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(onDismiss)(toast.id);
      }
    });
  }, [onDismiss, toast.id, translateX, windowWidth]);

  const gesture = Gesture.Pan()
    .enabled(isActiveToast)
    .onBegin(() => {
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      // Allow swiping only to the left
      if (event.translationX > 0) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      // Dismiss the toast if swiped enough, otherwise animate back to the initial position
      if (event.translationX < -50) {
        dismissItem();
      } else {
        translateX.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  useEffect(() => {
    if (!toast.autodismiss || isActiveToast) return;

    const timeout = setTimeout(() => {
      dismissItem();
    }, 2500);

    return () => clearTimeout(timeout);
  }, [dismissItem, isActiveToast, toast.autodismiss]);

  // Animated styles for the toast container
  const rToastStyle = useAnimatedStyle(() => {
    const baseScale = 1 - toast.id * 0.05;
    const scale = isSwiping.value ? baseScale * 0.96 : baseScale;

    return {
      bottom: bottom.value,
      zIndex: 1000 - toast.id,
      transform: [
        {
          scale: withTiming(scale),
        },
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [toast]);

  // Animated styles for the visible container (opacity)
  const rVisibleContainerStyle = useAnimatedStyle(() => {
    return {
      // The content of the first two toasts is visible
      // The content of the other toasts is hidden
      opacity: withTiming(toast.id <= 1 ? 1 : 0),
    };
  }, [toast.id]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={index}
        style={[
          {
            width: windowWidth * 0.9,
            left: windowWidth * 0.05,
            shadowRadius: Math.max(10 - toast.id * 2, 5),
            zIndex: 100 - toast.id,
            // Note: 'borderCurve' works just on iOS
            borderCurve: 'continuous',
          },
          styles.container,
          rToastStyle,
        ]}
      >
        <Animated.View style={styles.textContainer}>
          <Animated.View style={[rVisibleContainerStyle, styles.rowCenter]}>
            {Boolean(toast.leading) && <>{toast.leading?.()}</>}
            <View
              style={[
                styles.columnCenter,
                {
                  marginLeft: toast.leading ? 10 : 0,
                },
              ]}
            >
              <Text style={styles.title}>{toast.title}</Text>
              {toast.subtitle && <Text style={styles.subtitle}>{toast.subtitle}</Text>}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

// Styles for the Toast component
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    elevation: 5,
    paddingHorizontal: 25,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 2,
  },
});

// Export the Toast component for use in other files
export { Toast };
