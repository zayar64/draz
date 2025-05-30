import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Container, View, Text, Icon, IconButton, Button } from "@/components";
import {
    HeroImage,
    DraftHeroRelationsModal,
    DraftHeroSelectionModal
} from "@/components/hero";
import { useTheme } from "@/contexts";
import { getAllHeroes, getHeroRelations } from "@/database";
import { HeroType, RelationType } from "@/types";

const IMAGE_SIZE = 40;
const BADGE_SIZE = IMAGE_SIZE * 0.4;

type TeamSlotPress = (index: number, hero: HeroType | null) => void;
type TeamSlotLongPress = (index: number, hero: HeroType | null) => void;

type RecBoxProps = {
    title: string;
    data: [string, number][];
    excludedHeroes: HeroType[];
    onSlotPress: (heroId: number, recommendationTitle: string) => void;
};

type TeamProps = {
    title: string;
    team: (HeroType | null)[];
    onSlotPress: TeamSlotPress;
    onSlotLongPress?: TeamSlotLongPress;
};

type BanSectionProps = {
    title: string;
    bannedHeroes: (HeroType | null)[];
    onSlotPress: TeamSlotPress;
    onSlotLongPress: (index: number) => void;
};

const RecBox = ({
    title,
    data,
    onSlotPress,
    excludedHeroes,
    ...props
}: RecBoxProps) => {
    const { colors } = useTheme();

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text>{title}</Text>
            </View>
            <View className="h-14 rounded-lg border flex-row px-2 pt-1">
                <FlashList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={IMAGE_SIZE}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                onSlotPress(Number(item[0]), title)
                            }
                        >
                            <View
                                className="rounded-full border absolute top-1 left-0 z-20 justify-center items-center"
                                style={{
                                    width: BADGE_SIZE,
                                    height: BADGE_SIZE,
                                    backgroundColor: colors.background
                                }}
                            >
                                <Text style={{ fontSize: BADGE_SIZE * 0.6 }}>
                                    {item[1]}
                                </Text>
                            </View>
                            <HeroImage
                                heroId={Number(item[0])}
                                size={IMAGE_SIZE}
                                margin={4}
                                imageStyle={{
                                    opacity: excludedHeroes.some(
                                        h => h.id === Number(item[0])
                                    )
                                        ? 0.3
                                        : 1
                                }}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

