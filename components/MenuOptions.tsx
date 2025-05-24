import React, { useMemo, useRef } from "react";
import { TouchableOpacity, Modal, FlatList } from "react-native";

import { useTheme } from "@/contexts";
import { reduceHexAlpha } from "@/utils";

import View from "./View";
import Text from "./Text";
import Icon from "./Icon";

interface MenuOptionsProps {
    options: { label: string; value: string }[];
    label?: string;
    value?: string;
    visible: boolean;
    onClose: () => void;
    onChange: (value: string) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
    options,
    label,
    value,
    visible = false,
    onClose,
    onChange
}) => {
    const { colors } = useTheme();
    const flatListRef =
        useRef<FlatList<{ label: string; value: string }>>(null);

    // Find selected index safely
    const selectedIndex = useMemo(() => {
        const index = options.findIndex(option => option.value === value);
        return index >= 0 ? index : 0;
    }, [value, options]);

    // Scroll to selected index when modal opens
    React.useEffect(() => {
        if (visible && options.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: selectedIndex,
                    animated: true,
                    viewPosition: 0.5 // Center the item
                });
            }, 100);
        }
    }, [visible, selectedIndex]);

    return (
        <Modal
            visible={visible}
            //onRequestClose={onClose}
            transparent
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: reduceHexAlpha(colors.background, 0.1),
                    padding: 16
                }}
            >
                <View
                    className="w-full rounded-lg border max-h-[50%] overflow-hidden px-2"
                    style={{ backgroundColor: colors.background }}
                >
                    <View className="space-x-4">
                        <TouchableOpacity
                            className="absolute py-4"
                            style={{
                                zIndex: 9999
                            }}
                            onPress={onClose}
                        >
                            <Icon name="close" size={24} />
                        </TouchableOpacity>

                        {label && (
                            <Text className="text-sm font-bold text-center p-4">
                                {label}
                            </Text>
                        )}
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={options}
                        keyExtractor={(_, index) => index.toString()}
                        getItemLayout={(_, index) => ({
                            length: 50, // Approximate row height
                            offset: 50 * index,
                            index
                        })}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onChange(item.value);
                                    onClose();
                                }}
                                className="p-2 my-1 rounded-lg border last:border-0 w-full"
                                style={{
                                    backgroundColor:
                                        item.value === value
                                            ? colors.primary
                                            : colors.background,
                                    borderColor: colors.border
                                }}
                            >
                                <Text className="text-center">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                        nestedScrollEnabled
                    />
                </View>
            </View>
        </Modal>
    );
};

export default MenuOptions;
