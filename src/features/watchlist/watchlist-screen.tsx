import { PortraitCard } from "@/src/components/anime-card/portrait-card";
import { appTheme } from "@/src/constants/app-theme";
import {
  useWatchlistStore,
  type IWatchlistData,
} from "@/src/hooks/stores/watchlist-store";
import { getDetail } from "@/src/services/api/detail";
import { getEpisodeList } from "@/src/services/api/episode-list";
import { PressableFeedback } from "heroui-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TrashBinMinimalistic } from "react-native-solar-icons/icons/bold";
import { Bookmark } from "react-native-solar-icons/icons/outline";
import { useUniwind } from "uniwind";

const H_PAD = 20;
const GAP = 12;
const NUM_COLUMNS = 3;

export default function WatchlistScreen() {
  const { width } = useWindowDimensions();
  const items = useWatchlistStore((s) => s.items);
  const remove = useWatchlistStore((s) => s.remove);
  const mergeBySession = useWatchlistStore((s) => s.mergeBySession);
  const [refreshing, setRefreshing] = useState(false);

  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const placeholderColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;

  const onRefresh = useCallback(async () => {
    if (items.length === 0) return;
    setRefreshing(true);
    const updates: Record<
      string,
      Partial<Omit<IWatchlistData, "session">>
    > = {};

    try {
      await Promise.allSettled(
        items.map(async (row) => {
          try {
            const [detail, releases] = await Promise.all([
              getDetail({ endpoint: row.session }),
              getEpisodeList({
                endpoint: row.session,
                page: 1,
                sort: "episode_desc",
              }),
            ]);
            updates[row.session] = {
              title: detail.title,
              poster: detail.image,
              status: detail.status ?? "",
              latestEpisode: releases.paginationInfo.total,
            };
          } catch {
            // Skip entries that fail (removed from source, network, etc.)
          }
        }),
      );

      if (Object.keys(updates).length > 0) {
        mergeBySession(updates);
      }
    } finally {
      setRefreshing(false);
    }
  }, [items, mergeBySession]);

  const cardWidth = useMemo(
    () =>
      (width - H_PAD * 2 - (NUM_COLUMNS - 1) * GAP) / NUM_COLUMNS,
    [width],
  );

  return (
    <View className="flex-1 bg-background" >
      <FlatList
        data={items}
        keyExtractor={(item) => item.session}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: 10, paddingVertical: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.light.primary]}
            tintColor={appTheme.colors.light.primary}
          />
        }
        contentContainerStyle={{
          paddingTop: 10,
          paddingHorizontal: 10,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2 p-5">
            <Bookmark size={48} color={placeholderColor} />
            <Text className="text-foreground text-sm font-medium text-center">
              Nothing saved yet. Open an anime and tap the bookmark to add it
              here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: `${100 / NUM_COLUMNS}%` }}>
            <PortraitCard
              cardWidth={cardWidth}
              item={{
                id: item.session,
                title: item.title,
                cover: item.poster,
                status: item.status || undefined,
              }}
              showDetails
              coverTopLeft={
                item.latestEpisode > 0 ? (
                  <View
                    className="rounded-md bg-accent px-1.5 py-0.5"
                    pointerEvents="none"
                  >
                    <Text
                      className="font-bold text-white"
                      style={{ fontSize: 9 }}
                    >
                      EP {item.latestEpisode}
                    </Text>
                  </View>
                ) : null
              }
              coverTopRight={
                <PressableFeedback
                  accessibilityLabel="Remove from watchlist"
                  hitSlop={8}
                  className="rounded-md bg-surface p-1.5"
                  onPress={() => remove(item.session)}
                >
                  <TrashBinMinimalistic size={14} color={
                    isDark ? "#FFFFFF" : "#000000"
                  } />
                </PressableFeedback>
              }
            />
          </View>
        )}
      />
    </View>
  );
}
