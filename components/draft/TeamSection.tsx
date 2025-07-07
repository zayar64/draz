import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Icon } from "@/components";
import { HeroImage } from "@/components/hero";
import { useTheme } from "@/contexts";
import { HeroType } from "@/types";

const IMAGE_SIZE = 40;

type TeamProps = {
    title: string;
    team: (HeroType | null)[];
    onSlotPress: (index: number, hero: HeroType | null) => void;
};

export const TeamSection = ({ title, team, onSlotPress, ...props }: TeamProps) => {
    const { colors } = useTheme();
    const color = title.includes("Enemy") ? colors.error : colors.primary;

    return (
        <View {...props}>
            <View className="self-start ml-2 mb-[-4px] px-2 rounded z-10 invisible" style={{ backgroundColor: colors.background }}>
                <Text style={{ color }}>{title}</Text>
            </View>
            <View className="h-14 rounded-lg border flex-row p-2 justify-between" style={{ borderColor: color }}>
                {team.map((hero, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => onSlotPress(idx, hero)}
                        className="rounded-full border-[2px] justify-center items-center"
                        style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderColor: color }}
                    >
                        {hero ? (
                            <HeroImage heroId={hero.id} size={IMAGE_SIZE} imageStyle={{ borderColor: color }} />
                        ) : (
                            <Icon name="add" size={IMAGE_SIZE * 0.8} color={color} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};