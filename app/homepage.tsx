import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0f172a] items-center justify-center px-6">

      <Text className="text-white text-4xl font-black mb-3">
        Welcome Home
      </Text>

      <Text className="text-slate-300 text-base mb-8">
        You are logged in successfully.
      </Text>

      <Button
        size="lg"
        className="bg-[#3d5236] rounded-full px-10"
        onPress={() => router.replace("/(auth)/login")}
      >
        <ButtonText className="text-white text-base font-bold">
          Log out
        </ButtonText>
      </Button>

    </View>
  );
}