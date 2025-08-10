import { db } from "../database";
import { heroes as heroSeedData } from "@/constants";
import { HeroType, HeroRelationType, RelationType } from "@/types";

function pickRandom<T>(array: T[], count: number): T[] {
    const copy = [...array];
    const result: T[] = [];

    for (let i = 0; i < count && copy.length > 0; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }

    return result;
}

export const getHeroRelations = async (
    hero: HeroType
): Promise<HeroRelationType> => {
  
    const relationTypes = await db.getAllAsync<{id: number, name: RelationType}>("SELECT * FROM relation_type");

    const heroRelations = await db.getAllAsync<{id: number, main_hero_id: number, target_hero_id: number, relation_type_id: number}>(
        "SELECT * FROM relation WHERE main_hero_id = ?",
        [hero.id]
    );

    const relations: HeroRelationType = {
        Combo: [],
        "Weak Vs": [],
        "Strong Vs": []
    };

    for (const relationType of relationTypes) {
        const relationName = relationType.name as RelationType;
        for (const heroRelation of heroRelations) {
            if (heroRelation.relation_type_id !== relationType.id) continue;

            const targetHero = await db.getFirstAsync(
                "SELECT * FROM hero WHERE id = ?",
                [heroRelation.target_hero_id]
            );

            if (targetHero) {
                relations[relationName].push(targetHero as HeroType);
            }
        }
    }

    return relations;
};

export const getAllHeroes = async (withRelations=false): Promise<HeroType[]> => {
  
    try {
        const allHeroes = await db.getAllAsync<HeroType>(
            "SELECT * FROM hero ORDER BY name"
        );
        if (withRelations) {
          for (const hero of allHeroes) {
            hero.relations = await getHeroRelations(hero)
          }
        }
        return allHeroes;
    } catch {
        return [];
    }
};
