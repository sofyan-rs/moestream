import { ApiClient } from "@/src/constants/api-url";

export interface IAiringPaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  from: number;
  to: number;
}

export interface IAiringData {
  id: number;
  anime_id: number;
  title: string;
  episode: number | string | null;
  episode2: number | string | null;
  edition: string | null;
  fansub: string | null;
  image: string;
  poster: string;
  disc: string | null;
  session: string;
  link: string;
  filler: number;
  created_at: string;
  completed: number;
}

export interface IAiringResponse {
  paginationInfo: IAiringPaginationInfo;
  data: IAiringData[];
}

export const getOngoing = async ({
  page = 1,
}: {
  page: number;
}): Promise<IAiringResponse> => {
  try {
    const response = await ApiClient.get(`/airing?page=${page}`);
    return response.data as IAiringResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
