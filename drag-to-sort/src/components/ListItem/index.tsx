import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Define the type for information about each list item
export type ItemInfo = {
  title: string;
  subtitle: string;
  activeValues: boolean[];
  color: string;
  squareColor?: string;
  textIcon: string;
};

// Define the type for the props of the ListItem component
type ListItemProps = {
  style?: StyleProp<ViewStyle>;
  activeIndex: Animated.SharedValue<number | null>;
  index: number;
  maxBorderRadius?: number;
  item: ItemInfo;
};
