import { ApiClient } from "@/src/constants/api-url";

export interface IPopularPaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
}

export interface IPopularAnimeIds {
  animepahe_id: string | null;
  anidb: string | null;
  anilist: string | null;
  animePlanet: string | null;
  ann: string | null;
  kitsu: string | null;
  mal: string | null;
}

export interface IPopularExternalLink {
  name: string;
  url: string;
}

export interface IPopularAnimeItem {
  ids: IPopularAnimeIds;
  title: string;
  image: string;
  preview: string | null;
  synopsis: string | null;
  synonym: string | null;
  japanese: string | null;
  type: string | null;
  episodes: string | number | null;
  status: string | null;
  duration: string | null;
  aired: string | null;
  season: string | null;
  studio: string | null;
  themes: string[];
  demographic: string[];
  external_links: IPopularExternalLink[];
  genre: string[];
  session: string;
  views: number;
}

export interface IPopularResponse {
  paginationInfo: IPopularPaginationInfo;
  data: IPopularAnimeItem[];
}

export const getPopular = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}): Promise<IPopularResponse> => {
  try {
    const response = await ApiClient.get(
      `/popular-series?page=${page}&limit=${limit}`,
    );
    return response.data as IPopularResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
