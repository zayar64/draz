import React from "react";
import { View } from "react-native";

import Radio from "./Radio";

type OptionType = Record<string, string>;

interface RadioGroupProps {
    options: OptionType[];
    selected: string;
    onSelect: (value: string) => void;
    horizontal?: boolean;
    className?: string
}

const RadioGroup = ({
    options,
    selected,
    onSelect,
    horizontal,
    className,
    ...props
}: RadioGroupProps) => {
    return (
        <View
            {...props}
            className={`${
                horizontal ? "flex-row" : "flex-col"
            } justify-around ${className || ""}`}
        >
            {options.map((option: OptionType, index: number) => (
                <Radio
                    key={index}
                    label={option.label}
                    value={option.value}
                    selected={selected}
                    onSelect={onSelect}
                    horizontal={!horizontal}
                />
            ))}
        </View>
    );
};

export default RadioGroup;
