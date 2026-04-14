import ErrorMessage from "@/src/components/error/error-message";
import LoadingSpinner from "@/src/components/loading/loading-spinner";
import { buildEpisodePlayerHref } from "@/src/features/episode/episode-path";
import { getDetail } from "@/src/services/api/detail";
import { getEpisodeList } from "@/src/services/api/episode-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
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
  const [episodeSort, setEpisodeSort] = useState<"episode_desc" | "episode_asc">(
    "episode_desc",
  );

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
    isFetching: isEpisodeListFetching,
    isError: isEpisodeListError,
  } = useQuery({
    queryKey: ["episode-list", id, episodeSort],
    queryFn: () =>
      getEpisodeList({ endpoint: id, page: 1, sort: episodeSort }),
  });

  const handlePlay = () => {
    if (episodeListData && episodeListData.data.length > 0) {
      router.push(
        buildEpisodePlayerHref(id, episodeListData.data[0].session, {
          releasesPage: 1,
          sort: episodeSort,
        }),
      );
    }
  };

  if (isDetailLoading || (isEpisodeListLoading && !episodeListData)) {
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
        className="flex-1 bg-background justify-center px-5"
        style={{ paddingTop: top }}
      >
        <ErrorMessage message={isDetailError ? "Failed to load anime detail." : isEpisodeListError ? "Failed to load episode list." : "Failed to load anime detail."} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <DetailCover cover={detailData.image} onPlay={handlePlay} />
        <DetailInfo
          animeDetail={detailData}
          session={id}
          latestEpisode={episodeListData.paginationInfo.total}
          onPlay={handlePlay}
        />
        <DetailSynopsis sinopsis={detailData.synopsis} />
        <DetailStats animeDetail={detailData} />
        <EpisodeList
          episodes={episodeListData.data}
          endpoint={id}
          totalEps={episodeListData.paginationInfo.total}
          sort={episodeSort}
          onToggleSort={() =>
            setEpisodeSort((prev) =>
              prev === "episode_desc" ? "episode_asc" : "episode_desc",
            )
          }
          isFetching={isEpisodeListFetching}
          hasMorePages={episodeListData.paginationInfo.lastPage > 1}
          onSeeAll={() => router.push(`/anime/${id}/episode-list`)}
        />
      </ScrollView>
    </View>
  );
}
