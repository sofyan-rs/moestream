import { ApiClient } from "@/src/constants/api-url";

export interface IEpisodeListPaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
}

export interface IEpisodeListItem {
  id: number;
  anime_id: number;
  episode: number | string | null;
  episode2: number | string | null;
  edition: string | null;
  title: string;
  snapshot: string;
  disc: string | null;
  audio: string;
  duration: string;
  session: string;
  link: string;
  filler: number;
  created_at: string;
}

export interface IEpisodeListResponse {
  paginationInfo: IEpisodeListPaginationInfo;
  data: IEpisodeListItem[];
}

export const getEpisodeList = async ({
  endpoint,
  page = 1,
  sort = "episode_desc",
}: {
  endpoint: string;
  page: number;
  sort: "episode_desc" | "episode_asc";
}): Promise<IEpisodeListResponse> => {
  try {
    const response = await ApiClient.get(
      `/${endpoint}/releases?sort=${sort}&page=${page}`,
    );
    return response.data as IEpisodeListResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
