-- CreateTable
CREATE TABLE "Meta" (
    "id" SERIAL NOT NULL,
    "analista" TEXT NOT NULL,
    "mesAno" TEXT NOT NULL,
    "semana" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL,
    "realizado" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "observacao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);
