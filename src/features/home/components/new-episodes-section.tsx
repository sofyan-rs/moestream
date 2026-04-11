import React from 'react';
import { FlatList, View } from 'react-native';
import { NEW_EPISODES, type NewEpisodeAnime } from '../data/home-dummy-data';
import { PortraitCard } from './portrait-card';
import { SectionHeader } from './section-header';

export function NewEpisodesSection() {
    return (
        <View className="mb-3">
            <SectionHeader title="New Episodes" />
            <FlatList<NewEpisodeAnime>
                data={NEW_EPISODES}
                renderItem={({ item }) => <PortraitCard item={item} showBadge />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
            />
        </View>
    )
}
