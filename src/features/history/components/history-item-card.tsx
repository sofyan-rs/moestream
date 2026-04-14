import { appTheme } from "@/src/constants/app-theme";
import type { IHistoryData } from "@/src/hooks/stores/history-store";
import { Image } from "expo-image";
import { Button } from "heroui-native";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { TrashBinMinimalistic, Tv } from "react-native-solar-icons/icons/outline";
import { useUniwind } from "uniwind";

const POSTER_W = 108;
const POSTER_H = Math.round((POSTER_W * 3) / 2);

function formatMinutesPart(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0";
  const m = Math.max(0, Math.floor(seconds / 60));
  return String(m);
}

function formatRelativeWatched(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfWatch = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfWatch.getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

type Props = {
  item: IHistoryData;
  onContinue: () => void;
  onDelete: () => void;
};

export function HistoryItemCard({ item, onContinue, onDelete }: Props) {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const colors = isDark ? appTheme.colors.dark : appTheme.colors.light;
  const accent = colors.primary;

  const pct = Math.round(item.progress * 100);
  const currentMin = formatMinutesPart(item.currentDuration);
  const totalMin = formatMinutesPart(item.totalDuration);
  const timeLine =
    item.totalDuration > 0
      ? `${currentMin} min / ${totalMin} min`
      : "—";

  const relative = useMemo(
    () => formatRelativeWatched(item.lastWatchedAt),
    [item.lastWatchedAt],
  );

  return (
    <View className="flex-row rounded-2xl bg-surface overflow-hidden p-3 gap-3">
      {/* Poster + bottom progress */}
      <View className="rounded-xl overflow-hidden bg-background shrink-0">
        <View style={{ width: POSTER_W, height: POSTER_H }}>
          {item.poster ? (
            <Image
              source={{ uri: item.poster }}
              style={{ width: POSTER_W, height: POSTER_H }}
              contentFit="cover"
            />
          ) : (
            <View
              className="bg-background items-center justify-center"
              style={{ width: POSTER_W, height: POSTER_H }}
            />
          )}
          <View
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 4, backgroundColor: colors.primaryLight }}
          >
            <View
              style={{
                height: 4,
                width: `${Math.min(100, Math.max(0, pct))}%` as `${number}%`,
                backgroundColor: accent,
              }}
            />
          </View>
        </View>
      </View>

      {/* Details */}
      <View className="flex-1 min-w-0 py-2">
        <View className="gap-1.5">
          <Text
            className="text-foreground font-semibold text-sm leading-tight"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View className="flex-row items-center gap-2">
            <View
              className="self-start flex-row items-center gap-1 rounded-lg px-2 py-1"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Tv size={14} color={accent} />
              <Text className="font-semibold text-xs" style={{ color: accent }}>
                Episode {item.episodeNumber}
              </Text>
            </View>
            {relative ? (
              <Text
                className="text-xs font-normal"
                style={{ color: colors.textMuted }}
              >
                {relative}
              </Text>
            ) : null}
          </View>

          <View className="flex-row flex-wrap items-center gap-2">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Text className="text-xs font-bold" style={{ color: accent }}>
                {pct}%
              </Text>
            </View>
            <Text
              className="text-xs font-normal"
              style={{ color: colors.textMuted }}
            >
              {timeLine}
            </Text>
          </View>
        </View>

        <View className="flex-row items-stretch gap-2" style={{ marginTop: 10 }}>
          <Button
            className="flex-1 rounded-lg overflow-hidden"
            onPress={onContinue}
            size="sm"
          >
            <Text className="text-white font-semibold text-sm">Continue</Text>
          </Button>
          <Button
            className="rounded-lg overflow-hidden justify-center"
            onPress={onDelete}
            size="sm"
            variant="outline"
          >
            <TrashBinMinimalistic size={20} color="#EF4444" />
          </Button>
        </View>
      </View>
    </View>
  );
}
