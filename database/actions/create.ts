import { db } from "../database";

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

        if (relationType === "Combo") {
            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
                [mainHeroId, targetHeroId, relationTypeId]
            );

            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
                [targetHeroId, mainHeroId, relationTypeId]
            );
        } else {
            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
                [mainHeroId, targetHeroId, relationTypeId]
            );

            await db.runAsync(
                "INSERT INTO relation (main_hero_id, target_hero_id, relation_type_id) values(?, ?, ?)",
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
