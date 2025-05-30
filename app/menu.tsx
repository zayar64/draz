import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import * as Updates from "expo-updates";
import { default as kvstore } from "expo-sqlite/kv-store";

import { downloadDb, pickAndUploadDb } from "@/database";
import { Container, View, Text, Icon, Prompt } from "@/components";
import { useGlobal, useTheme } from "@/contexts";
import { IconType } from "@/types";

export default function Menu() {
    const { setLoading } = useGlobal();
    const [iAmDeveloper, setIAmDeveloper] = useState<string>("1");
    const { colors, mode, toggleMode } = useTheme();
    const navigate = useRouter().push;

    const [showPrompt, setShowPrompt] = useState(false);

    const execAsync = async (func: () => void, restart = false) => {
        setLoading(true);
        try {
            await func();
            if (restart) await Updates.reloadAsync();
        } finally {
            setLoading(false);
        }
    };

    const checkOpenConsolePermission = async () => {
        setIAmDeveloper((await kvstore.getItem("iAmDeveloper")) || "1");
    };

    checkOpenConsolePermission();

    const menuSections: {
        title: string;
        items: {
            label: string;
            onPress: () => void;
            icon: string;
            iconSrc?: IconType;
        }[];
    }[] = [
        {
            title: "Data Management",
            items: [
                {
                    label: "Download Data",
                    onPress: () => execAsync(downloadDb),
                    icon: "download"
                },
                {
                    label: "Upload Data",
                    onPress: () => execAsync(pickAndUploadDb, true),
                    icon: "upload"
                }
            ]
        },
        {
            title: "More",
            items: [
                {
                    label: `${mode === "dark" ? "Dark" : "Light"} Mode`,
                    onPress: toggleMode,
                    icon: `${mode}-mode`,
                    iconSrc: "material"
                }
            ]
        },
        iAmDeveloper === "1"
            ? {
                  title: "Developer Options",
                  items: [
                      {
                          label: "SQLite Terminal",
                          onPress: () => navigate("/sqlite-terminal"),
                          icon: "terminal",
                          iconSrc: "oct"
                      }
                  ]
              }
            : { title: "", items: [] }
    ];

    return (
        <View
            className="flex-1 w-full items-center justify-center"
            style={{ backgroundColor: colors.background }}
        >
            <ScrollView className="w-full">
                {menuSections
                    .filter(i => i.title)
                    .map(({ title, items }, sectionIndex) => (
                        <View key={sectionIndex} className="border-b">
                            <Text className="font-bold text-lg p-4">
                                {title}
                            </Text>
                            {items.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="flex-row space-x-4 items-center p-4"
                                    style={{ borderColor: colors.border }}
                                    onPress={item.onPress}
                                >
                                    <Icon
                                        name={item.icon}
                                        src={
                                            item?.iconSrc
                                                ? (item?.iconSrc as IconType)
                                                : "materialCom"
                                        }
                                    />
                                    <Text className="ml-3">{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
            </ScrollView>

            <Prompt
                visible={showPrompt}
                onClose={() => setShowPrompt(false)}
                message="Enter code to continue..."
                onSubmit={async prompt => {
                    if (prompt === "zygod64") {
                        setShowPrompt(false);
                        navigate("/sqlite-terminal");
                        await kvstore.setItem("consolePermissionGranted", "1");
                    } else {
                        alert("Incorrect Code!");
                    }
                }}
            />
        </View>
    );
}
