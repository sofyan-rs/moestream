import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { EpisodeScreen } from '@/src/features/episode/episode-screen';

export default function EpisodePage() {
    const { id, episode } = useLocalSearchParams<{ id: string; episode: string }>();
    return <EpisodeScreen animeId={id} episodeNumber={parseInt(episode, 10)} />;
}
