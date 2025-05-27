import axios from "axios";

export default api;
import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode
} from "react";
import {
    Alert,
    View,
    Modal,
    ActivityIndicator,
    StyleSheet
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import * as Updates from "expo-updates";

import Text from "@/components/Text";
import { api, myapi } from "@/apis"

/**
 * Restart the app by reloading it.
 */
export async function restartApp() {
    try {
        await Updates.reloadAsync();
    } catch (error) {
        console.error("Failed to restart the app:", error);
    }
}

export const requestPermissions = async () => {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync(true); // 'true' prompts again if denied

    if (status !== "granted") {
        Alert.alert(
            "Permission Required",
            "This app needs storage access to function properly.",
            [{ text: "OK" }]
        );
    } else {
        console.log("Media library permission granted.");
    }
};

requestPermissions();

interface GlobalContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
    globalMessage: string | null;
    setGlobalMessage: (value: string | null) => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
}

export function GlobalProvider({ children }: { children?: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setGlobalMessage("");
        }, 3000);
    }, [globalMessage]);

    return (
        <GlobalContext.Provider
            value={{
                loading,
                setLoading,
                globalMessage,
                setGlobalMessage,
                api,
                myapi
            }}
        >
            <Modal
                transparent={true}
                visible={loading}
                onRequestClose={() => null}
            >
                <View style={styles.backdrop}>
                    <ActivityIndicator size="large" color="#0af" />
                </View>
            </Modal>

            {children}

            {globalMessage && (
                <View style={styles.snackbar}>
                    <Text style={styles.snackbarText}>{globalMessage}</Text>
                </View>
            )}
        </GlobalContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    snackbar: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: "#161940",
        padding: 16,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 14,
        alignItems: "center"
    },
    snackbarText: {
        color: "white"
    }
});
