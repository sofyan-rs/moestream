import LoadingSpinner from '@/src/components/loading/loading-spinner';
import { appTheme } from '@/src/constants/app-theme';
import { getOngoing, type TOngoingSeries } from '@/src/services/api/ongoing';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { PressableFeedback } from 'heroui-native';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'react-native-solar-icons/icons/outline';
import { NewEpisodeCard } from './components/new-episode-card';

export default function NewEpisodesScreen() {
    const router = useRouter();
    const { top } = useSafeAreaInsets();

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
        isRefetching,
    } = useInfiniteQuery({
        queryKey: ['ongoing-list'],
        queryFn: ({ pageParam = 1 }) => getOngoing({ page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.ongoing.length > 0 ? allPages.length + 1 : undefined,
    });

    const items: TOngoingSeries[] = data?.pages.flatMap(p => p.ongoing) ?? [];

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: top }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 px-5 py-4 bg-surface">
                <PressableFeedback onPress={() => router.back()} hitSlop={12}>
                    <ArrowLeft size={24} color={appTheme.colors.light.primary} />
                </PressableFeedback>
                <Text className="text-lg font-semibold text-foreground">
                    New Episodes
                </Text>
            </View>

            {isLoading ? (
                <LoadingSpinner size='lg' />
            ) : (
                <FlatList<TOngoingSeries>
                    data={items}
                    keyExtractor={item => item.endpoint}
                    renderItem={({ item }) => <NewEpisodeCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[appTheme.colors.light.primary]} />
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <LoadingSpinner />
                        ) : null
                    }
                    ItemSeparatorComponent={() => (
                        <View className="mx-5 border-b border-border opacity-50" />
                    )}
                />
            )}
        </View>
    );
}
