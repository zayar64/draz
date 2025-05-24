import React from "react"
import { useRouter, usePathname } from "expo-router";
import { Pressable } from "react-native";

import View from "./View";
import Text from "./Text";
import Icon from "./Icon";

import { useTheme } from "@/contexts";

interface HeaderProps {
    title?: string;
    headerTitle?: React.ReactNode;
    showBackButton?: boolean;
    headerRight?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
    title,
    headerTitle,
    showBackButton = true,
    headerRight
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isRoot = pathname === "/" // Check if it's the root screen
    const { colors } = useTheme();

    return (
        <View className="flex-row items-center justify-between py-2">
            {/* Back Button */}
            {showBackButton && !isRoot ? (
                <Icon name="arrow-back" onPress={() => router.back()} />
            ) : (
                <View className="w-10" /> // Placeholder to maintain spacing
            )}

            {/* Title */}
            {headerTitle ?? <Text className="text-lg font-bold">{title}</Text>}

            {/* Right Component (Optional) */}
            {headerRight ? (
                <View>{headerRight}</View>
            ) : (
                <View className="w-10" />
            )}
        </View>
    );
};

export default Header;
