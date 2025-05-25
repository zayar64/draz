import { db } from "../database";

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

        if (relationType === "Combo") {
            await db.runAsync(
                "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
                [mainHeroId, targetHeroId, relationTypeId]
            );

            await db.runAsync(
                "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
                [targetHeroId, mainHeroId, relationTypeId]
            );
        } else {
            await db.runAsync(
                "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
                [mainHeroId, targetHeroId, relationTypeId]
            );

            await db.runAsync(
                "DELETE FROM relation WHERE main_hero_id = ? AND target_hero_id = ? AND relation_type_id = ?",
                [
                    targetHeroId,
                    mainHeroId,
                    relationTypes.find(
                        item =>
                            item.id !== relationTypeId && item.name !== "Combo"
                    ).id
                ]
            );
        }

        await db.runAsync("COMMIT");
    } catch (e) {
        await db.runAsync("ROLLBACK");
        throw e;
    }
};
