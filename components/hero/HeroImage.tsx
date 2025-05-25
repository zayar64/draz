import React from "react";
import { Image } from "react-native";

import View from "../View";
import Text from "../Text";

import { heroImageMapping } from "@/constants";
import { db } from "@/database";

interface ImageType {
    heroId: number;
    name?: string;
    size?: number;
    margin?: number;
}

const DEFAULT_SIZE = 52;

const HeroImage = ({
    heroId,
    name,
    size = DEFAULT_SIZE,
    margin = 12
}: ImageType) => {
    const image = heroImageMapping[heroId];

    const borderWidth = size / (DEFAULT_SIZE / 2);
    return (
        <View
            className="flex-col justify-center items-center"
            style={{
                margin
            }}
        >
            <View
                style={{
                    width: size,
                    height: size,
                    borderWidth
                }}
                className="rounded-full"
            >
                <Image
                    source={image || require("@/assets/images/default.png")}
                    resizeMode="cover"
                    style={{
                        width: size - borderWidth * 2,
                        height: size - borderWidth * 2
                    }}
                    className="rounded-full"
                />
            </View>

            {name && (
                <Text
                    numberOfLines={1}
                    style={{ width: size, fontSize: borderWidth * 4 }}
                    className="text-center"
                >
                    {name}
                </Text>
            )}
        </View>
    );
};

export default React.memo(HeroImage);
