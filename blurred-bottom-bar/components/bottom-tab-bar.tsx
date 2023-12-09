import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { ScreenNames } from '../constants/screens';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSharedValue } from 'react-native-reanimated';
import { useCallback } from 'react';
import { StackActions } from '@react-navigation/native';
import {
  BOTTOM_BAR_HEIGHT,
  useSafeBottomBarHeight,
} from '../hooks/use-bottom-bar-height';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as OS from 'os';
import { TabBarItem } from './tab-bar-item';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

export const LINEAR_GRADIENT_COLORS = [
  'rgba(255,255,255,0)',
  'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.8)',
];

// Map screen keys to their corresponding index for tab bar items
const screensMap = Object.keys(ScreenNames).reduce((acc, key, index) => {
  return {
    ...acc,
    [index]: key,
  };
}, {}) as Record<number, keyof typeof ScreenNames>;

const BottomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const focusedIndex = useSharedValue(state.index);

  const currentIndex = state.index;

  const onTapIcon = useCallback(
    (selectedIndex: keyof typeof screensMap) => {
      const nextScreen = screensMap[selectedIndex];

      const isChangingRoute = currentIndex !== selectedIndex;

      const popsAmount = navigation.getState().routes.find(item => {
        return item.name === nextScreen;
      })?.state?.index;

      if (!isChangingRoute && popsAmount !== 0 && Boolean(popsAmount)) {
        const popAction = StackActions.pop(popsAmount);

        navigation.dispatch(popAction);
        return;
      }

      navigation.navigate(nextScreen);
      return;
    },
    [currentIndex, navigation],
  );

  const { bottom: safeBottom } = useSafeAreaInsets();

  const bottomBarSafeHeight = useSafeBottomBarHeight();

  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={LINEAR_GRADIENT_COLORS}
        style={[
          {
            height: bottomBarSafeHeight,
          },
          localStyles.gradientContainer,
        ]}
      />

      <View
        style={[
          localStyles.bottomContainer,
          {
            bottom: safeBottom + 15,
            height: BOTTOM_BAR_HEIGHT,
          },
        ]}>
        <BlurView
          intensity={Platform.OS === 'android' ? 20 : 40}
          style={[
            localStyles.container,
            {
              backgroundColor: 'rgba(255,255,255,0.05)',
              flex: 1,
            },
          ]}>
          {Object.keys(ScreenNames).map((key, index) => {
            return (
              <TabBarItem
                key={key}
                screenName={key}
                focusedIndex={focusedIndex}
                index={index}
                onPress={() => {
                  onTapIcon(index);
                  focusedIndex.value = index;
                }}
              />
            );
          })}
        </BlurView>
      </View>
    </>
  );
};

// Define local styles
const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContainer: {
    borderRadius: 30,
    borderCurve: 'continuous',
    overflow: 'hidden',
    left: '15%',
    right: '15%',
    borderWidth: 1,
    borderColor: 'rgb(216, 216, 216)',
    position: 'absolute',
  },
});

export { BottomTabBar };
