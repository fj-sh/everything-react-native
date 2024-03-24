import { StyleProp, TextStyle } from 'react-native';
import { useMemo } from 'react';
import { MotiView } from 'moti';
import { Tick } from '@/components/Ticker/Tick';

interface TickerProps {
  number: number;
  textSize: number;
  textStyle?: StyleProp<TextStyle>;
}
export const Ticker = ({ number, textSize, textStyle }: TickerProps) => {
  const numArray = useMemo(() => String(number).split(''), [number]);

  return (
    <MotiView style={{ flexDirection: 'row' }}>
      {numArray.map((num, index) => {
        return (
          <Tick
            key={index}
            num={parseFloat(num)}
            textSize={textSize}
            textStyle={textStyle}
            index={index}
          />
        );
      })}
    </MotiView>
  );
};
