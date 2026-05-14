import React, { useState } from "react";
import {
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";

type Field = "fullName" | "email" | "password" | "confirmPassword";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField]       = useState<Field | null>(null);
  const [errors, setErrors]                   = useState<Partial<Record<Field, string>>>({});
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [successMessage, setSuccessMessage]   = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const clearError = (field: Field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleCreateAccount = () => {
    const next: Partial<Record<Field, string>> = {};

    if (!fullName.trim())                        next.fullName = "Full name is required";
    if (!email.trim())                           next.email = "Email is required";
    else if (!isValidEmail(email))               next.email = "Please enter a valid email";
    if (!password.trim())                        next.password = "Password is required";
    else if (password.length < 6)               next.password = "Minimum 6 characters";
    if (!confirmPassword.trim())                 next.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)       next.confirmPassword = "Passwords do not match";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Account registered successfully!");
      setTimeout(() => router.replace("/(auth)/login"), 1000);
    }, 1500);
  };

  const getInputClass = (field: Field) => {
    const base = "h-14 rounded-[18px] mb-1 px-2 border-2 flex-row items-center";
    if (errors[field])          return `${base} bg-white border-red-500`;
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center py-9">

            
            <Text className="text-[#FFD166] text-center text-[10px] font-bold tracking-[3px] uppercase mb-2">
              ✦ Join Fitting Today ✦
            </Text>
            <Text className="text-white text-[34px] font-black text-center mb-9">
              Create New Account
            </Text>

            <View className="mb-3">
              <Input className={getInputClass("fullName")}>
                <InputSlot className="pl-2 pr-2">
                  <Ionicons name="person-outline" size={20} color={errors.fullName ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                  className="flex-1 text-sm text-black h-full"
                  value={fullName}
                  onChangeText={(v) => {
                    const textOnly = v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "");
                    setFullName(textOnly);
                    clearError("fullName");
                  }}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="default"
                  autoCapitalize="words"
                  maxLength={50}
                />
              </Input>
              {!!errors.fullName && (
                <Text className="text-red-300 text-[10px] font-bold ml-2">{errors.fullName}</Text>
              )}
            </View>

            <View className="mb-3">
              <Input className={getInputClass("email")}>
                <InputSlot className="pl-2 pr-2">
                  <Ionicons name="mail-outline" size={20} color={errors.email ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Email Address"
                  placeholderTextColor="#666"
                  className="flex-1 text-sm text-black h-full"
                  value={email}
                  onChangeText={(v) => { setEmail(v); clearError("email"); }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              {!!errors.email && (
                <Text className="text-red-300 text-[10px] font-bold ml-2">{errors.email}</Text>
              )}
            </View>

            <View className="mb-3">
              <Input className={getInputClass("password")}>
                <InputSlot className="pl-2 pr-2">
                  <Ionicons name="lock-closed-outline" size={20} color={errors.password ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-sm text-black h-full"
                  value={password}
                  onChangeText={(v) => { setPassword(v); clearError("password"); }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <InputSlot onPress={() => setShowPassword(!showPassword)} className="pr-2">
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </InputSlot>
              </Input>
              {!!errors.password && (
                <Text className="text-red-300 text-[10px] font-bold ml-2">{errors.password}</Text>
              )}
            </View>

            <View className="mb-3">
              <Input className={getInputClass("confirmPassword")}>
                <InputSlot className="pl-2 pr-2">
                  <Ionicons name="shield-checkmark-outline" size={20} color={errors.confirmPassword ? "#ef4444" : "#3d5236"} />
                </InputSlot>
                <InputField
                  placeholder="Confirm Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 text-sm text-black h-full"
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                />
                <InputSlot onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-2">
                  <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </InputSlot>
              </Input>
              {!!errors.confirmPassword && (
                <Text className="text-red-300 text-[10px] font-bold ml-2">{errors.confirmPassword}</Text>
              )}
            </View>

            <Button
              className={`bg-[#3d5236] h-14 rounded-full mt-6 mb-2 ${isSubmitting ? "opacity-70" : ""}`}
              onPress={handleCreateAccount}
              disabled={isSubmitting}
            >
              <ButtonText className="text-white text-xl font-extrabold">
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </ButtonText>
            </Button>

            {!!successMessage && (
              <Text className="text-green-400 text-center text-xs font-bold mb-3 bg-white/10 py-2 rounded-lg">
                ✓ {successMessage}
              </Text>
            )}

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[0.5px] bg-white/20" />
              <Text className="text-white/60 text-[9px] font-bold mx-4 uppercase tracking-[2px]">
                Or register with
              </Text>
              <View className="flex-1 h-[0.5px] bg-white/20" />
            </View>

            <View className="flex-row justify-center gap-4">
              <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-md">
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-md">
                <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-10 mb-4">
              <Text className="text-white/85">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-[#FFD166] font-bold underline">Log In</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}