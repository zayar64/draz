import React, { useState } from "react";
import { View, Pressable, PressableProps } from "react-native";
import { useTheme } from "@/contexts";
import Icon from "./Icon";
import { reduceHexAlpha } from "../utils/theme";

interface ButtonProps extends PressableProps {
    name: string;
    disabled?: boolean;
    fullWidth?: boolean;
    color?: "primary" | "info" | "success" | "error";
    variant?: "outlined" | "contained"
    style?: Record<string, string | number>;
}

const Button = ({
    name,
    disabled,
    fullWidth,
    color = "primary",
    variant = "outlined",
    style = {},
    onPress,
    ...props
}: ButtonProps) => {
    const { colors } = useTheme();
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
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    borderRadius: 12
                },
                variant === "outlined"
                    ? {
                          borderColor: reduceHexAlpha(
                              colors[color] || colors.border,
                              pressingIn || disabled ? 0.8 : 0
                          )
                      }
                    : {
                          backgroundColor: reduceHexAlpha(
                              colors[color] || colors.primary,
                              pressingIn || disabled ? 0.8 : 0
                          )
                      },
                style
            ]}
            {...props}
        >
            <Icon
                name={name}
                color={reduceHexAlpha(
                    variant === "outlined" ? colors[color] : colors.text,
                    pressingIn || disabled ? 0.8 : 0
                )}
            />
        </Pressable>
    );
};

export default Button;
