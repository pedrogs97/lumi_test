-- AlterTable
ALTER TABLE "faturas" ALTER COLUMN "energia_scee_kwh" DROP NOT NULL,
ALTER COLUMN "energia_scee_valor" DROP NOT NULL,
ALTER COLUMN "energia_compensada_kwh" DROP NOT NULL,
ALTER COLUMN "energia_compensada_valor" DROP NOT NULL;
