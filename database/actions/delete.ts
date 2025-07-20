import { getDb } from "../database";
import { OPPOSITE_RELATION_TYPE_MAPPINGS } from "@/constants";
import { RelationType } from "@/types";

export const deleteHeroRelation = async (data : {
        mainHeroId: number;
        targetHeroId: number;
        relationType: RelationType;
    }) => {
    const {
        mainHeroId,
        targetHeroId,
        relationType
    } = data;
    
    const db = await getDb()
    
    try {
        await db.runAsync("BEGIN");
        const relationTypeId = (
            await db.getFirstAsync<{ id: number }>(
                "SELECT id FROM relation_type WHERE name = ?",
                [relationType]
            )
        )?.id;

        if (!relationTypeId) {
            throw new Error("Invalid Relation Type");
        }

        const relationTypes = await db.getAllAsync<{
            id: number;
            name: string;
        }>("SELECT * FROM relation_type");

        await db.runAsync(
            "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [mainHeroId, targetHeroId, relationTypeId]
        );

        const oppositeRelationTypeId: number | undefined = relationTypes.find(
            item => item.name === OPPOSITE_RELATION_TYPE_MAPPINGS[relationType]
        )?.id;

        if (!oppositeRelationTypeId) {
            throw new Error("Invalid Relation Type");
        }

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
