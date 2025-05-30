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
    selectedHero,
    search,
    onChangeSearch,
    onClose,
    selections,
    onSelect,
    relationType
}: {
    visible: boolean;
    selectedHero: any;
    search: string;
    onChangeSearch: (text: string) => void;
    onClose: () => void;
    selections: any[];
    onSelect: (hero: any) => void;
    relationType: RelationType;
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
                    <HeroImage heroId={selectedHero.id} size={64} />
                    <Text variant="header">{selectedHero.name}</Text>
                </View>

                <View className="flex-row items-center space-x-2">
                    <TextField
                        value={search}
                        onChangeText={onChangeSearch}
                        className="grow"
                        label={`Search ${selectedHero.name}'s ( ${relationType} )`}
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

                <View className="flex-1">
                    <FlashList
                        data={selections}
                        renderItem={({ item }) => {
                            const disabled = selectedHero.relations[
                                relationType
                            ]
                                .map((i: HeroType) => i.id)
                                .includes(item.id);
                            return (
                                <TouchableOpacity
                                    onPress={() =>
                                        Confirm(
                                            "",
                                            `Add ${item.name} to ${selectedHero.name}'s ( ${relationType} ) ?`,
                                            () => onSelect(item)
                                        )
                                    }
                                    disabled={disabled}
                                    style={{
                                        opacity: disabled ? 0.3 : 1
                                    }}
                                >
                                    <HeroImage
                                        heroId={item.id}
                                        name={item.name}
                                        size={RELATION_IMAGE_SIZE}
                                    />
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={item => item.id.toString()}
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
