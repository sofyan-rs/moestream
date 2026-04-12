import StarIcon from '@/src/components/icons/star';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { PressableFeedback } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';
import { type SearchAnime } from '../data/search-dummy-data';

// const CARD_W = 110

type Props = {
    item: SearchAnime;
}

export function AnimeGridCard({ item }: Props) {
    const router = useRouter();

    return (
        <PressableFeedback
            style={{ width: '33.3%', paddingHorizontal: 7, marginBottom: 16 }}
            onPress={() => router.push(`/anime/${item.id}`)}
        >
            <View className="rounded-xl overflow-hidden">
                <Image
                    source={{ uri: item.cover }}
                    style={{ width: '100%', height: 105 * 1.45 }}
                    contentFit="cover"
                />
            </View>

            <View className="flex-row items-center gap-1 mt-2">
                <StarIcon size={10} color="#FF2D55" />
                <Text className="text-accent font-normal" style={{ fontSize: 10 }}>
                    {item.rating}
                </Text>
                <Text className="text-foreground font-normal" style={{ fontSize: 10 }}>
                    • {item.episodeCount} eps
                </Text>
            </View>

            <Text className="text-xs font-semibold text-foreground mt-0.5" numberOfLines={2}>
                {item.title}
            </Text>
        </PressableFeedback>
    )
}
