import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Ticker } from '@/components/Ticker/Ticker';
import { StatusBar } from 'expo-status-bar';

const TickerApp = () => {
  const [number, setNumber] = useState(Math.floor(Math.random() * 89999) + 10000);
  useEffect(() => {
    const interval = setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 89999) + 10000;
      // console.log(randomNumber)
      // setNumber(number => number + 1)
      setNumber(randomNumber);
    }, 2000);
    return () => clearInterval(interval);
  }, [number]);
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Ticker number={number} textSize={72} textStyle={{ fontWeight: '900', color: '#000' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export { TickerApp };
