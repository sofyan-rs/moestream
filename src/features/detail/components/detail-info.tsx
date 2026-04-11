import { appTheme } from '@/src/constants/app-theme';
import { Button } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Bookmark, Play } from 'react-native-solar-icons/icons/bold';
import { Bookmark as BookmarkOutline, DownloadMinimalistic } from 'react-native-solar-icons/icons/linear';
import { useUniwind } from 'uniwind';
import { type AnimeDetail } from '../data/detail-dummy-data';

type Props = {
    anime: AnimeDetail;
    bookmarked: boolean;
    onToggleBookmark: () => void;
    onPlay: () => void;
}

export function DetailInfo({ anime, bookmarked, onToggleBookmark, onPlay }: Props) {
    const { theme } = useUniwind();
    const isDark = theme === 'dark';
    const iconColor = isDark ? appTheme.colors.dark.text : appTheme.colors.light.text;

    return (
        <View className="p-5">
            {/* Title + bookmark */}
            <View className="flex-row items-start justify-between gap-3">
                <Text className="text-foreground text-2xl font-bold flex-1" numberOfLines={2}>
                    {anime.title}
                </Text>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-0.5"
                    onPress={onToggleBookmark}
                >
                    {bookmarked
                        ? <Bookmark size={22} color={bookmarked ? appTheme.colors.light.primary : iconColor} />
                        : <BookmarkOutline size={22} color="#94A3B8" />
                    }
                </Button>
            </View>

            {/* Genres */}
            <Text className="text-foreground font-normal text-sm mt-2 mb-3">
                {anime.genres.join(', ')}
            </Text>

            {/* CTA Buttons */}
            <View className="flex-row gap-2.5 mt-2">
                <Button className="flex-1" onPress={onPlay}>
                    <Play size={15} color="white" />
                    <Text className="text-white font-bold text-sm">Play</Text>
                </Button>
                <Button variant="outline" className="flex-1 bg-surface">
                    <DownloadMinimalistic size={15} color={iconColor} />
                    <Text className="text-foreground font-semibold text-sm">Download</Text>
                </Button>
            </View>
        </View>
    );
}
