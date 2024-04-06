import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { App } from './src';

LogBox.ignoreLogs(['(ADVICE) View']); // Ignore log notification by message

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
