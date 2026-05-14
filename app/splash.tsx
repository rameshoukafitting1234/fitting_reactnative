import React, { useEffect } from "react";
import { View, Text, ImageBackground, Animated } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, 
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(auth)/login"); 
    }, 3500);

    return () => clearTimeout(timer);
  }, []);//مصفوفة بعدد مرات التنفيذ انا اريدها بس مرة 

  return (
    <ImageBackground
      source={require("@/assets/images/R.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <View className="flex-1 bg-black/60 items-center justify-center">
        
        <Animated.View 
          style={{ opacity: fadeAnim }} 
          className="items-center"
        >
          <Text className="text-[#FFD166] text-xs font-bold tracking-[4px] uppercase mb-3">
            ✦ Luxury for your home ✦
          </Text>

          <Text className="text-white text-6xl font-black tracking-tighter">
            FITTING
          </Text>

          <View className="w-16 h-[2px] bg-[#3d5236] mt-4 mb-2" />
          
          <Text className="text-white/60 text-[10px] font-medium tracking-[2px] uppercase">
            Est. 2026
          </Text>
        </Animated.View>

        <View className="absolute bottom-12">
          <Text className="text-white/40 text-[10px] tracking-widest">
            © FITTING CO. ALL RIGHTS RESERVED.
          </Text>
        </View>

      </View>
    </ImageBackground>
  );
}