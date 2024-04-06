import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  StyleProp,
  View,
  ViewStyle,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useContext } from 'react';
import { TapContext } from '../SortableList/SortableItem';

export type ItemInfo = {
  title: string;
  subtitle: string;
  activeValues: boolean[];
  color: string;
  squareColor?: string;
  textIcon: string;
  isCompleted: boolean;
};

type ListItemProps = {
  style?: StyleProp<ViewStyle>;
  activeIndex: Animated.SharedValue<number | null>;
  index: number;
  maxBorderRadius?: number;
  item: ItemInfo;
};
// Define the ListItem component
export const ListItem: React.FC<ListItemProps> = ({
  style,
  activeIndex,
  index,
  maxBorderRadius = 10,
  item,
}) => {
  const { onTap } = useContext(TapContext);
  // Use animated style for dynamic styling based on the active index
  const rStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(activeIndex.value === index ? maxBorderRadius : 0),
    };
  }, [maxBorderRadius, index]);

  // Render the ListItem component
  return (
    <Animated.View style={[styles.container, style, rStyle]}>
      {/* Icon and Text Container */}

      <View style={styles.iconContainer}>
        <TouchableWithoutFeedback onPress={onTap}>
          <View style={[styles.icon, { backgroundColor: item.color }]}>
            <Text style={styles.iconText}>{item.textIcon}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      {/* Status Indicator Container */}
      <View style={styles.statusContainer}>
        {/* Map through activeValues to render status items */}
        {new Array(item.activeValues.length).fill(0).map((_, i) => (
          <View
            key={i}
            style={[
              styles.statusItem,
              {
                backgroundColor: item.squareColor ?? item.color,
                opacity: item.activeValues[i] ? 1 : 0.6,
                transform: [
                  {
                    scale: item.activeValues[i] ? 1 : 0.3,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Define styles for the ListItem component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    height: '55%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    height: 25,
    width: 25,
    borderRadius: 10,
  },
});
