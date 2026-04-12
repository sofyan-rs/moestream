import LoadingSpinner from '@/src/components/loading/loading-spinner';
import { appTheme } from '@/src/constants/app-theme';
import { getCompleted, type TCompletedSeries } from '@/src/services/api/completed';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { PressableFeedback } from 'heroui-native';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'react-native-solar-icons/icons/outline';
import { CompletedSeriesCard } from './components/completed-series-card';

export default function CompletedScreen() {
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
        queryKey: ['completed-list'],
        queryFn: ({ pageParam = 1 }) => getCompleted({ page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.completed.length > 0 ? allPages.length + 1 : undefined,
    });

    const items: TCompletedSeries[] = data?.pages.flatMap(p => p.completed) ?? [];

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
                    <ArrowLeft size={22} color="#FF2D55" />
                </PressableFeedback>
                <Text className="text-lg font-semibold text-foreground">
                    Completed Series
                </Text>
            </View>

            {isLoading ? (
                <LoadingSpinner size='lg' />
            ) : (
                <FlatList<TCompletedSeries>
                    data={items}
                    keyExtractor={item => item.endpoint}
                    renderItem={({ item }) => <CompletedSeriesCard item={item} />}
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
