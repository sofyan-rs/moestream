import { EpisodeScreen } from "@/src/features/episode/episode-screen";
import { type EpisodeReleasesSort } from "@/src/features/episode/episode-path";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

function parseReleasesPage(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = parseInt(String(raw ?? "1"), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parseSort(value: unknown): EpisodeReleasesSort {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "episode_asc" ? "episode_asc" : "episode_desc";
}

function parseStartAtSeconds(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = parseFloat(String(raw ?? "0"));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function EpisodePage() {
  const params = useLocalSearchParams<{
    id: string;
    episode: string;
    releasesPage?: string;
    sort?: string;
    t?: string;
  }>();

  const animeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const episodeSession = Array.isArray(params.episode)
    ? params.episode[0]
    : params.episode;
  const releasesPageParam = Array.isArray(params.releasesPage)
    ? params.releasesPage[0]
    : params.releasesPage;
  const sortParam = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const startAtParam = Array.isArray(params.t) ? params.t[0] : params.t;

  const page = useMemo(
    () => parseReleasesPage(releasesPageParam),
    [releasesPageParam],
  );
  const releasesSort = useMemo(() => parseSort(sortParam), [sortParam]);
  const startAtSeconds = useMemo(
    () => parseStartAtSeconds(startAtParam),
    [startAtParam],
  );

  return (
    <EpisodeScreen
      animeId={animeId}
      episodeSession={episodeSession}
      releasesPage={page}
      releasesSort={releasesSort}
      startAtSeconds={startAtSeconds}
    />
  );
}
