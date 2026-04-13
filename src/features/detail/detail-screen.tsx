import LoadingSpinner from '@/src/components/loading/loading-spinner';
import { getDetail } from '@/src/services/api/detail';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DetailCover } from './components/detail-cover';
import { DetailInfo } from './components/detail-info';
import { DetailStats } from './components/detail-stats';
import { DetailSynopsis } from './components/detail-synopsis';
import { EpisodeList } from './components/episode-list';

type Props = {
    id: string;
}

export function DetailScreen({ id }: Props) {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [bookmarked, setBookmarked] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['detail', id],
        queryFn: () => getDetail({ endpoint: id }),
    });

    const handlePlay = () => {
        if (data && data.episode_list.length > 0) {
            router.push(`/anime/${id}/episode/${data.episode_list[0].episode_endpoint}`);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: top }}>
                <LoadingSpinner size="lg" />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: top }}>
                <Text className="text-foreground text-base font-medium">Failed to load anime detail.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background" >
            <ScrollView
                className="flex-1 bg-background"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <DetailCover
                    cover={data.anime_detail.thumb}
                    onPlay={handlePlay}
                />
                <DetailInfo
                    animeDetail={data.anime_detail}
                    bookmarked={bookmarked}
                    onToggleBookmark={() => setBookmarked(prev => !prev)}
                    onPlay={handlePlay}
                />
                <DetailStats animeDetail={data.anime_detail} />
                <DetailSynopsis sinopsis={data.anime_detail.sinopsis} />
                <EpisodeList
                    episodes={data.episode_list}
                    // totalEps={data.anime_detail.total_episode}
                    endpoint={data.endpoint}
                    thumb={data.anime_detail.thumb}
                />
                <View className='h-20' />
            </ScrollView>
        </View>
    );
}
