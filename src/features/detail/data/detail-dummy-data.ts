export type AnimeEpisode = {
  id: string;
  endpoint?: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
};

export type AnimeDetail = {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  rating: number;
  score: number;
  type: "TV" | "Movie" | "OVA" | "ONA" | "Special";
  status: "Ongoing" | "Completed" | "Upcoming";
  totalEps: number;
  releaseDate: string;
  studio: string;
  synopsis: string;
  episodes: AnimeEpisode[];
};

export const ANIME_DETAILS: Record<string, AnimeDetail> = {
  "1": {
    id: "1",
    title: "Demon Slayer: Infinity Castle",
    cover: "https://picsum.photos/seed/demonslayer800/800/1100",
    genres: ["Action", "Fantasy", "Supernatural"],
    rating: 9.2,
    score: 9.2,
    type: "TV",
    status: "Ongoing",
    totalEps: 12,
    releaseDate: "Apr 2025",
    studio: "ufotable",
    synopsis:
      "Tanjiro Kamado and his allies face their most harrowing battle yet inside the labyrinthine Infinity Castle, where Muzan Kibutsuji has gathered the Twelve Kizuki for a final confrontation. Every pillar of the Demon Slayer Corps must fight to the death as the fate of humanity hangs in the balance.",
    episodes: [
      {
        id: "e1",
        number: 1,
        title: "The Infinity Castle",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/ds_ep1/640/360",
      },
      {
        id: "e2",
        number: 2,
        title: "Flame and Water",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/ds_ep2/640/360",
      },
      {
        id: "e3",
        number: 3,
        title: "Upper Rank Demons",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/ds_ep3/640/360",
      },
      {
        id: "e4",
        number: 4,
        title: "Breathing Styles Clash",
        duration: "26 min",
        thumbnail: "https://picsum.photos/seed/ds_ep4/640/360",
      },
      {
        id: "e5",
        number: 5,
        title: "The Sound of Swords",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/ds_ep5/640/360",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Frieren: Beyond Journey's End",
    cover: "https://picsum.photos/seed/frieren800/800/1100",
    genres: ["Adventure", "Fantasy", "Drama"],
    rating: 9.0,
    score: 9.0,
    type: "TV",
    status: "Completed",
    totalEps: 28,
    releaseDate: "Sep 2023",
    studio: "Madhouse",
    synopsis:
      "After the party of heroes defeated the Demon King, they resumed their everyday lives. A decade later, the elven mage Frieren finds herself confronting her own feelings of guilt as she reflects on her years adventuring alongside her now-aging companions.",
    episodes: [
      {
        id: "e1",
        number: 1,
        title: "The Journey's End",
        duration: "46 min",
        thumbnail: "https://picsum.photos/seed/fr_ep1/640/360",
      },
      {
        id: "e2",
        number: 2,
        title: "Killing Magic",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/fr_ep2/640/360",
      },
      {
        id: "e3",
        number: 3,
        title: "Memories of the Journey",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/fr_ep3/640/360",
      },
    ],
  },
  "9": {
    id: "9",
    title: "Wind Breaker Season 2",
    cover: "https://picsum.photos/seed/windbreaker800/800/1100",
    genres: ["Action", "Sports", "Drama"],
    rating: 8.3,
    score: 8.73,
    type: "TV",
    status: "Ongoing",
    totalEps: 13,
    releaseDate: "Apr 2025",
    studio: "CloverWorks",
    synopsis:
      "Sakura Haruka didn't want to have anything to do with weaklings. He was only interested in the strongest of the strong. He just enrolled at Furin High School, a school known for its delinquents. Haruka aims to become the top fighter there.",
    episodes: [
      {
        id: "e1",
        number: 1,
        title: "A New Wind Blows",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/wb_ep1/640/360",
      },
      {
        id: "e2",
        number: 2,
        title: "Rival Appears",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/wb_ep2/640/360",
      },
      {
        id: "e3",
        number: 3,
        title: "True Strength",
        duration: "24 min",
        thumbnail: "https://picsum.photos/seed/wb_ep3/640/360",
      },
    ],
  },
};

export function getAnimeDetail(id: string): AnimeDetail {
  return (
    ANIME_DETAILS[id] ?? {
      id,
      title: "Unknown Anime",
      cover: `https://picsum.photos/seed/anime${id}/800/1100`,
      genres: ["Action"],
      rating: 7.5,
      score: 7.5,
      type: "TV",
      status: "Ongoing",
      totalEps: 12,
      releaseDate: "2024",
      studio: "Unknown Studio",
      synopsis: "No synopsis available.",
      episodes: Array.from({ length: 6 }, (_, i) => ({
        id: `e${i + 1}`,
        number: i + 1,
        title: `Episode ${i + 1}`,
        duration: "24 min",
        thumbnail: `https://picsum.photos/seed/anime${id}_ep${i + 1}/640/360`,
      })),
    }
  );
}
