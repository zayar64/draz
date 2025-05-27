import { db } from "../database";

import { heroes, RELATION_TYPES } from "@/constants";

export async function createTables() {
    try {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS hero (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(150) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS relation_type (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(150) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS relation (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          main_hero_id INTEGER NOT NULL,
          target_hero_id INTEGER NOT NULL,
          relation_type_id INTEGER NOT NULL,
          FOREIGN KEY (main_hero_id) REFERENCES hero(id) ON DELETE CASCADE,
          FOREIGN KEY (target_hero_id) REFERENCES hero(id) ON DELETE CASCADE,
          FOREIGN KEY (relation_type_id) REFERENCES relation_type(id) ON DELETE CASCADE,
          UNIQUE(main_hero_id, target_hero_id, relation_type_id)
        );
    `);
    } catch (e) {
        console.error(e);
    }
}

const insertHeroes = async () => {
    try {
        for (const hero of heroes) {
            const heroExist = await db.getFirstAsync(
                "SELECT * FROM hero WHERE id = ?",
                [hero.id]
            );
            if (!heroExist) {
                await db.runAsync("INSERT INTO hero (id, name) values(?, ?)", [
                    hero.id,
                    hero.name
                ]);
            }
        }
    } catch (e) {
        console.error(e.message);
    }
};

const createRelationTypes = async () => {
    try {
        for (const relationType of RELATION_TYPES) {
            console.log(relationType);
            const relationTypeExist = await db.getFirstAsync(
                "SELECT * FROM relation_type WHERE name = ?",
                [relationType]
            );
            if (!relationTypeExist) {
                await db.runAsync(
                    "INSERT INTO relation_type (name) values(?)",
                    [relationType]
                );
            }
        }
    } catch (e) {
        console.error(e.message);
    }
};

const initializeDatabase = async () => {
    await createTables();
    await insertHeroes();
    await createRelationTypes();
};

initializeDatabase();
