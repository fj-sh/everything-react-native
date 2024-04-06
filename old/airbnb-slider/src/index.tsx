import { AnimatedCount } from './components/animated-count';
import { AnimatedSlider } from './components/animated-slider';
import { Palette } from './constants';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useWindowDimensions, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const CURRENCY = '$';
const App = () => {
  const price = useSharedValue(0);

  const maxValue = 4500;
  const textDigitWidth = 19;
  const textDigitHeight = 36;
  const maxDigits = maxValue.toString().length;
  const fontSize = 30;

  const { width: windowWidth } = useWindowDimensions();

  const rCurrencyStyle = useAnimatedStyle(() => {
    const digitCount = price.value.toString().length;

    const missingDigits = maxDigits - digitCount;

    return {
      transform: [
        {
          translateX: withSpring((missingDigits * textDigitWidth) / 2 - textDigitWidth - 2.5),
        },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style={'auto'} />

      <View style={{ flexDirection: 'row', overflow: 'visible', marginBottom: 50 }}>
        <Animated.View style={[{ position: 'absolute' }, rCurrencyStyle]}>
          <Text
            style={{
              fontSize,
              color: Palette.primary,
              fontWeight: 'bold',
            }}
          >
            {CURRENCY}
          </Text>
        </Animated.View>
        <AnimatedCount
          count={price}
          maxDigits={maxDigits}
          textDigitWidth={textDigitWidth}
          textDigitHeight={textDigitHeight}
          fontSize={fontSize}
          color={Palette.primary}
        />
      </View>
      <AnimatedSlider
        initialProgress={price.value}
        style={{
          width: windowWidth - 100,
        }}
        minValue={0}
        maxValue={maxValue}
        onUpdate={(prog) => {
          price.value = Math.round(prog);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
