import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useMemo
} from "react";
import {
    Alert,
    View,
    Modal,
    ActivityIndicator,
    StyleSheet
} from "react-native";

import Text from "@/components/Text";
import { useTheme } from "./ThemeProvider";

interface GlobalContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
    globalMessage: string | null;
    setGlobalMessage: (value: string | null) => void;
    loadingText: string;
    setLoadingText: (value: string) => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
}

export function GlobalProvider({ children }: { children?: React.ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("");
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);
    const { colors } = useTheme();

    const styles = useMemo(
        () =>
            StyleSheet.create({
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
                    bottom: 40,
                    left: 20,
                    right: 20,
                    backgroundColor: colors.background,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderRadius: 14,
                    alignItems: "center"
                },
                snackbarText: {
                    color: colors.text
                }
            }),
        [colors]
    );

    useEffect(() => {
        if (globalMessage) {
            setTimeout(() => {
                setGlobalMessage("");
            }, 1500);
        }
    }, [globalMessage]);

    return (
        <GlobalContext.Provider
            value={{
                loading,
                setLoading,
                globalMessage,
                setGlobalMessage,
                loadingText,
                setLoadingText
            }}
        >
            <Modal
                transparent={true}
                visible={loading || !!loadingText}
                onRequestClose={() => null}
            >
                <View style={styles.backdrop}>
                    <ActivityIndicator size="large" color="#0af" />
                    <Text>{loadingText}</Text>
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
