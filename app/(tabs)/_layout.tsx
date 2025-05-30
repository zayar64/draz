import React, { useState, useEffect, useMemo } from "react";
import { BackHandler, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import kvstore from "expo-sqlite/kv-store";

import { View, Icon, Prompt } from "@/components";
import { useTheme } from "@/contexts";
import { IconType } from "@/types";

interface TabItem {
    title: string;
    name: string;
    iconName: string;
    iconSrc?: IconType;
    onPress?: () => void;
}

const PERMISSION_KEY = "hasPermissionToUseApp";

export default function TabsLayout() {
    const [hasPermissionToUseApp, setHasPermissionToUseApp] = useState(true);
    const { colors } = useTheme();
    const router = useRouter();

    const tabs: TabItem[] = useMemo(
        () => [
            {
                title: "Home",
                name: "index",
                iconName: "home"
            },
            {
                title: "Draft",
                name: "draft",
                iconName: "sword-cross",
                iconSrc: "materialCom"
            }
        ],
        [router]
    );

    /*useEffect(() => {
        const checkPermission = async () => {
            const hasPermission = await kvstore.getItem(PERMISSION_KEY);
            setHasPermissionToUseApp(hasPermission === "1");
        };
        checkPermission();
    }, []);

    if (!hasPermissionToUseApp) {
        return (
            <Prompt
                visible
                onClose={BackHandler.exitApp}
                message="Enter permission key to continue..."
                onSubmit={async prompt => {
                    if (prompt === "Junian") {
                        setHasPermissionToUseApp(true);
                        await kvstore.setItem(PERMISSION_KEY, "1");
                    } else {
                        alert("Incorrect!");
                    }
                }}
            />
        );
    }*/

    return (
        <View className="flex-1">
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.background,
                    tabBarStyle: {
                        height: 40,
                        backgroundColor: colors.background,
                        borderColor: colors.text
                    }
                }}
            >
                {tabs.map(tab => (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <Icon
                                    name={tab.iconName}
                                    color={
                                        focused ? colors.primary : colors.text
                                    }
                                    src={tab.iconSrc ?? "material"}
                                />
                            )
                            /*tabBarButton: ({
                                onPress,
                                style,
                                children,
                                ...props
                            }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={
                                            tab.onPress ??
                                            (() => router.push(tab.name as any))
                                        }
                                        style={style}
                                    >
                                        {children}
                                    </TouchableOpacity>
                                );
                            }*/
                        }}
                    />
                ))}
            </Tabs>
        </View>
    );
}
