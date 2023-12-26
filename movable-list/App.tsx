import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { App } from './src';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const AppContainer = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <App />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default AppContainer;
