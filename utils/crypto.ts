import * as Device from "expo-device";
import { Buffer } from "buffer";
import kvstore from "expo-sqlite/kv-store";
import CryptoJS from "crypto-js";

export const SECRET_KEY = "zygod-64";

export async function verifyLicense(license: string) {
    try {
        const decoded = Buffer.from(license, "base64").toString("utf-8");
        const { payload, signature } = JSON.parse(decoded);

        // Check device ID match
        const currentDeviceId = Device.osInternalBuildId ?? "UNKNOWN";

        if (payload.deviceId !== currentDeviceId) {
            return {
                valid: false,
                reason: "License is for a different device"
            };
        }

        // Check expiry
        if (new Date(payload.expiry) < new Date()) {
            return { valid: false, reason: "License expired" };
        }

        // Validate signature
        const payloadStr = JSON.stringify(payload);
        const expectedSig = CryptoJS.HmacSHA256(
            payloadStr,
            SECRET_KEY
        ).toString(CryptoJS.enc.Hex);

        if (signature !== expectedSig) {
            return { valid: false, reason: "Invalid license signature" };
        }

        // Save locally
        await kvstore.setItemAsync("premium_license", license);
        return { valid: true, reason: "OK" };
    } catch (e: any) {
        return { valid: false, reason: "Corrupted license" };
        //return { valid: false, reason: e.message };
    }
}
