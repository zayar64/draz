import React, { useState, useMemo, useCallback } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Icon, HeroImage } from "@/components";
import { TextField } from "@/components";
import { increaseHexIntensity } from "@/utils";
import { useTheme } from "@/contexts";
import { HeroType } from "@/types";
import { RELATION_IMAGE_SIZE, MODAL_CLASS_NAME } from "./HeroRelationsModal";

const HeroSelectionModal = ({
    visible,
    onClose,
    heroes,
    onSelect
}: {
    visible: boolean;
    onClose: () => void;
    heroes: HeroType[];
    onSelect: (hero: HeroType) => void;
}) => {
  const [search, setSearch] = useState<string>("")
    const { colors } = useTheme();

    // Memoize modal style to prevent re-renders
    const modalStyle = useMemo(
        () => ({
            backgroundColor: increaseHexIntensity(colors.background, 0.2)
        }),
        [colors.background]
    );

    // Stable key extractor
    const keyExtractor = useCallback(
        (item: HeroType) => item.id.toString(),
        []
    );

    // Stable renderItem
    const renderItem = useCallback(
        ({ item }: { item: HeroType }) => (
            <TouchableOpacity onPress={() => onSelect(item)} className="p-1">
                <HeroImage
                    heroId={item.id}
                    name={item.name}
                    size={RELATION_IMAGE_SIZE}
                />
            </TouchableOpacity>
        ),
        [onSelect]
    );

    // Pre-calculate layout to speed up scroll
    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: RELATION_IMAGE_SIZE + 8, // image size + padding
            offset: (RELATION_IMAGE_SIZE + 8) * index,
            index
        }),
        []
    );
    
    const filteredHeroes = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        return heroes.filter(h =>
            h.name.toLowerCase().startsWith(lowerCaseSearch)
        );
    }, [heroes, search]);

    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            <View style={modalStyle} className={MODAL_CLASS_NAME}>
                <View className="flex-row items-center space-x-2 my-2">
                    <Icon name="arrow-back-ios" onPress={onClose} />
                    <TextField
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1"
                    />
                    {search.length > 0 && (
                        <Icon
                            name="clear"
                            size="large"
                            onPress={() => setSearch("")}
                        />
                    )}
                </View>
                <View className="flex-1 h-[80%]">
                    <FlashList
                        data={filteredHeroes}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        estimatedItemSize={RELATION_IMAGE_SIZE + 8}
                        /*getItemLayout={getItemLayout}
                        initialNumToRender={16}
                        maxToRenderPerBatch={32}
                        windowSize={5}*/
                        numColumns={4}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(HeroSelectionModal);
