-- Létrehozza a 'users' táblát, ha még nem létezik
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL
);

-- Létrehozza a 'products' táblát, ha még nem létezik
CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "user_id" INT NOT NULL,
  CONSTRAINT "FK_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Esetleg egy index a 'products' táblán a gyorsabb lekérdezéshez
CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "products"("user_id");
