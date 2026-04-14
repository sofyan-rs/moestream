import { Button } from "heroui-native";
import { Text, View } from "react-native";
import { cn } from "tailwind-variants";

type Props = {
  qualities: readonly string[];
  selectedQuality: string;
  onSelect: (quality: string) => void;
};

export function QualitySwitcher({
  qualities,
  selectedQuality,
  onSelect,
}: Props) {
  return (
    <View className="">
      <Text className="text-foreground text-sm font-semibold mb-3">
        Quality
      </Text>
      <View className="flex-row gap-2">
        {qualities.map((q) => {
          const isActive = selectedQuality === q;
          return (
            <Button
              key={q}
              onPress={() => onSelect(q)}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-lg",
                isActive ? "bg-accent" : "bg-surface",
              )}
            >
              <Text
                className={cn(
                  "font-normal text-xs",
                  isActive ? "text-white" : "text-foreground",
                )}
              >
                {q}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
}
