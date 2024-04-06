import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SketchCanvasWithoutInteraction } from './src/canvas-without-interactivity';
import { SketchCanvasWithInteraction } from './src/canvas-with-interactivity';
import { SketchCanvasWithInteractionAndCustomization } from './src/canvas-with-interactivity-and-custom';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SketchCanvasWithInteractionAndCustomization />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
