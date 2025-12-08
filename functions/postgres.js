import { Sequelize } from "sequelize";
import pg from "pg";

export async function postgres(dbUrl, sqlQuery) {
    if (!dbUrl) {
        throw new Error("PostgreSQL URL is required.");
    }

    // Create a temporary Sequelize instance for this query
    const sequelize = new Sequelize(dbUrl, {
        dialect: "postgres",
        logging: false,
        dialectModule: pg,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Neon requires this
            },
        },
    });

    try {
        const [results] = await sequelize.query(sqlQuery);
        await sequelize.close();
        return results;
    } catch (err) {
        await sequelize.close();
        throw new Error(`PostgreSQL query failed: ${err.message}`);
    }
}

export const postgresDescription = `
postgres(dbUrl, sqlQuery):
- Executes a raw SQL query on a PostgreSQL database (Neon, Supabase, RDS, etc.).
- Requires a PostgreSQL connection string.
- Returns the query result.

Parameters:
  dbUrl: String — PostgreSQL connection string.
         Example: "postgresql://user:password@host/dbname?sslmode=require"

  sqlQuery: String — The raw SQL query to run.

Returns:
  Object — The query output (rows for SELECT, metadata for INSERT/UPDATE/DELETE).
`;
