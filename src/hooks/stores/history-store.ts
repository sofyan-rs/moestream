import type { EpisodeReleasesSort } from "@/src/features/episode/episode-path";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Episode session string used in `/play` and episode routes (same as `episodeId` query param). */
export interface IHistoryData {
  session: string;
  title: string;
  poster: string;
  episodeNumber: number;
  episodeId: string;
  lastWatchedAt: string;
  totalDuration: number;
  currentDuration: number;
  /** 0–1 playback ratio */
  progress: number;
  releasesPage: number;
  releasesSort: EpisodeReleasesSort;
}

export const HISTORY_WATCHED_THRESHOLD = 0.9;

const mmkv = createMMKV({ id: "moestream-history" });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => {
    mmkv.set(name, value);
  },
  removeItem: (name: string) => {
    mmkv.remove(name);
  },
};

/** One row per anime: the episode you touched most recently. */
export function selectContinueWatchingList(
  watches: IHistoryData[],
): IHistoryData[] {
  const byAnime = new Map<string, IHistoryData>();
  for (const w of watches) {
    const prev = byAnime.get(w.session);
    if (
      !prev ||
      new Date(w.lastWatchedAt).getTime() > new Date(prev.lastWatchedAt).getTime()
    ) {
      byAnime.set(w.session, w);
    }
  }
  return Array.from(byAnime.values()).sort(
    (a, b) =>
      new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime(),
  );
}

type HistoryState = {
  watches: IHistoryData[];
  recordWatch: (entry: IHistoryData) => void;
  removeWatch: (animeSession: string, episodeId: string) => void;
  clearAnime: (animeSession: string) => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      watches: [],
      recordWatch: (entry) =>
        set((s) => {
          let poster = entry.poster;
          if (!poster) {
            const fromPast = s.watches.find(
              (w) => w.session === entry.session && w.poster,
            );
            poster = fromPast?.poster ?? "";
          }
          const merged: IHistoryData = { ...entry, poster };
          const idx = s.watches.findIndex(
            (w) =>
              w.session === merged.session && w.episodeId === merged.episodeId,
          );
          const watches =
            idx >= 0
              ? s.watches.map((w, i) => (i === idx ? merged : w))
              : [...s.watches, merged];
          return { watches };
        }),
      removeWatch: (animeSession, episodeId) =>
        set((s) => ({
          watches: s.watches.filter(
            (w) => !(w.session === animeSession && w.episodeId === episodeId),
          ),
        })),
      clearAnime: (animeSession) =>
        set((s) => ({
          watches: s.watches.filter((w) => w.session !== animeSession),
        })),
    }),
    {
      name: "watch-history",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ watches: state.watches }),
    },
  ),
);

export function selectWatchedEpisodeSessions(
  watches: IHistoryData[],
  animeSession: string,
  threshold = HISTORY_WATCHED_THRESHOLD,
): Set<string> {
  const set = new Set<string>();
  for (const w of watches) {
    if (w.session === animeSession && w.progress >= threshold) {
      set.add(w.episodeId);
    }
  }
  return set;
}
