import { App } from './src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from './src/toast-manager/toast-provider';

const AppContainer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

export default AppContainer;
