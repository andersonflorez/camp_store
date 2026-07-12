# Camp Score

MVP para administrar puntajes de campamentos, retiros y eventos similares.

Stack principal:

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Prisma
- SQLite (local)

## Requisitos

- Node.js 20+
- npm
- Cuenta en Vercel (para deploy)
- Cuenta en Turso (para base de datos de producción)

## Desarrollo local (SQLite)

### 1) Instalar dependencias

```bash
npm install
```

### 2) Crear variables de entorno local

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="file:./dev.db"
```

### 3) Aplicar migraciones en local

```bash
npm run prisma:migrate
```

### 4) (Opcional) Cargar datos de prueba

```bash
npm run prisma:seed
```

### 5) Levantar el proyecto

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Turso para producción (Vercel)

Este proyecto usa Prisma con datasource SQLite. Para usar Turso en producción, utiliza Turso como SQLite remota (libsql).

### 1) Crear la base en Turso

Con Turso CLI:

```bash
turso db create camp-score-prod
turso db show camp-score-prod --url
turso db tokens create camp-score-prod
```

Guarda estos valores:

- URL de la base, por ejemplo: `libsql://camp-score-prod-<org>.turso.io`
- Token de acceso

### 2) Configurar variables en Vercel

En el proyecto de Vercel, agrega:

- `DATABASE_URL` = URL de Turso (`libsql://...`)
- `TURSO_AUTH_TOKEN` = token generado
- `NODE_ENV` = `production`

### 3) Aplicar migraciones a producción

Antes del primer deploy (y cada cambio de schema), ejecuta:

```bash
DATABASE_URL="libsql://camp-score-prod-<org>.turso.io" \
TURSO_AUTH_TOKEN="<token>" \
npx prisma migrate deploy
```

### 4) Desplegar en Vercel

Conecta el repositorio en Vercel y realiza el deploy.

Script de build actual del proyecto:

```bash
npm run build
```

## Nota importante para Prisma + Turso

Si Turso no conecta con `PrismaClient` directo en tu entorno, usa el adaptador oficial de Prisma para libsql.

Dependencias necesarias:

```bash
npm install @prisma/adapter-libsql @libsql/client
```

Y luego adapta la inicialización de Prisma en `src/lib/prisma.ts` según la guía oficial de Prisma para Turso/libsql.

## Comandos útiles

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ver la base local en interfaz
npm run prisma:studio

# Reset completo local
npm run db:reset

# Type checking
npm run typecheck

# Lint
npm run lint
```
