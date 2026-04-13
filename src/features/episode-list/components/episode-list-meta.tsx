import React from "react";
import { Text, View } from "react-native";

type Props = {
  totalCount: number;
};

export function EpisodeListMeta({ totalCount }: Props) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
      <Text className="text-foreground text-xs font-normal">{totalCount} episodes</Text>
    </View>
  );
}
