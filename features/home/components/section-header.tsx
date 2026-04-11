import React from 'react'
import { Pressable, Text, View } from 'react-native'

type Props = {
    title: string
    onSeeAll?: () => void
}

export function SectionHeader({ title, onSeeAll }: Props) {
    return (
        <View className="flex-row items-center justify-between px-5 py-4">
            <Text className='text-lg font-semibold text-foreground'>
                {title}
            </Text>
            <Pressable onPress={onSeeAll}>
                <Text className='text-sm font-medium text-accent'>
                    See All
                </Text>
            </Pressable>
        </View>
    )
}
