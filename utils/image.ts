import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { mediaPath, HERO_IMAGES_PATH } from "@/constants";

export const checkIfImageExists = async (fileUri: string): Promise<boolean> => {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo.exists;
};

/**
 * Downloads and saves an image to the app's file system.
 * @param imageUrl - URL of the image to download.
 * @param fileName - Optional custom file name (default uses timestamp).
 * @returns The local file URI of the saved image.
 */
export const downloadAndSaveImage = async (
    imageUrl: string,
    fileName?: string
): Promise<string | null> => {
    try {
        const ext = imageUrl.split(".").pop()?.split(/\#|\?/)[0] || "jpg";
        const name = fileName || `image_${Date.now()}.${ext}`;
        const fileUri = `${HERO_IMAGES_PATH}${name}`;

        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

        console.log("Image saved to:", uri);
        return uri;
    } catch (error) {
        console.error("Image download failed:", error);
        return null;
    }
};

export const getAllAlbums = async () => {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        console.error("Permission to access media library is required.");
        return [];
    }

    try {
        // Fetch all albums
        const albums = await MediaLibrary.getAlbumsAsync();
        const albumsWithPaths = [];

        for (const album of albums) {
            //if (Number(album.id) < 0) continue;
            // Get the first media file in the album to retrieve the path
            const assets = await MediaLibrary.getAssetsAsync({
                album: album.id,
                mediaType: ["photo", "video"],
                first: 1
            });
            if (assets.assets.length === 0) continue;

            albumsWithPaths.push({
                id: album.id,
                title: album.title,
                assetCount: album.assetCount,
                path: assets.assets[0].uri
                /*.split("/")
                    .slice(0, -1)
                    .join("/")
                    .replace("file://", "")*/
            });
        }

        return albumsWithPaths;
    } catch (err: any) {
        console.error("Error fetching albums:", err.message);
        return [];
    }
};

export const getImagesByAlbumId = async (albumId: string) => {
    try {
        const assets = await MediaLibrary.getAssetsAsync({
            album: albumId,
            mediaType: ["photo", "video"],
            first: 1000 // Number of items to fetch
        });

        return assets.assets.map(asset => ({
            uri: asset.uri,
            filename: asset.filename
        }));
    } catch (err: any) {
        console.error("Error fetching album:", err.message);
        return null;
    }
};

/**
 * Save an image to the app's private storage.
 * @param uri - The source image URI.
 * @param filename - The name for the saved file.
 * @returns The saved file path.
 */
export const saveImage = async (uri: string, filename: string) => {
    const appStoragePath = `${mediaPath}${filename}`;

    try {
        await FileSystem.copyAsync({
            from: uri,
            to: appStoragePath
        });

        console.log("✅ Image saved to app storage:", appStoragePath);
        return appStoragePath;
    } catch (error) {
        console.error("❌ Error saving image:", error);
    }
};

/**
 * Copy a file from one location to another
 * @param sourceUri - The current file location
 * @param destinationUri - The new file location
 * @returns {Promise<string | null>} - The new file path or null if failed
 */
export async function copyImage(
    sourceUri: string,
    destinationUri: string
): Promise<string | null> {
    try {
        await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
        console.log(`File copied to: ${destinationUri}`);
        return destinationUri;
    } catch (error) {
        console.error("Error copying file:", error);
        return null;
    }
}

/**
 * Move a file (copy + delete the original)
 * @param sourceUri - The current file location
 * @param destinationUri - The new file location
 * @returns {Promise<string | null>} - The new file path or null if failed
 */
export async function moveImage(
    sourceUri: string,
    destinationUri: string
): Promise<string | null> {
    try {
        await FileSystem.moveAsync({ from: sourceUri, to: destinationUri });
        console.log(`File moved to: ${destinationUri}`);
        return destinationUri;
    } catch (error) {
        console.error("Error moving file:", error);
        return null;
    }
}

/**
 * Delete a file from local storage
 * @param fileUri - The file path to delete
 * @returns {Promise<boolean>} - True if successful, False otherwise
 */
