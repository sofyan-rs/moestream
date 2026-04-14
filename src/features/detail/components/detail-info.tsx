import { appTheme } from "@/src/constants/app-theme";
import {
  HISTORY_WATCHED_THRESHOLD,
  useHistoryStore,
} from "@/src/hooks/stores/history-store";
import { useWatchlistStore } from "@/src/hooks/stores/watchlist-store";
import { type IAnimeInfoResponse } from "@/src/services/api/detail";
import { Button } from "heroui-native";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { Bookmark, Play } from "react-native-solar-icons/icons/bold";
import {
  Bookmark as BookmarkOutline
} from "react-native-solar-icons/icons/linear";
import { useUniwind } from "uniwind";

type Props = {
  animeDetail: IAnimeInfoResponse;
  session: string;
  latestEpisode: number;
  onPlay: () => void;
};

export function DetailInfo({
  animeDetail,
  session,
  latestEpisode,
  onPlay,
}: Props) {
  const bookmarked = useWatchlistStore((s) =>
    s.items.some((i) => i.session === session),
  );
  const toggle = useWatchlistStore((s) => s.toggle);

  const hasWatchHistory = useHistoryStore((s) =>
    s.watches.some(
      (w) => w.session === session && w.progress < HISTORY_WATCHED_THRESHOLD,
    ),
  );

  const watchlistPayload = useMemo(
    () => ({
      session,
      title: animeDetail.title,
      poster: animeDetail.image,
      status: animeDetail.status ?? "",
      latestEpisode,
    }),
    [animeDetail, latestEpisode, session],
  );

  const onToggleBookmark = useCallback(() => {
    toggle(watchlistPayload);
  }, [toggle, watchlistPayload]);

  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const iconColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;

  return (
    <View className="p-5">
      {/* Title + bookmark */}
      <View className="flex-row items-start justify-between gap-3">
        <Text
          className="text-foreground text-2xl font-bold flex-1"
          numberOfLines={2}
        >
          {animeDetail.title}
        </Text>
        <Button
          variant="ghost"
          size="sm"
          className="mt-0.5"
          onPress={onToggleBookmark}
        >
          {bookmarked ? (
            <Bookmark
              size={22}
              color={bookmarked ? appTheme.colors.light.primary : iconColor}
            />
          ) : (
            <BookmarkOutline size={22} color="#94A3B8" />
          )}
        </Button>
      </View>

      {/* Genres */}
      <Text className="text-foreground font-normal text-sm mt-2 mb-3">
        {animeDetail.genre.join(", ")}
      </Text>

      {/* CTA Buttons */}
      <View className="flex-row gap-2.5 mt-2">
        <Button className="flex-1" onPress={onPlay}>
          <Play size={16} color="white" />
          <Text className="text-white font-bold text-sm">
            {hasWatchHistory ? "Continue" : "Play"}
          </Text>
        </Button>
        {/* <Button variant="outline" className="flex-1 bg-surface">
          <DownloadMinimalistic size={16} color={iconColor} />
          <Text className="text-foreground font-semibold text-sm">
            Download
          </Text>
        </Button> */}
      </View>
    </View>
  );
}
