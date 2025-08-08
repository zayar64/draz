import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    Modal,
    TouchableOpacity,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage } from "@/components";
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";
import Confirm from "@/components/Confirm";
import { HeroType, RelationType } from "@/types";

export const RELATION_IMAGE_SIZE = 48;
export const MODAL_CLASS_NAME = "h-[75%] rounded-xl border m-4 p-4 space-y-4";

const SWIPE_THRESHOLD = 50;

export const paginateList = (data: HeroType[], batchSize: number = 24) => {
    const [visibleCount, setVisibleCount] = useState(batchSize);

    useEffect(() => {
        if (visibleCount < data.length) {
            const timeout = setTimeout(() => {
                setVisibleCount(prev => prev + batchSize);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [visibleCount, data.length]);

    return data.slice(0, visibleCount);
};

const HeroRelationsModal = ({
    visible,
    hero,
    relationType,
    onClose,
    setRelationType,
    onPressAdd,
    onPressHero
}: {
    visible: boolean;
    hero: any;
    relationType: RelationType;
    onClose: () => void;
    setRelationType: (type: RelationType) => void;
    onPressAdd: () => void;
    onPressHero: (h: any) => void;
}) => {
    const { colors } = useTheme();
    const modalStyle = {
        backgroundColor: increaseHexIntensity(colors.background, 0.2)
    };

    const data: (HeroType | null)[] = [
        null,
        ...(hero.relations?.[relationType] || []).sort(
            (a: HeroType, b: HeroType) =>
                (a.name || "").localeCompare(b.name || "")
        )
    ];

    const relations = [
        { name: "Combo", colorRepresentation: "#50e750" },
        { name: "Weak Vs", colorRepresentation: "#f42828" },
        { name: "Strong Vs", colorRepresentation: "#f38726" }
    ];

    const renderItem = useCallback(
        ({ item }: { item: HeroType }) =>
            item === null ? (
                <View
                    className="mt-[12px] mx-[10px] rounded-full border-[2px] justify-center items-center"
                    style={{
                        width: RELATION_IMAGE_SIZE,
                        height: RELATION_IMAGE_SIZE
                    }}
                >
                    <Icon
                        name="add"
                        size={RELATION_IMAGE_SIZE - 10}
                        onPress={onPressAdd}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                        Confirm(
                            "",
                            `Are you sure to remove ${item.name}?`,
                            () => onPressHero(item)
                        )
                    }
                >
                    <HeroImage
                        heroId={item.id}
                        size={RELATION_IMAGE_SIZE}
                        name={item.name}
                    />
                </TouchableOpacity>
            ),
        [onPressAdd]
    );

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
                    <View className="flex-row items-center space-x-4 mb-[6px]">
                        <Icon name="arrow-back-ios" onPress={onClose} />
                        <HeroImage heroId={hero.id} size={64} />
                        <Text variant="header">{hero.name}</Text>
                    </View>
                    <View className="rounded-md border-[2px] overflow-hidden flex-row justify-evenly">
                        {relations.map(({ name, colorRepresentation }) => (
                            <TouchableOpacity
                                key={name}
                                onPress={() =>
                                    setRelationType(name as RelationType)
                                }
                                style={{
                                    backgroundColor:
                                        name === relationType
                                            ? colorRepresentation
                                            : undefined,
                                    width: "33.33%",
                                    borderColor: colors.border
                                }}
                                className="border-x justify-center items-center p-2"
                            >
                                <Text variant="body">{name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View />

                    <FlashList
                        data={paginateList(data as HeroType[])}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        numColumns={4}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default HeroRelationsModal;
