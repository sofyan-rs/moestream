import EpisodeListScreen from '@/src/features/episode-list/episode-list-screen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function EpisodeListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <EpisodeListScreen id={id} />
  )
}