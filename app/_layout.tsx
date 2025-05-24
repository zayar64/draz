import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useLocalSearchParams } from "expo-router";

import { PaperProvider } from "react-native-paper";

import { GlobalProvider, ThemeProvider } from "@/contexts";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf")
    });

    const { id } = useLocalSearchParams();

    useEffect(() => {
        if (error) console.error(error);

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider>
            <PaperProvider>
                <GlobalProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                animation: "none"
                            }}
                        >
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                </GlobalProvider>
            </PaperProvider>
        </ThemeProvider>
    );
};

export default RootLayout;
