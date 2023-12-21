import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import type { Positions } from './components/SortableList/types';

const PADDING = 6;
const HEIGHT = 80;
const ITEM_HEIGHT = HEIGHT + PADDING * 2;
const MAX_BORDER_RADIUS = 10;

const LINEAR_GRADIENT_COLORS = [
  'rgba(255,255,255,1)',
  'rgba(255,255,255,0.05)',
  'rgba(255,255,255,0.025)',
];

const App = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();

  const onDragEnd = useCallback((data: Positions) => {

  }
};
