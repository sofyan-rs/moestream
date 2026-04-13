import LoadingSpinner from "@/src/components/loading/loading-spinner";
import {
  getPopular,
  type IPopularAnimeItem,
} from "@/src/services/api/popular";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { PortraitCard } from "./portrait-card";
import { SectionHeader } from "./section-header";

export function PopularSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["popular", 1],
    queryFn: () => getPopular({ page: 1, limit: 10 }),
  });

  const items = data?.data ?? [];

  return (
    <View className="mb-3">
      <SectionHeader
        title="Popular Series"
        onSeeAll={() => router.push("/popular-series")}
      />
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <FlatList<IPopularAnimeItem>
          data={items}
          renderItem={({ item }) => (
            <PortraitCard
              item={{
                id: item.session,
                title: item.title,
                cover: item.image,
                type: item.type ?? undefined,
                status: item.status ?? undefined,
              }}
              showDetails
            />
          )}
          keyExtractor={(item) => item.session}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}
    </View>
  );
}
