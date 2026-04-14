import ErrorMessage from "@/src/components/error/error-message";
import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import { getPopular, type IPopularAnimeItem } from "@/src/services/api/popular";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React, { useCallback } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "react-native-solar-icons/icons/outline";
import { PopularSeriesCard } from "./components/popular-series-card";

export default function PopularScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["popular-list"],
    queryFn: ({ pageParam = 1 }) =>
      getPopular({ page: pageParam as number, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginationInfo.currentPage < lastPage.paginationInfo.lastPage
        ? allPages.length + 1
        : undefined,
  });

  const items: IPopularAnimeItem[] = data?.pages.flatMap((p) => p.data) ?? [];

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="flex-row items-center gap-3 p-5 bg-surface">
        <PressableFeedback onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#FF2D55" />
        </PressableFeedback>
        <Text className="text-lg font-semibold text-foreground">Popular Series</Text>
      </View>
      {error && (
        <View className="px-5" style={{ marginTop: 15 }}>
          <ErrorMessage message={error.message} />
        </View>
      )}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <FlatList<IPopularAnimeItem>
          data={items}
          keyExtractor={(item) => item.session}
          renderItem={({ item }) => <PopularSeriesCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[appTheme.colors.light.primary]}
            />
          }
          ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
          ItemSeparatorComponent={() => (
            <View className="mx-5 border-b border-border opacity-50" />
          )}
        />
      )}
    </View>
  );
}
