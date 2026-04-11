import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Star } from 'react-native-solar-icons/icons/bold'
import { type SearchAnime } from '../data/search-dummy-data'

// const CARD_W = 110

type Props = {
    item: SearchAnime
}

export function AnimeGridCard({ item }: Props) {
    const router = useRouter()

    return (
        <Pressable
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
                <Star size={10} color="#FF2D55" />
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
        </Pressable>
    )
}
