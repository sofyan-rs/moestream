import { ApiClient } from "@/src/constants/api-url";

export type TAnimeDetail = {
  title: string;
  thumb: string;
  sinopsis: string[];
  japanese: string;
  score: string;
  producers: string[];
  type: string;
  status: string;
  total_episode: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: string[];
};

export type TEpisode = {
  episode_title: string;
  episode_endpoint: string;
  episode_date: string;
  episode_number: string | null;
  type: "episode" | "full" | "batch" | "special";
};

export interface IDetailResponse {
  status: boolean;
  message: string;
  anime_detail: TAnimeDetail;
  episode_list: TEpisode[];
  endpoint: string;
}

export const getDetail = async ({
  endpoint,
}: {
  endpoint: string;
}): Promise<IDetailResponse> => {
  try {
    const [infoResponse, releasesResponse] = await Promise.all([
      ApiClient.get(`/animeInfo/${endpoint}`),
      ApiClient.get(`/${endpoint}/animeReleases?sort=episode_desc&page=1`),
    ]);

    const info = infoResponse.data as {
      title?: string;
      image?: string;
      synopsis?: string;
      japanese?: string;
      score?: string | number | null;
      type?: string;
      status?: string;
      episodes?: string | number;
      duration?: string;
      aired?: string;
      studio?: string;
      genre?: string[];
    };
    const releases = releasesResponse.data as {
      data?: {
        title?: string;
        session?: string;
        created_at?: string;
        episode?: string | number | null;
      }[];
    };

    return {
      status: true,
      message: "OK",
      endpoint,
      anime_detail: {
        title: info.title ?? "",
        thumb: info.image ?? "",
        sinopsis: info.synopsis ? [info.synopsis] : [],
        japanese: info.japanese ?? "",
        score: info.score === null || info.score === undefined ? "-" : String(info.score),
        producers: [],
        type: info.type ?? "-",
        status: info.status ?? "-",
        total_episode: info.episodes === null || info.episodes === undefined ? "-" : String(info.episodes),
        duration: info.duration ?? "-",
        release_date: info.aired ?? "-",
        studio: info.studio ?? "-",
        genres: info.genre ?? [],
      },
      episode_list: (releases.data ?? []).map((item) => ({
        episode_title: item.title ?? "",
        episode_endpoint: item.session ?? "",
        episode_date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "",
        episode_number: item.episode === null || item.episode === undefined ? null : String(item.episode),
        type: "episode",
      })),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
