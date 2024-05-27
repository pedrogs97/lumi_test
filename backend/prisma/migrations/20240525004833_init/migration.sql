-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "numero_cliente" TEXT NOT NULL,
    "mes_referencia" TEXT NOT NULL,
    "energia_eletrica_kwh" DOUBLE PRECISION NOT NULL,
    "energia_eletrica_valor" DOUBLE PRECISION NOT NULL,
    "energia_sceee_kwh" DOUBLE PRECISION NOT NULL,
    "energia_sceee_valor" DOUBLE PRECISION NOT NULL,
    "energia_compensada_kwh" DOUBLE PRECISION NOT NULL,
    "energia_compensada_valor" DOUBLE PRECISION NOT NULL,
    "contrib_ilum_publica" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);
