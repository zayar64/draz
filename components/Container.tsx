import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/contexts";

import BackButton from "./BackButton";

interface ContainerProps extends ViewProps {
    showBackButton?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function Container({
    style,
    children,
    ...props
}: ContainerProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.background,
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingTop: 8
                },
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
