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

Este proyecto usa Prisma con datasource SQLite y en runtime se conecta a Turso usando el adaptador oficial de libsql.

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

- `DATABASE_URL` = `file:./dev.db`
- `TURSO_DATABASE_URL` = URL de Turso (`libsql://...`)
- `TURSO_AUTH_TOKEN` = token generado
- `NODE_ENV` = `production`

`DATABASE_URL` debe seguir siendo `file:` para que Prisma CLI (generate/build) no falle con provider `sqlite`.

### 3) Build command en Vercel

Usa este Build Command:

```bash
npm run build
```

No uses `prisma migrate deploy` dentro del build de Vercel con `libsql://...` porque fallará la validación del schema.

### 4) Aplicar cambios de schema en Turso

Cuando cambie `prisma/schema.prisma`, genera el SQL de migración con Prisma y aplícalo con Turso CLI.

Ejemplo de flujo:

```bash
# 1) Crear migración local (genera SQL en prisma/migrations)
npm run prisma:migrate

# 2) Aplicar ese SQL en Turso (ejemplo)
turso db shell camp-score-prod < prisma/migrations/<migration_folder>/migration.sql
```

### 5) Desplegar en Vercel

Conecta el repositorio en Vercel y realiza el deploy.

Script de build actual del proyecto:

```bash
npm run build
```

## Nota importante para Prisma + Turso

La conexión a Turso en producción queda lista mediante:

- `@prisma/adapter-libsql`
- `@libsql/client`

Implementado en `src/lib/prisma.ts`.

Dependencias necesarias:

```bash
npm install @prisma/adapter-libsql @libsql/client
```

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
