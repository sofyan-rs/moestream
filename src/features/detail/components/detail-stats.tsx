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
        : (animeDetail.status?.trim() ?? "");

  const details: { label: string; value: string }[] = [
    { label: "Synonyms", value: animeDetail.synonym?.trim() ?? "" },
    { label: "Japanese", value: animeDetail.japanese?.trim() ?? "" },
    { label: "Type", value: animeDetail.type?.trim() ?? "" },
    {
      label: "Episodes",
      value:
        animeDetail.episodes === null || animeDetail.episodes === undefined
          ? ""
          : String(animeDetail.episodes).trim(),
    },
    { label: "Status", value: normalizedStatus },
    { label: "Duration", value: animeDetail.duration?.trim() ?? "" },
    { label: "Aired", value: animeDetail.aired?.trim() ?? "" },
    { label: "Season", value: animeDetail.season?.trim() ?? "" },
    { label: "Studios", value: animeDetail.studio?.trim() ?? "" },
    {
      label: "Themes",
      value: animeDetail.themes.length
        ? animeDetail.themes.join(", ")
        : "",
    },
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
