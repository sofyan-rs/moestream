import { ContinueWatchingSection } from '@/features/home/components/continue-watching-section'
import { HeroBanner } from '@/features/home/components/hero-banner'
import { HomeHeader } from '@/features/home/components/home-header'
import { NewEpisodesSection } from '@/features/home/components/new-episodes-section'
import { TrendingSection } from '@/features/home/components/trending-section'
import { FEATURED } from '@/features/home/data/home-dummy-data'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
    const { top } = useSafeAreaInsets();

    return (
        <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false} style={{ paddingTop: top }}>
            <HomeHeader />
            <HeroBanner items={FEATURED} />
            <ContinueWatchingSection />
            <TrendingSection />
            <NewEpisodesSection />
            <View className="h-10" />
        </ScrollView>
    )
}
