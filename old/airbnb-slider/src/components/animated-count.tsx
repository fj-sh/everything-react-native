import Animated from 'react-native-reanimated';
import { AnimatedDigit } from './animated-digit';

const TEXT_DIGIT_HEIGHT = 60;
const TEXT_DIGIT_WIDTH = 35;
const FONT_SIZE = 50;
const TEXT_COLOR = 'black';

interface AnimatedCountProps {
  count: Animated.SharedValue<number>;
  maxDigits: number;
  textDigitHeight?: number;
  textDigitWidth?: number;
  fontSize?: number;
  color?: string;
}

const AnimatedCount = ({
  count,
  maxDigits,
  textDigitHeight = TEXT_DIGIT_HEIGHT,
  textDigitWidth = TEXT_DIGIT_WIDTH,
  fontSize = FONT_SIZE,
  color = TEXT_COLOR,
}: AnimatedCountProps) => {
  return (
    <Animated.View
      style={{
        flexDirection: 'row-reverse',
      }}
    >
      {new Array(maxDigits).fill(0).map((_, index) => {
        return (
          <AnimatedDigit
            maxDigits={maxDigits}
            key={index}
            index={index}
            count={count}
            height={textDigitHeight}
            width={textDigitWidth}
            textStyle={{
              color,
              fontSize,
              fontWeight: 'bold',
            }}
          />
        );
      })}
    </Animated.View>
  );
};

export { AnimatedCount };
