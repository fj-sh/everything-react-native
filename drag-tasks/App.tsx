import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DragTask } from './components/DragTask';

// https://www.animatereactnative.com/post/drag-tasks-react-native-reanimated2-animation

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DragTask />
    </GestureHandlerRootView>
  );
}
