import "dotenv/config";

import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string){ 
  if(!process.env.DATABASE_URL){
    throw new Error("Please provide a database url!");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default<Environment> {
  name: "prisma",
  async setup() {
    const schema = randomUUID();
    const database = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = database;

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect;
      },
    };
  }
};