import React, { useState, useEffect, useMemo } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import * as Updates from "expo-updates";

import { Container, View, Text, Icon, Button } from "@/components";
import { HeroImage, DraftHeroSelectionModal } from "@/components/hero";
import { useTheme } from "@/contexts";
import { getAllHeroes, getHeroRelations } from "@/database";
import { HeroType } from "@/types";

const IMAGE_SIZE = 40;

type TeamProps = {
    title: string;
    team: (HeroType | null)[];
    onSlotPress: (index: number, hero: HeroType | null) => void;
};

type RecBoxProps = {
    title: string;
    heroes: HeroType[];
    excludedHeroes: HeroType[];
};

const RecBox = ({ title, heroIds, excludedHeroes, ...props }: RecBoxProps) => {
    const { colors } = useTheme();

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text>{title}</Text>
            </View>
            <View className="h-12 rounded-lg border flex-row px-2">
                <FlashList
                    data={heroIds}
                    renderItem={({ item }) => (
                        <HeroImage
                            heroId={item}
                            size={IMAGE_SIZE}
                            margin={4}
                            imageStyle={{
                                opacity: excludedHeroes.some(
                                    h => h.id === Number(item)
                                )
                                    ? 0.3
                                    : 1
                            }}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={20}
                />
            </View>
        </View>
    );
};

const TeamSection = ({ title, team, onSlotPress, ...props }: TeamProps) => {
    const { colors } = useTheme();
    const color = title.includes("Enemy") ? "#e84444" : "#336ee0";

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text style={{ color }}>{title}</Text>
            </View>
            <View
                className="h-14 rounded-lg border flex-row p-2 justify-between"
                style={{ borderColor: color }}
            >
                {team.map((hero, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => onSlotPress(idx, hero)}
                        className="rounded-full border-[2px] justify-center items-center"
                        style={{
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            borderColor: color
                        }}
                    >
                        {hero ? (
                            <HeroImage
                                heroId={hero.id}
                                size={IMAGE_SIZE}
                                imageStyle={{ borderColor: color }}
                            />
                        ) : (
                            <Icon
                                name="add"
                                size={IMAGE_SIZE * 0.8}
                                color={color}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const BanSection = ({
    title,
    bannedHeroes,
    onSlotPress,
    ...props
}: TeamProps) => {
    const { colors } = useTheme();
    const color = colors.text;

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text style={{ color }}>{title}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                    className="h-14 rounded-lg border flex-row p-2 space-x-2"
                    style={{ borderColor: color }}
                >
                    {bannedHeroes.map((hero, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => onSlotPress(idx, hero)}
                            className="rounded-full border-[2px] justify-center items-center"
                            style={{
                                width: IMAGE_SIZE,
                                height: IMAGE_SIZE,
                                borderColor: color,
                                opacity: hero ? 0.3 : 1
                            }}
                        >
                            {hero ? (
                                <HeroImage
                                    heroId={hero.id}
                                    size={IMAGE_SIZE}
                                    imageStyle={{ borderColor: color }}
                                />
                            ) : (
                                <Icon
                                    name="add"
                                    size={IMAGE_SIZE * 0.8}
                                    color={color}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const Draft = () => {
    const [heroes, setHeroes] = useState<HeroType[]>([]);
    const [blueTeam, setBlueTeam] = useState<(HeroType | null)[]>(
        Array(5).fill(null)
    );
    const [redTeam, setRedTeam] = useState<(HeroType | null)[]>(
        Array(5).fill(null)
    );
    const [bannedHeroes, setBannedHeroes] = useState<(HeroType | null)[]>(
        Array(10).fill(null)
    );

    const [recommendations, setRecommendations] = useState({
        "Recommended Counter Picks": {},
        "Recommended Combo Picks": {},
        "Not Recommended Picks": {},
        "Recommended To Ban": {}
    });

    const [showHeroSelections, setShowHeroSelections] = useState(false);
    const [selectionSearch, setSelectionSearch] = useState("");
    const [onSelect, setOnSelect] = useState<null | ((hero: HeroType) => void)>(
        null
    );

    const handleResetDraft = () => {
        setBlueTeam(Array(5).fill(null));
        setRedTeam(Array(5).fill(null));
        setBannedHeroes(Array(10).fill(null));
        setRecommendations({
            "Recommended Counter Picks": {},
            "Recommended Combo Picks": {},
            "Not Recommended Picks": {},
            "Recommended To Ban": {}
        });
    };

    useEffect(() => {
        getAllHeroes().then(setHeroes);
    }, []);

    const excludedHeroes = useMemo(() => {
        return heroes.filter(hero =>
            [...blueTeam, ...redTeam, ...bannedHeroes].some(
                h => h?.id === hero.id
            )
        );
    }, [heroes, blueTeam, redTeam, bannedHeroes]);

    const handleHeroToggle = async (
        team: (HeroType | null)[],
        setter: React.Dispatch<React.SetStateAction<(HeroType | null)[]>>,
        idx: number,
        hero: HeroType | null
    ) => {
        const isBlue = team === blueTeam;
        const isRed = team === redTeam;

        const updateMap = (
            target: HeroType[],
            source: Record<string, number>,
            increment: number
        ) =>
            target.reduce(
                (acc, hero) => {
                    acc[hero.id] = (source[hero.id] || 0) + increment;
                    return acc;
                },
                {} as Record<string, number>
            );

        const applyRelations = async (hero: HeroType, increment: number) => {
            try {
                const relations = await getHeroRelations(hero);

                if (isBlue) {
                    const combo = updateMap(
                        relations.Combo,
                        recommendations["Recommended Combo Picks"],
                        increment
                    );
                    const toBan = updateMap(
                        relations["Weak Vs"],
                        recommendations["Recommended To Ban"],
                        increment
                    );

                    setRecommendations(prev => ({
                        ...prev,
                        "Recommended Combo Picks": {
                            ...prev["Recommended Combo Picks"],
                            ...combo
                        },
                        "Recommended To Ban": {
                            ...prev["Recommended To Ban"],
                            ...toBan
                        }
                    }));
                }

                if (isRed) {
                    const notRecommended = updateMap(
                        relations["Strong Vs"],
                        recommendations["Not Recommended Picks"],
                        increment
                    );
                    const toBan = updateMap(
                        relations.Combo,
                        recommendations["Recommended To Ban"],
                        increment
                    );
                    const counter = updateMap(
                        relations["Weak Vs"],
                        recommendations["Recommended Counter Picks"],
                        increment
                    );

                    setRecommendations(prev => ({
                        ...prev,
                        "Not Recommended Picks": {
                            ...prev["Not Recommended Picks"],
                            ...notRecommended
                        },
                        "Recommended To Ban": {
                            ...prev["Recommended To Ban"],
                            ...toBan
                        },
                        "Recommended Counter Picks": {
                            ...prev["Recommended Counter Picks"],
                            ...counter
                        }
                    }));
                }
            } catch (e: any) {
                alert(e.message);
            }
        };

        if (hero) {
            setter(prev => {
                const next = [...prev];
                next[idx] = null;
                return next;
            });

            if (isBlue || isRed) {
                await applyRelations(hero, -1);
            }
        } else {
            setShowHeroSelections(true);
            setOnSelect(() => async (selectedHero: HeroType) => {
                setter(prev => {
                    const next = [...prev];
                    next[idx] = selectedHero;
                    return next;
                });
                setShowHeroSelections(false);
                setSelectionSearch("");

                if (isBlue || isRed) {
                    await applyRelations(selectedHero, 1);
                }
            });
        }
    };

    return (
        <Container className="space-y-6">
            <Button title="Reset Draft" onPress={handleResetDraft} />

            <View>
                <TeamSection
                    title="Your Picks"
                    team={blueTeam}
                    onSlotPress={(idx, hero) =>
                        handleHeroToggle(blueTeam, setBlueTeam, idx, hero)
                    }
                />

                <Text className="text-center text-4xl font-bold italic mt-4">
                    VS
                </Text>

                <TeamSection
                    title="Enemy Picks"
                    team={redTeam}
                    onSlotPress={(idx, hero) =>
                        handleHeroToggle(redTeam, setRedTeam, idx, hero)
                    }
                />
            </View>

            <BanSection
                title="Banned Heroes"
                bannedHeroes={bannedHeroes}
                onSlotPress={(idx, hero) =>
                    handleHeroToggle(bannedHeroes, setBannedHeroes, idx, hero)
                }
            />

            {Object.entries(recommendations).map(([title, _]) => (
                <RecBox
                    key={title}
                    title={title}
                    heroIds={Object.entries(recommendations[title])
                        .filter(([id, count]) => count)
                        .map(i => i[0])}
                    excludedHeroes={excludedHeroes}
                />
            ))}

            {showHeroSelections && (
                <DraftHeroSelectionModal
                    visible={showHeroSelections}
                    search={selectionSearch}
                    onChangeSearch={setSelectionSearch}
                    onClose={() => {
                        setShowHeroSelections(false);
                        setSelectionSearch("");
                    }}
                    availableHeroes={heroes.filter(
                        hero =>
                            !excludedHeroes.some(
                                excHero => excHero.id === hero.id
                            ) &&
                            hero.name
                                .toLowerCase()
                                .includes(selectionSearch.toLowerCase())
                    )}
                    onSelect={onSelect}
                />
            )}
        </Container>
    );
};

export default Draft;
