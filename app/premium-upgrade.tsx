import React, { useState, useEffect, useMemo } from "react";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import * as Device from "expo-device";

import { Container, View, Text, Icon, TextField, Button } from "@/components";
import { useGlobal, useTheme, useUser } from "@/contexts";
import { verifyLicense } from "@/utils";

const deviceId = Device.osInternalBuildId ?? Device.modelId ?? "UNKNOWN";

const PremiumCheckout = () => {
    const [licenseKey, setLicenseKey] = useState<string>("");
    const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

    const { colors, fontSize } = useTheme();
    const { setIsPremiumUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (copiedToClipboard) {
            setTimeout(() => {
                setCopiedToClipboard(false);
            }, 3000);
        }
    }, [copiedToClipboard]);

    async function activateLicense() {
        const result = await verifyLicense(licenseKey);
        if (result.valid) {
            alert("License subscription activated!");
            setIsPremiumUser(true);
            router.back();
        } else {
            //setLicenseKey("");
            alert("Activation failed: " + result.reason);
        }
    }

    return (
        <Container className="space-y-8">
            <View className="flex-row space-x-4 items-center">
                <Text numberOfLines={1} className="w-[90%]">
                    Device ID : {deviceId}
                </Text>

                {copiedToClipboard ? (
                    <Icon name="check" />
                ) : (
                    <Icon
                        name="content-copy"
                        onPress={async () => {
                            await Clipboard.setStringAsync(deviceId);
                            setCopiedToClipboard(true);
                        }}
                    />
                )}
            </View>

            <TextField
                value={licenseKey}
                onChangeText={setLicenseKey}
                label="License Key"
            />

            <View className="flex-row space-x-4 justify-between">
                <Button
                    title="CLEAR LICENSE KEY"
                    onPress={() => setLicenseKey("")}
                />

                <Button
                    title="ACTIVATE LICENSE KEY"
                    onPress={activateLicense}
                />
            </View>
        </Container>
    );
};

export default PremiumCheckout;
