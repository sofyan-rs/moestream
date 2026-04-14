import type { EpisodeReleasesSort } from "@/src/features/episode/episode-path";
import {
  selectContinueWatchingList,
  useHistoryStore,
} from "@/src/hooks/stores/history-store";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import { ContinueWatchingCard } from "./continue-watching-card";
import { SectionHeader } from "./section-header";

export type ContinueWatchingItem = {
  id: string;
  episodeSession: string;
  releasesPage: number;
  releasesSort: EpisodeReleasesSort;
  title: string;
  episode: string;
  progress: number;
  cover: string;
};

export function ContinueWatchingSection() {
  const watches = useHistoryStore((s) => s.watches);
  const rows = useMemo(() => selectContinueWatchingList(watches), [watches]);

  const data: ContinueWatchingItem[] = useMemo(
    () =>
      rows.map((w) => ({
        id: w.session,
        episodeSession: w.episodeId,
        releasesPage: w.releasesPage,
        releasesSort: w.releasesSort,
        title: w.title,
        episode: `Episode ${w.episodeNumber}`,
        progress: w.progress,
        cover: w.poster,
      })),
    [rows],
  );

  if (data.length === 0) return null;

  return (
    <View className="mb-3">
      <SectionHeader title="Continue Watching" onSeeAll={() => router.push("/history-watch")} />
      <FlatList<ContinueWatchingItem>
        data={data}
        renderItem={({ item }) => <ContinueWatchingCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}
