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
    const response = await ApiClient.get(`/detail/${endpoint}`);
    return response.data as IDetailResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
