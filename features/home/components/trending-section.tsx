import React from 'react'
import { FlatList, View } from 'react-native'
import { TRENDING, type TrendingAnime } from '../data/home-dummy-data'
import { PortraitCard } from './portrait-card'
import { SectionHeader } from './section-header'

export function TrendingSection() {
    return (
        <View className="mb-3">
            <SectionHeader title="Trending Now" />
            <FlatList<TrendingAnime>
                data={TRENDING}
                renderItem={({ item }) => <PortraitCard item={item} showRating />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </View>
    )
}
