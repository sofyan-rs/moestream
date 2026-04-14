import { appTheme } from "@/src/constants/app-theme";
import { type TEpisodeRelease } from "@/src/services/api/episode";
import { Button, PressableFeedback } from "heroui-native";
import { Text, View } from "react-native";
import { CheckCircle } from "react-native-solar-icons/icons/bold";
import { useUniwind } from "uniwind";
import { cn } from "tailwind-variants";

type Props = {
  episodes: TEpisodeRelease[];
  totalEps: number;
  currentEpisodeNumber: number;
  onSelect: (episodeSession: string) => void;
  /** Episode sessions (API id) the user has mostly finished — from watch history. */
  watchedEpisodeSessions?: ReadonlySet<string>;
  hasMorePages?: boolean;
  onSeeAll?: () => void;
};

export function EpisodeGrid({
  episodes,
  totalEps,
  currentEpisodeNumber,
  onSelect,
  watchedEpisodeSessions,
  hasMorePages = false,
  onSeeAll,
}: Props) {
  const { theme } = useUniwind();
  const checkColor =
    theme === "dark"
      ? appTheme.colors.dark.primary
      : appTheme.colors.light.primary;

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
          const isWatched = watchedEpisodeSessions?.has(ep.session) ?? false;
          return (
            <View key={ep.id} className="shrink-0 px-1" style={{ width: "18.2%" }}>
              <View className="relative">
                <Button
                  onPress={() => onSelect(ep.session)}
                  variant="outline"
                  size="md"
                  className={cn(
                    "w-full rounded-lg",
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
                {isWatched ? (
                  <View
                    className="absolute -bottom-0.5 -right-0.5 rounded-full bg-surface"
                    pointerEvents="none"
                  >
                    <CheckCircle size={14} color={checkColor} />
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
