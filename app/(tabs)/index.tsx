import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef
} from "react";
import {
    Alert,
    Modal,
    StyleProp,
    ViewStyle,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import kvstore from "expo-sqlite/kv-store";

import { FlashList, FlashList as FlashListRef } from "@shopify/flash-list";
import {
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

import { paginateList } from "@/components/hero/HeroRelationsModal";

import { useGlobal, useTheme, useUser } from "@/contexts";
import { increaseHexIntensity } from "@/utils";
import { RELATION_TYPES } from "@/constants";
import { HeroType } from "@/types";

// Constants
const RELATION_IMAGE_SIZE = 44;

export type RelationType = (typeof RELATION_TYPES)[number];

function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (remainingHours > 0)
        parts.push(`${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`);
    if (remainingMinutes > 0)
        parts.push(
            `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
        );
    if (remainingSeconds > 0 || parts.length === 0)
        parts.push(
            `${seconds > 60 ? "and " : ""}${remainingSeconds} second${
                remainingSeconds !== 1 ? "s" : ""
            }`
        );

    return parts.join(" ");
}

const HeroCard = React.memo(
    ({ hero, onPress }: { hero: HeroType; onPress: () => void }) => (
        <TouchableOpacity onPress={onPress}>
            <HeroImage heroId={hero.id} name={hero.name} />
        </TouchableOpacity>
    )
);

function Home() {
    const [heroes, setHeroes] = useState<HeroType[]>([]);
    const [relationType, setRelationType] = useState<RelationType>(
        RELATION_TYPES[0]
    );
    const [selectedHero, setSelectedHero] = useState<HeroType | null>(null);
    const [search, setSearch] = useState("");
    const [showHeroSelections, setShowHeroSelections] = useState(false);

    const { setLoading } = useGlobal();
    const { colors } = useTheme();
    const { setIsPremiumUser } = useUser();
    const router = useRouter();
    const allHeroListRef = useRef<FlashListRef<HeroType>>(null);

    const modalStyle: StyleProp<ViewStyle> = useMemo(
        () => ({
            backgroundColor: increaseHexIntensity(colors.background, 0.2)
        }),
        [colors.background]
    );

    // Fetch heroes once
    useEffect(() => {
        (async () => {
            try {
                setHeroes(await getAllHeroes());
            } catch (e: any) {
                alert(e.message);
            }
        })();
    }, [setLoading]);

    const filteredHeroes = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        if (search) {
            setTimeout(() => {
                allHeroListRef.current?.scrollToIndex({
                    index: 0
                    //animated: true
                });
            }, 100);
            return heroes.filter(h =>
                h.name.toLowerCase().startsWith(lowerCaseSearch)
            );
        }
        return [];
    }, [heroes, search]);

    const handleResetRelations = useCallback(() => {
        setSelectedHero(null);
        setRelationType(RELATION_TYPES[0]);
        setShowHeroSelections(false);
    }, []);

    const refreshRelations = useCallback(async (hero: HeroType) => {
        hero.relations = await getHeroRelations(hero);
    }, []);

    const updateHeroesState = useCallback((h1: HeroType, h2: HeroType) => {
        setHeroes(prev =>
            prev.map(h => (h.id === h1.id ? h1 : h.id === h2.id ? h2 : h))
        );
    }, []);

    const handleAddHeroRelation = useCallback(
        async (target: HeroType) => {
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
        async (target: HeroType) => {
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

    const handleChangeSelectedHero = async (hero: HeroType) => {
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

    // Renderers
    const renderHero = useCallback(
        ({ item }: { item: HeroType }) => (
            <HeroCard
                hero={item}
                onPress={() => handleChangeSelectedHero(item)}
            />
        ),
        []
    );

    const renderSelection = useCallback(
        ({ item }: { item: HeroType }) => (
            <TouchableOpacity
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
            </TouchableOpacity>
        ),
        [handleAddHeroRelation, relationType, selectedHero]
    );

    const keyExtractor = useCallback(
        (item: HeroType) => item.id.toString(),
        []
    );

    const specialSearcheFunctions: Record<string, () => void> = useMemo(
        () => ({
            "i am developer": async () => kvstore.setItem("iAmDeveloper", "1"),
            "i am not developer": async () =>
                kvstore.setItem("iAmDeveloper", "0")
        }),
        [router]
    );

    // Precompute heroes for selection
    const selectableHeroes = useMemo(() => {
        if (!selectedHero) return [];
        return heroes.filter(hero => hero.id !== selectedHero.id);
    }, [heroes, selectedHero]);

    // Memoize modal once per hero selection
    const memoizedHeroSelection = useMemo(() => {
        if (!selectedHero) return null;
        return (
            <HeroSelectionModal
                visible={showHeroSelections} // Only visibility changes now
                selectedHero={selectedHero}
                onClose={() => setShowHeroSelections(false)}
                heroes={selectableHeroes}
                onSelect={async hero => {
                    await handleAddHeroRelation(hero);
                    setShowHeroSelections(false);
                }}
                relationType={relationType}
            />
        );
    }, [
        selectedHero,
        showHeroSelections,
        selectableHeroes,
        handleAddHeroRelation,
        relationType
    ]);

    const memoizedAllHeroes = useMemo(
        () => (
            <FlashList
                showsVerticalScrollIndicator={false}
                data={heroes}
                ref={allHeroListRef}
                renderItem={renderHero}
                keyExtractor={keyExtractor}
                numColumns={5}
                keyboardShouldPersistTaps="handled"
            />
        ),
        [heroes, renderHero, keyExtractor, colors, allHeroListRef]
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View
                    style={{
                        backgroundColor: colors.background,
                        flex: 1
                    }}
                >
                    {selectedHero && (
                        <HeroRelationsModal
                            visible={true}
                            hero={selectedHero}
                            relationType={relationType}
                            onClose={handleResetRelations}
                            setRelationType={setRelationType}
                            onPressAdd={() => setShowHeroSelections(true)}
                            onPressHero={handleDeleteHeroRelation}
                        />
                    )}

                    {memoizedHeroSelection}

                    {/* Search Bar */}
                    <View className="flex-row items-center p-4 space-x-2 border-b">
                        <TextField
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1"
                            //label="Search Hero"
                            onEndEditing={() => {
                                const specialFunc =
                                    specialSearcheFunctions[search];
                                if (specialFunc) {
                                    setSearch("");
                                    specialFunc();
                                }
                            }}
                        />

                        {search ? (
                            <Icon
                                name="clear"
                                size="large"
                                onPress={() => setSearch("")}
                            />
                        ) : (
                            <Icon name="search" size="large" />
                        )}
                    </View>

                    {/* HeroType Grid */}
                    {memoizedAllHeroes}

                    <View
                        className="h-full"
                        style={{
                            display: search ? "flex" : "none"
                        }}
                    >
                        <FlashList
                            showsVerticalScrollIndicator={false}
                            data={paginateList(filteredHeroes, 5 * 6)}
                            renderItem={renderHero}
                            keyExtractor={keyExtractor}
                            numColumns={5}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Home;
