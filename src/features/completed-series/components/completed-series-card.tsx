import StarIcon from "@/src/components/icons/star";
import { appTheme } from "@/src/constants/app-theme";
import { type TCompletedSeries } from "@/src/services/api/completed";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import {
  Calendar,
  ClapperboardPlay,
} from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";

const THUMB_W = 90;
const THUMB_H = THUMB_W * 1.42;

type Props = {
  item: TCompletedSeries;
};

export function CompletedSeriesCard({ item }: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const iconColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;

  const score = parseFloat(item.score);

  return (
    <PressableFeedback
      className="flex-row px-5 py-3 gap-3"
      onPress={() => router.push(`/anime/${item.endpoint}`)}
    >
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />

      {/* Thumbnail */}
      <View
        className="rounded-xl overflow-hidden"
        style={{ width: THUMB_W, height: THUMB_H }}
      >
        <Image
          source={{ uri: item.thumb }}
          style={{ width: THUMB_W, height: THUMB_H }}
          contentFit="cover"
        />
      </View>

      {/* Info */}
      <View className="flex-1 justify-center gap-2">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View className="flex-row items-center gap-3">
          {!isNaN(score) && (
            <View className="flex-row items-center gap-1">
              <StarIcon size={14} color={appTheme.colors.light.primary} />
              <Text className="text-xs font-medium text-accent">
                {score.toFixed(1)}
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-1">
            <Calendar size={14} color={iconColor} />
            <Text className="text-xs text-foreground font-normal">
              {item.updated_on}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <ClapperboardPlay size={14} color={iconColor} />
          <Text className="text-xs text-foreground font-normal">
            {item.total_episode} Episodes
          </Text>
        </View>
      </View>
    </PressableFeedback>
  );
}
