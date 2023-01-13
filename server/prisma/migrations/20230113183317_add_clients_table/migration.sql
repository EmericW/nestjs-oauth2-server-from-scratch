-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('CONFIDENTIAL', 'PUBLIC');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "secret" TEXT,
    "type" "ClientType",
    "redirectUrls" TEXT[],

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
