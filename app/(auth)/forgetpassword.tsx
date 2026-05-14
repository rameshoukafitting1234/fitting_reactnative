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

const REGISTERED_USERS = [
  { email: "admin@fitting.com", password: "password123" },
  { email: "user@test.com", password: "123456" },
];

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendCode = () => {
    const emailTrimmed = email.trim().toLowerCase();
    const isValidEmail = (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    if (!isValidEmail(emailTrimmed)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const userExists = REGISTERED_USERS.find((u) => u.email === emailTrimmed);

      if (!userExists) {
        setIsSubmitting(false);
        Alert.alert(
          "Account Not Found",
          "This email is not registered in our system. Please check the email or sign up."
        );
        return;
      }

      setIsSubmitting(false);
      setStep(2);
      Alert.alert(
        "Code Sent",
        "A verification code has been sent to your email."
      );
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") {
  
      Alert.alert("Success", "Code verified! Now reset your password.");
      router.replace("/changepassword");
    } else {
      Alert.alert("Invalid Code", "The code you entered is incorrect.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/R.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/60 px-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center py-10">
            
            <TouchableOpacity
              onPress={() => (step === 1 ? router.back() : setStep(1))}
              className="absolute top-10 left-0 w-10 h-10 items-center justify-center bg-white/20 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-4xl font-black text-center mb-4">
              {step === 1 ? "Forgot Password" : "Verify OTP"}
            </Text>
            <Text className="text-white/70 text-center mb-10 px-4">
              {step === 1
                ? "Enter your email address and we'll send you a code to reset your password."
                : `Enter the 4-digit code sent to \n ${email}`}
            </Text>

            {step === 1 ? (
              <View className="mb-6">
                <Input className="flex-row items-center h-14 rounded-[18px] px-4 border-2 border-transparent bg-white/95">
                  <InputSlot className="pr-2">
                    <Ionicons name="mail-outline" size={22} color="#3d5236" />
                  </InputSlot>
                  <InputField
                    placeholder="Email Address"
                    placeholderTextColor="#666"
                    className="flex-1 text-black h-full"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                <Button
                  className="bg-[#3d5236] h-14 rounded-full mt-6"
                  onPress={handleSendCode}
                  disabled={isSubmitting}
                >
                  <ButtonText className="text-white text-xl font-bold">
                    {isSubmitting ? "Checking..." : "Send Code"}
                  </ButtonText>
                </Button>
              </View>
            ) : (
              <View className="mb-6">
                <Input className="flex-row items-center h-14 rounded-[18px] px-4 border-2 border-transparent bg-white/95">
                  <InputSlot className="pr-2">
                    <Ionicons name="keypad-outline" size={22} color="#3d5236" />
                  </InputSlot>
                  <InputField
                    placeholder="Enter 4-digit code"
                    placeholderTextColor="#666"
                    className="flex-1 text-black h-full text-center text-2xl font-bold tracking-[10px]"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </Input>
                <Button
                  className="bg-[#FFD166] h-14 rounded-full mt-6"
                  onPress={handleVerifyOTP}
                >
                  <ButtonText className="text-[#3d5236] text-xl font-bold">
                    Verify & Proceed
                  </ButtonText>
                </Button>

                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-white font-bold">
                    Didn't receive code?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={handleSendCode}
                    activeOpacity={0.7}
                  >
                    <Text className="text-[#FFD166] font-bold">Resend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}