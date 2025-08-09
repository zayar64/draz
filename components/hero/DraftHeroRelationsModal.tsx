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
import { increaseHexIntensity, reduceHexAlpha } from "@/utils";
import { useTheme } from "@/contexts";
import Confirm from "@/components/Confirm";
import { HeroType, RelationType } from "@/types";

import {
    RELATION_IMAGE_SIZE,
    MODAL_CLASS_NAME,
    paginateList
} from "./HeroRelationsModal";

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

    const relation = useMemo(
        () => relations.find(item => item.name === relationType),
        [relationType]
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
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center space-x-2 mb-[6px]">
                            <Icon name="arrow-back-ios" onPress={onClose} />
                            <HeroImage heroId={hero.id} size={50} />
                            <Text
                                variant="body"
                                numberOfLines={1}
                                className="w-40"
                            >
                                {hero.name}
                            </Text>
                        </View>

                        {headerRight ? (
                            <View>{headerRight}</View>
                        ) : (
                            <View className="w-10" />
                        )}
                    </View>

                    {headerRight ? (
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
                    ) : (
                        <View className="flex-row justify-center items-center">
                            <View
                                className="border-b w-full"
                                style={{
                                    borderColor: relation?.colorRepresentation
                                }}
                            />
                            <Text
                                className="absolute m-[-8px] px-2"
                                style={{
                                    backgroundColor: modalStyle.backgroundColor,
                                    color: relation?.colorRepresentation
                                }}
                            >
                                {relation?.name}
                            </Text>
                        </View>
                    )}

                    <View />

                    <FlashList
                        data={paginateList(data)}
                        renderItem={({ item }) => (
                            <HeroImage
                                heroId={item.id}
                                size={RELATION_IMAGE_SIZE}
                                name={item.name}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        numColumns={4}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(HeroRelationsModal, (prev, next) => prev.hero === next.hero && prev.relationType === next.relationType);
