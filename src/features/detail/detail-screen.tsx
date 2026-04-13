import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { getDetail } from "@/src/services/api/detail";
import { getEpisodeList } from "@/src/services/api/episode-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DetailCover } from "./components/detail-cover";
import { DetailInfo } from "./components/detail-info";
import { DetailStats } from "./components/detail-stats";
import { DetailSynopsis } from "./components/detail-synopsis";
import { EpisodeList } from "./components/episode-list";

type Props = {
  id: string;
};

export function DetailScreen({ id }: Props) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ["detail", id],
    queryFn: () => getDetail({ endpoint: id }),
  });
  const {
    data: episodeListData,
    isLoading: isEpisodeListLoading,
    isError: isEpisodeListError,
  } = useQuery({
    queryKey: ["episode-list", id],
    queryFn: () =>
      getEpisodeList({ endpoint: id, page: 1, sort: "episode_desc" }),
  });

  const handlePlay = () => {
    if (episodeListData && episodeListData.data.length > 0) {
      router.push(`/anime/${id}/episode/${episodeListData.data[0].session}`);
    }
  };

  if (isDetailLoading || isEpisodeListLoading) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center"
        style={{ paddingTop: top }}
      >
        <LoadingSpinner size="lg" />
      </View>
    );
  }

  if (isDetailError || isEpisodeListError || !detailData || !episodeListData) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center"
        style={{ paddingTop: top }}
      >
        <Text className="text-foreground text-base font-medium">
          Failed to load anime detail.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <DetailCover cover={detailData.image} onPlay={handlePlay} />
        <DetailInfo
          animeDetail={detailData}
          bookmarked={bookmarked}
          onToggleBookmark={() => setBookmarked((prev) => !prev)}
          onPlay={handlePlay}
        />
        <DetailStats animeDetail={detailData} />
        <DetailSynopsis sinopsis={detailData.synopsis} />
        <EpisodeList
          episodes={episodeListData.data}
          endpoint={id}
          totalEps={episodeListData.paginationInfo.total}
          hasMorePages={episodeListData.paginationInfo.lastPage > 1}
          onSeeAll={() => router.push(`/anime/${id}/episode-list`)}
        />
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
