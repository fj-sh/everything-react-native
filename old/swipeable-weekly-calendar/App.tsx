import { CalendarComponent } from './components/calendar';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function App() {
  const [date, setDate] = useState(new Date());

  const pressDate = useCallback(
    (d: Date) => {
      console.log(d);
      setDate(d);
    },
    [setDate]
  );

  return (
    <SafeAreaView>
      <CalendarComponent date={date} onPressDate={pressDate} showMonth={true} language="ja" />
    </SafeAreaView>
  );
}
