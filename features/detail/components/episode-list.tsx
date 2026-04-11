import { appTheme } from '@/constants/app-theme'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { PressableFeedback, Separator } from 'heroui-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Play } from 'react-native-solar-icons/icons/bold'
import { PlayCircle } from 'react-native-solar-icons/icons/linear'
import { useUniwind } from 'uniwind'
import { type AnimeDetail, type AnimeEpisode } from '../data/detail-dummy-data'

type EpisodeItemProps = {
    episode: AnimeEpisode
    animeId: string
}

function EpisodeItem({ episode, animeId }: EpisodeItemProps) {
    const router = useRouter()
    const { theme } = useUniwind()
    const accent = theme === 'dark' ? appTheme.colors.dark.primary : appTheme.colors.light.primary

    return (
        <PressableFeedback
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => router.push(`/anime/${animeId}/episode/${episode.number}`)}
        >
            <PressableFeedback.Highlight />
            <PressableFeedback.Ripple />
            <View className="rounded-xl overflow-hidden" style={{ width: 100, height: 62 }}>
                <Image
                    source={{ uri: episode.thumbnail }}
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
                    Episode {episode.number}
                </Text>
                <Text className="text-foreground text-xs mt-0.5 font-normal" numberOfLines={1}>
                    {episode.title}
                </Text>
                <Text className="text-foreground text-xs mt-1 font-normal">
                    {episode.duration}
                </Text>
            </View>

            <PlayCircle size={22} color={accent} />
        </PressableFeedback>
    )
}

type Props = {
    anime: AnimeDetail
}

export function EpisodeList({ anime }: Props) {
    const { theme } = useUniwind()
    const accent = theme === 'dark' ? appTheme.colors.dark.primary : appTheme.colors.light.primary

    return (
        <View className="mt-2 pb-8">
            <View className='px-5 mb-2'>
                <Separator className='mb-3' />
                <View className="flex-row items-center justify-between">
                    <Text className="text-foreground text-base font-bold" style={{ color: accent }
                    }>
                        Episode List
                    </Text>
                    <Text className="text-foreground  font-normal text-xs">
                        {anime.totalEps} eps
                    </Text>
                </View>
            </View>

            {
                anime.episodes.map((ep, index) => (
                    <View key={ep.id}>
                        <EpisodeItem episode={ep} animeId={anime.id} />
                        {index < anime.episodes.length - 1 && (
                            <View
                                className="mx-4"
                                style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.12)' }}
                            />
                        )}
                    </View>
                ))
            }
        </View >
    )
}
