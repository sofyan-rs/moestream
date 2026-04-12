export const SERVERS = [
  {
    id: "s1",
    label: "Server 1",
    url: "https://xenforo.com/community/data/xfmg/video/157/157924-80fc41522d86e7b72ee0a467f67e7572.mp4?hash=gPxBUi2G57",
  },
  {
    id: "s2",
    label: "Server 2",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "s3",
    label: "Server 3",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
] as const;

export const QUALITIES = ["1080p", "720p", "480p"] as const;

export type Server = (typeof SERVERS)[number];
export type Quality = (typeof QUALITIES)[number];

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
