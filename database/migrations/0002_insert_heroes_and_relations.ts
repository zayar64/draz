import { db } from "../database";
import { heroes } from "@/constants";

import { HeroType, RelationType, HeroRelationType } from "@/types";

/*const insertRelations = async () => {
    for (const hero of heroes) {
        const heroExist = await db.getFirstAsync<HeroType>(
            "SELECT * FROM hero WHERE id = ?",
            [hero.id]
        );

        if (!heroExist) {
            continue;
        }

        const relations: HeroRelationType | undefined = hero?.relations;

        if (relations) {
            for (const relationType of Object.keys(
                relations
            ) as RelationType[]) {
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
        }
    }
};

const name = "0002_insert_heroes";

const exeInsertHeroes = async () => {
    await db.runAsync("INSERT INTO migration (name) VALUES (?)", [name]);
};

export const m2 = {
    [name]: exeInsertHeroes
};*/
