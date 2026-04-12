import { ContinueWatchingSection } from '@/src/features/home/components/continue-watching-section'
import { HeroBanner } from '@/src/features/home/components/hero-banner'
import { HomeHeader } from '@/src/features/home/components/home-header'
import { NewEpisodesSection } from '@/src/features/home/components/new-episodes-section'
import { FEATURED } from '@/src/features/home/data/home-dummy-data'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CompletedSection } from './components/completed-section'

export default function HomeScreen() {
    const { top } = useSafeAreaInsets();

    return (
        <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false} style={{ paddingTop: top }}>
            <HomeHeader />
            <HeroBanner items={FEATURED} />
            <ContinueWatchingSection />
            <NewEpisodesSection />
            <CompletedSection />
            <View className="h-12" />
        </ScrollView>
    )
}
