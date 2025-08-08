import React, { useState, useEffect, useMemo } from "react";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

import { Container, View, Text, Icon, TextField, Button } from "@/components";
import { useGlobal, useTheme, useUser } from "@/contexts";
import { generateRandomText, generatePremiumKey } from "@/utils/crypto";

const PremiumCheckout = () => {
    const [randomText, setRandomText] = useState<string>(generateRandomText());
    const [premiumKey, setPremiumKey] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

    const { colors } = useTheme();
    const { setIsPremiumUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            setPremiumKey(await generatePremiumKey(randomText));
        })();
    }, [randomText]);

    useEffect(() => {
        if (copiedToClipboard) {
            setTimeout(() => {
                setCopiedToClipboard(false);
            }, 3000);
        }
    }, [copiedToClipboard]);

    return (
        <Container className="space-y-8">
            <View className="flex-row space-x-4 items-center">
                <Text numberOfLines={1} className="w-[90%]">
                    Temporary ID : {randomText}
                </Text>

                {copiedToClipboard ? (
                    <Icon name="check" />
                ) : (
                    <Icon
                        name="content-copy"
                        onPress={async () => {
                            await Clipboard.setStringAsync(randomText);
                            //alert(`Copied ${randomText} to clipboard`);
                            setCopiedToClipboard(true);
                        }}
                    />
                )}
            </View>

            <View
                className="rounded border p-2"
                style={{
                    borderColor: colors.primary
                }}
            >
                <Icon name="info-outline" color="primary" />

                <Text className="text-xs">
                    Copy the Temporary ID and send it to Zayar Minn and request
                    for Premium Key
                </Text>
            </View>

            <TextField
                value={userInput}
                onChangeText={setUserInput}
                label="Premium Key"
            />

            <Button
                title="ACTIVATE KEY"
                onPress={() => {
                    if (userInput === premiumKey) {
                        setIsPremiumUser(true);
                        router.back();
                    } else {
                      alert("Invalid Key")
                    }
                }}
            />
        </Container>
    );
};

export default PremiumCheckout;
