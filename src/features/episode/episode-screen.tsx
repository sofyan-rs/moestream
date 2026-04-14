import ErrorMessage from "@/src/components/error/error-message";
import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import {
  selectWatchedEpisodeSessions,
  useHistoryStore,
} from "@/src/hooks/stores/history-store";
import { getDetail } from "@/src/services/api/detail";
import {
  getAnimeReleases,
  getEpisodePlay,
  type TPlayableSource,
} from "@/src/services/api/episode";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Button, Separator } from "heroui-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
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

  const detailQuery = useQuery({
    queryKey: ["detail", animeId],
    queryFn: () => getDetail({ endpoint: animeId }),
    enabled: Boolean(animeId),
  });

  const watches = useHistoryStore((s) => s.watches);
  const recordWatch = useHistoryStore((s) => s.recordWatch);

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
  const [showSourceControls, setShowSourceControls] = useState(false);

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

  const watchedEpisodeSessions = useMemo(
    () => selectWatchedEpisodeSessions(watches, animeId),
    [watches, animeId],
  );

  const handleWatchProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!currentEpisode || !playQuery.data) return;
      const totalDuration = duration;
      const progress =
        totalDuration > 0 ? currentTime / totalDuration : 0;
      recordWatch({
        session: animeId,
        title: playQuery.data.title,
        poster: detailQuery.data?.image ?? "",
        episodeNumber: currentEpisode.number,
        episodeId: episodeSession,
        lastWatchedAt: new Date().toISOString(),
        totalDuration,
        currentDuration: currentTime,
        progress,
        releasesPage,
        releasesSort,
      });
    },
    [
      animeId,
      currentEpisode,
      detailQuery.data?.image,
      episodeSession,
      playQuery.data,
      recordWatch,
      releasesPage,
      releasesSort,
    ],
  );

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
        <ErrorMessage message="Failed to load episode." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <EpisodePlayer
        key={episodeSession}
        sourceUrl={selectedServerSafe.url}
        referer={selectedServerSafe.embed}
        title={playQuery.data.title}
        subtitle={`Episode ${currentEpisode.number}`}
        selectedQuality={selectedQuality}
        safeAreaTop={top}
        accent={accent}
        onBack={() => router.back()}
        onWatchProgress={({ currentTime, duration }) =>
          handleWatchProgress(currentTime, duration)
        }
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

        <View className="p-5 gap-3">
          <Button
            variant="outline"
            className="bg-surface"
            onPress={() => setShowSourceControls((open) => !open)}
          >
            {showSourceControls ? "Hide server & quality" : "Server & quality"}
          </Button>
          {showSourceControls ? (
            <>
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
            </>
          ) : null}
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
          watchedEpisodeSessions={watchedEpisodeSessions}
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
