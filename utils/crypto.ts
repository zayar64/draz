import * as Crypto from "expo-crypto";

const SECRET_CODE = "zygod-64";

export function generateRandomText(length: number = 20): string {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += charset[Math.floor(Math.random() * charset.length)];
    }
    return text;

    /*return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Date.now()}-${SECRET_CODE}`
    );*/
}

export async function generatePremiumKey(text: string): Promise<string> {
    // Generate key
    const key = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${text}-${SECRET_CODE}`
    );
    return key;

    // Format it to UUID v4-like structure (8-4-4-4-12)
    const formattedKey = [
        key.slice(0, 8),
        key.slice(8, 12),
        key.slice(12, 16),
        key.slice(16, 20),
        key.slice(20, 32)
    ].join("-");
    return formattedKey;
}
