export const SERVERS = [
  {
    id: "s1",
    label: "Server 1",
    url: "https://vault-99.kwik.cx/mp4/99/01/1807c59b8a88ac3e911770330867baa99d3617c17a2dec29bc2aca1bc98d6db6?file=AnimePahe_Do_You_Like_Big_Girls__-_2_360p_OceanVeil.mp4",
  },
  {
    id: "s2",
    label: "Server 2",
    url: "https://vault-99.owocdn.top/stream/99/01/6e488cb3fb6c087aeca60d2c90543088e63e5f419477e4d315cc66386a297069/uwu.m3u8",
  },
  {
    id: "s3",
    label: "Server 3",
    url: "https://vault-99.owocdn.top/stream/99/01/6e488cb3fb6c087aeca60d2c90543088e63e5f419477e4d315cc66386a297069/uwu.m3u8",
  },
] as const;

export const QUALITIES = ["1080p", "720p", "480p"];

export type Server = (typeof SERVERS)[number];
export type Quality = string;

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
