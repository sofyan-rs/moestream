import LoadingSpinner from '@/src/components/loading/loading-spinner';
import { getOngoing, type TOngoingSeries } from '@/src/services/api/ongoing';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';
import { PortraitCard } from './portrait-card';
import { SectionHeader } from './section-header';

export function NewEpisodesSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['ongoing', 1],
        queryFn: () => getOngoing({ page: 1 }),
    });

    const items = data?.ongoing ?? [];

    return (
        <View className="mb-3">
            <SectionHeader title="New Episodes" onSeeAll={() => router.push('/new-episodes')} />
            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <FlatList<TOngoingSeries>
                    data={items}
                    renderItem={({ item }) => (
                        <PortraitCard
                            item={{
                                id: item.endpoint,
                                title: item.title,
                                cover: item.thumb,
                                episode: item.latest_episode ?? undefined,
                                timeAgo: item.updated_on,
                            }}
                            showBadge
                        />
                    )}
                    keyExtractor={item => item.endpoint}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
                />
            )}
        </View>
    )
}
