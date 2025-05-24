import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/contexts";

interface RadioProps {
    label: string;
    value: string;
    selected: string;
    onSelect: (value: string) => void;
    horizontal?: boolean;
    color?: string
}

const RADIO_SIZE = 18;

const Radio: FC<RadioProps> = ({
    label,
    value,
    selected,
    onSelect,
    horizontal,
    color
}) => {
    const { colors } = useTheme();
    return (
        <Pressable
            onPress={() => onSelect(value)}
            className={`${
                horizontal ? "flex-row space-x-2" : "flex-col space-y-2"
            } items-center p-1`}
        >
            <View
                className="border rounded-full flex items-center justify-center"
                style={{
                    borderColor: colors.border,
                    width: RADIO_SIZE,
                    height: RADIO_SIZE
                }}
            >
                {selected === value && (
                    <View
                        className="rounded-full"
                        style={{
                            backgroundColor: color || colors.primary,
                            width: RADIO_SIZE - RADIO_SIZE * 0.4,
                            height: RADIO_SIZE - RADIO_SIZE * 0.4
                        }}
                    />
                )}
            </View>
            <Text
                style={{
                    color: colors.text
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
};

export default Radio;
