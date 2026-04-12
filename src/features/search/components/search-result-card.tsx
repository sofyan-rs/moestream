import StarIcon from '@/src/components/icons/star';
import { appTheme } from '@/src/constants/app-theme';
import { type TSearchData } from '@/src/services/api/search';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { PressableFeedback } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useUniwind } from 'uniwind';

const THUMB_W = 90;
const THUMB_H = THUMB_W * 1.42;

type Props = {
    item: TSearchData;
}

export function SearchResultCard({ item }: Props) {
    const router = useRouter();
    const { theme } = useUniwind();
    const isDark = theme === 'dark';
    const iconColor = isDark ? appTheme.colors.dark.text : appTheme.colors.light.text;
    const rating = item.rating ? parseFloat(item.rating) : null;

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
            </View>

            {/* Info */}
            <View className="flex-1 justify-center gap-2">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
                    {item.title}
                </Text>

                {rating !== null && !isNaN(rating) && (
                    <View className="flex-row items-center gap-1">
                        <StarIcon size={14} color={appTheme.colors.light.primary} />
                        <Text className="text-xs font-medium text-accent">
                            {rating.toFixed(1)}
                        </Text>
                    </View>
                )}

                {item.genres.length > 0 && (
                    <Text className="text-xs text-foreground font-normal" numberOfLines={1} style={{ color: iconColor }}>
                        {item.genres.join(' · ')}
                    </Text>
                )}

                {item.status ? (
                    <View className="bg-surface rounded-md px-2 py-0.5 self-start">
                        <Text className="text-foreground font-semibold" style={{ fontSize: 10 }}>
                            {item.status}
                        </Text>
                    </View>
                ) : null}
            </View>
        </PressableFeedback>
    );
}
