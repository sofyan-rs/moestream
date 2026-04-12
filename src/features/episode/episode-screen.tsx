import { appTheme } from '@/src/constants/app-theme';
import { Stack, useRouter } from 'expo-router';
import { Separator } from 'heroui-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';
import { getAnimeDetail } from '../detail/data/detail-dummy-data';
import { EpisodeActions } from './components/episode-actions';
import { EpisodeGrid } from './components/episode-grid';
import { EpisodePlayer } from './components/episode-player';
import { EpisodeSynopsis } from './components/episode-synopsis';
import { EpisodeTitleInfo } from './components/episode-title-info';
import { QualitySwitcher } from './components/quality-switcher';
import { ServerSwitcher } from './components/server-switcher';
import { QUALITIES, SERVERS, type Quality, type Server } from './data/episode-constants';

type Props = {
    animeId: string;
    episodeNumber: number;
};

export function EpisodeScreen({ animeId, episodeNumber }: Props) {
    const router = useRouter();
    const { theme } = useUniwind();
    const { top } = useSafeAreaInsets();
    const isDark = theme === 'dark';
    const accent = isDark ? appTheme.colors.dark.primary : appTheme.colors.light.primary;
    const surfaceColor = isDark ? appTheme.colors.dark.surface : appTheme.colors.light.surface;

    const anime = getAnimeDetail(animeId);
    const currentEpisodeIndex = anime.episodes.findIndex(ep => ep.number === episodeNumber);
    const currentEpisode = anime.episodes[currentEpisodeIndex] ?? anime.episodes[0];
    const hasPrev = currentEpisodeIndex > 0;
    const hasNext = currentEpisodeIndex < anime.episodes.length - 1;

    const [selectedServer, setSelectedServer] = useState<Server>(SERVERS[0]);
    const [selectedQuality, setSelectedQuality] = useState<Quality>('720p');

    const navigateToEpisode = (epNumber: number) => {
        router.replace(`/anime/${animeId}/episode/${epNumber}`);
    };

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar hidden />

            <EpisodePlayer
                sourceUrl={selectedServer.url}
                selectedQuality={selectedQuality}
                safeAreaTop={top}
                accent={accent}
                onBack={() => router.back()}
            />

            <ScrollView
                className="flex-1 bg-background"
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <EpisodeTitleInfo
                    animeTitle={anime.title}
                    episodeNumber={currentEpisode.number}
                    episodeTitle={currentEpisode.title}
                    duration={currentEpisode.duration}
                />

                <Separator />

                <View className='p-5'>
                    <ServerSwitcher
                        servers={SERVERS}
                        selectedServerId={selectedServer.id}
                        onSelect={setSelectedServer}
                    />
                    <QualitySwitcher
                        qualities={QUALITIES}
                        selectedQuality={selectedQuality}
                        onSelect={setSelectedQuality}
                    />
                </View>

                <Separator className="mt-1" />

                <EpisodeActions
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                    onPrev={() => hasPrev && navigateToEpisode(anime.episodes[currentEpisodeIndex - 1].number)}
                    onNext={() => hasNext && navigateToEpisode(anime.episodes[currentEpisodeIndex + 1].number)}
                    onDownload={() => { /* download */ }}
                    onShare={() => { /* share */ }}
                    accent={accent}
                    surfaceColor={surfaceColor}
                    isDark={isDark}
                />

                <Separator className="mt-1" />

                <EpisodeGrid
                    episodes={anime.episodes}
                    totalEps={anime.totalEps}
                    currentEpisodeNumber={episodeNumber}
                    onSelect={navigateToEpisode}
                    accent={accent}
                    surfaceColor={surfaceColor}
                    isDark={isDark}
                />

                <Separator className="mt-11" />

                <EpisodeSynopsis synopsis={anime.synopsis} accent={accent} />

                <View className='h-20' />
            </ScrollView>
        </View>
    );
}
