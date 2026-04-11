import { appTheme } from '@/constants/app-theme'
import React from 'react'
import { Text, View } from 'react-native'
import { Magnifer } from 'react-native-solar-icons/icons/outline'
import { useUniwind } from 'uniwind'

export function SearchEmptyState() {
    const { theme } = useUniwind()
    const isDark = theme === 'dark'
    const placeholderColor = isDark ? appTheme.colors.dark.text : appTheme.colors.light.text

    return (
        <View className="flex-1 items-center justify-center gap-2" style={{ paddingBottom: 80 }}>
            <Magnifer size={48} color={placeholderColor} />
            <Text className="text-lg font-semibold text-foreground">
                No results found
            </Text>
            <Text className="text-sm font-normal text-foreground text-center px-8">
                Try a different title or adjust the genre filter
            </Text>
        </View>
    )
}
