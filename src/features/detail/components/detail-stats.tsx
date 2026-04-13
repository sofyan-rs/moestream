import StarIcon from "@/src/components/icons/star";
import { appTheme } from "@/src/constants/app-theme";
import { type IAnimeInfoResponse } from "@/src/services/api/detail";
import { Card, Separator } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import {
  Calendar,
  ClockCircle,
  Home2,
  Playlist,
  Tv,
} from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <View className="items-center flex-1 px-2">
      <View className="mb-1">{icon}</View>
      <Text className="text-accent text-sm text-center font-bold">{value}</Text>
      <Text className="text-foreground font-normal text-xs mt-0.5">
        {label}
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
  const muted = isDark
    ? appTheme.colors.dark.textMuted
    : appTheme.colors.light.textMuted;

  return (
    <View className="px-5 mb-5">
      <Card>
        <Card.Body>
          <View className="flex-row items-center">
            <StatItem
              icon={<Tv size={16} color={muted} />}
              label="Type"
              value={animeDetail.type}
            />
            <Separator orientation="vertical" />
            <StatItem
              icon={<ClockCircle size={16} color={muted} />}
              label="Status"
              value={animeDetail.status}
            />
            <Separator orientation="vertical" />
            <StatItem
              icon={<StarIcon size={16} color={muted} />}
              label="Score"
              value="-"
            />
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(148,163,184,0.15)",
              marginVertical: 12,
            }}
          />
          <View className="flex-row items-center">
            <StatItem
              icon={<Playlist size={16} color={muted} />}
              label="Total Eps"
              value={
                animeDetail.episodes === null
                  ? "-"
                  : String(animeDetail.episodes)
              }
            />
            <Separator orientation="vertical" />
            <StatItem
              icon={<Calendar size={16} color={muted} />}
              label="Released"
              value={animeDetail.aired ?? "-"}
            />
            <Separator orientation="vertical" />
            <StatItem
              icon={<Home2 size={16} color={muted} />}
              label="Studio"
              value={animeDetail.studio ?? "-"}
            />
          </View>
        </Card.Body>
      </Card>
    </View>
  );
}
