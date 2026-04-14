import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IWatchlistData {
  session: string;
  title: string;
  poster: string;
  status: string;
  latestEpisode: number;
}

const mmkv = createMMKV({ id: "moestream-watchlist" });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => {
    mmkv.set(name, value);
  },
  removeItem: (name: string) => {
    mmkv.remove(name);
  },
};

type WatchlistPatch = Partial<Omit<IWatchlistData, "session">>;

type WatchlistState = {
  items: IWatchlistData[];
  add: (item: IWatchlistData) => void;
  remove: (session: string) => void;
  toggle: (item: IWatchlistData) => void;
  /** Merge fields from API refresh; unknown sessions are ignored. */
  mergeBySession: (updates: Record<string, WatchlistPatch>) => void;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const rest = s.items.filter((i) => i.session !== item.session);
          return { items: [item, ...rest] };
        }),
      remove: (session) =>
        set((s) => ({
          items: s.items.filter((i) => i.session !== session),
        })),
      toggle: (item) => {
        const exists = get().items.some((i) => i.session === item.session);
        if (exists) {
          get().remove(item.session);
        } else {
          get().add(item);
        }
      },
      mergeBySession: (updates) =>
        set((s) => ({
          items: s.items.map((i) => {
            const patch = updates[i.session];
            return patch ? { ...i, ...patch } : i;
          }),
        })),
    }),
    {
      name: "watchlist",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
