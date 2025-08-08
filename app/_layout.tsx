import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as Updates from "expo-updates";
import { SplashScreen, Stack } from "expo-router";

import { PaperProvider } from "react-native-paper";

import { GlobalProvider, ThemeProvider, UserProvider } from "@/contexts";
import { db, copyDatabaseFromAssets } from "@/database";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        /*"Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf")*/
    });

    useEffect(() => {
        (async () => {
          // Checking if database is already initialized
          // Copy from assets if not
            try {
                await db.getFirstAsync("SELECT * from migration");
            } catch (e) {
                await copyDatabaseFromAssets();
                await Updates.reloadAsync();
            }
        })();
    }, []);

    useEffect(() => {
        if (error) console.error(error);

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) return;

    return (
        <ThemeProvider>
            <PaperProvider>
            <UserProvider>
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
                </UserProvider>
            </PaperProvider>
        </ThemeProvider>
    );
};

export default RootLayout;
