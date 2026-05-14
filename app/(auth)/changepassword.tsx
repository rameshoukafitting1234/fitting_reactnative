import React, { useState } from "react";
import {
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Success",
        "Your password has been reset successfully. You can now log in.",
        [{ text: "Go to Login", onPress: () => router.replace("/login") }],
      );
    }, 1500);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/R.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/60 px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-10 left-0 w-10 h-10 items-center justify-center bg-white/20 rounded-full z-10"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-4xl font-black text-center mb-4">
              New Password
            </Text>
            <Text className="text-white/70 text-center mb-10 px-6">
              Please enter your new password. Make sure it&apos;s strong and easy
              to remember.
            </Text>

            <View className="mb-4">
              <Input className="flex-row items-center h-14 rounded-[18px] px-4 border-2 border-transparent bg-white/95">
                <InputSlot className="pr-2">
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#3d5236"
                  />
                </InputSlot>
                <InputField
                  placeholder="New Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-black h-full"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <InputSlot
                  onPress={() => setShowPassword(!showPassword)}
                  className="pl-2"
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#999"
                  />
                </InputSlot>
              </Input>
            </View>

            <View className="mb-8">
              <Input className="flex-row items-center h-14 rounded-[18px] px-4 border-2 border-transparent bg-white/95">
                <InputSlot className="pr-2">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color="#3d5236"
                  />
                </InputSlot>
                <InputField
                  placeholder="Confirm New Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-black h-full"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </Input>
            </View>

            <Button
              className="bg-[#FFD166] h-14 rounded-full active:opacity-80"
              onPress={handleResetPassword}
              disabled={isSubmitting}
            >
              <ButtonText className="text-[#3d5236] text-xl font-extrabold">
                {isSubmitting ? "Updating..." : "Update Password"}
              </ButtonText>
            </Button>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
