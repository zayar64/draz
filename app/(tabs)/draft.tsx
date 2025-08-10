import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Container, View, Text, Icon, IconButton, Button } from "@/components";
import { TeamSection, BanSection, RecommendationBox } from "@/components/draft";

import {
    HeroImage,
    DraftHeroRelationsModal,
    DraftHeroSelectionModal
} from "@/components/hero";
import { useTheme, useUser } from "@/contexts";
import { getAllHeroes, getHeroRelations } from "@/database";
import { HeroType, RelationType } from "@/types";
import { alertPremium } from "@/utils";

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

    const [counterPicks, setCounterPicks] = useState<Record<string, number>>(
        {}
    );
    const [comboPicks, setComboPicks] = useState<Record<string, number>>({});
    const [counteredPicks, setCounteredPicks] = useState<
        Record<string, number>
    >({});
    const [enemyCounterPicks, setEnemyCounterPicks] = useState<
        Record<string, number>
    >({});

    const [showHeroSelections, setShowHeroSelections] = useState(false);
    const [onSelect, setOnSelect] = useState<null | ((hero: HeroType) => void)>(
        null
    );
    const [selectedHero, setSelectedHero] = useState<HeroType | null>(null);
    const [relationType, setRelationType] = useState<RelationType>("Combo");

    const { colors } = useTheme();
    const { isPremiumUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        getAllHeroes().then(setHeroes);
    }, []);

    const excludedHeroes = useMemo(() => {
        const exc: Record<string, true> = {};
        const selectedHeroes = [
            ...blueTeam,
            ...redTeam,
            ...bannedHeroes
        ].filter(h => h);

        selectedHeroes.map(hero => {
            if (hero) {
                exc[hero.id] = true;
            }
        });

        return exc;
    }, [blueTeam, redTeam, bannedHeroes]);

    const updateRecommendation = useCallback(
        async (
            team: (HeroType | null)[],
            typeToSet: RelationType,
            setter: (recom: Record<string, number>) => void
        ) => {
            const heroes = team.filter((h): h is HeroType => h !== null);

            const allRelations = await Promise.all(
                heroes.map(hero => getHeroRelations(hero))
            );

            // Count recommendations
            const recom: Record<string, number> = {};
            allRelations.forEach(relations => {
                relations[typeToSet].forEach(({ id }) => {
                    recom[id] = (recom[id] || 0) + 1;
                });
            });

            setter(recom);
        },
        []
    );

    useEffect(() => {
        (async () => {
            await Promise.all([
                updateRecommendation(blueTeam, "Combo", setComboPicks),
                updateRecommendation(blueTeam, "Weak Vs", setEnemyCounterPicks)
            ]);
        })();
    }, [blueTeam]);

    useEffect(() => {
        (async () => {
            await Promise.all([
                updateRecommendation(redTeam, "Weak Vs", setCounterPicks),
                updateRecommendation(redTeam, "Strong Vs", setCounteredPicks)
            ]);
        })();
    }, [redTeam]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                await Promise.all([
                    updateRecommendation(blueTeam, "Combo", setComboPicks),
                    updateRecommendation(
                        blueTeam,
                        "Weak Vs",
                        setEnemyCounterPicks
                    ),
                    updateRecommendation(redTeam, "Weak Vs", setCounterPicks),
                    updateRecommendation(
                        redTeam,
                        "Strong Vs",
                        setCounteredPicks
                    )
                ]);
            })();

            return () => {
                //setComboPicks({});
                //setCounterPicks({});
                //setCounteredPicks({});
                //setEnemyCounterPicks({});
            };
        }, [blueTeam, redTeam, updateRecommendation])
    );

    const availableHeroes = useMemo(
        () => heroes.filter(h => !excludedHeroes[h.id]),
        [heroes, excludedHeroes]
    );

    useEffect(() => {
        setSelectedHero(null);
    }, [excludedHeroes]);

    const [selectionTitle, setSelectionTitle] = useState<string>("");
    const handleHeroToggle = async (
        team: (HeroType | null)[],
        setter: React.Dispatch<React.SetStateAction<(HeroType | null)[]>>,
        idx: number,
        hero: HeroType | null
    ) => {
        if (hero) {
            const relations = await getHeroRelations(hero);
            setSelectedHero({
                ...hero,
                relations
            });
        } else {
            setSelectionTitle(
                team === blueTeam
                    ? "pick for your team"
                    : team === redTeam
                    ? "pick for enemy team"
                    : "ban a hero"
            );

            setShowHeroSelections(true);
            setOnSelect(() => async (selected: HeroType) => {
                setter(prev => {
                    const next = [...prev];
                    next[idx] = selected;
                    return next;
                });
                setShowHeroSelections(false);
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

        if (
            ["Recommended Counter Picks", "Recommended To Ban"].includes(
                recommendationTitle
            )
        ) {
            setRelationType("Strong Vs");
        } else if (recommendationTitle === "Not Recommended Picks") {
            setRelationType("Weak Vs");
        }

        setSelectedHero({
            ...hero,
            relations
        });
    };

    const handleResetDraft = () => {
        setBlueTeam(Array(5).fill(null));
        setRedTeam(Array(5).fill(null));
        setBannedHeroes(Array(10).fill(null));
    };

    const handleRemoveHero = useCallback((heroId: number) => {
        setBlueTeam(prev => prev.map(h => (h?.id === heroId ? null : h)));
        setRedTeam(prev => prev.map(h => (h?.id === heroId ? null : h)));
        setBannedHeroes(prev => prev.map(h => (h?.id === heroId ? null : h)));
    }, []);

    const memoizedHeroRelations = useMemo(
        () =>
            selectedHero ? (
                <DraftHeroRelationsModal
                    visible
                    hero={selectedHero}
                    relationType={relationType}
                    setRelationType={setRelationType}
                    onClose={() => {
                        setSelectedHero(null);
                        setRelationType("Combo");
                    }}
                    excludedHeroes={excludedHeroes}
                    headerRight={
                        excludedHeroes[selectedHero.id] && (
                            <Icon
                                name="delete"
                                color="error"
                                onPress={() => {
                                    handleRemoveHero(selectedHero.id);
                                    setSelectedHero(null);
                                }}
                            />
                        )
                    }
                />
            ) : null,
        [selectedHero, relationType]
    );

    const memoizedHeroSelection = useMemo(
        () => (
            <DraftHeroSelectionModal
                visible={showHeroSelections}
                onClose={() => {
                    setShowHeroSelections(false);
                    setSelectionTitle("");
                }}
                heroes={availableHeroes}
                onSelect={hero => onSelect && onSelect(hero)}
                selectionTitle={selectionTitle}
            />
        ),
        [showHeroSelections, availableHeroes]
    );

    return (
        <Container className="space-y-4">
            <View className="flex-row space-x-4 justify-between">
                <Icon name="refresh" onPress={handleResetDraft} size="large" />

                {/*<Icon
                    name="save"
                    onPress={
                        isPremiumUser
                            ? () => alert("Function is not yet implemented :3")
                            : () => alertPremium(router)
                    }
                    size="large"
                    disabled={
                        !blueTeam.every(item => item) ||
                        !redTeam.every(item => item)
                    }
                />*/}
            </View>

            <TeamSection
                title="Your Picks"
                team={blueTeam}
                onSlotPress={(idx, hero) => {
                    handleHeroToggle(blueTeam, setBlueTeam, idx, hero);
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
                }}
            />

            <BanSection
                title="Banned Heroes"
                bannedHeroes={bannedHeroes}
                onSlotPress={(idx, hero) => {
                    handleHeroToggle(bannedHeroes, setBannedHeroes, idx, hero);
                }}
            />

            <RecommendationBox
                title="Recommended Counter Picks"
                data={counterPicks}
                excludedHeroes={excludedHeroes}
                onSlotPress={(heroId, recommendationTitle) =>
                    handleRecommendationSlotPress(heroId, recommendationTitle)
                }
            />

            <RecommendationBox
                title="Recommended Combo Picks"
                data={comboPicks}
                excludedHeroes={excludedHeroes}
                onSlotPress={(heroId, recommendationTitle) =>
                    handleRecommendationSlotPress(heroId, recommendationTitle)
                }
            />

            <RecommendationBox
                title="Not Recommended Picks"
                data={counteredPicks}
                excludedHeroes={excludedHeroes}
                onSlotPress={(heroId, recommendationTitle) =>
                    handleRecommendationSlotPress(heroId, recommendationTitle)
                }
            />

            <RecommendationBox
                title="Recommended To Ban"
                data={enemyCounterPicks}
                excludedHeroes={excludedHeroes}
                onSlotPress={(heroId, recommendationTitle) =>
                    handleRecommendationSlotPress(heroId, recommendationTitle)
                }
            />

            {memoizedHeroRelations}

            {memoizedHeroSelection}
        </Container>
    );
};

export default Draft;
