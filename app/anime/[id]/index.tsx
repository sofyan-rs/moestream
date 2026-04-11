import { DetailScreen } from '@/features/detail/components/detail-screen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function AnimeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <DetailScreen id={id ?? '1'} />
}