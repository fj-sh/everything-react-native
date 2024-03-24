import { MotiView, MotiText } from 'moti';
import { StyleProp, TextStyle } from 'react-native';
import { usePrevious } from '@/components/Ticker/hooks/usePrevious';

type TickProps = {
  num: number;
  textSize: number;
  textStyle: StyleProp<TextStyle>;
  index: number;
};

const numZeroToNine = [...Array(10).keys()];
export const Tick = ({ num, textSize, textStyle, index }: TickProps) => {
  const xxx = usePrevious(num);

  return (
    <MotiView style={{ height: textSize, overflow: 'hidden' }}>
      <MotiView
        from={{ translateY: -textSize * (xxx ?? 0) }}
        animate={{ translateY: -textSize * num }}
        transition={{
          type: 'timing',
          duration: 500,
          delay: 80 * index,
        }}
      >
        {numZeroToNine.map((number, index) => {
          return (
            <MotiText
              key={index}
              style={[
                textStyle,
                {
                  height: textSize,
                  fontSize: textSize,
                  lineHeight: textSize * 1.1,
                  textAlign: 'center',
                },
              ]}
            >
              {number}
            </MotiText>
          );
        })}
      </MotiView>
    </MotiView>
  );
};
