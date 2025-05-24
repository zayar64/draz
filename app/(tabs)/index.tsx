import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, Image, TouchableOpacity, Modal } from "react-native";

import { db, getAllHeroes } from "@/database";
import { Container, View, Text, Icon, HeroImage } from "@/components";
import { useGlobal, useTheme } from "@/contexts";
import { HERO_IMAGES_PATH, heroImageMapping } from "@/constants";

import { reduceHexAlpha, increaseHexIntensity } from "@/utils";

import {
    downloadAndSaveImage,
    deleteImage,
    checkIfImageExists
} from "@/utils/image";

const RELATION_IMAGE_SIZE = 44;

type HeroType = {
    id: number;
    name: string;
    image: string;
};

const RELATION_TYPES = ["Combo", "Weak Vs", "Strong Vs"];

function pickRandom(array, count) {
    const copy = [...array];
    const result = [];

    for (let i = 0; i < count && copy.length > 0; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }

    return result;
}

const ImageBorder = ({ children, width = 1, ...props }) => (
    <View className="rounded-full" style={{ borderWidth: width }}>
        {children}
    </View>
);

const Home = () => {
    const [heroes, setHeroes] = useState<HeroType[]>([]);
    const [relationType, setRelationType] = useState<keyof RELATION_TYPES>(
        RELATION_TYPES[0]
    );
    const [heroToViewRelations, setHeroToViewRelations] =
        useState<HeroType>(null);

    const { loading, setLoading } = useGlobal();
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
        setHeroToViewRelations(null);
        setRelationType(RELATION_TYPES[0]);
    };

    const memoizedHeroes = useMemo(
        () => (
            <View className="flex-row flex-wrap">
                {heroes.map((hero, index) => (
                    <TouchableOpacity
                        className="justify-center items-center"
                        key={index}
                        onPress={() => {
                            setHeroToViewRelations(hero);
                        }}
                    >
                        <HeroImage heroId={hero.id} name={hero.name} />
                    </TouchableOpacity>
                ))}
            </View>
        ),
        [heroes]
    );

    return (
        <Container
            style={{
                paddingTop: 0,
                paddingHorizontal: 0
            }}
        >
            {heroToViewRelations && <Modal
                transparent
                visible={!!heroToViewRelations}
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
                            <HeroImage
                                heroId={heroToViewRelations.id}
                                size={64}
                            />

                            <Text variant="header">
                                {heroToViewRelations.name}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row">
                        {RELATION_TYPES.map(type => (
                            <TouchableOpacity
                                key={type}
                                style={{
                                    backgroundColor:
                                        type === relationType
                                            ? colors.primary
                                            : undefined,
                                    width: `${100 / RELATION_TYPES.length}%`,
                                    borderColor: colors.border
                                }}
                                className="border justify-center items-center p-2"
                                onPress={() => setRelationType(type)}
                            >
                                <Text variant="body">{type}</Text>
                            </TouchableOpacity>
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
                            <Icon name="add" size={RELATION_IMAGE_SIZE - 10} />
                        </View>

                        {heroToViewRelations.relations[relationType].map(
                            hero => (
                                <HeroImage
                                    heroId={hero.id}
                                    size={RELATION_IMAGE_SIZE}
                                    name={hero.name}
                                    margin={10}
                                    key={hero.id}
                                />
                            )
                        )}
                    </View>
                </View>
            </Modal>}

            <ScrollView>{memoizedHeroes}</ScrollView>
        </Container>
    );
};

export default Home;
