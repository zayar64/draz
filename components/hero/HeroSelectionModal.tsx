import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect
} from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList, FlashList as FlashListRef } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage, TextField, Confirm } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";
import { HeroType, RelationType } from "@/types";

import {
    RELATION_IMAGE_SIZE,
    MODAL_CLASS_NAME,
    paginateList
} from "./HeroRelationsModal";

const BATCH_SIZE = 4 * 6;

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
    const listRef = useRef<FlashListRef<HeroType>>(null);

    const filteredHeroes = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        if (search) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: 0
                    //animated: true
                });
            }, 100);

            return heroes.filter(h =>
                h.name.toLowerCase().startsWith(lowerCaseSearch)
            );
        }
        return [];
    }, [heroes, search]);

    const renderItem = useCallback(
        ({ item }: { item: HeroType }) => {
            const disabled = selectedHero?.relations?.[relationType]
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
        },
        [selectedHero, relationType, onSelect]
    );

    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

    useEffect(() => {
        if (visibleCount < heroes.length) {
            const timeout = setTimeout(() => {
                setVisibleCount(prev => prev + BATCH_SIZE);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [visibleCount, heroes.length]);

    const paginatedHeroes = useMemo(
        () => heroes.slice(0, visibleCount),
        [heroes, visibleCount]
    );

    const memoizedList = useMemo(
        () => (
            <FlashList
                data={paginatedHeroes}
                ref={listRef}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={4}
                keyboardShouldPersistTaps="handled"
            />
        ),
        [renderItem, paginatedHeroes]
    );

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            //animationType="fade"
        >
            <View className="flex-1 justify-center">
                <View
                    style={modalStyle}
                    className={`${MODAL_CLASS_NAME} overflow-hidden`}
                >
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
                        <Icon
                            name="clear"
                            size="large"
                            onPress={() => setSearch("")}
                        />
                    </View>

                    <View
                        className="h-full"
                        style={{
                            display: search ? "flex" : "none"
                        }}
                    >
                        <FlashList
                            data={paginateList(filteredHeroes, 4 * 4)}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            numColumns={4}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>

                    <View />
                    {memoizedList}
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(
    HeroSelectionModal,
    (prev, next) =>
        //prev.visible === next.visible &&
        prev.selectedHero === next.selectedHero &&
        prev.onClose === next.onClose &&
        prev.heroes === next.heroes &&
        prev.onSelect === next.onSelect &&
        prev.relationType === next.relationType
);
