import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("mlbb.db");
