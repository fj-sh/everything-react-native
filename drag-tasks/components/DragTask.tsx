import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useState } from 'react';
import { circleTotalSize, colors, maxYDrag, spacing, tasks, types } from '../constants';
import { Dimensions, View, Image, Text } from 'react-native';
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { Swatch } from './Swatch';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedIcon } from './AnimatedIcon';

// https://www.animatereactnative.com/post/drag-tasks-react-native-reanimated2-animation

const { width, height } = Dimensions.get('screen');

interface MyGestureContext extends Record<string, unknown> {
  startX: number;
  startY: number;
}

export const DragTask = () => {
  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  const index = useSharedValue(0);
  const prevIndex = useSharedValue(0);
  const initialX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const newX = useDerivedValue(() => {
    return interpolate(
      translation.x.value,
      [0, width * 0.8 - initialX.value],
      [0, (colors.length - 1) * circleTotalSize],
      Extrapolate.CLAMP
    );
  });

  const backgroundColor = useDerivedValue(() => {
    return interpolateColor(
      translation.y.value,
      [0, maxYDrag],
      [colors[index.value], colors[prevIndex.value]]
    );
  });

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, MyGestureContext>(
    {
      onStart: (ev, ctx) => {
        initialX.value = ev.x;
        ctx.startX = translation.x.value;
        ctx.startY = translation.y.value;
      },
      onActive: (event, ctx) => {
        if (ctx.startY + event.translationY > maxYDrag * 0.7) {
          translation.x.value = ctx.startX + event.translationX;
        }
        translation.y.value = ctx.startY + event.translationY;
      },
      onEnd: (ev) => {
        if (translation.y.value < maxYDrag) {
          translation.y.value = withTiming(0);
          return;
        }
        prevIndex.value = index.value;
        index.value = Math.round(newX.value / circleTotalSize);
        translation.y.value = withTiming(0, undefined, () => {
          runOnJS(setActiveIndex)(index.value);
          // reset prevIndex to avoid animations when opening the menu again
          // initialX.value = 0;
          prevIndex.value = index.value;
        });
      },
    }
  );

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translation.y.value,
            [0, maxYDrag],
            [0, maxYDrag],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const headerStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  const stylez2 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translation.y.value, [0, maxYDrag / 2], [0, 1], Extrapolate.CLAMP),
      transform: [
        {
          translateX: -1 * newX.value,
        },
        {
          translateY: interpolate(
            translation.y.value,
            [0, maxYDrag],
            [-maxYDrag / 2, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          width,
          height: maxYDrag,
          backgroundColor: '#000',
          position: 'absolute',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              marginLeft: width / 2 - circleTotalSize / 2,
              height: circleTotalSize,
            },
            stylez2,
          ]}
        >
          {colors.map((color, index) => {
            return <Swatch index={index} color={color} key={color} newX={newX} />;
          })}
        </Animated.View>
        <View
          style={{
            bottom: 0,
            left: width / 2 - 1,
            flex: 1,
            height: 50,
            width: 2,
            position: 'absolute',
            backgroundColor: 'white',
          }}
        />
      </View>
      <Animated.ScrollView
        scrollEnabled={translation.y.value === 0}
        style={[{ backgroundColor: 'transparent' }, stylez]}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[{ flex: 1 }]}>
            <Animated.View style={[{ height: height / 3, padding: spacing }, headerStyles]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing,
                  marginTop: 32,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={28}
                  color="white"
                  style={{ marginLeft: 5 }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 2,
                    borderColor: 'white',
                    alignSelf: 'flex-end',
                    padding: spacing / 2,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{ color: 'white', fontFamily: 'Menlo', fontWeight: '700', fontSize: 14 }}
                  >
                    {types[activeIndex]}
                  </Text>
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={16}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </View>
              <Text
                style={{ fontSize: 28, color: 'white', fontWeight: '900', marginBottom: spacing }}
              >
                Create additional fields for payment flow.
              </Text>
              <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
                Built with ❤️ by @mironcatalin, powered by Reanimated2 and Expo^
              </Text>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <View style={{ padding: spacing, backgroundColor: 'white' }}>
          {tasks.map((task) => {
            return (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', padding: spacing }}
                key={task.key}
              >
                <AnimatedIcon
                  style={{ marginRight: spacing }}
                  name={task.isDone ? 'check-circle' : 'checkbox-blank-circle-outline'}
                  backgroundColor={backgroundColor}
                  color={colors[activeIndex]}
                  size={28}
                />
                <Text
                  key={task.key}
                  style={{
                    textDecorationLine: task.isDone ? 'line-through' : 'none',
                    opacity: 0.4,
                    fontWeight: '400',
                    fontSize: 15,
                  }}
                >
                  {task.name}
                </Text>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                  {task.collaborators.map((collaborator) => {
                    return (
                      <Image
                        key={collaborator.key}
                        source={{ uri: collaborator.uri }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginLeft: -20,
                          borderWidth: 2,
                          borderColor: 'white',
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
};
