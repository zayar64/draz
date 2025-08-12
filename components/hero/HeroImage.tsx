import React from "react";
import { Image } from "react-native";

import View from "../View";
import Text from "../Text";

import { heroImageMapping } from "@/constants";

interface ImageType {
    heroId: number;
    name?: string;
    size?: number;
    margin?: number;
    imageStyle?: Record<string, string | number>;
    disabled?: boolean;
}

const DEFAULT_SIZE = 52;

const HeroImage = ({
    heroId,
    name,
    size = DEFAULT_SIZE,
    margin = 12,
    imageStyle,
    disabled = false
}: ImageType) => {
    const image = heroImageMapping[heroId];
    const disabledColor = "#484848";

    const borderWidth = size / (DEFAULT_SIZE / 2);
    return (
        <View
            className="flex-col justify-center items-center"
            style={{
                margin
            }}
        >
            <View
                style={[
                    {
                        width: size,
                        height: size,
                        borderWidth
                    },
                    disabled
                        ? {
                              backgroundColor: disabledColor,
                              borderColor: disabledColor
                          }
                        : {},
                    imageStyle
                ]}
                className="rounded-full"
            >
                <Image
                    source={image || require("@/assets/images/default.png")}
                    resizeMode="cover"
                    style={{
                        width: size - borderWidth * 2,
                        height: size - borderWidth * 2,
                        opacity: disabled ? 0.5 : 1
                    }}
                    className="rounded-full"
                />
            </View>

            {name && (
                <Text
                    numberOfLines={1}
                    style={[
                        {
                            width: size,
                            fontSize: borderWidth * 4,
                            opacity: disabled ? 0.3 : 1
                        }
                    ]}
                    className="text-center"
                >
                    {name}
                </Text>
            )}
        </View>
    );
};

export default React.memo(HeroImage);
