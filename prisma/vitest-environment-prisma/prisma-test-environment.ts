import { Environment } from "vitest";

export default<Environment> {
  name: "prisma",
  async setup() {
    console.log("🤖 Setup tests E2E");

    return {
      async teardown() {
        console.log("Teardown");
      },
    };
  }
};