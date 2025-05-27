import axios from "axios";

export const api = axios.create({
    baseURL: "https://mlbb-stats.ridwaanhall.com/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const myapi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const getHeroList = async () => {};

import { db, createHeroRelation } from "@/database";

/*export const fetchAndCreateHeroRelation = async (heroId: number) => {
    try {
        const res = await api.get(`hero-relation/${heroId}/`);
        const relation = res.data?.data?.records?.[0]?.data?.relation;

        const combo = (relation?.assist?.target_hero_id || []).filter(i => i);
        const weak = (relation?.weak?.target_hero_id || []).filter(i => i);
        const strong = (relation?.strong?.target_hero_id || []).filter(i => i);

        const renamedRelations = {
            Combo: combo,
            "Weak Vs": weak,
            "Strong Vs": strong
        };

        for (const relationType in renamedRelations) {
            for (const targetHeroId of renamedRelations[relationType]) {
                await createHeroRelation({
                    mainHeroId: heroId,
                    targetHeroId,
                    relationType
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
};

const fetchAndCreateHeroRelations = async () => {
    const numberOfHeroes = (
        await db.getFirstAsync("SELECT COUNT(*) AS n_heroes FROM hero")
    ).n_heroes;

    for (let i = 1; i <= numberOfHeroes; i++) {
        await fetchAndCreateHeroRelation(i);
        console.log(`Hero with id ${i} done!.`);
    }
    alert("Fetch and created hero relations.");
};*/

//fetchAndCreateHeroRelations();
