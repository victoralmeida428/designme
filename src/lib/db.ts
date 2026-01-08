import { Pool } from "pg"

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool(poolConfig);
} else {
    if (!global.postgresPool) {
        global.postgresPool = new Pool(poolConfig);
    }

    pool = global.postgresPool;
}

declare global {
    var postgresPool: Pool|undefined;
}

export default pool;