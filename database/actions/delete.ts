import { db } from "../database";
import { OPPOSITE_RELATION_TYPE_MAPPINGS } from "@/constants";

export const deleteHeroRelation = async data => {
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

        await db.runAsync(
            "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [mainHeroId, targetHeroId, relationTypeId]
        );

        const oppositeRelationTypeId = relationTypes.find(
            item => item.name === OPPOSITE_RELATION_TYPE_MAPPINGS[relationType]
        ).id;

        await db.runAsync(
            "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [targetHeroId, mainHeroId, oppositeRelationTypeId]
        );

        await db.runAsync("COMMIT");
    } catch (e) {
        await db.runAsync("ROLLBACK");
        throw e;
    }
};
