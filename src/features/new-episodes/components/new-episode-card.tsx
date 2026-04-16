import { appTheme } from "@/src/constants/app-theme";
import { type IAiringData } from "@/src/services/api/ongoing";
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
  item: IAiringData;
};

export function NewEpisodeCard({ item }: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const iconColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;
  const backgroundColor = isDark ? appTheme.colors.dark.surface : appTheme.colors.light.surface;

  return (
    <PressableFeedback
      className="flex-row px-5 py-3 gap-3"
      onPress={() => router.push(`/anime/${item.session}`)}
    >
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />
      {/* Thumbnail */}
      <View
        className="rounded-xl overflow-hidden"
        style={{ width: THUMB_W, height: THUMB_H, backgroundColor: backgroundColor }}
      >
        <Image
          source={{ uri: item.poster || item.image }}
          style={{ width: THUMB_W, height: THUMB_H }}
          contentFit="cover"
        />
        {/* NEW badge */}
        <View
          className="absolute bg-accent rounded-md px-1.5 py-0.5"
          style={{ top: 7, left: 7 }}
        >
          <Text className="font-bold text-white" style={{ fontSize: 8 }}>
            NEW
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="flex-1 justify-center gap-2">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.episode && (
          <View className="flex-row items-center gap-1.5">
            <ClapperboardPlay size={14} color={appTheme.colors.light.primary} />
            <Text className="text-xs font-medium text-accent">
              EP {String(item.episode)}
            </Text>
          </View>
        )}

        <View className="flex-row items-center gap-1.5">
          <Calendar size={14} color={iconColor} />
          <Text className="text-xs text-foreground font-normal">
            {new Date(item.created_at).toLocaleDateString()} ·{" "}
            {new Date(item.created_at).toLocaleDateString(undefined, {
              weekday: "short",
            })}
          </Text>
        </View>
      </View>
    </PressableFeedback>
  );
}
