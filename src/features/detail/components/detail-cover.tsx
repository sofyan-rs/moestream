import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "react-native-solar-icons/icons/outline";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = SCREEN_WIDTH * 0.65;

type Props = {
  cover: string;
  onPlay?: () => void;
};

export function DetailCover({ cover, onPlay }: Props) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ height: COVER_HEIGHT }}>
      <Image
        source={{ uri: cover }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.45)",
          "transparent",
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.88)",
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Top bar */}
      <View
        className="absolute top-0 left-0 right-0 flex-row items-center p-5"
        style={{ paddingTop: top }}
      >
        <Button
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center border-0"
          variant="outline"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          hitSlop={8}
        >
          <ArrowLeft size={24} color="white" />
        </Button>
      </View>

      {/* Play button */}
      {/* <Button onPress={onPlay}
                className="absolute self-center items-center justify-center rounded-xl"
                style={{
                    top: COVER_HEIGHT / 2 - 32,
                    backgroundColor: 'rgba(255,45,85,0.85)',
                }}>
                <Play size={28} color="white" />
            </Button> */}

      {/* Watch trailer label */}
      {/* <View className="absolute self-center" style={{ top: COVER_HEIGHT / 2 + 28 }}>
                <Text className="text-white text-xs font-medium" style={{ opacity: 0.85 }}>
                    Watch Trailer
                </Text>
            </View> */}
    </View>
  );
}
