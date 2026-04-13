import { appTheme } from "@/src/constants/app-theme";
import { type IPopularAnimeItem } from "@/src/services/api/popular";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import { Calendar, ClapperboardPlay, Tv, VideoFrame, VideoFramePlayHorizontal } from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";

const THUMB_W = 90;
const THUMB_H = THUMB_W * 1.42;

type Props = {
  item: IPopularAnimeItem;
};

export function PopularSeriesCard({ item }: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const iconColor = isDark ? appTheme.colors.dark.text : appTheme.colors.light.text;
  const normalizedStatus =
    item.status === "Currently Airing"
      ? "Ongoing"
      : item.status === "Finished Airing"
        ? "Completed"
        : item.status;
  const normalizedType = item.type?.toLowerCase();

  return (
    <PressableFeedback
      className="flex-row px-5 py-3 gap-3"
      onPress={() => router.push(`/anime/${item.session}`)}
    >
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />

      <View className="rounded-xl overflow-hidden" style={{ width: THUMB_W, height: THUMB_H }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: THUMB_W, height: THUMB_H }}
          contentFit="cover"
        />
      </View>

      <View className="flex-1 justify-center gap-2">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
          {item.title}
        </Text>

        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            {normalizedType === "tv" ? (
              <Tv size={14} color={appTheme.colors.light.primary} />
            ) : normalizedType === "movie" ? (
              <VideoFrame size={14} color={appTheme.colors.light.primary} />
            ) : (
              <VideoFramePlayHorizontal size={14} color={appTheme.colors.light.primary} />
            )}
            <Text className="text-xs font-medium text-accent">
              {item.type ?? "-"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Calendar size={14} color={iconColor} />
            <Text className="text-xs text-foreground font-normal">
              {item.aired ?? "-"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <ClapperboardPlay size={14} color={iconColor} />
          <Text className="text-xs text-foreground font-normal">
            {item.episodes ?? "?"} Episodes • {normalizedStatus ?? "-"}
          </Text>
        </View>
      </View>
    </PressableFeedback>
  );
}
