import { appTheme } from '@/src/constants/app-theme';
import { type TEpisode } from '@/src/services/api/detail';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { PressableFeedback, Separator } from 'heroui-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Play } from 'react-native-solar-icons/icons/bold';
import { PlayCircle, SortFromBottomToTop, SortFromTopToBottom } from 'react-native-solar-icons/icons/linear';
import { useUniwind } from 'uniwind';

type EpisodeItemProps = {
    episode: TEpisode;
    index: number;
    animeId: string;
    thumb: string;
}

function EpisodeItem({ episode, index, animeId, thumb }: EpisodeItemProps) {
    const router = useRouter();
    const { theme } = useUniwind();
    const accent = theme === 'dark' ? appTheme.colors.dark.primary : appTheme.colors.light.primary;
    const displayNumber = episode.episode_number ?? String(index + 1);

    return (
        <PressableFeedback
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => router.push(`/anime/${animeId}/episode/${episode.episode_endpoint}`)}
        >
            <PressableFeedback.Highlight />
            <PressableFeedback.Ripple />
            <View className="rounded-xl overflow-hidden" style={{ width: 100, height: 62 }}>
                <Image
                    source={{ uri: thumb }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
                <View className="absolute inset-0 items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                >
                    <Play size={28} color="white" />
                </View>
            </View>

            <View className="flex-1">
                <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
                    Episode {displayNumber}
                </Text>
                {/* <Text className="text-foreground text-xs mt-0.5 font-normal" numberOfLines={1}>
                    {episode.episode_title}
                </Text> */}
                <Text className="text-foreground text-xs mt-1 font-normal">
                    {episode.episode_date}
                </Text>
            </View>
            <PlayCircle size={22} color={accent} />
        </PressableFeedback>
    );
}

type Props = {
    episodes: TEpisode[];
    // totalEps: string;
    endpoint: string;
    thumb: string;
}

export function EpisodeList({ episodes, endpoint, thumb }: Props) {
    const { theme } = useUniwind();
    const accent = theme === 'dark' ? appTheme.colors.dark.primary : appTheme.colors.light.primary;
    const [sortAsc, setSortAsc] = useState(false);

    const filteredEpisodes = episodes
        .filter(ep => ep.type === 'episode')
        .slice()
        .sort((a, b) => {
            const numA = a.episode_number ? parseFloat(a.episode_number) : 0;
            const numB = b.episode_number ? parseFloat(b.episode_number) : 0;
            return sortAsc ? numA - numB : numB - numA;
        });

    const totalEps = filteredEpisodes.length;

    return (
        <View className="mt-2 pb-8">
            <View className='px-5 mb-2'>
                <Separator className='mb-3' />
                <View className="flex-row items-center justify-between">
                    <Text className="text-foreground text-base font-bold" style={{ color: accent }}>
                        Episode List
                    </Text>
                    <View className="flex-row items-center gap-3">
                        <Text className="text-foreground font-normal text-xs">
                            {totalEps} eps
                        </Text>
                        <PressableFeedback
                            onPress={() => setSortAsc(prev => !prev)}
                            hitSlop={8}
                            className="flex-row items-center gap-1"
                        >
                            {sortAsc
                                ? <SortFromBottomToTop size={28} color={accent} />
                                : <SortFromTopToBottom size={28} color={accent} />
                            }
                        </PressableFeedback>
                    </View>
                </View>
            </View>

            {filteredEpisodes.map((ep, index) => (
                <View key={ep.episode_endpoint}>
                    <EpisodeItem episode={ep} index={index} animeId={endpoint} thumb={thumb} />
                    {index < filteredEpisodes.length - 1 && (
                        <View
                            className="mx-4"
                            style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.12)' }}
                        />
                    )}
                </View>
            ))}
        </View>
    );
}
