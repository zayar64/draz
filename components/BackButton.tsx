import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useRouter } from "expo-router";

import Icon from "@/components/Icon";

const BackButton = ({ ...props }) => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={router.back} {...props}>
            <Icon name="arrow-back-ios" />
        </TouchableOpacity>
    );
};

export default BackButton;
