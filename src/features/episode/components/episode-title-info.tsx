import { Text, View } from "react-native";

type Props = {
  animeTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  duration: string;
};

export function EpisodeTitleInfo({
  animeTitle,
  episodeNumber,
  episodeTitle,
  duration,
}: Props) {
  return (
    <View className="p-5">
      <View className="flex-row items-center gap-2 mb-2">
        <View className="bg-accent rounded-md px-2 py-1">
          <Text className="font-semibold text-xs text-white">
            Eps {episodeNumber}
          </Text>
        </View>
        <Text className="font-normal text-xs text-foreground">{duration}</Text>
      </View>

      <Text className="text-foreground text-xl font-bold" numberOfLines={2}>
        {animeTitle}
      </Text>

      {episodeTitle ? (
        <Text
          className="font-normal text-xs text-foreground mt-1"
          numberOfLines={1}
        >
          {episodeTitle}
        </Text>
      ) : null}
    </View>
  );
}
