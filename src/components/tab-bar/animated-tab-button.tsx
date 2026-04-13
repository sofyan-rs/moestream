import { Pressable, type GestureResponderEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  focused: boolean;
  style?: React.ComponentProps<typeof Pressable>["style"];
  onPress?: ((e: GestureResponderEvent) => void) | null;
  onLongPress?: ((e: GestureResponderEvent) => void) | null;
  children?: React.ReactNode;
};

const SPRING = { damping: 14, stiffness: 180, mass: 0.8 };

export function AnimatedTabButton({
  children,
  style,
  onPress,
  onLongPress,
}: Props) {
  const scale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <Pressable
      style={style}
      onPress={onPress ?? undefined}
      onLongPress={onLongPress ?? undefined}
      onPressIn={() => {
        scale.value = withSpring(0.88, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
    >
      <Animated.View style={containerStyle}>{children}</Animated.View>
    </Pressable>
  );
}
