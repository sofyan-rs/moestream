import LoadingSpinner from '@/src/components/loading/loading-spinner';
import { getOngoing, type IAiringData } from '@/src/services/api/ongoing';
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

    const items = data?.data ?? [];

    return (
        <View className="mb-3">
            <SectionHeader title="New Episodes" onSeeAll={() => router.push('/new-episodes')} />
            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <FlatList<IAiringData>
                    data={items}
                    renderItem={({ item }) => (
                        <PortraitCard
                            item={{
                                id: item.session,
                                title: item.title,
                                cover: item.poster || item.image,
                                episode: item.episode ? String(item.episode) : undefined,
                                timeAgo: new Date(item.created_at).toLocaleDateString(),
                            }}
                            showBadge
                        />
                    )}
                    keyExtractor={item => item.session}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
                />
            )}
        </View>
    )
}
