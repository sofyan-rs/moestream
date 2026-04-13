import { appTheme } from "@/src/constants/app-theme";
import { type IAnimeInfoResponse } from "@/src/services/api/detail";
import React from "react";
import { Text, View } from "react-native";
import { useUniwind } from "uniwind";

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  if (!value || value.trim().length === 0) return null;

  return (
    <View className="mb-1">
      <Text className="text-foreground text-sm font-semibold">
        {label} : <Text className="text-muted font-normal">{value}</Text>
      </Text>
    </View>
  );
}

type Props = {
  animeDetail: IAnimeInfoResponse;
};

export function DetailStats({ animeDetail }: Props) {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const accent = isDark ? appTheme.colors.dark.primary : appTheme.colors.light.primary;

  const normalizedStatus =
    animeDetail.status === "Currently Airing"
      ? "Ongoing"
      : animeDetail.status === "Finished Airing"
        ? "Completed"
        : (animeDetail.status ?? "-");

  const details: { label: string; value: string }[] = [
    { label: "Synonyms", value: animeDetail.synonym ?? "-" },
    { label: "Japanese", value: animeDetail.japanese ?? "-" },
    { label: "Type", value: animeDetail.type ?? "-" },
    {
      label: "Episodes",
      value: animeDetail.episodes === null ? "-" : String(animeDetail.episodes),
    },
    { label: "Status", value: normalizedStatus },
    { label: "Duration", value: animeDetail.duration ?? "-" },
    { label: "Aired", value: animeDetail.aired ?? "-" },
    { label: "Season", value: animeDetail.season ?? "-" },
    { label: "Studios", value: animeDetail.studio ?? "-" },
    { label: "Themes", value: animeDetail.themes.join(", ") || "-" }
  ];

  return (
    <View className="px-5 mt-5 mb-5 bg-surface p-5">
      <Text className="text-foreground text-base font-bold mb-2" style={{ color: accent }}>
        Details
      </Text>
      {details.map((item) => (
        <DetailRow key={item.label} label={item.label} value={item.value} />
      ))}
    </View>
  );
}
