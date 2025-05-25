import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Modal,
    StyleProp,
    ViewStyle,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import {
    db,
    getAllHeroes,
    createHeroRelation,
    deleteHeroRelation,
    getHeroRelations
} from "@/database";
import {
    Container,
    View,
    Text,
    Icon,
    HeroImage,
    TextField,
    Confirm
} from "@/components";

import { HeroRelationsModal, HeroSelectionModal } from "@/components/hero";

import { useGlobal, useTheme } from "@/contexts";
import { increaseHexIntensity } from "@/utils";

// Constants
const RELATION_IMAGE_SIZE = 44;
const RELATION_TYPES = ["Combo", "Weak Vs", "Strong Vs"] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

interface Hero {
    id: number;
    name: string;
    image: string;
    relations?: Record<RelationType, Hero[]>;
}

interface HeroRelation {
    mainHeroId: number;
    targetHeroId: number;
    relationType: RelationType;
}

const HeroCard = React.memo(
    ({ hero, onPress }: { hero: Hero; onPress: () => void }) => (
        <Pressable onPress={onPress}>
            <HeroImage heroId={hero.id} name={hero.name} />
        </Pressable>
    )
);

function Home() {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [relationType, setRelationType] = useState<RelationType>(
        RELATION_TYPES[0]
    );
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
    const [search, setSearch] = useState("");
    const [selectionSearch, setSelectionSearch] = useState("");
    const [showHeroSelections, setShowHeroSelections] = useState(false);

    const { setLoading } = useGlobal();
    const { colors } = useTheme();

    const modalStyle: StyleProp<ViewStyle> = useMemo(
        () => ({
            backgroundColor: increaseHexIntensity(colors.background, 0.2)
        }),
        [colors.background]
    );

    // Fetch heroes once
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                setHeroes(await getAllHeroes());
            } catch (e: any) {
                alert(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [setLoading]);

    const filteredHeroes = useMemo(
        () =>
            heroes.filter(h =>
                h.name.toLowerCase().includes(search.toLowerCase())
            ),
        [heroes, search]
    );

    const handleResetRelations = useCallback(() => {
        setSelectedHero(null);
        setRelationType(RELATION_TYPES[0]);
        setShowHeroSelections(false);
    }, []);

    const refreshRelations = useCallback(async (hero: Hero) => {
        hero.relations = await getHeroRelations(hero);
    }, []);

    const updateHeroesState = useCallback((h1: Hero, h2: Hero) => {
        setHeroes(prev =>
            prev.map(h => (h.id === h1.id ? h1 : h.id === h2.id ? h2 : h))
        );
    }, []);

    const handleAddHeroRelation = useCallback(
        async (target: Hero) => {
            if (!selectedHero) return;
            await createHeroRelation({
                mainHeroId: selectedHero.id,
                targetHeroId: target.id,
                relationType
            });
            await Promise.all([
                refreshRelations(selectedHero),
                refreshRelations(target)
            ]);
            updateHeroesState(selectedHero, target);
        },
        [relationType, refreshRelations, updateHeroesState, selectedHero]
    );

    const handleDeleteHeroRelation = useCallback(
        async (target: Hero) => {
            if (!selectedHero) return;
            await deleteHeroRelation({
                mainHeroId: selectedHero.id,
                targetHeroId: target.id,
                relationType
            });
            await Promise.all([
                refreshRelations(selectedHero),
                refreshRelations(target)
            ]);
            updateHeroesState(selectedHero, target);
        },
        [relationType, refreshRelations, updateHeroesState, selectedHero]
    );

    // Renderers
    const renderHero = useCallback(
        ({ item }: { item: Hero }) => (
            <HeroCard hero={item} onPress={() => setSelectedHero(item)} />
        ),
        []
    );

    const renderSelection = useCallback(
        ({ item }: { item: Hero }) => (
            <Pressable
                onPress={() =>
                    Confirm(
                        "",
                        `Add ${item.name} to ${selectedHero?.name} ( ${relationType}) ?`,
                        async () => {
                            await handleAddHeroRelation(item);
                            setShowHeroSelections(false);
                        }
                    )
                }
                style={{ margin: 8 }}
            >
                <HeroImage heroId={item.id} name={item.name} />
            </Pressable>
        ),
        [handleAddHeroRelation, relationType, selectedHero]
    );

    const keyExtractor = useCallback((item: Hero) => item.id.toString(), []);

    // Selection data
    const availableSelections = useMemo(
        () =>
            heroes
                .filter(h => h.id !== selectedHero?.id)
                .filter(h =>
                    h.name.toLowerCase().includes(selectionSearch.toLowerCase())
                ),
        [heroes, selectedHero, selectionSearch]
    );

    const handleChangeSelectedHero = async (hero: Hero) => {
        setSelectedHero({
            ...hero,
            relations: await getHeroRelations(hero)
        });

        setRelationType(
            relationType === "Combo"
                ? "Combo"
                : relationType === "Weak Vs"
                ? "Strong Vs"
                : "Weak Vs"
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <Container style={{ paddingHorizontal: 0 }}>
                    {selectedHero && (
                        <HeroRelationsModal
                            visible={!!selectedHero}
                            hero={selectedHero}
                            relationType={relationType}
                            onClose={handleResetRelations}
                            onSelectRelationType={setRelationType}
                            onPressAdd={() => setShowHeroSelections(true)}
                            onPressHero={handleChangeSelectedHero}
                            onLongPressHero={handleDeleteHeroRelation}
                        />
                    )}

                    {selectedHero && showHeroSelections && (
                        <HeroSelectionModal
                            visible={!!selectedHero && showHeroSelections}
                            selectedHero={selectedHero}
                            search={selectionSearch}
                            onChangeSearch={setSelectionSearch}
                            onClose={() => {
                                setShowHeroSelections(false);
                                setSelectionSearch("");
                            }}
                            selections={availableSelections}
                            onSelect={async hero => {
                                await handleAddHeroRelation(hero);
                                setShowHeroSelections(false);
                            }}
                            relationType={relationType}
                        />
                    )}

                    {/* Search Bar */}
                    <View className="flex-row items-center px-4 my-4 space-x-2">
                        <TextField
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1"
                            label="Search Hero"
                        />
                        {search && (
                            <Icon
                                name="clear"
                                size="large"
                                onPress={() => setSearch("")}
                            />
                        )}
                    </View>

                    {/* Hero Grid */}
                    <FlashList
                        showsVerticalScrollIndicator={false}
                        data={filteredHeroes}
                        renderItem={renderHero}
                        keyExtractor={keyExtractor}
                        numColumns={5}
                        estimatedItemSize={100}
                        keyboardShouldPersistTaps="handled"
                    />
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
export default Home;
