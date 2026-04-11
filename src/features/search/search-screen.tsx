import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimeGridCard } from './components/anime-grid-card';
import { GenreFilter } from './components/genre-filter';
import { SearchBar } from './components/search-bar';
import { SearchEmptyState } from './components/search-empty-state';
import { GENRES, SEARCH_RESULTS } from './data/search-dummy-data';

export function SearchScreen() {
    const { top } = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return SEARCH_RESULTS.filter(anime => {
            const matchesQuery = q.length === 0 || anime.title.toLowerCase().includes(q);
            const matchesGenre =
                selectedGenre === 'All' || anime.genres.includes(selectedGenre);
            return matchesQuery && matchesGenre;
        })
    }, [query, selectedGenre]);

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: top }}>
            <View className='pb-3'>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    onClear={() => setQuery('')}
                />
                <GenreFilter
                    genres={GENRES}
                    selected={selectedGenre}
                    onSelect={setSelectedGenre}
                />
            </View>

            {filtered.length > 0 ? (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}
                    columnWrapperStyle={{ justifyContent: 'flex-start' }}
                    renderItem={({ item }) => <AnimeGridCard item={item} />}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <SearchEmptyState />
            )}
        </View>
    )
}
