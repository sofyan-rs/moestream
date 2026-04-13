import StarIcon from "@/src/components/icons/star";
import { type TSearchData } from "@/src/services/api/search";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  item: TSearchData;
};

export function AnimeGridCard({ item }: Props) {
  const router = useRouter();

  return (
    <PressableFeedback
      style={{ width: "33.3%", paddingHorizontal: 7, marginBottom: 16 }}
      onPress={() => router.push(`/anime/${item.endpoint}`)}
    >
      <View className="rounded-xl overflow-hidden">
        <Image
          source={{ uri: item.thumb }}
          style={{ width: "100%", height: 105 * 1.45 }}
          contentFit="cover"
        />
      </View>

      {/* {item.rating && (
                <View className="flex-row items-center gap-1 mt-2">
                    <StarIcon size={10} color="#FF2D55" />
                    <Text className="text-accent font-normal" style={{ fontSize: 10 }}>
                        {item.rating}
                    </Text>
                </View>
            )} */}

      <View className="flex-row items-center gap-1 mt-2">
        {item.status}
        <StarIcon size={10} color="#FF2D55" />
        <Text className="text-accent font-normal" style={{ fontSize: 10 }}>
          {item.status}
        </Text>
      </View>

      <Text
        className="text-xs font-semibold text-foreground mt-0.5"
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </PressableFeedback>
  );
}