export async function deleteImage(fileUri: string): Promise<boolean> {
    try {
        await FileSystem.deleteAsync(fileUri);
        console.log(`File deleted: ${fileUri}`);
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
}

/**
 * Copy all files from an internal storage folder to the app's local storage
 * @param folderPath - The source folder in internal storage
 * @param destinationFolder - The target folder in local storage
 * @returns {Promise<string[]>} - List of copied file paths
 */
export async function copyFolder(
    folderPath: string = "file:///storage/emulated/0/Pictures/zink",
    destinationFolder: string = "images"
): Promise<string[]> {
    try {
        const files = await FileSystem.readDirectoryAsync(folderPath);
        const copiedFiles: string[] = [];

        for (const file of files) {
            if (
                !(
                    file.endsWith(".jpg") ||
                    file.endsWith(".png") ||
                    file.endsWith(".jpeg")
                )
            )
                continue;
            const sourceUri = `${folderPath}/${file}`;
            const destinationUri = `${FileSystem.documentDirectory}${destinationFolder}/${file}`;

            await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
            copiedFiles.push(destinationUri);
        }

        console.log(
            `Copied ${copiedFiles.length} files to ${destinationFolder}`
        );
        return copiedFiles;
    } catch (error) {
        console.error("Error copying folder to local storage:", error);
        return [];
    }
}

/**
 * Move all files from an internal storage folder to the app's local storage
 * @param folderPath - The source folder in internal storage
 * @param destinationFolder - The target folder in local storage
 * @returns {Promise<string[]>} - List of moved file paths
 */
export async function moveFolderToLocalStorage(
    folderPath: string,
    destinationFolder: string
): Promise<string[]> {
    try {
        const files = await FileSystem.readDirectoryAsync(folderPath);
        const movedFiles: string[] = [];

        for (const file of files) {
            const sourceUri = `${folderPath}/${file}`;
            const destinationUri = `${FileSystem.documentDirectory}${destinationFolder}/${file}`;

            await FileSystem.moveAsync({ from: sourceUri, to: destinationUri });
            movedFiles.push(destinationUri);
        }

        console.log(`Moved ${movedFiles.length} files to ${destinationFolder}`);
        return movedFiles;
    } catch (error) {
        console.error("Error moving folder to local storage:", error);
        return [];
    }
}

/**
 * Delete all files in a local storage folder
 * @param folderName - The target folder name in local storage
 * @returns {Promise<boolean>} - True if successful, False otherwise
 */
export async function deleteFolderFromLocalStorage(
    folderName: string
): Promise<boolean> {
    try {
        const folderUri = `${FileSystem.documentDirectory}${folderName}`;
        await FileSystem.deleteAsync(folderUri, { idempotent: true });

        console.log(`Deleted folder: ${folderName}`);
        return true;
    } catch (error) {
        console.error("Error deleting folder from local storage:", error);
        return false;
    }
}

export async function listLocalImages(
    folderName: string
): Promise<{ uri: string; name: string; size: number }[]> {
    try {
        const folderUri = `${FileSystem.documentDirectory}${folderName}/`;
        const files = await FileSystem.readDirectoryAsync(folderUri);

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
            }
        }

        console.log(`Found ${imageFiles.length} images in ${folderName}`);
        return imageFiles;
    } catch (error) {
        console.error("Error listing images from local storage:", error);
        return [];
    }
}

export async function listExternalImages(
    folderUri: string
): Promise<{ uri: string; name: string; size: number }[]> {
    try {
        const files = await FileSystem.readDirectoryAsync(folderUri);

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
            }
        }

        console.log(`Found ${imageFiles.length} images in ${folderUri}`);
        return imageFiles;
    } catch (error) {
        console.error("Error listing images from local storage:", error);
        return [];
    }
}

const exportFolder = `${FileSystem.documentDirectory}images/`;

export const pickAndDownloadImages = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        console.error("Permission to access media library is required.");
        return;
    }

    // Pick an image from the gallery
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true // Allows multiple image selection
    });

    if (result.canceled || !result.assets) return;

    try {
        // Ensure the target directory exists
        await FileSystem.makeDirectoryAsync(exportFolder, {
            intermediates: true
        });

        for (const image of result.assets) {
            const filename = image.uri.split("/").pop(); // Get the image filename
            const destination = `${exportFolder}${filename}`;

            console.log(`Exporting ${filename} to ${destination}...`);
            await FileSystem.copyAsync({ from: image.uri, to: destination });
        }

        console.log("Images exported successfully.");
    } catch (err: any) {
        console.error("Error exporting images:", err.message);
    }
};
