import { db } from "../database";

function pickRandom(array, count) {
    const copy = [...array];
    const result = [];

    for (let i = 0; i < count && copy.length > 0; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }

    return result;
}

export const getAllHeroes = async () => {
    const heroes = await db.getAllAsync("SELECT * FROM hero");
    const relationTypes = await db.getAllAsync("SELECT * FROM relation_type");

    for (const hero of heroes) {
        const heroRelations = await db.getAllAsync(
            "SELECT * FROM relation WHERE main_hero_id = ?",
            [hero.id]
        );
        const relations = {};
        for (const relationType of relationTypes) {
            relations[relationType.name] = [];
            for (const heroRelation of heroRelations) {
                if (heroRelation.relation_type_id !== relationType.id) continue;
                const targetHero = await db.getFirstAsync(
                    "SELECT * FROM hero WHERE id = ?",
                    [heroRelation.target_hero_id]
                );
                if (targetHero) relations[relationType.name].push(targetHero);
            }
        }
        hero.relations = relations;
    }

    return heroes;

    /*return heroes.map(hero => ({
        ...hero,
        relations: {
            Combo: pickRandom(heroes, 10),
            "Weak Vs": pickRandom(heroes, 10),
            "Strong Vs": pickRandom(heroes, 10)
        }
    }));*/
};
