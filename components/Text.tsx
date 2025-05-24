import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";

interface StyledTextProps extends TextProps {
    style?: StyleProp<TextStyle>;
    variant?: "header" | "header2" | "body" | "body2" | "caption";
    color?: string;
}

export default function StyledText({
    style,
    variant = "body",
    color,
    children,
    ...props
}: StyledTextProps) {
    const { colors, fontSize } = useTheme();

    const fz = {
        header: 1.75,
        header2: 1.5,
        body: 1,
        body2: 1.25,
        caption: 0.75
    };

    return (
        <Text
            style={[
                {
                    color: colors[color ?? ""] || colors.text,
                    fontSize: fontSize * fz[variant],
                    fontWeight: 500
                },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}
