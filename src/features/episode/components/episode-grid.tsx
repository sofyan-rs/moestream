import { Button } from "heroui-native";
import { ScrollView, Text, View } from "react-native";
import { cn } from "tailwind-variants";
import { type TEpisodeRelease } from "@/src/services/api/episode";

type Props = {
  episodes: TEpisodeRelease[];
  totalEps: number;
  currentEpisodeNumber: number;
  onSelect: (episodeSession: string) => void;
  accent: string;
  surfaceColor: string;
  isDark: boolean;
};

export function EpisodeGrid({
  episodes,
  totalEps,
  currentEpisodeNumber,
  onSelect,
  accent,
  surfaceColor,
  isDark,
}: Props) {
  return (
    <View className="p-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-foreground text-base font-bold">Episodes</Text>
        <Text className="font-normal text-xs text-foreground">
          {totalEps} eps
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {episodes.map((ep) => {
            const isActive = ep.number === currentEpisodeNumber;
            return (
              // <TouchableOpacity
              //     key={ep.id}
              //     onPress={() => onSelect(ep.number)}
              //     style={{
              //         width: 46, height: 46, borderRadius: 12,
              //         alignItems: 'center', justifyContent: 'center',
              //         backgroundColor: isActive ? accent : surfaceColor,
              //         borderWidth: 1,
              //         borderColor: isActive ? accent : 'rgba(148,163,184,0.15)',
              //     }}
              // >
              //     <Text style={{
              //         color: isActive ? '#fff' : (isDark ? '#CBD5E1' : '#334155'),
              //         fontSize: 14,
              //         fontWeight: isActive ? '700' : '500',
              //     }}>
              //         {ep.number}
              //     </Text>
              // </TouchableOpacity>
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
                    "text-base",
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
      </ScrollView>
    </View>
  );
}
