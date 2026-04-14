import { ListGroup, PressableFeedback, Separator, Switch } from "heroui-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

export default function MoreScreen() {
  const { theme } = useUniwind();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  return (
    <ScrollView className="bg-background p-5">
      <ListGroup className="rounded-xl">
        <PressableFeedback animation={false} onPress={() => { }}>
          <PressableFeedback.Scale>
            <ListGroup.Item disabled>
              <ListGroup.ItemContent>
                <ListGroup.ItemTitle>History</ListGroup.ItemTitle>
                <ListGroup.ItemDescription>
                  View your watching history
                </ListGroup.ItemDescription>
              </ListGroup.ItemContent>
              <ListGroup.ItemSuffix />
            </ListGroup.Item>
          </PressableFeedback.Scale>
          <PressableFeedback.Ripple />
        </PressableFeedback>

        <Separator className="mx-4" />

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


      </ListGroup>
      <View className="items-center justify-center mt-4">
        <Text className="text-sm font-medium text-foreground">
          Created by KoiDev
        </Text>
      </View>
    </ScrollView>
  );
}
