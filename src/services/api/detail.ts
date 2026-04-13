import { ApiClient } from "@/src/constants/api-url";

export interface IAnimeInfoIds {
  animepahe_id: string | null;
  anidb: string | null;
  anilist: string | null;
  animePlanet: string | null;
  ann: string | null;
  kitsu: string | null;
  mal: string | null;
}

export interface IAnimeInfoExternalLink {
  name: string;
  url: string;
}

export interface IAnimeInfoResponse {
  ids: IAnimeInfoIds;
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
  external_links: IAnimeInfoExternalLink[];
  genre: string[];
}

export const getDetail = async ({
  endpoint,
}: {
  endpoint: string;
}): Promise<IAnimeInfoResponse> => {
  try {
    const response = await ApiClient.get(`/${endpoint}`);
    return response.data as IAnimeInfoResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
