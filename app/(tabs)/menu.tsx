import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Link, useFocusEffect } from "expo-router";
import * as Updates from "expo-updates";
import kvstore from "expo-sqlite/kv-store";

import {
    db,
    downloadDb,
    pickAndUploadDb,
    copyDatabaseFromAssets
} from "@/database";
import { heroes } from "@/constants";
import { Container, View, Text, Icon, Prompt, Confirm } from "@/components";
import { useGlobal, useTheme, useUser } from "@/contexts";
import { IconType, RelationType, HeroType, HeroRelationType } from "@/types";
import { alertPremium } from "@/utils"

export default function Menu() {
    const [iAmDeveloper, setIAmDeveloper] = useState<string>("0");
    const router = useRouter();
    const { setLoading, setLoadingText } = useGlobal();
    const { colors, mode, toggleMode } = useTheme();
    const { isPremiumUser } = useUser();

    const execAsync = async (func: () => void, restart = false) => {
        setLoading(true);
        try {
            await func();
            if (restart) await Updates.reloadAsync();
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setIAmDeveloper(await kvstore.getItem("iAmDeveloper") || "0");
            })();
        }, [])
    );

    const insertRelations = async () => {
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
            disabled?: boolean;
            color?: string;
            iconSrc?: IconType;
        }[];
    }[] = [
        {
            title: "Data Management",
            items: [
                {
                    label: "Download Data",
                    onPress: () => execAsync(downloadDb),
                    icon: "download",
                    disabled: !isPremiumUser
                },
                {
                    label: "Upload Data",
                    onPress: () => execAsync(pickAndUploadDb, true),
                    icon: "upload",
                    disabled: !isPremiumUser
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
                          label: "Copy Database From Assets",
                          onPress: async () => {
                              //await execAsync(insertRelations);
                              await copyDatabaseFromAssets();
                              await Updates.reloadAsync();
                          },
                          icon: "database-refresh"
                      },
                      {
                          label: "Delete All Heroes Relation",
                          onPress: () =>
                              Confirm(
                                  "",
                                  "Are you sure to delete all heroes relations ?",
                                  () =>
                                      execAsync(async () => {
                                          await db.runAsync(
                                              "DELETE FROM relation;"
                                          );
                                          await db.runAsync(
                                              "UPDATE sqlite_sequence SET seq = 1 WHERE NAME = 'relation';"
                                          );
                                      })
                              ),
                          icon: "delete",
                          color: "red"
                      },
                      {
                          label: "Terminal",
                          icon: "terminal",
                          onPress: () => router.push("/sqlite-terminal" as any),
                          iconSrc: "material"
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
                                    style={{
                                        borderColor: colors.border
                                    }}
                                    onPress={
                                        item.disabled
                                            ? ()=>alertPremium(router)
                                            : item.onPress
                                    }
                                >
                                    <Icon
                                        name={
                                            item.disabled ? "lock" : item.icon
                                        }
                                        src={
                                            item?.iconSrc
                                                ? (item?.iconSrc as IconType)
                                                : "materialCom"
                                        }
                                        //color={item.color}
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
