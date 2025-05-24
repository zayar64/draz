import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";

import { useTheme } from "@/contexts";
import { reduceHexIntensity } from "@/utils";

interface StyledViewProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
    border?: boolean;
}

export default function StyledView({
    style,
    children,
    border,
    ...props
}: StyledViewProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                border
                    ? {
                          borderWidth: 0.5,
                          overflow: "hidden"
                      }
                    : {},
                    {                          borderColor: colors.border,},
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
