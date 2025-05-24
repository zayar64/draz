import React, { useState, useMemo, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    Pressable
} from "react-native";

import { useTheme } from "@/contexts";

import MenuOptions from "./MenuOptions";
import Button from "./Button";
import Icon from "./Icon";
import Text from "./Text";

interface CustomMenuProps {
    options: {
        label: string;
        value: string;
    }[];
    label?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    style?: Record<string, string | number>;
    showIfNoValue?: boolean;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
    options,
    label,
    value = "",
    onChange,
    className,
    style = {},
    showIfNoValue = true,
    ...props
}) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const { mode, colors } = useTheme();

    const handleSelect = (val: string) => {
        onChange(val);
        setMenuVisible(false);
    };

    useEffect(() => {
        options.length > 1 &&
            setMenuVisible(!options.find(item => item.value === value));
    }, [options]);

    return (
        <View style={[style]} {...props}>
            {/* Button */}
            <TouchableOpacity
                onPress={() => setMenuVisible(!menuVisible)}
                className="rounded-lg border overflow-hidden"
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border
                }}
            >
                {/*label && (
                    <View className="flex-row justify-center items-center space-x-1 pt-1">
                        <View className="grow border-b border-gray-100 h-0" />
                        <Text className="font-extrabold">{label}</Text>
                        <View className="grow border-b border-gray-100 h-0" />
                    </View>
                )*/}
                <View
                    className="flex-row justify-between items-center px-2 min-h-[32px]"
                    style={{
                        borderTopWidth: label ? 0 : 1,
                        paddingTop: label ? 0 : 1
                    }}
                >
                    <Text className="grow text-center" numberOfLines={2}>
                        {options.find(item => item.value === value)?.label ||
                            label ||
                            "Select an option"}
                    </Text>

                    <Icon name={menuVisible ? "expand-less" : "expand-more"} />
                </View>
            </TouchableOpacity>

            <MenuOptions
                label={label}
                value={value}
                options={options}
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                onChange={onChange}
            />
        </View>
    );
};

export default CustomMenu;
