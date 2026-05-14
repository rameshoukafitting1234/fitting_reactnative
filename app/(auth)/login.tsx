

import React, { useState } from "react";
import {
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";




const REGISTERED_USERS = [
  { email: "admin@fitting.com", password: "password123" },
  { email: "user@test.com", password: "123456" },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleLogin = () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email";
    if (!password.trim()) nextErrors.password = "Password is required";
    else if (password.length < 6) nextErrors.password = "Minimum 6 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

     
      const userFound = REGISTERED_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (userFound) {
        if (userFound.password === password) {
          router.replace("/homepage"); 
        } else {
          setErrors({ password: "Wrong password, please try again" });
        }
      } else {
        Alert.alert(
          "Account Not Found",
          "This email is not registered. We will take you to create a new account.",
          [
            { 
              text: "OK", 
              onPress: () => router.push("/(auth)/sign-up") 
            }
          ]
        );
      }
    }, 1000);
  };


  const getInputClassName = (field: "email" | "password") => {
    const base = "flex-row items-center h-14 rounded-[18px] mb-1 px-4 border-2";
    if (errors[field]) return `${base} bg-white border-red-500`;
    if (focusedField === field) return `${base} bg-white border-[#FFD166]`;
    return `${base} bg-white/95 border-transparent`;
  };

  return (
    <ImageBackground
      source={require("@/assets/images/R.jpg")}
      className="flex-1" 
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/55 px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-10">

            
            <Text className="text-[#FFD166] text-center text-xs font-bold tracking-[3px] uppercase mb-2">
              ✦ Welcome to Fitting ✦
            </Text>
            <Text className="text-white text-4xl font-black text-center mb-11">
              Sign in Your Account
            </Text>

            <View className="mb-4">
               <Input className={getInputClassName("email")}>
                <InputSlot className="pr-2">
                  <Ionicons name="mail-outline" size={22} color={errors.email ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Enter Your Email"
                  placeholderTextColor="#666"
                  className="flex-1 text-sm text-black h-full"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              {!!errors.email && (
                <Text className="text-red-400 text-xs font-semibold mt-1 ml-1">
                  {errors.email}
                </Text>
              )}
            </View>

            <View className="mb-2">
              <Input className={getInputClassName("password")}>
                <InputSlot className="pr-2">
                  <Ionicons name="lock-closed-outline" size={22} color={errors.password ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Enter Your Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-sm text-black h-full"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <InputSlot onPress={() => setShowPassword(!showPassword)} className="pl-2">
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#999"
                  />
                </InputSlot>
              </Input>
              {!!errors.password && (
                <Text className="text-red-400 text-xs font-semibold mt-1 ml-1">
                  {errors.password}
                </Text>
              )}
            </View>

            <View className="flex-row justify-between items-center mb-7 mt-2">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
              >
                <View
                  className={`w-5 h-5 rounded-md border-2 items-center justify-center mr-2 ${
                    rememberMe ? "bg-[#3d5236] border-[#3d5236]" : "border-white/80"
                  }`}
                >
                  {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-white font-semibold text-sm">Remember me</Text>
              </TouchableOpacity>

              <Link href="/forgetpassword" asChild>
                <TouchableOpacity>
                  <Text className="text-[#FFD166] font-bold text-sm">Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Button
              className={`bg-[#3d5236] h-14 rounded-full active:opacity-80 ${isSubmitting ? "opacity-70" : ""}`}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <ButtonText className="text-white text-xl font-extrabold text-center w-full">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </ButtonText>
            </Button>

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[0.5px] bg-white/25" />
              <Text className="text-white/60 text-[10px] font-bold mx-4 uppercase tracking-widest">
                Or sign in with
              </Text>
              <View className="flex-1 h-[0.5px] bg-white/25" />
            </View>

            <View className="flex-row justify-center gap-4">
              <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <MaterialCommunityIcons name="google" size={26} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <MaterialCommunityIcons name="message-text" size={26} color="#3d5236" />
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <MaterialCommunityIcons name="facebook" size={26} color="#4267B2" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-10 mb-6">
              <Text className="text-white/85">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-[#FFD166] font-bold underline">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}