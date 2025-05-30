import { db } from "../database";

const name = "0001_initial";

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

export const initializeDatabase = async () => {
  await createTables()
    if (!(await db.getFirstAsync("SELECT * FROM migration"))) {
        await db.runAsync("INSERT INTO migration (name) VALUES (?)", [name]);
    }
};
