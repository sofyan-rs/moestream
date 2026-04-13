import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import { ArrowLeft } from "react-native-solar-icons/icons/linear";

type Props = {
  accent: string;
  sort: "episode_desc" | "episode_asc";
  onBack: () => void;
  onToggleSort: () => void;
};

export function EpisodeListHeader({
  accent,
  sort,
  onBack,
  onToggleSort,
}: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 py-4 bg-surface">
      <PressableFeedback onPress={onBack} hitSlop={10}>
        <ArrowLeft size={22} color={accent} />
      </PressableFeedback>
      <Text className="text-foreground text-base font-semibold">Episode List</Text>
      <PressableFeedback onPress={onToggleSort} hitSlop={10}>
        <Text className="text-accent text-xs font-semibold">
          {sort === "episode_desc" ? "Newest" : "Oldest"}
        </Text>
      </PressableFeedback>
    </View>
  );
}
