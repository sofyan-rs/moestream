import { appTheme } from "@/src/constants/app-theme";
import { Button } from "heroui-native";
import { Text, View } from "react-native";
import { SkipNext, SkipPrevious } from "react-native-solar-icons/icons/linear";
import { cn } from "tailwind-variants";

type Props = {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  accent: string;
  surfaceColor: string;
  isDark: boolean;
};

export function EpisodeActions({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  accent,
  surfaceColor,
  isDark,
}: Props) {
  const iconColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;
  const accentColor = isDark
    ? appTheme.colors.dark.primary
    : appTheme.colors.light.primary;

  return (
    <View className="p-5 flex-col gap-3">
      {/* Download / Share (temporarily hidden)
            <View className='flex-row gap-2.5'>
                <Button variant="outline" className="flex-1 bg-surface round" onPress={onDownload}>
                    <DownloadMinimalistic size={16} color={iconColor} />
                    <Text className="text-foreground font-semibold text-sm">
                        Download
                    </Text>
                </Button>
                <Button variant="outline" className="flex-1 bg-surface" onPress={onShare}>
                    <Share size={16} color={iconColor} />
                    <Text className="text-foreground font-semibold text-sm">
                        Share
                    </Text>
                </Button>
            </View>
            */}

      {/* Prev / Next */}
      <View className="flex-row gap-2.5">
        <Button
          variant="outline"
          className={cn("flex-1 bg-surface", hasPrev ? "border-accent" : "")}
          isDisabled={!hasPrev}
          onPress={onPrev}
        >
          <SkipPrevious size={16} color={hasPrev ? accentColor : iconColor} />
          <Text
            className={cn(
              "font-semibold text-sm",
              hasPrev ? "text-accent" : "text-muted",
            )}
          >
            Previous
          </Text>
        </Button>
        <Button
          variant="outline"
          className={cn("flex-1 bg-surface", hasNext ? "border-accent" : "")}
          isDisabled={!hasNext}
          onPress={onNext}
        >
          <Text
            className={cn(
              "font-semibold text-sm",
              hasNext ? "text-accent" : "text-muted",
            )}
          >
            Next
          </Text>
          <SkipNext size={16} color={hasNext ? accentColor : iconColor} />
        </Button>
      </View>
    </View>
  );
}
