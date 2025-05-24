import * as FileSystem from "expo-file-system";
import { Dimensions } from "react-native";
import Storage from "expo-sqlite/kv-store";

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const mediaPath =
    `${FileSystem.documentDirectory}images/`;
    
export const HERO_IMAGES_PATH = `${FileSystem.documentDirectory}`

export * from "./IconMapping"
export * from "./heroImageMapping"

