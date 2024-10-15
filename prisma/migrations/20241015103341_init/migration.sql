-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "releaseDate" DATETIME,
    "rating" REAL,
    "poster" TEXT,
    "categoryId" INTEGER NOT NULL,
    "directorId" INTEGER NOT NULL,
    CONSTRAINT "Movie_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Movie" ("categoryId", "description", "directorId", "id", "name", "poster", "rating", "releaseDate") SELECT "categoryId", "description", "directorId", "id", "name", "poster", "rating", "releaseDate" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE TABLE "new_Serie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "releaseDate" DATETIME,
    "rating" REAL,
    "poster" TEXT,
    "categoryId" INTEGER NOT NULL,
    "directorId" INTEGER NOT NULL,
    CONSTRAINT "Serie_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Serie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Serie" ("categoryId", "description", "directorId", "id", "name", "poster", "rating", "releaseDate") SELECT "categoryId", "description", "directorId", "id", "name", "poster", "rating", "releaseDate" FROM "Serie";
DROP TABLE "Serie";
ALTER TABLE "new_Serie" RENAME TO "Serie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
