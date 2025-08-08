import { db } from "../database";
import { OPPOSITE_RELATION_TYPE_MAPPINGS } from "@/constants";
import { RelationType } from "@/types";

export const createHeroRelation = async (data: {
    mainHeroId: number;
    targetHeroId: number;
    relationType: RelationType;
}) => {
    const { mainHeroId, targetHeroId, relationType } = data;
    
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

        const relationTypes = await db.getAllAsync<{ id: number; name: string }>(
            "SELECT * FROM relation_type"
        );

        const relationExist = await db.getFirstAsync(
            "SELECT * FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [mainHeroId, targetHeroId, relationTypeId]
        );

        if (!relationExist) {
            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) VALUES (?, ?, ?)",
                [mainHeroId, targetHeroId, relationTypeId]
            );
        }

        const oppositeRelationTypeId = relationTypes.find(
            item => item.name === OPPOSITE_RELATION_TYPE_MAPPINGS[relationType]
        )?.id;

        if (!oppositeRelationTypeId) {
            throw new Error("Invalid Opposite Relation Type");
        }

        const oppositeRelationExist = await db.getFirstAsync(
            "SELECT * FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
            [targetHeroId, mainHeroId, oppositeRelationTypeId]
        );

        if (!oppositeRelationExist) {
            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) VALUES (?, ?, ?)",
                [targetHeroId, mainHeroId, oppositeRelationTypeId]
            );
        }

        await db.runAsync("COMMIT");
    } catch (e) {
        await db.runAsync("ROLLBACK");
        throw e;
    }
};