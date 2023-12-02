import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

type MaterialCommunityIconsProps = React.ComponentProps<typeof MaterialCommunityIcons>;

type AnimatedIconProps = {
  backgroundColor: Animated.SharedValue<string>;
  name: any;
} & Omit<MaterialCommunityIconsProps, 'name'>;

const AIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
export const AnimatedIcon = ({ backgroundColor, name, ...rest }: AnimatedIconProps) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      color: backgroundColor.value,
    };
  });

  return <AIcon animatedProps={animatedProps} name={name} size={24} {...rest} />;
};
