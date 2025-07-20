import { getDb } from "../database";
import { heroes, RELATION_TYPES } from "@/constants";

export async function createTables() {
  const db = await getDb()
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
        
        CREATE TABLE IF NOT EXISTS migration (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          UNIQUE(name)
        );
    `);
    } catch (e) {
        console.error(e);
    }
}

const createRelationTypes = async () => {
  const db = await getDb()
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
  const db = await getDb()
    try {
        for (const hero of heroes) {
            const heroExist = await db.getFirstAsync(
                "SELECT * FROM hero WHERE id = ?",
                [hero.id]
            );

            if (!heroExist) {
                await db.runAsync("INSERT INTO hero (id, name) VALUES (?, ?)", [
                    hero.id,
                    hero.name
                ]);
            }
        }
    } catch (e: any) {
        console.error("Error inserting heroes:", e.message);
    }
};

const name = "0001_initial";
const TOTAL_HERO_COUNT = heroes.length;

export const initializeDatabase = async () => {
    await createTables();
    const db = await getDb()

    try {
        const heroesCountInDb = (await db.getFirstAsync<{total_heroes: number}>(
            "SELECT COUNT(id) AS total_heroes FROM hero"
        ))?.total_heroes;

        if (!heroesCountInDb || heroesCountInDb !== TOTAL_HERO_COUNT) {
            if (!heroesCountInDb) await insertHeroes();
            else {
                for (const hero of heroes.slice(heroesCountInDb)) {
                    await db.runAsync(
                        "INSERT INTO hero (id, name) VALUES (?, ?)",
                        [hero.id, hero.name]
                    );
                }
            }
        }
    } catch (e: any) {
        console.error(e);
    }

    if (!(await db.getFirstAsync("SELECT * FROM migration"))) {
        await createRelationTypes();
        await db.runAsync("INSERT INTO migration (name) VALUES (?)", [name]);
    }
};
