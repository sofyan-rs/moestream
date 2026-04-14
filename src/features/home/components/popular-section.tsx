import ErrorMessage from "@/src/components/error/error-message";
import {
  getPopular,
  type IPopularAnimeItem,
} from "@/src/services/api/popular";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Skeleton } from "heroui-native";
import React from "react";
import { FlatList, View } from "react-native";
import { PortraitCard } from "../../../components/anime-card/portrait-card";
import { SectionHeader } from "./section-header";

export function PopularSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["popular", 1],
    queryFn: () => getPopular({ page: 1, limit: 10 }),
  });

  const items = data?.data ?? [];
  const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  return (
    <View className="mb-3">
      <SectionHeader
        title="Popular Series"
        onSeeAll={() => router.push("/popular-series")}
      />
      {error && (
        <View className="px-5">
          <ErrorMessage message={error.message} />
        </View>
      )}
      {isLoading ? (
        <FlatList<number>
          data={skeletonItems}
          keyExtractor={(item) => `popular-skeleton-${item}`}
          renderItem={({ index }) => (
            <View style={{ width: 118, marginRight: index === skeletonItems.length - 1 ? 0 : 12 }}>
              <Skeleton className="rounded-xl" style={{ width: 118, height: 160 }} />
              <Skeleton
                className="rounded-full mt-2"
                style={{ width: 80, height: 8 }}
              />
              <Skeleton
                className="rounded-full"
                style={{ width: 118, height: 12, marginTop: 7 }}
              />
              <Skeleton
                className="rounded-full"
                style={{ width: 94, height: 12, marginTop: 5 }}
              />
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
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
