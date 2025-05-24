import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";

import { iconFamilyMapping, iconShortFamilyMapping } from "@/constants";
import { useTheme } from "@/contexts";
import { IconType, IconFamilyType } from "@/types";
import { reduceHexAlpha } from "@/utils";

interface CustomIconProps {
    name: any; //keyof typeof MaterialIcons.glyphMap
    size?: number | "small" | "medium" | "large";
    src?: IconType;
    family?: IconFamilyType;
    color?: string;
    disabled?: boolean;
    onPress?: () => void;
    [key: string]: any;
}

const CustomIcon: React.FC<CustomIconProps> = ({
    name,
    size = "medium",
    src = "material",
    family,
    color,
    disabled,
    onPress,
    ...rest
}) => {
    const { colors } = useTheme();
    const iconColor = colors[color as string] || color || colors.text;
    const sz = typeof size === "number" ? size : size === "large" ? 30 : 24

    const Icon: any =
        iconFamilyMapping[family ?? ""] || iconShortFamilyMapping[src];

    const IconToRender = useMemo(
        () => (
            <Icon
                name={name}
                size={sz}
                color={disabled ? reduceHexAlpha(iconColor, 0.8) : iconColor}
                {...rest}
            />
        ),
        [name, size, iconColor, rest]
    );

    return onPress && !disabled ? (
        <TouchableOpacity onPress={onPress}>{IconToRender}</TouchableOpacity>
    ) : (
        IconToRender
    );
};

export default CustomIcon;
