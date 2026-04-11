import { DetailScreen } from '@/src/features/detail/detail-screen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function AnimeDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <DetailScreen id={id ?? '1'} />;
}