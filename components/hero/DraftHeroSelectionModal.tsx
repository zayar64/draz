import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage, TextField, Confirm } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";

import { HeroType, RelationType } from "@/types";

import {
    
    RELATION_IMAGE_SIZE,
    MODAL_CLASS_NAME
} from "./HeroRelationsModal";

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
                <View className="flex-row items-center space-x-4">
                    <Icon name="arrow-back-ios" onPress={onClose} />
                </View>

                <View className="flex-row items-center space-x-2">
                    <TextField
                        value={search}
                        onChangeText={onChangeSearch}
                        className="grow"
                        label="Search Hero"
                    />
                    {search && (
                        <Icon
                            name="clear"
                            size="large"
                            onPress={() => onChangeSearch("")}
                        />
                    )}
                </View>

                <View />

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
