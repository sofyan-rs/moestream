import { ApiClient } from "@/src/constants/api-url";

export type TSearchData = {
  title: string;
  thumb: string;
  genres: string[];
  status: string;
  rating: string | null;
  endpoint: string;
};

export interface ISearchResponse {
  status: boolean;
  message: string;
  search: TSearchData[];
  query: string;
}

export const getSearch = async ({
  query,
}: {
  query: string;
}): Promise<ISearchResponse> => {
  try {
    const response = await ApiClient.get(`/search?q=${encodeURIComponent(query)}&page=1`);
    const payload = response.data as {
      data?: {
        title?: string;
        poster?: string;
        status?: string;
        score?: string | number | null;
        session?: string;
      }[];
    };

    return {
      status: true,
      message: "OK",
      query,
      search: (payload.data ?? []).map((item) => ({
        title: item.title ?? "",
        thumb: item.poster ?? "",
        genres: [],
        status: item.status ?? "",
        rating:
          item.score === null || item.score === undefined ? null : String(item.score),
        endpoint: item.session ?? "",
      })),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
