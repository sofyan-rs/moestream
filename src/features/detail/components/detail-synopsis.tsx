import { appTheme } from '@/src/constants/app-theme';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AltArrowDown, AltArrowUp } from 'react-native-solar-icons/icons/linear';
import { useUniwind } from 'uniwind';

type Props = {
    sinopsis: string[];
}

const MAX_LINES = 3;

export function DetailSynopsis({ sinopsis }: Props) {
    const synopsis = sinopsis.join(' ');
    const [expanded, setExpanded] = useState(false);
    const { theme } = useUniwind();
    const accent = theme === 'dark' ? appTheme.colors.dark.primary : appTheme.colors.light.primary;

    return (
        <View className="px-5 mb-5">
            <Text className="text-foreground text-base font-bold mb-2" style={{ color: accent }}>
                Synopsis
            </Text>
            <Text
                className="text-foreground text-sm leading-relaxed font-normal"
                numberOfLines={expanded ? undefined : MAX_LINES}
            >
                {synopsis}
            </Text>
            <Pressable
                onPress={() => setExpanded(prev => !prev)}
                className="flex-row items-center gap-1 mt-2"
                hitSlop={8}
            >
                <Text className="text-sm font-semibold" style={{ color: accent }}>
                    {expanded ? 'Read less' : 'Read more'}
                </Text>
                {expanded
                    ? <AltArrowUp size={14} color={accent} />
                    : <AltArrowDown size={14} color={accent} />
                }
            </Pressable>
        </View>
    );
}
