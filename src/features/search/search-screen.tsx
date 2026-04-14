import ErrorMessage from "@/src/components/error/error-message";
import { appTheme } from "@/src/constants/app-theme";
import { getSearch, type ISearchResultItem } from "@/src/services/api/search";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "heroui-native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearch({ query: debouncedQuery, page: 1 }),
    enabled: debouncedQuery.length > 0,
  });

  const results: ISearchResultItem[] = data?.data ?? [];
  const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

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
      {error && (
        <View className="px-5">
          <ErrorMessage message={error.message} />
        </View>
      )}
      {isQueryEmpty ? (
        <SearchEmptyState variant="initial" />
      ) : isLoading ? (
        <FlatList<number>
          data={skeletonItems}
          keyExtractor={(item) => `search-skeleton-${item}`}
          renderItem={() => (
            <View className="flex-row px-5 py-3 gap-3">
              <Skeleton
                isLoading
                className="rounded-xl"
                style={{ width: 90, height: 128 }}
              />
              <View className="flex-1 justify-center">
                <Skeleton
                  isLoading
                  className="rounded-full"
                  style={{ width: "90%", height: 14 }}
                />
                <Skeleton
                  isLoading
                  className="rounded-full mt-2"
                  style={{ width: 80, height: 10 }}
                />
                <View className="flex-row items-center gap-2 mt-2">
                  <Skeleton
                    isLoading
                    className="rounded-full"
                    style={{ width: 40, height: 10 }}
                  />
                  <Skeleton
                    isLoading
                    className="rounded-md"
                    style={{ width: 60, height: 10 }}
                  />
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          ItemSeparatorComponent={() => (
            <View className="mx-5 border-b border-border opacity-50" />
          )}
        />
      ) : results.length > 0 ? (
        <FlatList<ISearchResultItem>
          data={results}
          keyExtractor={(item) => item.session}
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
