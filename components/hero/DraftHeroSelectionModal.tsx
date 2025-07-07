import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage, TextField, Confirm } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";

import { HeroType, RelationType } from "@/types";

import { RELATION_IMAGE_SIZE, MODAL_CLASS_NAME } from "./HeroRelationsModal";

const HeroSelectionModal = ({
    visible,
    search,
    onChangeSearch,
    onClose,
    availableHeroes,
    onSelect
}: {
    visible: boolean;
    search: string;
    onChangeSearch: (text: string) => void;
    onClose: () => void;
    availableHeroes: HeroType[];
    onSelect: (hero: HeroType) => void;
}) => {
    const { colors } = useTheme();

    const modalStyle = {
        backgroundColor: increaseHexIntensity(colors.background, 0.2)
    };

    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            <View style={modalStyle} className={MODAL_CLASS_NAME}>
                <View className="flex-row items-center space-x-2 my-2">
                    <Icon name="arrow-back-ios" onPress={onClose} />

                    <TextField
                        value={search}
                        onChangeText={onChangeSearch}
                        className="flex-1"
                    />
                    {search && (
                        <Icon
                            name="clear"
                            size="large"
                            onPress={() => onChangeSearch("")}
                        />
                    )}
                </View>

                <View className="flex-1 h-[80%]">
                    <FlashList
                        data={availableHeroes}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onSelect(item)}>
                                <HeroImage
                                    heroId={item.id}
                                    name={item.name}
                                    size={RELATION_IMAGE_SIZE}
                                />
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        numColumns={4}
                        estimatedItemSize={RELATION_IMAGE_SIZE}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default HeroSelectionModal;
