import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { appTheme } from "@/src/constants/app-theme";
import { getSearch, type TSearchData } from "@/src/services/api/search";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { AnimeGridCard } from './components/anime-grid-card';
// import { GenreFilter } from './components/genre-filter';
import { SearchBar } from "./components/search-bar";
import { SearchEmptyState } from "./components/search-empty-state";
import { SearchResultCard } from "./components/search-result-card";

export function SearchScreen() {
  const { top } = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearch({ query: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
  });

  const results: TSearchData[] = data?.search ?? [];
  const isQueryEmpty = debouncedQuery.length === 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="pb-3">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
        />
        {/* <GenreFilter genres={GENRES} selected={selectedGenre} onSelect={setSelectedGenre} /> */}
      </View>

      {isQueryEmpty ? (
        <SearchEmptyState variant="initial" />
      ) : isLoading ? (
        <LoadingSpinner size="lg" />
      ) : results.length > 0 ? (
        <FlatList<TSearchData>
          data={results}
          keyExtractor={(item) => item.endpoint}
          renderItem={({ item }) => <SearchResultCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          ItemSeparatorComponent={() => (
            <View className="mx-5 border-b border-border opacity-50" />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[appTheme.colors.light.primary]}
            />
          }
        />
      ) : (
        <SearchEmptyState variant="no-results" />
      )}
    </View>
  );
}
