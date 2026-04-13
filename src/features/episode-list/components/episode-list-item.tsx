import { type IEpisodeListItem } from "@/src/services/api/episode-list";
import { Image } from "expo-image";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import { Play } from "react-native-solar-icons/icons/bold";
import { PlayCircle } from "react-native-solar-icons/icons/linear";

type Props = {
  item: IEpisodeListItem;
  index: number;
  accent: string;
  thumbnailUri?: string;
  onPress: (session: string) => void;
};

export function EpisodeListItem({
  item,
  index,
  accent,
  thumbnailUri,
  onPress,
}: Props) {
  const displayNumber =
    item.episode === null ? String(index + 1) : String(item.episode);

  return (
    <PressableFeedback
      className="flex-row items-center gap-3 px-5 py-3"
      onPress={() => onPress(item.session)}
    >
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />
      <View className="rounded-xl overflow-hidden" style={{ width: 100, height: 62 }}>
        <Image
          source={{ uri: thumbnailUri ?? item.snapshot }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <Play size={28} color="white" />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
          Episode {displayNumber}
        </Text>
        <Text className="text-foreground text-xs mt-1 font-normal">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <PlayCircle size={22} color={accent} />
    </PressableFeedback>
  );
}
