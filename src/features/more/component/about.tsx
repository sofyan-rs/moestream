import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { Button, Dialog } from "heroui-native";
import { useState, type ReactElement } from "react";
import { Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

// const APP_NAME = "Moestream";

type Props = {
  trigger: ReactElement;
};

export default function About({ trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const version =
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    "—";

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-background">
          <View className="flex-row justify-end">
            <Dialog.Close variant="ghost" />
          </View>
          <View className="items-center mb-5">
            <View className="size-20 items-center justify-center rounded-full bg-accent/15">
              <StyledIonicons
                name="play-circle"
                size={40}
                className="text-accent"
              />
            </View>
          </View>
          <View className="mb-6 gap-2 items-center px-1">
            <Dialog.Title className="text-center">
              <Text className="text-accent font-semibold text-2xl">
                Moe
              </Text>
              <Text className="text-foreground font-semibold text-2xl">stream</Text>
            </Dialog.Title>
            <Dialog.Description className="text-center">
              A simple anime streaming app for Android and iOS. Browse series,
              pick sources, and resume where you left off—watchlist and history
              are stored only on this device.
            </Dialog.Description>
            <Text className="text-xs font-medium text-foreground text-center mt-1">
              Version {version}
            </Text>
            <Text className="text-xs font-normal text-foreground text-center">
              Created by KoiDev
            </Text>
          </View>
          <Button onPress={() => setIsOpen(false)}>Close</Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
