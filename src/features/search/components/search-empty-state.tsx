import { appTheme } from "@/src/constants/app-theme";
import React from "react";
import { Text, View } from "react-native";
import { Magnifer } from "react-native-solar-icons/icons/outline";
import { useUniwind } from "uniwind";

type Props = {
  variant?: "initial" | "no-results";
};

export function SearchEmptyState({ variant = "initial" }: Props) {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const placeholderColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;

  const title = variant === "initial" ? "Search for anime" : "No results found";
  const subtitle =
    variant === "initial"
      ? "Enter a title to find your favorite series"
      : "Try searching with a different title";

  return (
    <View
      className="flex-1 items-center justify-center gap-2"
      style={{ paddingBottom: 80 }}
    >
      <Magnifer size={48} color={placeholderColor} />
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
      <Text className="text-sm font-normal text-foreground text-center px-8">
        {subtitle}
      </Text>
    </View>
  );
}
