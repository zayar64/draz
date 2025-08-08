import { Alert } from "react-native";
import type { Router } from "expo-router"

export const alertPremium = async (router: Router) => {
    await Alert.alert(
        "Notice",
        "You need to be a premium user for this feature",
        [
            {
                text: "upgrade",
                onPress: () => router.push("/premium-upgrade")
            },
            {
                text: ""
            },
            {
                text: "OK",
                onPress: () => {}
            }
        ]
    );
};

export * from "./date";
export * from "./theme";
