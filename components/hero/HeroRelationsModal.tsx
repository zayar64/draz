import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text, Icon, HeroImage } from "@/components";
import { increaseHexIntensity } from "@/utils";
import { useTheme } from "@/contexts";
import Confirm from "@/components/Confirm";
import { HeroType, RelationType } from "@/types";

export const RELATION_IMAGE_SIZE = 48;
export const MODAL_CLASS_NAME = "h-[92%] rounded-xl border m-4 p-4 space-y-4";

const HeroRelationsModal = ({
    visible,
    hero,
    relationType,
    onClose,
    onSelectRelationType,
    onPressAdd,
    onPressHero,
    onLongPressHero
}: {
    visible: boolean;
    hero: any;
    relationType: RelationType;
    onClose: () => void;
    onSelectRelationType: (type: RelationType) => void;
    onPressAdd: () => void;
    onPressHero: (h: any) => void;
    onLongPressHero: (h: any) => void;
}) => {
    const { colors } = useTheme();
    const modalStyle = {
        backgroundColor: increaseHexIntensity(colors.background, 0.2)
    };

    const data: (HeroType | null)[] = [
        null,
        ...(hero.relations?.[relationType] || []).sort(
            (firstHero: HeroType, secondHero: HeroType) =>
                (firstHero.name || "").localeCompare(secondHero.name || "")
        )
    ];

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyle} className={MODAL_CLASS_NAME}>
                <View className="flex-row items-center space-x-4 mb-[6px]">
                    <Icon name="arrow-back-ios" onPress={onClose} />
                    <HeroImage heroId={hero.id} size={64} />
                    <Text variant="header">{hero.name}</Text>
                </View>

                <View className="rounded-md border-[2px] overflow-hidden flex-row justify-evenly">
                    {["Combo", "Weak Vs", "Strong Vs"].map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() =>
                                onSelectRelationType(type as RelationType)
                            }
                            style={{
                                backgroundColor:
                                    type === relationType
                                        ? colors.primary
                                        : undefined,
                                width: "33.33%",
                                borderColor: colors.border
                            }}
                            className="border-x justify-center items-center p-2"
                        >
                            <Text variant="body">{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View />

                <View className="flex-1">
                    <FlashList
                        data={data}
                        renderItem={({ item }) =>
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
                                    onPress={() => onPressHero(item)}
                                    onLongPress={() =>
                                        Confirm(
                                            "",
                                            `Are you sure to remove ${item.name}?`,
                                            () => onLongPressHero(item)
                                        )
                                    }
                                    delayLongPress={300}
                                >
                                    <HeroImage
                                        heroId={item.id}
                                        size={RELATION_IMAGE_SIZE}
                                        name={item.name}
                                    />
                                </TouchableOpacity>
                            )
                        }
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
