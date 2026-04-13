import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import {
  getEpisodeList,
  type IEpisodeListItem,
} from "@/src/services/api/episode-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, PlayCircle } from "react-native-solar-icons/icons/linear";
import { Play } from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";

type Props = {
  id: string;
};

export default function EpisodeListScreen({ id }: Props) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { theme } = useUniwind();
  const accent =
    theme === "dark"
      ? appTheme.colors.dark.primary
      : appTheme.colors.light.primary;
  const [sort, setSort] = useState<"episode_desc" | "episode_asc">(
    "episode_desc",
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["episode-list-all", id, sort],
    queryFn: ({ pageParam = 1 }) =>
      getEpisodeList({
        endpoint: id,
        page: pageParam as number,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginationInfo.currentPage < lastPage.paginationInfo.lastPage
        ? allPages.length + 1
        : undefined,
  });

  const episodes = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  const totalCount = data?.pages?.[0]?.paginationInfo.total ?? episodes.length;

  const renderItem = ({ item, index }: { item: IEpisodeListItem; index: number }) => {
    const displayNumber =
      item.episode === null ? String(index + 1) : String(item.episode);

    return (
      <PressableFeedback
        className="flex-row items-center gap-3 px-5 py-3"
        onPress={() => router.push(`/anime/${id}/episode/${item.session}`)}
      >
        <PressableFeedback.Highlight />
        <PressableFeedback.Ripple />
        <View
          className="rounded-xl overflow-hidden"
          style={{ width: 100, height: 62 }}
        >
          <Image
            source={{ uri: item.snapshot }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            <Play size={28} color="white" />
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
            Episode {displayNumber}
          </Text>
          <Text className="text-foreground text-xs mt-1 font-normal">
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <PlayCircle size={22} color={accent} />
      </PressableFeedback>
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="flex-row items-center justify-between px-5 py-4 bg-surface">
        <PressableFeedback onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={22} color={accent} />
        </PressableFeedback>
        <Text className="text-foreground text-base font-semibold">Episode List</Text>
        <PressableFeedback
          onPress={() =>
            setSort((prev) =>
              prev === "episode_desc" ? "episode_asc" : "episode_desc",
            )
          }
          hitSlop={10}
        >
          <Text className="text-accent text-xs font-semibold">
            {sort === "episode_desc" ? "Newest" : "Oldest"}
          </Text>
        </PressableFeedback>
      </View>

      <FlatList
        data={episodes}
        keyExtractor={(item) => item.session}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="px-5 pt-3 pb-2">
            <Text className="text-foreground text-xs font-normal">
              {totalCount} eps
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View
            className="mx-5"
            style={{ height: 1, backgroundColor: "rgba(148,163,184,0.12)" }}
          />
        )}
        ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
