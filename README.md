# Backend API

API REST en Node.js/Express + TypeScript + TypeORM (MySQL). Autenticación JWT.

## Inicio rápido (Docker)
- Requisitos: `Docker Desktop` instalado y corriendo.
- Copia `.env.example` a `.env` y ajusta si quieres. Para Docker:
```
DB_ENABLED=true
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=pruebatecnica
PORT=3000
JWT_SECRET=cambiar
CORS_ORIGIN=http://localhost:4200
```
- Levantar servicios (build + up):
```
docker compose up -d --build
```
- Ver salud de la API:
```
curl http://localhost:3000/api/v1/health
```
- Sembrar datos de desarrollo (crea admin y datos básicos):
```
docker compose exec api node dist/seeds/dev-seed.js
```
- Probar login admin:
```
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```
- Parar todo:
```
docker compose down
```
- Logs:
```
docker compose logs api --tail=50
```

## Inicio local (sin Docker)
- Requisitos: `Node 18+`, `MySQL` local.
- Copia `.env.example` a `.env`.
  - Sin DB: `DB_ENABLED=false`.
  - Con DB local: configura `DB_HOST=localhost`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_ENABLED=true`.
- Instala dependencias:
```
npm install
```
- Si tienes DB activa, ejecuta el seed:
```
npm run seed:dev
```
- Arranca en desarrollo:
```
npm run dev
```
- Healthcheck:
```
curl http://localhost:3000/api/v1/health
```

## Pruebas
- Ejecutar test unitarios/integración (Jest + ts-jest + Supertest):
```
npm test
```
- Modo watch:
```
npm run test:watch
```
- Qué cubren:
  - `health.spec.ts`: responde OK en `GET /api/v1/health`.
  - `auth.login.spec.ts`: login con credenciales válidas devuelve JWT.
- Consejos:
  - Si usas Docker, puedes correr `npm test` en tu host; no necesitas levantar servicios para los tests básicos.
  - Asegúrate de tener dependencias instaladas (`npm install`).

## Endpoints de verificación
- Salud: `GET /api/v1/health` → debería devolver `{ status: "ok" }`.
- Login: `POST /api/v1/auth/login` con `{ email, password }`.
- Usuario actual: `GET /api/v1/users/me` con `Authorization: Bearer <TOKEN>`.

## Scripts útiles
- Desarrollo: `npm run dev`
- Build TypeScript: `npm run build`
- Arranque producción local (tras build): `npm run start`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` / `npm run lint:fix`
- Formateo: `npm run format`

## Notas
- La API arranca en `http://localhost:3000`.
- En Docker, el servicio MySQL es `db` y la API espera a que esté sana antes de conectar.
- Usuario de prueba: `admin@example.com / admin123`.