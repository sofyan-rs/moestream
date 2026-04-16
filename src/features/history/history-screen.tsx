import { appTheme } from "@/src/constants/app-theme";
import { buildEpisodePlayerHref } from "@/src/features/episode/episode-path";
import { HistoryItemCard } from "@/src/features/history/components/history-item-card";
import {
  selectContinueWatchingList as selectLatestWatchPerSeries,
  useHistoryStore,
} from "@/src/hooks/stores/history-store";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { History } from "react-native-solar-icons/icons/outline";
import { useUniwind } from "uniwind";

export default function HistoryScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const watches = useHistoryStore((s) => s.watches);
  const removeWatch = useHistoryStore((s) => s.removeWatch);

  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const placeholderColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;
  const accent = isDark
    ? appTheme.colors.dark.primary
    : appTheme.colors.light.primary;

  const rows = useMemo(
    () => selectLatestWatchPerSeries(watches),
    [watches],
  );

  return (
    <FlatList
      className="flex-1 bg-background"
      data={rows}
      keyExtractor={(item) => item.session}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 24,
        flexGrow: 1,
      }}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center gap-2 px-5 py-16">
          <History size={48} color={placeholderColor} />
          <Text className="text-foreground text-sm font-medium text-center">
            Episodes you watch will appear here. Progress is saved on this
            device.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <HistoryItemCard
          item={item}
          onContinue={() =>
            router.push(
              buildEpisodePlayerHref(item.session, item.episodeId, {
                releasesPage: item.releasesPage,
                sort: item.releasesSort,
              }),
            )
          }
          onDelete={() => removeWatch(item.session, item.episodeId)}
        />
      )}
    />
  );
}
