import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { App } from './src';

const AppContainer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};

export default AppContainer;
