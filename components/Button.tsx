import React, { useState } from "react";
import { View, Pressable, PressableProps } from "react-native";
import { useTheme } from "@/contexts";
import Text from "./Text";
import { reduceHexAlpha } from "../utils/theme";

interface ButtonProps extends PressableProps {
    title?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    color?: "primary" | "info" | "success" | "error";
    style?: Record<string, string | number>;
}

const Button = ({
    title,
    children,
    disabled,
    fullWidth,
    color = "primary",
    style = {},
    onPress,
    ...props
}: ButtonProps) => {
    const { colors } = useTheme();
    const bgColor = colors[color] || colors.primary;
    const [pressingIn, setPressingIn] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => setPressingIn(true)}
            onPressOut={() => setPressingIn(false)}
            style={[
                {
                    width: fullWidth ? "100%" : undefined,
                    minWidth: 80,
                    borderWidth: 2,
                    borderColor: bgColor,
                    backgroundColor:
                        pressingIn || disabled
                            ? reduceHexAlpha(bgColor, 0.5)
                            : undefined,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    borderRadius: 12
                },
                style
            ]}
            {...props}
        >
            {title ? <Text>{title}</Text> : children}
        </Pressable>
    );
};

export default Button;
