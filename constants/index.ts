import * as FileSystem from "expo-file-system";
import { Dimensions } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { RelationType } from "@/types"

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const mediaPath = `${FileSystem.documentDirectory}images/`;

export const HERO_IMAGES_PATH = `${FileSystem.documentDirectory}`;

export const RELATION_TYPES = ["Combo", "Weak Vs", "Strong Vs"] as const;

export const OPPOSITE_RELATION_TYPE_MAPPINGS: Record<RelationType, RelationType> = {
    Combo: "Combo",
    "Weak Vs": "Strong Vs",
    "Strong Vs": "Weak Vs"
};

export * from "./IconMapping";
export * from "./heroImageMapping";
export * from "./heroes";
