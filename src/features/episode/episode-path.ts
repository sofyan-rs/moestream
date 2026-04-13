import type { Href } from "expo-router";

export type EpisodeReleasesSort = "episode_desc" | "episode_asc";

/** Query string the episode player uses to fetch the matching releases batch. */
export function buildEpisodePlayerHref(
  animeId: string,
  episodeSession: string,
  opts?: { releasesPage?: number; sort?: EpisodeReleasesSort },
): Href {
  const releasesPage = opts?.releasesPage ?? 1;
  const sort = opts?.sort ?? "episode_desc";
  const q = new URLSearchParams({
    releasesPage: String(releasesPage),
    sort,
  });
  return `/anime/${animeId}/episode/${episodeSession}?${q.toString()}` as Href;
}
