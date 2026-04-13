import { Spinner } from "heroui-native";
import React from "react";
import { View } from "react-native";

export default function LoadingSpinner({
  size = "lg",
  height = 100,
}: {
  size?: "sm" | "md" | "lg";
  height?: number;
}) {
  return (
    <View className="flex-1 items-center justify-center" style={{ height }}>
      <Spinner size={size} />
    </View>
  );
}
