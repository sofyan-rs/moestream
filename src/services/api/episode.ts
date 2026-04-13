import { ApiClient } from "@/src/constants/api-url";

export type TPlayableSource = {
  id: string;
  label: string;
  url: string;
  quality: string;
  fansub: string;
};

export type TEpisodeRelease = {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  session: string;
};

export interface IEpisodeReleasesResponse {
  items: TEpisodeRelease[];
}

export interface IPlayResponse {
  episodeNumber: number;
  title: string;
  synopsis: string;
  duration: string;
  sources: TPlayableSource[];
}

export const getAnimeReleases = async ({
  session,
}: {
  session: string;
}): Promise<IEpisodeReleasesResponse> => {
  const response = await ApiClient.get(
    `/${session}/animeReleases?sort=episode_asc&page=1`
  );
  const payload = response.data as {
    data?: {
      id?: number | string;
      episode?: number | string | null;
      title?: string;
      duration?: string;
      snapshot?: string;
      session?: string;
    }[];
  };

  return {
    items: (payload.data ?? []).map((item, index) => ({
      id: String(item.id ?? index),
      number:
        item.episode === null || item.episode === undefined
          ? index + 1
          : Number(item.episode),
      title: item.title ?? "",
      duration: item.duration ?? "-",
      thumbnail: item.snapshot ?? "",
      session: item.session ?? "",
    })),
  };
};

export const getEpisodePlay = async ({
  animeSession,
  episodeSession,
}: {
  animeSession: string;
  episodeSession: string;
}): Promise<IPlayResponse> => {
  const response = await ApiClient.get(
    `/play/${animeSession}?episodeId=${episodeSession}&downloads=true`
  );
  const payload = response.data as {
    episode?: string | number;
    anime_title?: string;
    sources?: {
      url?: string;
      resolution?: string | number;
      fanSub?: string;
    }[];
  };

  const sources: TPlayableSource[] = (payload.sources ?? [])
    .filter((source) => Boolean(source.url))
    .map((source, index) => {
      const quality = source.resolution ? `${source.resolution}p` : "Auto";
      return {
        id: `server-${index + 1}`,
        label: `Server ${index + 1}`,
        url: source.url ?? "",
        quality,
        fansub: source.fanSub ?? "",
      };
    });

  return {
    episodeNumber: Number(payload.episode ?? 0),
    title: payload.anime_title ?? "",
    synopsis: "",
    duration: "-",
    sources,
  };
};
