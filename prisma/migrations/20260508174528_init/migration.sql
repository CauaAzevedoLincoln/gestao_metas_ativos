-- CreateTable
CREATE TABLE "Meta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analista" TEXT NOT NULL,
    "mesAno" TEXT NOT NULL,
    "semana" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,
    "meta" REAL NOT NULL,
    "realizado" REAL NOT NULL,
    "status" TEXT,
    "observacao" TEXT,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
