import { db } from "../database";
import { OPPOSITE_RELATION_TYPE_MAPPINGS } from "@/constants";

export const createHeroRelation = async data => {
    const { mainHeroId, targetHeroId, relationType } = data;
    try {
        await db.runAsync("BEGIN");
        const relationTypeId = (
            await db.getFirstAsync(
                "SELECT * FROM relation_type WHERE name = ?",
                [relationType]
            )
        )?.id;

        const relationTypes = await db.getAllAsync(
            "SELECT * FROM relation_type"
        );

        const relationExist = await db.getFirstAsync(
            "SELECT * FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [mainHeroId, targetHeroId, relationTypeId]
        );

        if (!relationExist) {
            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
                [mainHeroId, targetHeroId, relationTypeId]
            );
        }

        const oppositeRelationTypeId = relationTypes.find(
            item => item.name === OPPOSITE_RELATION_TYPE_MAPPINGS[relationType]
        ).id;
        
        const oppositeRelationExist = await db.getFirstAsync(
            "SELECT * FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [targetHeroId, mainHeroId, oppositeRelationTypeId]
        );

if (!oppositeRelationExist) {
        await db.runAsync(
            "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
            [targetHeroId, mainHeroId, oppositeRelationTypeId]
        );
}

        await db.runAsync("COMMIT");
    } catch (e) {
        await db.runAsync("ROLLBACK");
        throw e;
    }
};
