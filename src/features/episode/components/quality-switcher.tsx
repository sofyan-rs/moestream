import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import { cn } from 'tailwind-variants';
import { type Quality } from '../data/episode-constants';

type Props = {
    qualities: readonly Quality[];
    selectedQuality: Quality;
    onSelect: (quality: Quality) => void;
};

export function QualitySwitcher({ qualities, selectedQuality, onSelect }: Props) {
    return (
        <View className="">
            <Text className="text-foreground text-sm font-semibold mb-3">Quality</Text>
            <View className='flex-row gap-2'>
                {qualities.map(q => {
                    const isActive = selectedQuality === q;
                    return (
                        <Button
                            key={q}
                            onPress={() => onSelect(q)}
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
                                {q}
                            </Text>
                        </Button>
                    );
                })}
            </View>
        </View>
    );
}
