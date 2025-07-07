import React from "react";
import { TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { View, Text } from "@/components";
import { HeroImage } from "@/components/hero";
import { useTheme } from "@/contexts";
import { HeroType } from "@/types";

const IMAGE_SIZE = 40;
const BADGE_SIZE = IMAGE_SIZE * 0.4;

type RecommendationBoxProps = {
    title: string;
    data: [string, number][];
    excludedHeroes: HeroType[];
    onSlotPress: (heroId: number, recommendationTitle: string) => void;
};

export const RecommendationBox = ({
    title,
    data,
    excludedHeroes,
    onSlotPress,
    ...props
}: RecommendationBoxProps) => {
    const { colors } = useTheme();

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text>{title}</Text>
            </View>
            <View className="h-14 rounded-lg border flex-row px-2 pt-1">
                <FlashList
                    data={data.filter(
                        ([id]) => !excludedHeroes.some(h => h.id === Number(id))
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={IMAGE_SIZE}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => onSlotPress(Number(item[0]), title)}
                        >
                            <View
                                className="rounded-full border absolute top-1 left-0 z-20 justify-center items-center"
                                style={{
                                    width: BADGE_SIZE,
                                    height: BADGE_SIZE,
                                    backgroundColor: colors.background
                                }}
                            >
                                <Text style={{ fontSize: BADGE_SIZE * 0.6 }}>
                                    {item[1]}
                                </Text>
                            </View>
                            <HeroImage
                                heroId={Number(item[0])}
                                size={IMAGE_SIZE}
                                margin={4}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};
