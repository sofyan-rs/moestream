import React from 'react'
import { FlatList, View } from 'react-native'
import { CONTINUE_WATCHING, type ContinueWatchingItem } from '../data/home-dummy-data'
import { ContinueWatchingCard } from './continue-watching-card'
import { SectionHeader } from './section-header'

export function ContinueWatchingSection() {
    return (
        <View className="mb-3">
            <SectionHeader title="Continue Watching" />
            <FlatList<ContinueWatchingItem>
                data={CONTINUE_WATCHING}
                renderItem={({ item }) => <ContinueWatchingCard item={item} />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </View>
    )
}
