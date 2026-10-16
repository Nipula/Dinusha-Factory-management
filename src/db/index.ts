import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/env";

// In production, we use connection pooling. In development, standard client.
const connectionString = env.DATABASE_URL || "";

// Disable prefetch as it is not supported for Transaction Pooler
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
