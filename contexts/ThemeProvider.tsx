import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo
} from "react";
import { useColorScheme } from "react-native";
import { default as kvstore } from "expo-sqlite/kv-store";
import {
    reduceHexIntensity,
    increaseHexIntensity,
    reduceHexAlpha
} from "@/utils";

type Mode = "light" | "dark";
type Colors = Record<string, string>;

interface ThemeContextProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    toggleMode: () => void;
    colors: Colors;
    fontSize: number;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type colorModeType = { light: string; dark: string };

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const systemTheme = useColorScheme() as Mode;
    const [mode, setThemeState] = useState<Mode>(systemTheme || "light");

    const colors: Colors = useMemo(() => {
        const colorsMapping: Record<string, string | colorModeType> = {
            primary: "#0e8ae2d3",
            secondary: "#e16a26",
            success: "#2bb741",
            error: { light: "#ff0000", dark: "#ff0000" },

            background: { light: "#edf0f0", dark: "#161920" },
            //background: { light: "#edf0f0", dark: "#2c2e38" },
            text: { light: "#000000", dark: "#FFFFFF" },
            border: { light: "#000000", dark: "#ddd4d4" }
        };
        colorsMapping.background2 = {
            light: reduceHexIntensity(
                (colorsMapping.background as colorModeType).light,
                0.2
            ),
            dark: increaseHexIntensity(
                (colorsMapping.background as colorModeType).dark,
                0.2
            )
        };
        colorsMapping.background3 = {
            light: reduceHexIntensity(
                (colorsMapping.background as colorModeType).light,
                0.5
            ),
            dark: increaseHexIntensity(
                (colorsMapping.background as colorModeType).dark,
                0.5
            )
        };

        let colorsToReturn: Colors = {};

        Object.keys(colorsMapping).forEach(type => {
            const colorValue = colorsMapping[type];
            if (typeof colorValue === "string") {
                colorsToReturn[type] = colorValue;
            } else {
                colorsToReturn[type] =
                    colorValue[mode] ||
                    reduceHexIntensity(colorValue.light, 0.9);
            }
        });

        return colorsToReturn;
    }, [mode]);

    useEffect(() => {
        const loadTheme = async () => {
            const storedMode = await kvstore.getItem("mode");
            if (storedMode) {
                setThemeState(storedMode as Mode);
            }
        };
        loadTheme();
    }, []);

    const setMode = (newTheme: Mode) => {
        setThemeState(newTheme);
        kvstore.setItem("mode", newTheme);
    };

    const toggleMode = () => {
        setMode(mode === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                setMode,
                toggleMode,
                colors,
                fontSize: 12
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
