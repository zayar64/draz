import { db } from "../database";
import { heroes, RELATION_TYPES } from "@/constants";

import { HeroType, RelationType, HeroRelationType } from "@/types";

const createRelationTypes = async () => {
    try {
        for (const relationType of RELATION_TYPES) {
            const relationTypeExist = await db.getFirstAsync(
                "SELECT * FROM relation_type WHERE name = ?",
                [relationType]
            );
            if (!relationTypeExist) {
                await db.runAsync(
                    "INSERT INTO relation_type (name) VALUES (?)",
                    [relationType]
                );
            }
        }
    } catch (e: any) {
        console.error("Error creating relation types:", e.message);
    }
};

const insertHeroes = async () => {
    try {
        for (const hero of heroes) {
            const heroExist = await db.getFirstAsync(
                "SELECT * FROM hero WHERE id = ?",
                [hero.id]
            );

            if (!heroExist) {
                await db.runAsync(
                    "INSERT INTO hero (id, name) VALUES (?, ?)",
                    [hero.id, hero.name]
                );
            }

            const relations: HeroRelationType | undefined = hero.relations;

            if (relations) {
                for (const relationType of Object.keys(relations) as RelationType[]) {
                    const relationHeroes: HeroType[] = relations[relationType];
                    for (const targetHero of relationHeroes) {
                        try {
                            await db.runAsync(
                                `INSERT INTO relation 
                                 (main_hero_id, target_hero_id, relation_type_id) 
                                 VALUES (?, ?, (SELECT id FROM relation_type WHERE name = ? LIMIT 1))`,
                                [hero.id, targetHero.id, relationType]
                            );
                        } catch (e: any) {
                            console.warn(
                                `Failed to insert relation: ${hero.name} -> ${targetHero.name} [${relationType}]`
                            );
                        }
                    }
                }
                console.log(`Inserted ${hero.name}'s relations!`);
            }
        }
    } catch (e: any) {
        console.error("Error inserting heroes:", e.message);
    }
};

const name = "0002_insert_heroes_and_relations";

const insertHeroesAndRelations = async () => {
    await createRelationTypes();
    await insertHeroes();
    await db.runAsync("INSERT INTO migration (name) VALUES (?)", [name]);
};

export const m2 = {
    [name]: insertHeroesAndRelations
};