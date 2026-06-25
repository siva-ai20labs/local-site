-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "phone" TEXT,
    "category" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "address" TEXT,
    "hours" TEXT,
    "topReviews" TEXT,
    "mapsUrl" TEXT,
    "hasWebsite" BOOLEAN NOT NULL DEFAULT false,
    "websiteUrl" TEXT,
    "builtSiteUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "scrapeSource" TEXT,
    "scrapedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ScraperRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "query" TEXT,
    "status" TEXT NOT NULL,
    "found" INTEGER NOT NULL DEFAULT 0,
    "inserted" INTEGER NOT NULL DEFAULT 0,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_businessName_address_key" ON "Prospect"("businessName", "address");
