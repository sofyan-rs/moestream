import { EpisodeScreen } from '@/src/features/episode/episode-screen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function EpisodePage() {
    const { id, episode } = useLocalSearchParams<{ id: string; episode: string }>();

    return <EpisodeScreen animeId={id} episodeSession={episode} />;
}
