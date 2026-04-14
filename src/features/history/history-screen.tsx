import { appTheme } from "@/src/constants/app-theme";
import { buildEpisodePlayerHref } from "@/src/features/episode/episode-path";
import { HistoryItemCard } from "@/src/features/history/components/history-item-card";
import {
  useHistoryStore,
  type IHistoryData,
} from "@/src/hooks/stores/history-store";
import { PressableFeedback } from "heroui-native";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, History } from "react-native-solar-icons/icons/outline";
import { useUniwind } from "uniwind";

function sortByDateDesc(a: IHistoryData, b: IHistoryData) {
  return (
    new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime()
  );
}

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

  const sorted = useMemo(() => [...watches].sort(sortByDateDesc), [watches]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="flex-row items-center gap-3 p-5 bg-surface">
        <PressableFeedback onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={24} color={accent} />
        </PressableFeedback>
        <Text className="text-lg font-semibold text-foreground">History</Text>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(item) => `${item.session}-${item.episodeId}`}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
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
    </View>
  );
}
