import React, { forwardRef } from "react";
import { TextInput } from "react-native-paper";
import { StyleProp, TextStyle } from "react-native";

import { useTheme } from "@/contexts";
import { reduceHexIntensity } from "@/utils";

// Use TextInput from react-native-paper directly for props
interface TextFieldProps extends React.ComponentProps<typeof TextInput> {
    label?: string;
    style?: StyleProp<TextStyle>;
    maxLength?: number;
    multiline?: boolean;
    onChangeText: (value: string) => void;
}

export const isValidNumberInput = (value: string): boolean => {
    // Allows optional minus, digits, and optional decimal part
    if (value.length >= 2 && value.startsWith("0") && !value.includes("."))
        return false;
    if (value.startsWith(".")) return false;
    return /^-?\d*\.?\d*$/.test(value);
};

const MAX_LENGTH = 10;

// Use TextInput['ref'] to get the correct ref type from react-native-paper
const TextField = forwardRef<any, TextFieldProps>(
    ({ label, maxLength, multiline, style, onChangeText, ...props }, ref) => {
        const { mode, colors } = useTheme();

        return (
            <TextInput
                mode="outlined"
                outlineColor={colors.text}
                activeOutlineColor={colors.primary}
                label={label}
                ref={ref}
                style={[
                    {
                        backgroundColor: 
                            colors.background
                            
                        
                    },
                    multiline
                        ? { paddingVertical: 12, lineHeight: 24 }
                        : { height: 32 },
                    style
                ]}
                contentStyle={{
                    color: colors.text,
                    paddingLeft: 12,
                    fontSize: 12
                }}
                theme={{
                    colors: {
                        primary: colors.primary,
                        onSurfaceVariant: mode === "dark" ? "gray" : "grey"
                    }
                }}
                maxLength={
                    props.inputMode === "numeric"
                        ? maxLength ?? MAX_LENGTH
                        : undefined
                }
                keyboardType={props.inputMode}
                multiline={multiline}
                onChangeText={v => {
                    if (props.inputMode === "numeric") {
                        if (!isValidNumberInput(v)) return;
                    }
                    onChangeText(v);
                }}
                {...props}
            />
        );
    }
);

export default TextField;
