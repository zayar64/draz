import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, TouchableOpacity, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Container, View, Text, Icon, IconButton, Button } from "@/components";
import { TeamSection, BanSection, RecommendationBox } from "@/components/draft";

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
    const [heroToRemoveFrom, setHeroToRemoveFrom] = useState<
        (HeroType | null)[]
    >(Array(5).fill(null));

    const { colors } = useTheme();

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

    const availableHeroes = useMemo(
        () =>
            heroes.filter(
                h =>
                    !excludedHeroes.some(e => e.id === h.id) &&
                    h.name.toLowerCase().includes(selectionSearch.toLowerCase())
            ),
        [heroes, blueTeam, redTeam, bannedHeroes, selectionSearch]
    );

    useEffect(() => {
        setSelectedHero(null);
    }, [excludedHeroes]);

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

        let heroesToDisplayIds = blueTeam.filter(h => h).map(h => h?.id);

        if (
            ["Recommended Counter Picks", "Recommended To Ban"].includes(
                recommendationTitle
            )
        ) {
            setRelationType("Strong Vs");
            if (recommendationTitle === "Recommended Counter Picks") {
                heroesToDisplayIds = redTeam.filter(h => h).map(h => h?.id);
            }
        } else if (recommendationTitle === "Not Recommended Picks") {
            setRelationType("Weak Vs");
            heroesToDisplayIds = redTeam.filter(h => h).map(h => h?.id);
        }

        relations.Combo = relations.Combo.filter(h =>
            heroesToDisplayIds.includes(h.id)
        );
        relations["Weak Vs"] = relations["Weak Vs"].filter(h =>
            heroesToDisplayIds.includes(h.id)
        );
        relations["Strong Vs"] = relations["Strong Vs"].filter(h =>
            heroesToDisplayIds.includes(h.id)
        );

        setSelectedHero({
            ...hero,
            relations
        });
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
            <View className="flex-row space-x-4 justify-between">
                <Icon name="refresh" onPress={handleResetDraft} size="large" />

                <Icon
                    name="save"
                    onPress={() =>
                        Alert.alert(
                            "Notice",
                            "Only premium users can access this feature"
                        )
                    }
                    size="large"
                    /*disabled={
                        !blueTeam.every(item => item) ||
                        !redTeam.every(item => item)
                    }*/
                />
            </View>

            {/*<View className="border-b" />*/}

            <TeamSection
                title="Your Picks"
                team={blueTeam}
                onSlotPress={(idx, hero) => {
                    handleHeroToggle(blueTeam, setBlueTeam, idx, hero);
                    setHeroToRemoveFrom(blueTeam);
                }}
            />

            <View />

            <View className="flex-row justify-center items-center">
                <Text
                    className="text-3xl font-bold pb-1"
                    style={{
                        color: colors.primary
                    }}
                >
                    V
                </Text>
                <Text
                    className="text-3xl font-bold pt-1"
                    style={{
                        color: colors.error
                    }}
                >
                    S
                </Text>
            </View>

            <TeamSection
                title="Enemy Picks"
                team={redTeam}
                onSlotPress={(idx, hero) => {
                    handleHeroToggle(redTeam, setRedTeam, idx, hero);
                    setHeroToRemoveFrom(redTeam);
                }}
            />

            <BanSection
                title="Banned Heroes"
                bannedHeroes={bannedHeroes}
                onSlotPress={(idx, hero) => {
                    handleHeroToggle(bannedHeroes, setBannedHeroes, idx, hero);
                    setHeroToRemoveFrom(bannedHeroes);
                }}
            />

            {Object.entries(recommendations).map(([title, entries]) => (
                <RecommendationBox
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
                    setRelationType={setRelationType}
                    headerRight={
                        excludedHeroes.find(
                            item => item.id === selectedHero.id
                        ) && (
                            <Icon
                                name="delete"
                                color="error"
                                onPress={async () => {
                                    const tmp =
                                        heroToRemoveFrom === blueTeam
                                            ? setBlueTeam
                                            : heroToRemoveFrom === redTeam
                                            ? setRedTeam
                                            : heroToRemoveFrom === bannedHeroes
                                            ? setBannedHeroes
                                            : null;
                                    tmp?.(prev =>
                                        prev.map(hero =>
                                            hero?.id === selectedHero?.id
                                                ? null
                                                : hero
                                        )
                                    );
                                    await applyRelations(
                                        heroToRemoveFrom,
                                        selectedHero!,
                                        -1
                                    );
                                }}
                            />
                        )
                    }
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
                    availableHeroes={availableHeroes}
                    onSelect={hero => onSelect && onSelect(hero)}
                />
            )}
        </Container>
    );
};

export default Draft;
