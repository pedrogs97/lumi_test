/*
  Warnings:

  - Added the required column `instalacao` to the `faturas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faturas" ADD COLUMN     "instalacao" TEXT NOT NULL;
