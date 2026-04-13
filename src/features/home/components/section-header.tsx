import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
      <PressableFeedback onPress={onSeeAll}>
        <Text className="text-sm font-medium text-accent">See All</Text>
      </PressableFeedback>
    </View>
  );
}
