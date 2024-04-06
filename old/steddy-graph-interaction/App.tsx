import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

// @ts-ignore
import mPlusRoundedMedium from './assets/fonts/MPLUSRounded1c-Medium.ttf';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { App } from './src';

const AppContainer = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'MPlus-Rounded-Medium': mPlusRoundedMedium, // medium
      });
      setFontsLoaded(true);
    })();
  }, []);

  return (
    // Because we're using the PressableScale :) (based on a GestureDetector)
    <GestureHandlerRootView style={localStyles.fill}>
      {fontsLoaded && <App />}
    </GestureHandlerRootView>
  );
};

const localStyles = StyleSheet.create({
  fill: { flex: 1 },
});
// eslint-disable-next-line import/no-default-export
export default AppContainer;
