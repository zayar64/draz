import { useState, useEffect } from "react";
import { usePathname } from "expo-router";
import { BackHandler } from "react-native";

import { useGlobal } from "@/contexts";

export default function useNavigateBackGuard(
    condition: boolean,
    onFalseCondition: () => void
) {
    const [timesPressed, setTimesPressed] = useState<number>(0);
    const pathname = usePathname();
    const { setGlobalMessage } = useGlobal();

    useEffect(() => {
        if (pathname !== "/") return;
        const onBackPress = () => {
            if (condition) {
                //BackHandler.exitApp();
                onFalseCondition();
                return true; // Prevent default back behavior
            }
            if (timesPressed >= 1) {
                return false; // Allow default back behavior
            }
            setTimesPressed(prev => prev + 1);
            setGlobalMessage("Press again to exit");
            return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };
    }, [condition, onFalseCondition, pathname, timesPressed]);
    
    useEffect(() => {
      setTimesPressed(0)
      setGlobalMessage("")
    }, [pathname])

    useEffect(() => {
        if (timesPressed === 1) {
            setTimeout(() => {
                setTimesPressed(0);
            }, 1500);
        }
    }, [timesPressed]);
}
