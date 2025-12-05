-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "primaryArea" TEXT,
    "defaultShulId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Shul" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "MinyanLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "time" TEXT,
    "prayerType" TEXT NOT NULL,
    "shulId" TEXT,
    "shulName" TEXT,
    "userId" TEXT NOT NULL,
    "photoUri" TEXT,
    "note" TEXT,
    "travelArea" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MinyanLog_shulId_fkey" FOREIGN KEY ("shulId") REFERENCES "Shul" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MinyanLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
