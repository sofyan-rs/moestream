import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React, { type ReactNode } from "react";
import { Text, View } from "react-native";

const CARD_W = 118;

type Props = {
  item: {
    id: string;
    title: string;
    cover: string;
    type?: string;
    status?: string;
    episode?: string;
    timeAgo?: string;
    /** Shown under the title (e.g. last watched episode). */
    subtitle?: string;
  };
  showDetails?: boolean;
  showBadge?: boolean;
  /** When set, card uses this width and no trailing margin (for grids). */
  cardWidth?: number;
  /** Rendered over the cover, top-left (e.g. episode count). */
  coverTopLeft?: ReactNode;
  /** Rendered over the cover, top-right (e.g. remove action). */
  coverTopRight?: ReactNode;
  /** Overrides default navigation to anime detail. */
  onPress?: () => void;
};

export function PortraitCard({
  item,
  showDetails,
  showBadge,
  cardWidth,
  coverTopLeft,
  coverTopRight,
  onPress: onPressOverride,
}: Props) {
  const router = useRouter();
  const width = cardWidth ?? CARD_W;
  const normalizedStatus =
    item.status === "Currently Airing"
      ? "Ongoing"
      : item.status === "Finished Airing"
        ? "Completed"
        : item.status;

  const handlePress = () => {
    if (onPressOverride) {
      onPressOverride();
      return;
    }
    router.push(`/anime/${item.id}`);
  };

  return (
    <PressableFeedback
      style={{ width, marginRight: cardWidth != null ? 0 : 12 }}
      onPress={handlePress}
    >
      {/* Poster */}
      <View className="rounded-xl overflow-hidden relative">
        {item.cover ? (
          <Image
            source={{ uri: item.cover }}
            style={{ width, height: width * 1.42 }}
            contentFit="cover"
          />
        ) : (
          <View
            className="bg-surface items-center justify-center"
            style={{ width, height: width * 1.42 }}
          />
        )}
        {showBadge && (
          <View
            className="absolute bg-accent rounded-md overflow-hidden px-1.5 py-0.5"
            style={{ top: 8, left: 8 }}
          >
            <Text className="font-bold text-white" style={{ fontSize: 8 }}>
              NEW
            </Text>
          </View>
        )}
        {coverTopLeft != null ? (
          <View
            className="absolute z-10"
            pointerEvents="box-none"
            style={{
              top: 8,
              left: 8,
            }}
          >
            {coverTopLeft}
          </View>
        ) : null}
        {coverTopRight != null ? (
          <View
            className="absolute z-10"
            pointerEvents="box-none"
            style={{
              top: 8,
              right: 8,
            }}
          >
            {coverTopRight}
          </View>
        ) : null}
      </View>

      {/* Type + status row */}
      {showDetails && (item.type || normalizedStatus) && (
        <View className="flex-row items-center gap-1 mt-2">
          <Text className="font-normal text-accent" style={{ fontSize: 10 }}>
            {[item.type, normalizedStatus].filter(Boolean).join(" • ")}
          </Text>
        </View>
      )}

      {/* Episode + time ago */}
      {showBadge && item.episode && (
        <Text className="font-medium text-accent mt-2" style={{ fontSize: 10 }}>
          EP {item.episode} • {item.timeAgo}
        </Text>
      )}

      {/* Title */}
      <Text
        className="text-xs font-semibold text-foreground mt-1"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      {item.subtitle ? (
        <Text
          className="font-medium text-accent mt-0.5"
          style={{ fontSize: 10 }}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
      ) : null}
    </PressableFeedback>
  );
}
