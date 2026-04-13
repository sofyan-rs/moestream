import React from "react";
import { FlatList, View } from "react-native";
import { ContinueWatchingCard } from "./continue-watching-card";
import { SectionHeader } from "./section-header";

export type ContinueWatchingItem = {
  id: string;
  title: string;
  episode: string;
  progress: number;
  cover: string;
};

const CONTINUE_WATCHING = [
  {
    id: "1",
    title: "One Piece",
    episode: "Episode 100",
    progress: 0.5,
    cover: "https://via.placeholder.com/150",
  },
];

export function ContinueWatchingSection() {
  return (
    <View className="mb-3">
      <SectionHeader title="Continue Watching" />
      <FlatList<ContinueWatchingItem>
        data={CONTINUE_WATCHING}
        renderItem={({ item }) => <ContinueWatchingCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}
