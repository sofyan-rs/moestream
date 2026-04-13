import { appTheme } from "@/src/constants/app-theme";
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { useUniwind } from "uniwind";

type Props = {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
};

export function GenreFilter({ genres, selected, onSelect }: Props) {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const accentColor = isDark
    ? appTheme.colors.dark.primary
    : appTheme.colors.light.primary;
  const inputBg = isDark
    ? appTheme.colors.dark.surface
    : appTheme.colors.light.surface;
  const textColor = isDark
    ? appTheme.colors.dark.text
    : appTheme.colors.light.text;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 5,
        gap: 8,
      }}
    >
      {genres.map((genre) => {
        const active = selected === genre;
        return (
          <Pressable
            key={genre}
            onPress={() => onSelect(genre)}
            className="rounded-lg p-2"
            style={{
              backgroundColor: active ? accentColor : inputBg,
              borderWidth: active ? 0 : 1,
              borderColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? "#fff" : textColor }}
            >
              {genre}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
