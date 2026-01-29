/*
  Warnings:

  - You are about to drop the column `genres` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `platforms` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPrice" REAL,
    "images" TEXT NOT NULL,
    "releaseDate" DATETIME,
    "developer" TEXT,
    "publisher" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Game" ("createdAt", "description", "developer", "discountPrice", "featured", "id", "images", "inStock", "price", "publisher", "releaseDate", "slug", "stockQuantity", "title", "updatedAt") SELECT "createdAt", "description", "developer", "discountPrice", "featured", "id", "images", "inStock", "price", "publisher", "releaseDate", "slug", "stockQuantity", "title", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE INDEX "Game_inStock_idx" ON "Game"("inStock");
CREATE INDEX "Game_featured_idx" ON "Game"("featured");
CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");
CREATE INDEX "Game_title_idx" ON "Game"("title");
CREATE INDEX "Game_price_idx" ON "Game"("price");
CREATE INDEX "Game_discountPrice_idx" ON "Game"("discountPrice");
CREATE INDEX "Game_inStock_featured_idx" ON "Game"("inStock", "featured");
CREATE INDEX "Game_inStock_createdAt_idx" ON "Game"("inStock", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
