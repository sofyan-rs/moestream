import ErrorMessage from "@/src/components/error/error-message";
import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import { buildEpisodePlayerHref } from "@/src/features/episode/episode-path";
import { getEpisodeList } from "@/src/services/api/episode-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import { EpisodeListHeader } from "./components/episode-list-header";
import { EpisodeListItem } from "./components/episode-list-item";
import { EpisodeListMeta } from "./components/episode-list-meta";

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
    error,
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

  const releasesPageForSession = useCallback(
    (session: string) => {
      for (const page of data?.pages ?? []) {
        if (page.data.some((e) => e.session === session)) {
          return page.paginationInfo.currentPage;
        }
      }
      return 1;
    },
    [data?.pages],
  );

  if (isLoading) {
    return <View
      className="flex-1 bg-background items-center justify-center"
      style={{ paddingTop: top }}
    >
      <LoadingSpinner size="lg" />
    </View>;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <EpisodeListHeader
        accent={accent}
        sort={sort}
        onBack={() => router.back()}
        onToggleSort={() =>
          setSort((prev) => (prev === "episode_desc" ? "episode_asc" : "episode_desc"))
        }
      />

      <FlatList
        data={episodes}
        keyExtractor={(item) => item.session}
        renderItem={({ item, index }) => (
          <EpisodeListItem
            item={item}
            index={index}
            accent={accent}
            onPress={(session) =>
              router.push(
                buildEpisodePlayerHref(id, session, {
                  releasesPage: releasesPageForSession(session),
                  sort,
                }),
              )
            }
          />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <EpisodeListMeta totalCount={totalCount} />
            {error && (
              <View className="px-4" style={{ marginTop: 10 }}>
                <ErrorMessage message={error.message} />
              </View>
            )}
          </>}
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
