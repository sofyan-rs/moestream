import { Button } from 'heroui-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Bell } from 'react-native-solar-icons/icons/bold'
import { useUniwind } from 'uniwind'

export function HomeHeader() {
    const { theme } = useUniwind()
    const isDark = theme === 'dark'
    const textColor = isDark ? '#FFFFFF' : '#0F172A'

    return (
        <View className="flex-row items-center justify-between p-4">
            <Text className='text-2xl font-bold'>
                <Text className="text-accent">Moe</Text>
                <Text style={{ color: textColor }}>stream</Text>
            </Text>
            <Button
                variant='outline'
                className="w-10 h-10 rounded-full bg-surface items-center justify-center border-surface border"
            >
                <Bell size={19} color={textColor} />
            </Button>
        </View>
    )
}
