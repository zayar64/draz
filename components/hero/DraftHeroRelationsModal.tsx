import React, { useMemo, useEffect } from "react";
import {
    Modal,
    TouchableOpacity,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage } from "@/components";
import { increaseHexIntensity } from "@/utils";
import { useTheme } from "@/contexts";
import Confirm from "@/components/Confirm";
import { HeroType, RelationType } from "@/types";

export const RELATION_IMAGE_SIZE = 48;
export const MODAL_CLASS_NAME = "h-[92%] rounded-xl border m-4 p-4 space-y-4";

const SWIPE_THRESHOLD = 50;

const HeroRelationsModal = ({
    visible,
    hero,
    relationType,
    onClose,
    setRelationType,
    headerRight
}: {
    visible: boolean;
    hero: any;
    relationType: RelationType;
    onClose: () => void;
    setRelationType: (type: RelationType) => void;

    headerRight: React.ReactNode;
}) => {
    const { colors } = useTheme();
    const modalStyle = {
        backgroundColor: increaseHexIntensity(colors.background, 0.2)
    };

    const data: HeroType[] = (hero.relations?.[relationType] || []).sort(
        (a: HeroType, b: HeroType) => (a.name || "").localeCompare(b.name || "")
    );

    const relations = [
        { name: "Combo", colorRepresentation: "#50e750" },
        { name: "Weak Vs", colorRepresentation: "#f42828" },
        { name: "Strong Vs", colorRepresentation: "#f38726" }
    ];

    const handleSwipeLeft = () => {
        const currentIndex = relations.findIndex(
            item => item.name === relationType
        );
        const newIndex = Math.max(0, currentIndex - 1);
        setRelationType(relations[newIndex].name as RelationType);
    };

    const handleSwipeRight = () => {
        const currentIndex = relations.findIndex(
            item => item.name === relationType
        );
        const newIndex = Math.min(relations.length - 1, currentIndex + 1);
        setRelationType(relations[newIndex].name as RelationType);
    };

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderRelease: (
                    _evt: GestureResponderEvent,
                    gestureState: PanResponderGestureState
                ) => {
                    if (gestureState.dx > SWIPE_THRESHOLD) {
                        handleSwipeLeft();
                    } else if (gestureState.dx < -SWIPE_THRESHOLD) {
                        handleSwipeRight();
                    }
                }
            }),
        [relationType]
    );

    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            <View style={modalStyle} className={MODAL_CLASS_NAME}>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-2 mb-[6px]">
                        <Icon name="arrow-back-ios" onPress={onClose} />
                        <HeroImage heroId={hero.id} size={50} />
                        <Text variant="body" numberOfLines={1} className="w-40">
                            {hero.name}
                        </Text>
                    </View>

                    {headerRight ? (
                        <View>{headerRight}</View>
                    ) : (
                        <View className="w-10" />
                    )}
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
                <View className="flex-1">
                    <FlashList
                        data={data}
                        renderItem={({ item }) => (
                            <HeroImage
                                heroId={item.id}
                                size={RELATION_IMAGE_SIZE}
                                name={item.name}
                            />
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

export default HeroRelationsModal;
