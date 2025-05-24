import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Pressable,
    Animated
} from "react-native";

import { Link } from "expo-router";

import Icon from "./Icon";
import View from "./View";
import Text from "./Text";

import { useTheme, useGlobal } from "@/contexts";
import { reduceHexIntensity } from "@/utils";
import { IconType } from "@/types";

interface LeftDrawerProps {
    open: boolean;
    onClose: () => void;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({ open, onClose }) => {
    const screenWidth = Dimensions.get("window").width;
    const drawerWidth = screenWidth * 0.64; // % of screen width
    const translateX = useRef(new Animated.Value(-drawerWidth)).current;
    const [isVisible, setIsVisible] = useState(open); // Local state to control Modal visibility

    const { mode, toggleMode, colors } = useTheme();

    const menuItems = [
        {
            label: "အတိုးတွက်စက်",
            path: "/loan-calculator",
            icon: "calculator"
        },
        {
            label: "Compare",
            path: "/icons",
            icon: "swap",
            iconSrc: "ant"
        },
        {
            label: "Icons",
            path: "/icons",
            icon: "question-mark",
            iconSrc: "material"
        }
    ];

    useEffect(() => {
        if (open) {
            // When drawer should open
            setIsVisible(true);
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            // When drawer should close
            Animated.timing(translateX, {
                toValue: -drawerWidth,
                duration: 200,
                useNativeDriver: true
            }).start(() => {
                // Only hide the modal after animation completes
                setIsVisible(false);
                onClose(); // Call onClose after animation
            });
        }
    }, [open, drawerWidth, onClose]);

    const handleClose = () => {
        // Trigger the slide-out animation instead of closing immediately
        Animated.timing(translateX, {
            toValue: -drawerWidth,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setIsVisible(false);
            onClose();
        });
    };

    return (
        <Modal
            visible={isVisible} // Controlled by local state
            transparent
            animationType="none"
            onRequestClose={handleClose} // Use custom close handler
        >
            <View className="flex-1 flex-row">
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-black/50"
                    onPress={handleClose} // Use custom close handler
                />

                {/* Drawer Content */}
                <Animated.View
                    className="h-full absolute left-0 top-0"
                    style={{
                        width: drawerWidth,
                        transform: [{ translateX }],
                        backgroundColor: reduceHexIntensity(
                            colors.background,
                            0.1
                        )
                    }}
                >
                    {/* Header */}
                    <View className="p-5"></View>

                    {/* Menu Items */}
                    <ScrollView className="flex-1">
                        {menuItems.map((item, index) => (
                            <Link key={index} href={item.path as any} asChild>
                                <TouchableOpacity
                                    className="flex-row space-x-4 items-center p-4 border-b"
                                    style={{
                                        borderColor: colors.border
                                    }}
                                    onPress={handleClose} // Close with animation
                                >
                                    <Icon name={item.icon} src={item.iconSrc as IconType ?? "materialCom"} />
                                    <Text className="ml-3">{item.label}</Text>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </ScrollView>

                    {/* Footer */}
                    {/*<TouchableOpacity
                        onPress={toggleMode}
                        className="flex-row px-6 h-10 border-t space-x-4 justify-center items-center"
                        style={{
                            borderColor: colors.border
                        }}
                    >
                        <Icon name={`${mode}-mode`} />
                    </TouchableOpacity>*/}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default LeftDrawer;
