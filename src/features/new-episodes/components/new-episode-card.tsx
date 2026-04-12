import { type TOngoingSeries } from '@/src/services/api/ongoing';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { PressableFeedback } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Calendar, ClapperboardPlay } from 'react-native-solar-icons/icons/bold';

const THUMB_W = 90;
const THUMB_H = THUMB_W * 1.42;

type Props = {
    item: TOngoingSeries;
}

export function NewEpisodeCard({ item }: Props) {
    const router = useRouter();

    return (
        <PressableFeedback
            className="flex-row px-5 py-3 gap-3"
            onPress={() => router.push(`/anime/${item.endpoint}`)}
        >
            <PressableFeedback.Highlight />
            <PressableFeedback.Ripple />
            {/* Thumbnail */}
            <View className="rounded-xl overflow-hidden" style={{ width: THUMB_W, height: THUMB_H }}>
                <Image
                    source={{ uri: item.thumb }}
                    style={{ width: THUMB_W, height: THUMB_H }}
                    contentFit="cover"
                />
                {/* NEW badge */}
                <View
                    className="absolute bg-accent rounded-md px-1.5 py-0.5"
                    style={{ top: 7, left: 7 }}
                >
                    <Text className="font-bold text-white" style={{ fontSize: 8 }}>
                        NEW
                    </Text>
                </View>
            </View>

            {/* Info */}
            <View className="flex-1 justify-center gap-2">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
                    {item.title}
                </Text>

                {item.latest_episode && (
                    <View className="flex-row items-center gap-1.5">
                        <ClapperboardPlay size={14} color="#FF2D55" />
                        <Text className="text-xs font-medium text-accent">
                            EP {item.latest_episode}
                        </Text>
                    </View>
                )}

                <View className="flex-row items-center gap-1.5">
                    <Calendar size={14} color="#8E8E93" />
                    <Text className="text-xs text-foreground font-normal">
                        {item.updated_on} · {item.updated_day}
                    </Text>
                </View>
            </View>
        </PressableFeedback>
    );
}
