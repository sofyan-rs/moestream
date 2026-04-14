import { appTheme } from "@/src/constants/app-theme";
import { HeroBanner } from "@/src/features/home/components/hero-banner";
import { HomeHeader } from "@/src/features/home/components/home-header";
import { NewEpisodesSection } from "@/src/features/home/components/new-episodes-section";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ContinueWatchingSection } from "./components/continue-watching-section";
import { PopularSection } from "./components/popular-section";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["ongoing"] });
    await queryClient.invalidateQueries({ queryKey: ["popular"] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      style={{ paddingTop: top }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[appTheme.colors.light.primary]}
        />
      }
    >
      <HomeHeader />
      <HeroBanner />
      <ContinueWatchingSection />
      <NewEpisodesSection />
      <PopularSection />
      <View className="h-20" />
    </ScrollView>
  );
}
