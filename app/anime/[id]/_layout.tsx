import { appTheme } from "@/src/constants/app-theme";
import { Stack } from "expo-router";
import { useUniwind } from "uniwind";

export default function AnimeLayout() {
  const { theme } = useUniwind();

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontFamily: "Montserrat_600SemiBold" },
        headerTintColor:
          theme === "light"
            ? appTheme.colors.light.text
            : appTheme.colors.dark.text,
        headerStyle: {
          backgroundColor:
            theme === "light"
              ? appTheme.colors.light.surface
              : appTheme.colors.dark.surface,
        },
        headerShadowVisible: false,
      }}
    >
      {/* URL: /anime/[id] */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* URL: /anime/[id]/episode-list */}
      <Stack.Screen name="episode-list" options={{ headerShown: false }} />
      {/* URL: /anime/[id]/episode/[episode] */}
      <Stack.Screen
        name="episode/[episode]"
        options={{ title: "Watching Episode" }}
      />
    </Stack>
  );
}
