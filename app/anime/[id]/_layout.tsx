import { Stack } from 'expo-router';

export default function AnimeLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            {/* URL: /anime/[id] */}
            <Stack.Screen
                name="index"
                options={{ title: 'Anime Detail' }}
            />
            {/* URL: /anime/[id]/episode/[episode] */}
            <Stack.Screen
                name="episode/[episode]"
                options={{ title: 'Watching Episode' }}
            />
        </Stack>
    );
}