import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

async function copyBundledAssetToStorage() {
    try {
        const asset = Asset.fromModule(require("@/assets/databases/draz.db"));

        await asset.downloadAsync(); // Makes sure it's available locally

        const sourceUri = asset.localUri;
        const destinationUri = FileSystem.documentDirectory + "SQLite/draz.db";

        const fileInfo = await FileSystem.getInfoAsync(destinationUri);

        //if (fileInfo.exists) return;

        if (sourceUri) {
            await FileSystem.copyAsync({
                from: sourceUri,
                to: destinationUri
            });
            console.log("✅ Copied to", destinationUri);
        }
    } catch (error) {
        console.error(error);
    }
}

//copyBundledAssetToStorage();

export const db = SQLite.openDatabaseSync("draz.db");

export async function listLocalFiles(): Promise<
    { uri: string; name: string; size: number }[]
> {
    const folderUri = `${FileSystem.documentDirectory}SQLite/`;
    try {
        const files = await FileSystem.readDirectoryAsync(folderUri);
        console.log(files);

        const imageFiles: { uri: string; name: string; size: number }[] = [];

        for (const file of files) {
            const fileUri = `${folderUri}${file}`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (fileInfo.exists && fileInfo.isDirectory === false) {
                imageFiles.push({
                    uri: fileUri,
                    name: file,
                    size: fileInfo.size || 0
                });
                console.log(fileUri);
            }
        }

        console.log(`Found ${imageFiles.length} files.`);
        return imageFiles;
    } catch (error) {
        console.error("Error listing files from local storage:", error);
        return [];
    }
}
