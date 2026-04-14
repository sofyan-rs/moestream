import ErrorMessage from "@/src/components/error/error-message";
import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import { getOngoing, type IAiringData } from "@/src/services/api/ongoing";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PressableFeedback, Skeleton } from "heroui-native";
import React, { useCallback } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "react-native-solar-icons/icons/outline";
import { NewEpisodeCard } from "./components/new-episode-card";

export default function NewEpisodesScreen() {
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
    queryKey: ["ongoing-list"],
    queryFn: ({ pageParam = 1 }) => getOngoing({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginationInfo.nextPageUrl ? allPages.length + 1 : undefined,
  });

  const items: IAiringData[] = data?.pages.flatMap((p) => p.data) ?? [];
  const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      {/* Header */}
      <View className="flex-row items-center gap-3 p-5 bg-surface">
        <PressableFeedback onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={24} color={appTheme.colors.light.primary} />
        </PressableFeedback>
        <Text className="text-lg font-semibold text-foreground">
          New Episodes
        </Text>
      </View>
      {error && (
        <View className="px-5" style={{ marginTop: 15 }}>
          <ErrorMessage message={error.message} />
        </View>
      )}
      {isLoading ? (
        <FlatList<number>
          data={skeletonItems}
          keyExtractor={(item) => `new-episodes-list-skeleton-${item}`}
          renderItem={({ index }) => (
            <View className="flex-row px-5 py-3 gap-3">
              <Skeleton
                isLoading
                className="rounded-xl"
                style={{ width: 90, height: 125 }}
              />
              <View className="flex-1 justify-center">
                <Skeleton
                  isLoading
                  className="rounded-full"
                  style={{ width: "90%", height: 14 }}
                />
                <Skeleton
                  isLoading
                  className="rounded-full mt-2"
                  style={{ width: 50, height: 10 }}
                />
                <Skeleton
                  isLoading
                  className="rounded-full mt-2"
                  style={{ width: 100, height: 10 }}
                />
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          ItemSeparatorComponent={({ leadingItem }) =>
            leadingItem != null ? (
              <View className="mx-5 border-b border-border opacity-50" />
            ) : null
          }
        />
      ) : (
        <FlatList<IAiringData>
          data={items}
          keyExtractor={(item) => item.session}
          renderItem={({ item }) => <NewEpisodeCard item={item} />}
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
