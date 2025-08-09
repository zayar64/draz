import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect
} from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList, FlashList as FlashListRef } from "@shopify/flash-list";
import { View, Icon, HeroImage, Text } from "@/components";
import { TextField } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";
import { HeroType } from "@/types";
import { RELATION_IMAGE_SIZE, MODAL_CLASS_NAME } from "./HeroRelationsModal";

const HeroSelectionModal = ({
    visible,
    onClose,
    heroes,
    onSelect,
    selectionTitle
}: {
    visible: boolean;
    onClose: () => void;
    heroes: HeroType[];
    onSelect: (hero: HeroType) => void;
    selectionTitle: string;
}) => {
    const [search, setSearch] = useState<string>("");
    const { colors } = useTheme();

    // Memoize modal style to prevent re-renders
    const modalStyle = useMemo(
        () => ({
            backgroundColor: increaseHexIntensity(colors.background, 0.2)
        }),
        [colors.background]
    );

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

    const memoizedList = useMemo(
        () => (
            <FlashList
                data={heroes}
                ref={listRef}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={4}
                keyboardShouldPersistTaps="handled"
            />
        ),
        [renderItem, heroes]
    );

    const selectionTitleColor = useMemo(
        () =>
            selectionTitle.includes("your")
                ? colors.primary
                : selectionTitle.includes("enemy")
                ? colors.error
                : colors.text,
        [selectionTitle, colors]
    );

    useEffect(() => setSearch(""), [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View
                className="flex-1 justify-center"
                style={{
                    backgroundColor: reduceHexAlpha(colors.background, 0.2)
                }}
            >
                <View style={modalStyle} className={MODAL_CLASS_NAME}>
                    <View className="flex-row justify-center items-center border-b my-4">
                        <Text
                            className="absolute top-[-16px] px-2 text-lg"
                            style={{
                                backgroundColor: modalStyle.backgroundColor,
                                color: selectionTitleColor
                            }}
                        >
                            {selectionTitle.toUpperCase()}
                        </Text>
                    </View>

                    <View className="flex-row items-center space-x-2 my-2">
                        <Icon
                            name="arrow-back-ios"
                            size="large"
                            onPress={onClose}
                        />

                        <TextField
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1"
                        />

                        <Icon
                            name={search ? "clear" : "search"}
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
                            data={filteredHeroes}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            numColumns={4}
                            showsVerticalScrollIndicator={false}
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
        prev.onClose === next.onClose &&
        prev.heroes === next.heroes &&
        prev.onSelect === next.onSelect &&
        prev.selectionTitle === next.selectionTitle
);
