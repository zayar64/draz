import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { View, Text, Icon } from "@/components";
import { HeroImage } from "@/components/hero";
import { useTheme } from "@/contexts";
import { HeroType } from "@/types";

const IMAGE_SIZE = 40;

type BanSectionProps = {
    title: string;
    bannedHeroes: (HeroType | null)[];
    onSlotPress: (index: number, hero: HeroType | null) => void;
};

export const BanSection = ({ title, bannedHeroes, onSlotPress, ...props }: BanSectionProps) => {
    const { colors } = useTheme();

    return (
        <View {...props}>
            <View className="self-start ml-2 mb-[-4px] px-2 rounded z-10" style={{ backgroundColor: colors.background }}>
                <Text style={{ color: colors.text }}>{title}</Text>
            </View>
            <View className="h-14 rounded-lg border px-2 pt-2" style={{ borderColor: colors.text }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-2">
                        {bannedHeroes.map((hero, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => onSlotPress(idx, hero)}
                                className="rounded-full border-[2px] justify-center items-center"
                                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderColor: colors.text }}
                            >
                                {hero ? (
                                    <HeroImage heroId={hero.id} size={IMAGE_SIZE} />
                                ) : (
                                    <Icon name="add" size={IMAGE_SIZE * 0.8} color={colors.text} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};