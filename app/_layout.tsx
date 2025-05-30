import React, { useState, useEffect } from "react";
import { Modal, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useLocalSearchParams } from "expo-router";

import { PaperProvider } from "react-native-paper";

import { GlobalProvider, ThemeProvider } from "@/contexts";
import { db, migrationMapping, initializeDatabase } from "@/database";

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
    const [dbChecked, setDbChecked] = useState<boolean>(false);

    useEffect(() => {
        if (error) console.error(error);

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    useEffect(() => {
        (async () => {
            try {
                await initializeDatabase();

                const migrations = (
                    await db.getAllAsync<{name: string}>("SELECT name FROM migration")
                ).map(m => m.name);

                for (const [migrationName, migrationFunc] of Object.entries(
                    migrationMapping
                )) {
                    if (!migrations.includes(migrationName)) {
                        await migrationFunc();
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setDbChecked(true);
            }
        })();
    }, []);

    if (!fontsLoaded || !dbChecked) {
        return (
            <Modal
                transparent={true}
                visible={!dbChecked}
                onRequestClose={() => null}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgbd(0,0,0,0.5)"
                    }}
                >
                    <ActivityIndicator size="large" color="#0af" />
                    <Text style={{
                      color: "#fff"
                    }}>Initializing Database</Text>
                </View>
            </Modal>
        );
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
