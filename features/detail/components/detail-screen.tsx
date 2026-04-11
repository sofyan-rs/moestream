import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getAnimeDetail } from '../data/detail-dummy-data'
import { DetailCover } from './detail-cover'
import { DetailInfo } from './detail-info'
import { DetailStats } from './detail-stats'
import { DetailSynopsis } from './detail-synopsis'
import { EpisodeList } from './episode-list'

type Props = {
    id: string
}

export function DetailScreen({ id }: Props) {
    const { top } = useSafeAreaInsets();
    const router = useRouter()
    const anime = getAnimeDetail(id)
    const [bookmarked, setBookmarked] = useState(false)

    const handlePlay = () => {
        if (anime.episodes.length > 0) {
            router.push(`/anime/${id}/episode/${anime.episodes[0].number}`)
        }
    }

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: top }}>
            <ScrollView
                className="flex-1 bg-background"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <DetailCover
                    cover={anime.cover}
                    onPlay={handlePlay}
                />
                <DetailInfo
                    anime={anime}
                    bookmarked={bookmarked}
                    onToggleBookmark={() => setBookmarked(prev => !prev)}
                    onPlay={handlePlay}
                />
                <DetailStats anime={anime} />
                <DetailSynopsis synopsis={anime.synopsis} />
                <EpisodeList anime={anime} />
                <View className='h-20' />
            </ScrollView>
        </View>
    )
}
