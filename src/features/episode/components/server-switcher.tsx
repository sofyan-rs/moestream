import { Button } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { cn } from 'tailwind-variants';
import { type TPlayableSource } from '@/src/services/api/episode';

type Props = {
    servers: readonly TPlayableSource[];
    selectedServerId: string;
    onSelect: (server: TPlayableSource) => void;
};

export function ServerSwitcher({ servers, selectedServerId, onSelect }: Props) {
    return (
        <View className="mb-5">
            <Text className="text-foreground text-sm font-semibold mb-3">Server</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row gap-2'>
                    {servers.map(server => {
                        const isActive = selectedServerId === server.id;
                        return (
                            <Button
                                key={server.id}
                                onPress={() => onSelect(server)}
                                variant="outline"
                                size='sm'
                                className={
                                    cn(
                                        'rounded-full',
                                        isActive ? 'bg-accent' : 'bg-surface',
                                    )
                                }
                            >
                                <Text className={
                                    cn('font-normal text-xs',
                                        isActive ? 'text-white' : 'text-foreground',
                                    )
                                }>
                                    {server.label}
                                </Text>
                            </Button>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
