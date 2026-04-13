import { ApiClient } from "@/src/constants/api-url";

export interface ISearchPaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  from: number;
  to: number;
}

export interface ISearchResultItem {
  id: number;
  title: string;
  status: string;
  type: string;
  episodes: number;
  score: number;
  year: number;
  season: string;
  poster: string;
  session: string;
  link: string;
}

export interface ISearchResponse {
  paginationInfo: ISearchPaginationInfo;
  data: ISearchResultItem[];
}

export const getSearch = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}): Promise<ISearchResponse> => {
  try {
    const response = await ApiClient.get(
      `/search?q=${encodeURIComponent(query)}&page=${page}`,
    );
    return response.data as ISearchResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