const TeamSection = ({
    title,
    team,
    onSlotPress,
    onSlotLongPress,
    ...props
}: TeamProps) => {
    const { colors } = useTheme();
    const color = title.includes("Enemy") ? colors.error : colors.primary;

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10 invisible"
                style={{ backgroundColor: colors.background }}
            >
                <Text style={{ color }}>{title}</Text>
            </View>
            <View
                className="h-14 rounded-lg border flex-row p-2 justify-between"
                style={{ borderColor: color }}
            >
                {team.map((hero, idx) => {
                    const disabled = idx !== 0 && !team[idx - 1];
                    return (
                        <TouchableOpacity
                            key={idx}
                            disabled={disabled}
                            onPress={() => onSlotPress(idx, hero)}
                            onLongPress={() =>
                                team[idx + 1]
                                    ? alert(
                                          "You can only remove the last pick!"
                                      )
                                    : onSlotLongPress?.(idx, hero)
                            }
                            delayLongPress={100}
                            className="rounded-full border-[2px] justify-center items-center"
                            style={{
                                width: IMAGE_SIZE,
                                height: IMAGE_SIZE,
                                borderColor: color,
                                opacity: disabled && !hero ? 0 : 1
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
                    );
                })}
            </View>
        </View>
    );
};

const BanSection = ({
    title,
    bannedHeroes,
    onSlotPress,
    onSlotLongPress,
    ...props
}: BanSectionProps) => {
    const { colors } = useTheme();

    return (
        <View {...props}>
            <View
                className="self-start ml-2 mb-[-4px] px-2 rounded z-10"
                style={{ backgroundColor: colors.background }}
            >
                <Text style={{ color: colors.text }}>{title}</Text>
            </View>
            <View
                className="h-14 rounded-lg border px-2 pt-2"
                style={{ borderColor: colors.text }}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-2">
                        {bannedHeroes.map((hero, idx) => {
                            const disabled =
                                (idx !== 0 && !bannedHeroes[idx - 1]) ||
                                !!bannedHeroes[idx + 1];
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    disabled={disabled}
                                    onPress={() =>
                                        !bannedHeroes[idx] &&
                                        onSlotPress(idx, hero)
                                    }
                                    onLongPress={() => onSlotLongPress(idx)}
                                    className="rounded-full border-[2px] justify-center items-center"
                                    style={{
                                        width: IMAGE_SIZE,
                                        height: IMAGE_SIZE,
                                        display:
                                            disabled && !hero ? "none" : "flex",
                                        borderColor: colors.text
                                    }}
                                    delayLongPress={100}
                                >
                                    {hero ? (
                                        <HeroImage
                                            heroId={hero.id}
                                            size={IMAGE_SIZE}
                                        />
                                    ) : (
                                        <Icon
                                            name={disabled ? "lock" : "add"}
                                            size={IMAGE_SIZE * 0.8}
                                            color={colors.text}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
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
    const [recommendations, setRecommendations] = useState<
        Record<string, Record<string, number>>
    >({
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
    const [selectedHero, setSelectedHero] = useState<HeroType | null>(null);
    const [relationType, setRelationType] = useState<RelationType>("Combo");

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

    const applyRelations = useCallback(
        async (
            team: (HeroType | null)[],
            hero: HeroType,
            increment: number
        ) => {
            const isBlue = team === blueTeam;
            const isRed = team === redTeam;

            try {
                const relations = await getHeroRelations(hero);
                const next = { ...recommendations };

                if (isBlue) {
                    Object.assign(
                        next["Recommended Combo Picks"],
                        updateMap(
                            relations.Combo,
                            next["Recommended Combo Picks"],
                            increment
                        )
                    );
                    Object.assign(
                        next["Recommended To Ban"],
                        updateMap(
                            relations["Weak Vs"],
                            next["Recommended To Ban"],
                            increment
                        )
                    );
                }

                if (isRed) {
                    Object.assign(
                        next["Not Recommended Picks"],
                        updateMap(
                            relations["Strong Vs"],
                            next["Not Recommended Picks"],
                            increment
                        )
                    );
                    Object.assign(
                        next["Recommended Counter Picks"],
                        updateMap(
                            relations["Weak Vs"],
                            next["Recommended Counter Picks"],
                            increment
                        )
                    );
                }

                setRecommendations(next);
            } catch (e: any) {
                alert(e.message);
            }
        },
        [recommendations, blueTeam, redTeam]
    );

    const handleHeroToggle = async (
        team: (HeroType | null)[],
        setter: React.Dispatch<React.SetStateAction<(HeroType | null)[]>>,
        idx: number,
        hero: HeroType | null
    ) => {
        if (hero) {
            setSelectedHero({
                ...hero,
                relations: await getHeroRelations(hero)
            });
        } else {
            setShowHeroSelections(true);
            setOnSelect(() => async (selected: HeroType) => {
                setter(prev => {
                    const next = [...prev];
                    next[idx] = selected;
                    return next;
                });
                setShowHeroSelections(false);
                setSelectionSearch("");
                if (team === blueTeam || team === redTeam) {
                    await applyRelations(team, selected, 1);
                }
            });
        }
    };

    const handleRecommendationSlotPress = async (
        heroId: number,
        recommendationTitle: string
    ) => {
        const hero = heroes.find(h => h.id === Number(heroId));
        if (!hero) {
            return;
        }
        const relations = await getHeroRelations(hero);

        const pickedHeroIds = [
            ...blueTeam.filter(h => h).map(h => h?.id),
            ...redTeam.filter(h => h).map(h => h?.id)
        ];

        relations.Combo = relations.Combo.filter(h =>
            pickedHeroIds.includes(h.id)
        );
        relations["Weak Vs"] = relations["Weak Vs"].filter(h =>
            pickedHeroIds.includes(h.id)
        );
        relations["Strong Vs"] = relations["Strong Vs"].filter(h =>
            pickedHeroIds.includes(h.id)
        );

        setSelectedHero({
            ...hero,
            relations
        });
        if (
            ["Recommended Counter Picks", "Recommended To Ban"].includes(
                recommendationTitle
            )
        ) {
            setRelationType("Strong Vs");
        } else if (recommendationTitle === "Not Recommended Picks") {
            setRelationType("Weak Vs");
        }
    };

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

    return (
        <Container className="space-y-4">
            {/*<View className="flex-row justify-between space-x-4">
                <IconButton
                    name="refresh"
                    onPress={handleResetDraft}
                    variant="contained"
                />
                <IconButton name="settings" variant="contained" />
            </View>*/}

            <Button title="Reset Draft" onPress={handleResetDraft} />

            <TeamSection
                title="Your Picks"
                team={blueTeam}
                onSlotPress={(idx, hero) =>
                    handleHeroToggle(blueTeam, setBlueTeam, idx, hero)
                }
                onSlotLongPress={async (idx, hero) => {
                    setBlueTeam(prev => {
                        const next = [...prev];
                        next[idx] = null;
                        return next;
                    });
                    await applyRelations(blueTeam, hero!, -1);
                }}
            />

            <View>
                <Text className="text-center text-4xl font-bold italic mt-4">
                    VS
                </Text>
            </View>

            <TeamSection
                title="Enemy Picks"
                team={redTeam}
                onSlotPress={(idx, hero) =>
                    handleHeroToggle(redTeam, setRedTeam, idx, hero)
                }
                onSlotLongPress={async (idx, hero) => {
                    setRedTeam(prev => {
                        const next = [...prev];
                        next[idx] = null;
                        return next;
                    });
                    await applyRelations(redTeam, hero!, -1);
                }}
            />

            <BanSection
                title="Banned Heroes"
                bannedHeroes={bannedHeroes}
                onSlotPress={(idx, hero) => {
                    setShowHeroSelections(true);
                    setOnSelect(() => async (selected: HeroType) => {
                        setBannedHeroes(prev => {
                            const next = [...prev];
                            next[idx] = selected;
                            return next;
                        });
                        setShowHeroSelections(false);
                        setSelectionSearch("");
                    });
                }}
                onSlotLongPress={idx => {
                    setBannedHeroes(prev => {
                        const next = [...prev];
                        next[idx] = null;
                        return next;
                    });
                }}
            />

            {Object.entries(recommendations).map(([title, entries]) => (
                <RecBox
                    key={title}
                    title={title}
                    data={Object.entries(entries)
                        .filter(([, count]) => count)
                        .sort((a, b) => b[1] - a[1])}
                    excludedHeroes={excludedHeroes}
                    onSlotPress={(heroId, recommendationTitle) =>
                        handleRecommendationSlotPress(
                            heroId,
                            recommendationTitle
                        )
                    }
                />
            ))}

            {selectedHero && (
                <DraftHeroRelationsModal
                    visible
                    hero={selectedHero}
                    relationType={relationType}
                    onClose={() => {
                        setSelectedHero(null);
                        setRelationType("Combo");
                    }}
                    onSelectRelationType={setRelationType}
                />
            )}

            {showHeroSelections && (
                <DraftHeroSelectionModal
                    visible
                    search={selectionSearch}
                    onChangeSearch={setSelectionSearch}
                    onClose={() => {
                        setShowHeroSelections(false);
                        setSelectionSearch("");
                    }}
                    availableHeroes={heroes.filter(
                        h =>
                            !excludedHeroes.some(e => e.id === h.id) &&
                            h.name
                                .toLowerCase()
                                .includes(selectionSearch.toLowerCase())
                    )}
                    onSelect={hero => onSelect && onSelect(hero)}
                />
            )}
        </Container>
    );
};

export default Draft;
