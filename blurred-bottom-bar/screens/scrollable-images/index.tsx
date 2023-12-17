import { Image } from 'expo-image';
import { ScrollView, View, useWindowDimensions } from 'react-native';

const images = [
  require('../../assets/images/01.jpg'),
  require('../../assets/images/02.jpg'),
  require('../../assets/images/03.jpg'),
];

export const ScrollableImages = () => {
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView
      pagingEnabled
      decelerationRate={'fast'}
      style={{ backgroundColor: 'black', width, height }}>
      {images.map((item, i) => {
        return (
          <View
            key={i}
            style={{
              backgroundColor: `rgba(0, 0, 255, 0.${i + 2})`,
              height,
              width,
            }}>
            <Image
              contentFit="cover"
              source={item}
              style={{
                width,
                height,
              }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};
