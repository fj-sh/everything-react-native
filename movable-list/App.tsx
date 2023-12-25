import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { App } from './src';
const AppContainer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};

// eslint-disable-next-line import/no-default-export
export default AppContainer;
