import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "userdb.sqlite",
    logging: false,
});

export async function sqlite(sqlQuery) {
    try {
        const [results] = await sequelize.query(sqlQuery);
        return results;
    } catch (err) {
        throw new Error(`SQLite query failed: ${err.message}`);
    }
}

export const sqliteDescription = `
sqlite(sqlQuery):
- Executes a raw SQL query on the fixed SQLite database "userdb.sqlite".
- Returns the query result.

Parameters:
  sqlQuery: String — The raw SQL query to run.

Returns:
  Object — The query output (rows for SELECT, metadata for INSERT/UPDATE/DELETE).
`;
