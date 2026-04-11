import { appTheme } from '@/src/constants/app-theme';
import { InputGroup } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';
import { Magnifer } from 'react-native-solar-icons/icons/outline';
import { useUniwind } from 'uniwind';

type Props = {
    value: string
    onChangeText: (text: string) => void
    onClear: () => void
}

export function SearchBar({ value, onChangeText, onClear }: Props) {
    const { theme } = useUniwind()
    const isDark = theme === 'dark'
    const textColor = isDark ? appTheme.colors.dark.text : appTheme.colors.light.text

    return (
        <View className="px-5" style={{ paddingTop: 20, paddingBottom: 10 }}>
            <InputGroup>
                <InputGroup.Prefix isDecorative>
                    <Magnifer size={16} color={textColor} />
                </InputGroup.Prefix>
                <InputGroup.Input className='rounded-xl' placeholder="Search anime..." value={value} onChangeText={onChangeText} />
            </InputGroup>
        </View>
    )
}
