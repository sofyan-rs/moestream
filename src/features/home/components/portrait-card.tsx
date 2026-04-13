import StarIcon from "@/src/components/icons/star";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

const CARD_W = 118;

type Props = {
  item: {
    id: string;
    title: string;
    cover: string;
    rating?: number;
    episode?: string;
    timeAgo?: string;
  };
  showRating?: boolean;
  showBadge?: boolean;
};

export function PortraitCard({ item, showRating, showBadge }: Props) {
  const router = useRouter();

  return (
    <PressableFeedback
      style={{ width: CARD_W, marginRight: 12 }}
      onPress={() => router.push(`/anime/${item.id}`)}
    >
      {/* Poster */}
      <View className="rounded-xl overflow-hidden">
        <Image
          source={{ uri: item.cover }}
          style={{ width: CARD_W, height: CARD_W * 1.42 }}
          contentFit="cover"
        />
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
      </View>

      {/* Rating row */}
      {showRating && item.rating != null && (
        <View className="flex-row items-center gap-1 mt-2">
          <StarIcon size={11} color="#FF2D55" />
          <Text className="font-normal text-accent" style={{ fontSize: 10 }}>
            {item.rating}
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
    </PressableFeedback>
  );
}
