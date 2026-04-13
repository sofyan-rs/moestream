import { type TEpisodeRelease } from "@/src/services/api/episode";
import { Button, PressableFeedback } from "heroui-native";
import { Text, View } from "react-native";
import { cn } from "tailwind-variants";

type Props = {
  episodes: TEpisodeRelease[];
  totalEps: number;
  currentEpisodeNumber: number;
  onSelect: (episodeSession: string) => void;
  hasMorePages?: boolean;
  onSeeAll?: () => void;
};

export function EpisodeGrid({
  episodes,
  totalEps,
  currentEpisodeNumber,
  onSelect,
  hasMorePages = false,
  onSeeAll,
}: Props) {
  return (
    <View className="p-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-foreground text-base font-bold">Episodes</Text>
        <View className="flex-row items-center gap-3">
          <Text className="font-normal text-xs text-foreground">
            {totalEps} eps
          </Text>
          {hasMorePages && onSeeAll ? (
            <PressableFeedback onPress={onSeeAll} hitSlop={8}>
              <Text className="text-accent font-semibold text-xs">See all</Text>
            </PressableFeedback>
          ) : null}
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {episodes.map((ep) => {
          const isActive = ep.number === currentEpisodeNumber;
          return (
            <Button
              key={ep.id}
              onPress={() => onSelect(ep.session)}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-lg",
                isActive ? "bg-accent" : "bg-surface",
              )}
            >
              <Text
                className={cn(
                  "text-base tabular-nums",
                  isActive
                    ? "text-white font-semibold"
                    : "text-foreground font-normal",
                )}
              >
                {ep.number}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
}
