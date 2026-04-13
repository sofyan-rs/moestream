import { appTheme } from "@/src/constants/app-theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Play } from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";
import { type ContinueWatchingItem } from "./continue-watching-section";

const CARD_W = Dimensions.get("window").width * 0.56;

type Props = {
  item: ContinueWatchingItem;
};

export function ContinueWatchingCard({ item }: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const colors = isDark ? appTheme.colors.dark : appTheme.colors.light;

  return (
    <PressableFeedback
      style={{ width: CARD_W, marginRight: 12 }}
      onPress={() => router.push(`/anime/${item.id}`)}
      className="rounded-xl overflow-hidden bg-surface"
    >
      {/* Thumbnail + play overlay */}
      <View>
        <Image
          source={{ uri: item.cover }}
          style={{ width: CARD_W, height: CARD_W * 0.5625 }}
          contentFit="cover"
        />
        <View className="absolute top-3 right-3 rounded-full bg-black/55 items-center justify-center">
          <Play size={22} color="white" />
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 3, backgroundColor: colors.primaryLight }}>
        <View
          style={{
            height: 3,
            width: `${item.progress * 100}%` as `${number}%`,
            backgroundColor: colors.primary,
          }}
        />
      </View>

      {/* Info */}
      <View className="px-2.5 py-2">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-xs font-normal text-accent mt-1">
          {item.episode}
        </Text>
      </View>
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}
