import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, Image, Pressable, Modal } from "react-native";

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
import { useGlobal, useTheme } from "@/contexts";

import { increaseHexIntensity } from "@/utils";

const RELATION_IMAGE_SIZE = 44;

type HeroType = {
    id: number;
    name: string;
    image: string;
};

const RELATION_TYPES = ["Combo", "Weak Vs", "Strong Vs"];

const Home = () => {
    const [heroes, setHeroes] = useState<HeroType[]>([]);
    const [relationType, setRelationType] = useState<keyof RELATION_TYPES>(
        RELATION_TYPES[0]
    );
    const [selectedHero, setSelectedHero] = useState<HeroType>(null);
    const [search, setSearch] = useState<string>("");

    const { setLoading } = useGlobal();
    const { colors } = useTheme();

    useEffect(() => {
        (async () => {
            setHeroes([]);
            setLoading(true);

            try {
                const res = await getAllHeroes();
                setHeroes(res);
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleResetRelations = () => {
        setSelectedHero(null);
        setRelationType(RELATION_TYPES[0]);
    };

    const memoizedHeroes = useMemo(
        () => (
            <View className="flex-row flex-wrap">
                {heroes.map((hero, index) => (
                    <Pressable
                        className="justify-center items-center"
                        key={index}
                        onPress={() => {
                            setSelectedHero(hero);
                        }}
                    >
                        <HeroImage heroId={hero.id} name={hero.name} />
                    </Pressable>
                ))}
            </View>
        ),
        [heroes]
    );

    const selectedHeroIndex = useMemo(
        () => heroes.findIndex(hero => hero.id === selectedHero?.id),
        [heroes, selectedHero]
    );

    const handleAddHeroRelation = async () => {
        const targetHeroId = Math.floor(Math.random() * (heroes.length + 1));
        const targetHeroIndex = heroes.findIndex(
            hero => hero.id === targetHeroId
        );
        const targetHero = heroes[targetHeroIndex];

        if (selectedHeroIndex === -1 || targetHeroIndex === -1) {
            throw new Error("One or both not found!");
        }

        try {
            await createHeroRelation({
                mainHeroId: selectedHero.id,
                targetHeroId,
                relationType
            });

            // Refresh selected hero's relations and targeted hero's relations
            selectedHero.relations = await getHeroRelations(selectedHero);
            targetHero.relations = await getHeroRelations(targetHero);

            heroes[selectedHeroIndex] = selectedHero;
            heroes[targetHeroIndex] = targetHero;

            setHeroes([...heroes]);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleDeleteHeroRelation = async targetHero => {
        const targetHeroIndex = heroes.findIndex(
            hero => hero.id === targetHero.id
        );

        if (selectedHeroIndex === -1 || targetHeroIndex === -1) {
            throw new Error("One or both not found!");
        }

        try {
            await deleteHeroRelation({
                mainHeroId: selectedHero.id,
                targetHeroId: targetHero.id,
                relationType
            });

            // Refresh selected hero's relations and targeted hero's relations
            selectedHero.relations = await getHeroRelations(selectedHero);
            targetHero.relations = await getHeroRelations(targetHero);

            heroes[selectedHeroIndex] = selectedHero;
            heroes[targetHeroIndex] = targetHero;

            setHeroes([...heroes]);
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <Container
            style={{
                paddingTop: 0,
                paddingHorizontal: 0
            }}
        >
            {selectedHero && (
                <Modal
                    transparent
                    visible={!!selectedHero}
                    onRequestClose={handleResetRelations}
                    animationType="fade"
                >
                    <View
                        style={{
                            backgroundColor: increaseHexIntensity(
                                colors.background,
                                0.2
                            )
                        }}
                        className="h-[90%] rounded-xl border m-4 p-4 space-y-8"
                    >
                        <View className="flex-row justify-start items-center space-x-8 pl-4">
                            <Icon
                                name="arrow-back-ios"
                                onPress={handleResetRelations}
                            />

                            <View className="flex-row justify-center items-center space-x-4">
                                <HeroImage heroId={selectedHero.id} size={64} />

                                <Text variant="header">
                                    {selectedHero.name}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row">
                            {RELATION_TYPES.map(type => (
                                <Pressable
                                    key={type}
                                    style={{
                                        backgroundColor:
                                            type === relationType
                                                ? colors.primary
                                                : undefined,
                                        width: `${
                                            100 / RELATION_TYPES.length
                                        }%`,
                                        borderColor: colors.border
                                    }}
                                    className="border justify-center items-center p-2"
                                    onPress={() => setRelationType(type)}
                                >
                                    <Text variant="body">{type}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <View className="flex-row flex-wrap">
                            <View
                                className="m-[10] rounded-full border-[2px] justify-center items-center"
                                style={{
                                    width: RELATION_IMAGE_SIZE,
                                    height: RELATION_IMAGE_SIZE
                                }}
                            >
                                <Icon
                                    name="add"
                                    size={RELATION_IMAGE_SIZE - 10}
                                    onPress={handleAddHeroRelation}
                                />
                            </View>

                            {selectedHero.relations[relationType].map(hero => (
                                <Pressable
                                    onLongPress={() =>
                                        Confirm(
                                            "", //"Remove Hero",
                                            `Are you sure to remove ${hero.name} ?`,
                                            async () =>
                                                await handleDeleteHeroRelation(
                                                    hero
                                                )
                                        )
                                    }
                                    key={hero.id}
                                >
                                    <HeroImage
                                        heroId={hero.id}
                                        size={RELATION_IMAGE_SIZE}
                                        name={hero.name}
                                        margin={10}
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Modal>
            )}

            {/*<View className="flex-row justify-between space-x-4 px-2">
                <Icon name="search" />
                <TextField value={search} onChangeText={setSearch} />
                <Icon name="clear" />
            </View>*/}

            <ScrollView>{memoizedHeroes}</ScrollView>
        </Container>
    );
};

export default Home;
