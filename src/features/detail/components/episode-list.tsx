import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import { type IEpisodeListItem } from "@/src/services/api/episode-list";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import { SortFromBottomToTop, SortFromTopToBottom } from "react-native-solar-icons/icons/linear";
import { useUniwind } from "uniwind";
import { EpisodeListItem } from "../../episode-list/components/episode-list-item";

type Props = {
  episodes: IEpisodeListItem[];
  endpoint: string;
  totalEps: number;
  sort: "episode_desc" | "episode_asc";
  onToggleSort: () => void;
  isFetching?: boolean;
  hasMorePages?: boolean;
  onSeeAll?: () => void;
};

export function EpisodeList({
  episodes,
  endpoint,
  totalEps,
  sort,
  onToggleSort,
  isFetching = false,
  hasMorePages = false,
  onSeeAll,
}: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const accent =
    theme === "dark"
      ? appTheme.colors.dark.primary
      : appTheme.colors.light.primary;
  return (
    <View className="pb-8">
      <View className="px-5 mb-3">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-foreground text-base font-bold"
            style={{ color: accent }}
          >
            Episode List
          </Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-foreground font-normal text-xs">
              {totalEps} eps
            </Text>
            {hasMorePages && onSeeAll ? (
              <PressableFeedback onPress={onSeeAll} hitSlop={8}>
                <Text className="text-accent font-semibold text-xs">See all</Text>
              </PressableFeedback>
            ) : null}
            <PressableFeedback
              onPress={onToggleSort}
              hitSlop={8}
              className="flex-row items-center gap-1"
            >
              {sort === "episode_asc" ? (
                <SortFromBottomToTop size={28} color={accent} />
              ) : (
                <SortFromTopToBottom size={28} color={accent} />
              )}
            </PressableFeedback>
          </View>
        </View>
      </View>

      {isFetching ? (
        <View className="px-5 py-2">
          <LoadingSpinner />
        </View>
      ) : null}

      {!isFetching && episodes.map((ep, index) => (
        <View key={ep.session}>
          <EpisodeListItem
            item={ep}
            index={index}
            accent={accent}
            thumbnailUri={ep.snapshot}
            onPress={(session) => router.push(`/anime/${endpoint}/episode/${session}`)}
          />
          {index < episodes.length - 1 && (
            <View
              className="mx-4"
              style={{ height: 1, backgroundColor: "rgba(148,163,184,0.12)" }}
            />
          )}
        </View>
      ))}
    </View>
  );
}
