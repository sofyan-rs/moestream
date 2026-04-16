import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { ListGroup, PressableFeedback, Separator, Switch } from "heroui-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import About from "./component/about";

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useUniwind();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const version =
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    "—";

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  return (
    <>
      <ScrollView className="bg-background p-5">
        <ListGroup className="rounded-xl">
          <ListGroup.Item>
            {/* <ListGroup.ItemPrefix>
            {isDarkMode ? (
              <Sun size={22} color={theme === "light" ? "black" : "white"} />
            ) : (
              <Moon size={22} color={theme === "light" ? "black" : "white"} />
            )}
          </ListGroup.ItemPrefix> */}
            <ListGroup.ItemContent>
              <ListGroup.ItemTitle>
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </ListGroup.ItemTitle>
              <ListGroup.ItemDescription>
                Toggle between light and dark mode
              </ListGroup.ItemDescription>
            </ListGroup.ItemContent>
            <ListGroup.ItemSuffix>
              <Switch
                isSelected={isDarkMode}
                onSelectedChange={() => {
                  Uniwind.setTheme(theme === "light" ? "dark" : "light");
                }}
              />
            </ListGroup.ItemSuffix>
          </ListGroup.Item>

          <Separator className="mx-4" />

          <About
            trigger={
              <PressableFeedback animation={false}>
                <PressableFeedback.Scale>
                  <ListGroup.Item>
                    <ListGroup.ItemContent>
                      <ListGroup.ItemTitle>About</ListGroup.ItemTitle>
                      <ListGroup.ItemDescription>
                        App information and notices
                      </ListGroup.ItemDescription>
                    </ListGroup.ItemContent>
                    <ListGroup.ItemSuffix />
                  </ListGroup.Item>
                </PressableFeedback.Scale>
                <PressableFeedback.Ripple />
              </PressableFeedback>
            }
          />
        </ListGroup>
        <View className="items-center justify-center mt-4">
          <Text className="text-sm font-medium text-foreground">
            v{version}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
