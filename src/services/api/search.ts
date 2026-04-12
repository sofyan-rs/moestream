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
    const response = await ApiClient.get(`/search/${query}`);
    return response.data as ISearchResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
