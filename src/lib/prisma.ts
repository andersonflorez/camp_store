import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

declare global {
  // Evita múltiples instancias durante el desarrollo con Hot Reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  (() => {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    const log: Prisma.LogLevel[] =
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"];

    if (tursoUrl) {
      const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoAuthToken,
      });

      return new PrismaClient({
        adapter,
        log,
      });
    }

    return new PrismaClient({
      log,
    });
  })();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}