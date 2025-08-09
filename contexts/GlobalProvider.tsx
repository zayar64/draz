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

import Text from "@/components/Text";

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

export function GlobalProvider({ children }: { children?: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("");
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
