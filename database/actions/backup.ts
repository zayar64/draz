import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

const dbPath = `${FileSystem.documentDirectory}SQLite/mlbb.db`;

const uploadDb = async (source: string) => {
    console.log("Checking file existence...");
    const fileInfo = await FileSystem.getInfoAsync(source);
    if (!fileInfo.exists) {
        console.error("Source file does not exist.");
        return;
    }

    console.log("Ensuring target directory exists...");
    await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite/`,
        { intermediates: true }
    );

    console.log("Copying database...");
    try {
        await FileSystem.copyAsync({ from: source, to: dbPath });
        console.log("Successfully restored database.");
    } catch (err: any) {
        console.error("Error copying database:", err.message);
    }
};

// Use a document picker to select the database file
export const pickAndUploadDb = async () => {
    const result = await DocumentPicker.getDocumentAsync({
        type: "application/octet-stream"
    });

    if (result.canceled || !result.assets) return;

    uploadDb(result.assets[0].uri);
};

export const downloadDb = async () => {
    console.log("Checking if database exists...");
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (!fileInfo.exists) {
        console.error("Database file not found.");
        return;
    }

    const customFileName =
        new Date()
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" ")
            .replaceAll(" ", "_") + "_finz.db";
    const customFilePath = FileSystem.cacheDirectory + customFileName;

    try {
        // Copy original DB to new file with custom name
        await FileSystem.copyAsync({
            from: dbPath,
            to: customFilePath
        });

        console.log("Downloading database...");
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(customFilePath, {
                mimeType: "application/octet-stream",
                dialogTitle: "Download Database"
            });
            console.log("Database shared successfully.");
        } else {
            console.error("Sharing is not available on this device.");
        }
    } catch (err: any) {
        console.error("Error downloading database:", err.message);
    }
};
