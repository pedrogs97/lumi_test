/*
  Warnings:

  - You are about to drop the column `energia_sceee_kwh` on the `Fatura` table. All the data in the column will be lost.
  - You are about to drop the column `energia_sceee_valor` on the `Fatura` table. All the data in the column will be lost.
  - Added the required column `energia_scee_kwh` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energia_scee_valor` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "energia_sceee_kwh",
DROP COLUMN "energia_sceee_valor",
ADD COLUMN     "energia_scee_kwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "energia_scee_valor" DOUBLE PRECISION NOT NULL;
