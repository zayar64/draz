import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import * as Updates from "expo-updates";
import { default as kvstore } from "expo-sqlite/kv-store";

import {
    getDb,
    downloadDb,
    pickAndUploadDb,
    copyBundledAssetToStorage
} from "@/database";
import { heroes } from "@/constants";
import { Container, View, Text, Icon, Prompt, Confirm } from "@/components";
import { useGlobal, useTheme } from "@/contexts";
import { IconType, RelationType, HeroType, HeroRelationType } from "@/types";

export default function Menu() {
    const { setLoading, setLoadingText } = useGlobal();
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

    const insertRelations = async () => {
        const db = await getDb();
        const totalHeroesCount = heroes.length;
        setLoadingText("Please do not exist!");

        for (const index in heroes) {
            const hero = heroes[index];

            const relations: Record<RelationType, number[]> | undefined =
                hero.relations;

            if (relations) {
                for (const relationType of Object.keys(
                    relations
                ) as RelationType[]) {
                    const relationHeroIds: number[] = relations[relationType];
                    for (const targetHeroId of relationHeroIds) {
                        try {
                            await db.runAsync(
                                `INSERT INTO relation 
                                 (main_hero_id, target_hero_id, relation_type_id) 
                                 VALUES (?, ?, (SELECT id FROM relation_type WHERE name = ? LIMIT 1))`,
                                [hero.id, targetHeroId, relationType]
                            );
                        } catch (e: any) {
                            console.warn(
                                `Failed to insert relation: ${hero.name} -> ${targetHeroId} [${relationType}]`
                            );
                        }
                    }
                }
            }
        }
        setLoadingText("");
    };

    const menuSections: {
        title: string;
        items: {
            label: string;
            onPress: () => void;
            icon: string;
            color?: string;
            iconSrc?: IconType;
        }[];
    }[] = [
        {
            title: "Data Management",
            items: [
                {
                    label: "Add All Pre-defined Heroes Relation",
                    onPress: async () => {
                        //await execAsync(insertRelations);
                        await copyBundledAssetToStorage();
                        alert("Adding complete");
                        setTimeout(async () => {
                            await Updates.reloadAsync();
                        }, 500);
                    },
                    icon: "database-plus"
                },
                {
                    label: "Delete All Heroes Relation",
                    onPress: () =>
                        Confirm(
                            "",
                            "Are you sure to delete all heroes relations ?",
                            () =>
                                execAsync(async () => {
                                    const db = await getDb();
                                    await db.runAsync("DELETE FROM relation;");
                                    await db.runAsync(
                                        "UPDATE sqlite_sequence SET seq = 1 WHERE NAME = 'relation';"
                                    );
                                })
                        ),
                    icon: "delete",
                    color: "red"
                },
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
                /*{
                    label: "Terminal",
                    onPress: () => navigate("/sqlite-terminal"),
                    icon: "terminal",
                    iconSrc: "material"
                }*/
            ]
        }
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
                                        color={item.color}
                                    />
                                    <Text
                                        className="ml-3"
                                        style={{
                                            color: item.color || colors.text
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
}
