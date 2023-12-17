import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { App } from './index';

const AppContainer = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default AppContainer;
