import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { File, Paths } from "expo-file-system";
import { Button, ButtonText } from "@/components/ui/button";

type DemoUser = {
  id: number;
  name: string;
  email: string;
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name={icon} size={22} color="#FFD166" />
        <Text className="text-[#FFD166] font-bold text-sm ml-2 uppercase tracking-wider">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function ResultBox({ text }: { text: string }) {
  return (
    <View className="mt-2 rounded-xl bg-black/40 p-3">
      <Text className="text-white/90 text-xs leading-5">{text}</Text>
    </View>
  );
}

export default function TrainingScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionResponse | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fileResult, setFileResult] = useState("");

  const userQuery = useQuery({
    queryKey: ["trainig page", "demo-user"],
    queryFn: async (): Promise<DemoUser> => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users/2",
      );
      if (!res.ok) throw new Error("فشل جلب البيانات");
      return res.json();
    },
  });

  const locationMutation = useMutation({
    mutationFn: async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(perm);
      if (perm.status !== "granted") {
        throw new Error("لم يُمنح إذن الموقع");
      }
      return Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    },
  });

  const fileMutation = useMutation({
    mutationFn: async () => {
      const file = new File(Paths.document, "training-test.txt");
      if (!file.exists) {
        file.create({ overwrite: true });
      }
      const content = `trainig page— ${new Date().toISOString()}`;
      file.write(content);
      const readBack = await file.text();
      return `مسار: ${file.uri}\n\nالمحتوى:\n${readBack}`;
    },
    onSuccess: (msg) => setFileResult(msg),
    onError: (e) =>
      setFileResult(e instanceof Error ? e.message : "خطأ في الملف"),
  });

  const photoMutation = useMutation({
    mutationFn: async () => {
      if (!cameraPermission?.granted) {
        const res = await requestCameraPermission();
        if (!res.granted) throw new Error("لم يُمنح إذن الكاميرا");
      }
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.5,
      });
      if (!photo?.uri) throw new Error("فشل التقاط الصورة");
      return photo.uri;
    },
    onSuccess: (uri) => setPhotoUri(uri),
  });

  const checkAllPermissions = async () => {
    const cam = await requestCameraPermission();
    const loc = await Location.getForegroundPermissionsAsync();
    setLocationPermission(loc);
    Alert.alert(
      "حالة الأذونات",
      `الكاميرا: ${cam.status}\nالموقع: ${loc.status}`,
    );
  };

  return (
    <View className="flex-1 bg-[#0f172a]">
      <View className="pt-12 px-4 pb-3 flex-row items-center border-b border-white/10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-black">training page</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TanStack Query */}
        <Section title="TanStack Query" icon="cloud-download-outline">
          {userQuery.isPending && (
            <ActivityIndicator color="#FFD166" />
          )}
          {userQuery.isError && (
            <ResultBox
              text={`خطأ: ${userQuery.error instanceof Error ? userQuery.error.message : "غير معروف"}`}
            />
          )}
          {userQuery.isSuccess && (
            <ResultBox
              text={`✓ API يعمل\nالاسم: ${userQuery.data.name}\nالبريد: ${userQuery.data.email}`}
            />
          )}
          <Button
            className="bg-[#3d5236] h-11 rounded-full mt-2"
            onPress={() => userQuery.refetch()}
          >
            <ButtonText className="text-white font-bold">إعادة الجلب</ButtonText>
          </Button>
        </Section>

        {/* Permissions */}
        <Section title="الأذونات (Permissions)" icon="shield-checkmark-outline">
          <ResultBox
            text={`الكاميرا: ${cameraPermission?.status ?? "غير معروف"}\nالموقع: ${locationPermission?.status ?? "اضغط «فحص» أو «الموقع»"}`}
          />
          <Button
            className="bg-[#FFD166] h-11 rounded-full mt-2"
            onPress={checkAllPermissions}
          >
            <ButtonText className="text-[#3d5236] font-bold">
              طلب / فحص الأذونات
            </ButtonText>
          </Button>
        </Section>

        {/* Location */}
        <Section title="expo-location" icon="location-outline">
          <Button
            className="bg-[#3d5236] h-11 rounded-full"
            onPress={() => locationMutation.mutate()}
            disabled={locationMutation.isPending}
          >
            <ButtonText className="text-white font-bold">
              {locationMutation.isPending ? "جاري..." : "موقعي الحالي"}
            </ButtonText>
          </Button>
          {locationMutation.isSuccess && (
            <ResultBox
              text={`خط العرض: ${locationMutation.data.coords.latitude.toFixed(6)}\nخط الطول: ${locationMutation.data.coords.longitude.toFixed(6)}`}
            />
          )}
          {locationMutation.isError && (
            <ResultBox
              text={
                locationMutation.error instanceof Error
                  ? locationMutation.error.message
                  : "خطأ"
              }
            />
          )}
        </Section>

        {/* Camera */}
        <Section title="expo-camera" icon="camera-outline">
          {cameraPermission?.granted ? (
            <View className="rounded-xl overflow-hidden h-48 mb-2">
              <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
            </View>
          ) : (
            <ResultBox text="يُعرض المعاينة بعد منح إذن الكاميرا" />
          )}
          <Button
            className="bg-[#3d5236] h-11 rounded-full"
            onPress={() => photoMutation.mutate()}
            disabled={photoMutation.isPending}
          >
            <ButtonText className="text-white font-bold">
              {photoMutation.isPending ? "جاري..." : "التقاط صورة"}
            </ButtonText>
          </Button>
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              className="w-full h-40 rounded-xl mt-2"
              resizeMode="cover"
            />
          )}
        </Section>

        {/* File System */}
        <Section title="expo-file-system" icon="document-text-outline">
          <Button
            className="bg-[#3d5236] h-11 rounded-full"
            onPress={() => fileMutation.mutate()}
            disabled={fileMutation.isPending}
          >
            <ButtonText className="text-white font-bold">
              {fileMutation.isPending ? "جاري..." : "كتابة وقراءة ملف"}
            </ButtonText>
          </Button>
          {!!fileResult && <ResultBox text={fileResult} />}
        </Section>
      </ScrollView>
    </View>
  );
}
