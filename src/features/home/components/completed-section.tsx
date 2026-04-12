import LoadingSpinner from '@/src/components/loading/loading-spinner'
import { getCompleted, type TCompletedSeries } from '@/src/services/api/completed'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, View } from 'react-native'
import { PortraitCard } from './portrait-card'
import { SectionHeader } from './section-header'

export function CompletedSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['completed', 1],
        queryFn: () => getCompleted({ page: 1 }),
    })

    const items = data?.completed ?? []

    return (
        <View className="mb-3">
            <SectionHeader title="Completed Series" onSeeAll={
                () => router.push('/completed-series')
            } />
            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <FlatList<TCompletedSeries>
                    data={items}
                    renderItem={({ item }) => (
                        <PortraitCard
                            item={{
                                id: item.endpoint,
                                title: item.title,
                                cover: item.thumb,
                                rating: parseFloat(item.score) || undefined,
                            }}
                            showRating
                        />
                    )}
                    keyExtractor={item => item.endpoint}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                />
            )}
        </View>
    )
}
