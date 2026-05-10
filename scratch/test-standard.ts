import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function runTests() {
  console.log("🚀 Testando conexão com PRISMA STANDARD...");

  try {
    const time = await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ Conexão OK! Hora do servidor:", time);

    console.log("📝 Testando inserção...");
    const test = await prisma.meta.create({
      data: {
        analista: "Teste",
        mesAno: "MAI/2026",
        semana: "S1",
        atividade: "TESTE_FINAL",
        meta: 1,
        realizado: 1
      }
    });
    console.log("✅ Inserção OK! ID:", test.id);

    await prisma.meta.delete({ where: { id: test.id } });
    console.log("✅ Limpeza OK!");
    
    console.log("\n✨ TUDO PRONTO PARA O DEPLOY!");
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
