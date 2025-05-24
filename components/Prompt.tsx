import React, { useState, useEffect } from "react";
import { View, Pressable, Modal } from "react-native";

import Text from "./Text";
import TextField from "./TextField";
import Button from "./Button";

import { useTheme } from "@/contexts";
import { reduceHexIntensity } from "@/utils";

interface ConfirmationPromptProps {
    visible: boolean;
    onClose: () => void;
    message: string;
    onSubmit: (message: string) => void;
}

const TRIES_LIMIT = 1;

const Prompt: React.FC<ConfirmationPromptProps> = ({
    visible,
    onClose,
    message,
    onSubmit
}) => {
    const [input, setInput] = useState("");

    const [tries, setTries] = useState<number>(0);
    const [nextLimit, setNextLimit] = useState<number>(TRIES_LIMIT);
    const [disableConfirm, setDisableConfirm] = useState<boolean>(false);

    const { colors } = useTheme();

    useEffect(() => {
        if (tries === nextLimit) {
            setDisableConfirm(true);
            setNextLimit(prev => prev + TRIES_LIMIT);
        }
    }, [tries]);

    useEffect(() => {
        if (disableConfirm) {
            setTimeout(() => {
                setDisableConfirm(false);
            }, 3000);
        }
    }, [disableConfirm]);

    const handleSubmit = async () => {
        await onSubmit(input);
        setInput("");
        setTries(prev => prev + 1);
    };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center">
                <View
                    className="p-8 rounded-lg w-[80%] space-y-8"
                    style={{
                        backgroundColor: reduceHexIntensity(
                            colors.background,
                            0.2
                        )
                    }}
                >
                    <Text className="text-lg font-bold text-center">
                        {message}
                    </Text>

                    <TextField
                        value={input}
                        onChangeText={setInput}
                        //autoFocus
                        //onEndEditing={handleSubmit}
                    />

                    <View className="flex-row justify-between">
                        <Button
                            onPress={onClose}
                            title="Cancel"
                            color="error"
                        />

                        <Button
                            onPress={handleSubmit}
                            title="submit"
                            color="success"
                            disabled={disableConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Prompt;
