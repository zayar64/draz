import { Alert } from "react-native";
import type { Router } from "expo-router";

export const alertPremium = async (router: Router) => {
    await Alert.alert(
        "Premiun Access",
        "You are not a premium user. Upgrade to be a premium user ?",
        [
            {
                text: "upgrade",
                onPress: () => router.push("/premium-upgrade" as any)
            },
            {
                text: ""
            },
            {
                text: "no, thanks",
                onPress: () => {}
            }
        ]
    );
};

export * from "./date";
export * from "./theme";
