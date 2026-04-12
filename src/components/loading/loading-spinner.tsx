import { Spinner } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';

export default function LoadingSpinner({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
    return (
        <View className="flex-1 items-center justify-center">
            <Spinner size={size} />
        </View>
    )
}