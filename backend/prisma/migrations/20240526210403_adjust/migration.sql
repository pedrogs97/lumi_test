/*
  Warnings:

  - You are about to drop the `Fatura` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Fatura";

-- CreateTable
CREATE TABLE "faturas" (
    "id" SERIAL NOT NULL,
    "numero_cliente" TEXT NOT NULL,
    "mes_referencia" TEXT NOT NULL,
    "energia_eletrica_kwh" DOUBLE PRECISION NOT NULL,
    "energia_eletrica_valor" DOUBLE PRECISION NOT NULL,
    "energia_scee_kwh" DOUBLE PRECISION NOT NULL,
    "energia_scee_valor" DOUBLE PRECISION NOT NULL,
    "energia_compensada_kwh" DOUBLE PRECISION NOT NULL,
    "energia_compensada_valor" DOUBLE PRECISION NOT NULL,
    "contrib_ilum_publica" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "faturas_pkey" PRIMARY KEY ("id")
);
