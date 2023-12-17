import {
  Canvas,
  ExtendedTouchInfo,
  ICanvas,
  Path,
  Skia,
  SkiaView,
  TouchInfo,
  useDrawCallback,
  useTouchHandler,
} from '@shopify/react-native-skia';
import React, { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, SafeAreaView, useWindowDimensions, View } from 'react-native';
import useDrawingStore, { CurrentPath } from '../store';
import Header from '../components/header';
import history from './history';
import Toolbar from '../components/toolbar';

const Drawing = () => {
  const touchState = useRef(false);
  const canvas = useRef<ICanvas>();
  const currentPath = useRef<CurrentPath | null>();
  const { width } = useWindowDimensions();
  const completedPaths = useDrawingStore((state) => state.completedPaths);
  const setCompletedPaths = useDrawingStore((state) => state.setCompletedPaths);
  const stroke = useDrawingStore((state) => state.stroke);
  const [canvasHeight, setCanvasHeight] = useState(400);
};

export default Drawing;
