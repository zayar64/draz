import React, { useState, useMemo, useCallback } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage, TextField, Confirm } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";
import { HeroType, RelationType } from "@/types";

import { RELATION_IMAGE_SIZE, MODAL_CLASS_NAME } from "./HeroRelationsModal";

const HeroSelectionModal = ({
    visible,
    selectedHero,
    onClose,
    heroes,
    onSelect,
    relationType
}: {
    visible: boolean;
    selectedHero: HeroType;
    onClose: () => void;
    heroes: HeroType[];
    onSelect: (hero: HeroType) => void;
    relationType: RelationType;
}) => {
    const [search, setSearch] = useState<string>("");
    const { colors } = useTheme();
    const modalStyle = {
        backgroundColor: increaseHexIntensity(colors.background, 0.2)
    };

    const filteredHeroes = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        return heroes.filter(h =>
            h.name.toLowerCase().startsWith(lowerCaseSearch)
        );
    }, [heroes, search]);

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
                        onChangeText={setSearch}
                        className="grow"
                        label={`Search ${selectedHero.name}'s ( ${relationType} )`}
                    />
                    {search && (
                        <Icon
                            name="clear"
                            size="large"
                            onPress={() => setSearch("")}
                        />
                    )}
                </View>

                <View />

                <View className="flex-1">
                    <FlashList
                        data={filteredHeroes}
                        renderItem={({ item }) => {
                            const disabled = selectedHero?.relations?.[
                                relationType
                            ]
                                .map((i: HeroType) => i.id)
                                .includes(item.id);
                            return (
                                <TouchableOpacity
                                    onPress={() =>
                                        Confirm(
                                            "Confirm",
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
