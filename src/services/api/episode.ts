import { ApiClient } from "@/src/constants/api-url";
import { getEpisodeList, type IEpisodeListItem } from "./episode-list";

export interface IEpisodePlayIds {
  animepahe_id: number;
  mal_id: number | null;
  anilist_id: number | null;
  anime_planet_id: number | null;
  ann_id: number | null;
  anilist: string | null;
  anime_planet: string | null;
  ann: string | null;
  kitsu: string | null;
  myanimelist: string | null;
}

export interface IEpisodePlaySource {
  url: string;
  isM3U8: boolean;
  embed: string;
  resolution: string;
  isDub: boolean;
  fanSub: string;
  download: string;
}

export interface IEpisodePlayDownload {
  fansub: string;
  quality: string;
  resolution: string;
  filesize: string;
  isDub: boolean;
  pahe: string;
  download: string;
}

/** Raw body from `GET /play/:session?episodeId=…&downloads=true` */
export interface IEpisodePlayApiResponse {
  ids: IEpisodePlayIds;
  session: string;
  provider: string;
  episode: string;
  anime_title: string;
  sources: IEpisodePlaySource[];
  downloads: IEpisodePlayDownload[];
}

export type TPlayableSource = {
  id: string;
  label: string;
  url: string;
  quality: string;
  /** Kwik (or provider) embed page URL — use as `Referer` for stream requests */
  embed: string;
};

export type TEpisodeRelease = {
  id: number;
  number: number;
  title: string;
  duration: string;
  session: string;
};

/** Mapped play payload for the episode screen */
export interface IEpisodeResponse {
  title: string;
  sources: TPlayableSource[];
}

function toEpisodeNumber(episode: IEpisodeListItem["episode"]): number {
  if (episode === null || episode === undefined) return 0;
  if (typeof episode === "number") return episode;
  const n = parseInt(String(episode), 10);
  return Number.isNaN(n) ? 0 : n;
}

function mapListItemToRelease(item: IEpisodeListItem): TEpisodeRelease {
  return {
    id: item.id,
    number: toEpisodeNumber(item.episode),
    title: item.title,
    duration: item.duration,
    session: item.session,
  };
}

export async function getAnimeReleases({
  session,
  page = 1,
  sort = "episode_desc",
}: {
  session: string;
  page?: number;
  sort?: "episode_desc" | "episode_asc";
}) {
  const res = await getEpisodeList({ endpoint: session, page, sort });
  return {
    items: res.data.map(mapListItemToRelease),
    paginationInfo: res.paginationInfo,
  };
}

function mapPlaySource(
  source: IEpisodePlaySource,
  index: number,
): TPlayableSource {
  const quality = `${source.resolution}p`;
  const dub = source.isDub ? " · Dub" : "";
  return {
    id: `${source.embed}-${index}`,
    label: `${source.fanSub} · ${quality}${dub}`,
    url: source.download,
    quality,
    embed: source.embed,
  };
}

export const getEpisodePlay = async ({
  animeSession,
  episodeSession,
}: {
  animeSession: string;
  episodeSession: string;
}): Promise<IEpisodeResponse> => {
  const response = await ApiClient.get(
    `/play/${animeSession}?episodeId=${episodeSession}&downloads=true`,
  );
  const raw = response.data as IEpisodePlayApiResponse;
  return {
    title: raw.anime_title,
    sources: raw.sources.map((s, i) => mapPlaySource(s, i)),
  };
};
