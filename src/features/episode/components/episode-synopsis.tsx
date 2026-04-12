import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    synopsis: string;
    accent: string;
};

export function EpisodeSynopsis({ synopsis, accent }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View className="px-5 py-5">
            <Text className="text-foreground text-sm font-semibold mb-2">Description</Text>
            <Text
                className="text-foreground text-sm font-normal"
                numberOfLines={expanded ? undefined : 3}
            >
                {synopsis}
            </Text>
            <TouchableOpacity onPress={() => setExpanded(p => !p)} style={{ marginTop: 8 }}>
                <Text className="text-accent text-xs font-semibold">
                    {expanded ? 'Show less' : 'Read more'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
