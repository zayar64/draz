import React from "react";

import { useTheme } from "@/contexts";
import View from "./View";
import Text from "./Text";
import { reduceHexAlpha, increaseHexIntensity } from "@/utils";

type PairType = {
    key: string;
    value: string;
};

export default function KeyValueTable({
    data,
    ...props
}: {
    data: PairType[];
    className?: string;
    style?: Record<string, string | number>;
}) {
    const { colors } = useTheme();

    return (
        <View {...props}>
            {data.map((pair: PairType, index: number) => (
                <View
                    className="flex-row space-x-0"
                    style={{
                        backgroundColor:
                            index % 2 === 0
                                ? colors.background3
                                : colors.background
                    }}
                    key={index}
                >
                    <Text className="p-2 leading-5 w-[50%]">{pair.key}</Text>
                    <Text className="py-2 leading-5 w-[50%]">{pair.value}</Text>
                </View>
            ))}
        </View>
    );
}
