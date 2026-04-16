import StarIcon from "@/src/components/icons/star";
import { appTheme } from "@/src/constants/app-theme";
import { type ISearchResultItem } from "@/src/services/api/search";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";
import { cn } from "tailwind-variants";
import { useUniwind } from "uniwind";

const THUMB_W = 90;
const THUMB_H = THUMB_W * 1.42;

type Props = {
  item: ISearchResultItem;
};

function statusLabel(status: string) {
  if (status === "Currently Airing") return "Ongoing";
  if (status === "Finished Airing") return "Completed";
  return status;
}

export function SearchResultCard({ item }: Props) {
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const iconColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;
  const backgroundColor = isDark ? appTheme.colors.dark.surface : appTheme.colors.light.surface;

  const label = statusLabel(item.status);
  const isOngoing = item.status === "Currently Airing";
  const rating =
    typeof item.score === "number" && !Number.isNaN(item.score)
      ? item.score
      : null;
  const metaLine = [item.type, item.year > 0 ? String(item.year) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <PressableFeedback
      className="flex-row px-5 py-3 gap-3"
      onPress={() => router.push(`/anime/${item.session}`)}
    >
      <PressableFeedback.Highlight />
      <PressableFeedback.Ripple />

      {/* Thumbnail */}
      <View
        className="rounded-xl overflow-hidden"
        style={{ width: THUMB_W, height: THUMB_H, backgroundColor: backgroundColor }}
      >
        <Image
          source={{ uri: item.poster }}
          style={{ width: THUMB_W, height: THUMB_H }}
          contentFit="cover"
        />
      </View>

      {/* Info */}
      <View className="flex-1 justify-center gap-2">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {metaLine ? (
          <Text
            className="text-xs text-foreground font-normal"
            numberOfLines={1}
            style={{ color: iconColor }}
          >
            {metaLine}
          </Text>
        ) : null}

        <View className="flex-row items-center gap-2">
          {rating !== null && (
            <View className="flex-row items-center gap-1">
              <StarIcon size={14} color={appTheme.colors.light.primary} />
              <Text className="text-xs font-medium text-accent">
                {rating.toFixed(1)}
              </Text>
            </View>
          )}
          {item.status ? (
            <View
              className={cn(
                "rounded-md px-2 py-0.5 self-start overflow-hidden",
                isOngoing ? "bg-accent" : "bg-surface",
              )}
            >
              <Text
                className={cn(
                  "text-foreground font-semibold",
                  isOngoing ? "text-white" : "text-foreground",
                )}
                style={{ fontSize: 10 }}
              >
                {label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </PressableFeedback>
  );
}
