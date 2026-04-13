import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import {
  getAnimeReleases,
  getEpisodePlay,
  type TPlayableSource,
} from "@/src/services/api/episode";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Separator } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import { EpisodeActions } from "./components/episode-actions";
import { EpisodeGrid } from "./components/episode-grid";
import { EpisodePlayer } from "./components/episode-player";
import { EpisodeTitleInfo } from "./components/episode-title-info";
import { QualitySwitcher } from "./components/quality-switcher";
import { ServerSwitcher } from "./components/server-switcher";
import {
  buildEpisodePlayerHref,
  type EpisodeReleasesSort,
} from "./episode-path";

type Props = {
  animeId: string;
  episodeSession: string;
  releasesPage: number;
  releasesSort: EpisodeReleasesSort;
};

export function EpisodeScreen({
  animeId,
  episodeSession,
  releasesPage,
  releasesSort,
}: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const { top } = useSafeAreaInsets();
  const isDark = theme === "dark";
  const accent = isDark
    ? appTheme.colors.dark.primary
    : appTheme.colors.light.primary;
  const surfaceColor = isDark
    ? appTheme.colors.dark.surface
    : appTheme.colors.light.surface;

  const releasesQuery = useQuery({
    queryKey: ["animeReleases", animeId, releasesPage, releasesSort],
    queryFn: () =>
      getAnimeReleases({
        session: animeId,
        page: releasesPage,
        sort: releasesSort,
      }),
    enabled: Boolean(animeId),
  });

  const currentEpisode = useMemo(
    () =>
      releasesQuery.data?.items.find((item) => item.session === episodeSession),
    [releasesQuery.data?.items, episodeSession],
  );

  const playQuery = useQuery({
    queryKey: ["play", animeId, episodeSession],
    queryFn: () => getEpisodePlay({ animeSession: animeId, episodeSession }),
    enabled: Boolean(animeId && episodeSession),
  });

  const episodes = releasesQuery.data?.items ?? [];
  const currentEpisodeIndex = episodes.findIndex(
    (item) => item.session === episodeSession,
  );

  const isDesc = releasesSort === "episode_desc";
  const hasPrev = isDesc
    ? currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1
    : currentEpisodeIndex > 0;
  const hasNext = isDesc
    ? currentEpisodeIndex > 0
    : currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1;

  const prevSession =
    currentEpisodeIndex >= 0
      ? isDesc
        ? episodes[currentEpisodeIndex + 1]?.session
        : episodes[currentEpisodeIndex - 1]?.session
      : undefined;
  const nextSession =
    currentEpisodeIndex >= 0
      ? isDesc
        ? episodes[currentEpisodeIndex - 1]?.session
        : episodes[currentEpisodeIndex + 1]?.session
      : undefined;

  const [selectedServer, setSelectedServer] = useState<TPlayableSource | null>(
    null,
  );
  const [selectedQuality, setSelectedQuality] = useState("720p");

  const sources = useMemo(
    () => playQuery.data?.sources ?? [],
    [playQuery.data?.sources],
  );
  const filteredSources = sources.filter(
    (source) => source.quality === selectedQuality,
  );
  const displaySources = filteredSources.length > 0 ? filteredSources : sources;
  const selectedServerSafe = selectedServer ?? displaySources[0] ?? null;

  const availableQualities = useMemo(
    () => Array.from(new Set(sources.map((source) => source.quality))),
    [sources],
  );

  useEffect(() => {
    if (
      availableQualities.length > 0 &&
      !availableQualities.includes(selectedQuality)
    ) {
      setSelectedQuality(availableQualities[0]);
    }
  }, [availableQualities, selectedQuality]);

  useEffect(() => {
    setSelectedServer(null);
  }, [episodeSession, selectedQuality]);

  const navigateToEpisode = (epSession: string) => {
    router.replace(
      buildEpisodePlayerHref(animeId, epSession, {
        releasesPage,
        sort: releasesSort,
      }),
    );
  };

  if (releasesQuery.isLoading || playQuery.isLoading) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center"
        style={{ paddingTop: top }}
      >
        <LoadingSpinner size="lg" />
      </View>
    );
  }

  if (!currentEpisode || !playQuery.data || !selectedServerSafe) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-5">
        <Text className="text-foreground text-sm font-medium text-center">
          Failed to load this episode.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      <EpisodePlayer
        sourceUrl={selectedServerSafe.url}
        referer={selectedServerSafe.embed}
        selectedQuality={selectedQuality}
        safeAreaTop={top}
        accent={accent}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <EpisodeTitleInfo
          animeTitle={playQuery.data.title}
          episodeNumber={currentEpisode.number}
          episodeTitle={currentEpisode.title}
          duration={currentEpisode.duration}
        />

        <Separator />

        <View className="p-5">
          <ServerSwitcher
            servers={displaySources}
            selectedServerId={selectedServerSafe.id}
            onSelect={setSelectedServer}
          />
          <QualitySwitcher
            qualities={availableQualities}
            selectedQuality={selectedQuality}
            onSelect={setSelectedQuality}
          />
        </View>

        <Separator className="mt-1" />

        <EpisodeActions
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={() => hasPrev && prevSession && navigateToEpisode(prevSession)}
          onNext={() => hasNext && nextSession && navigateToEpisode(nextSession)}
          accent={accent}
          surfaceColor={surfaceColor}
          isDark={isDark}
        />

        <Separator className="mt-1" />

        <EpisodeGrid
          episodes={episodes}
          totalEps={
            releasesQuery.data?.paginationInfo.total ?? episodes.length
          }
          currentEpisodeNumber={currentEpisode.number}
          onSelect={navigateToEpisode}
          hasMorePages={
            (releasesQuery.data?.paginationInfo.lastPage ?? 1) > 1
          }
          onSeeAll={() => router.push(`/anime/${animeId}/episode-list`)}
        />

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
