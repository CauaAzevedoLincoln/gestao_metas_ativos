import { prisma } from "../app/lib/prisma";

async function runTests() {
  console.log("🚀 Iniciando bateria de testes com o NOVO adaptador Neon Serverless...");

  try {
    console.log("📝 Testando inserção...");
    const testMeta = await prisma.meta.create({
      data: {
        analista: "Cauã",
        mesAno: "MAI/2026",
        semana: "S1",
        atividade: "TESTE_ADAPTADOR_NEON",
        meta: 10,
        realizado: 10,
        status: "Verde",
        observacao: "Teste com @prisma/adapter-neon"
      }
    });
    console.log("✅ Inserção OK! ID:", testMeta.id);

    console.log("🔍 Verificando se gravou no banco...");
    const meta = await prisma.meta.findUnique({ where: { id: testMeta.id } });
    if (meta) {
      console.log("✅ Gravação confirmada no Neon!");
    } else {
      throw new Error("Erro: O registro não foi encontrado após a inserção.");
    }

    console.log("🗑️ Limpando registro de teste...");
    await prisma.meta.delete({ where: { id: testMeta.id } });
    console.log("✅ Limpeza OK!");

    console.log("\n✨ TESTE CONCLUÍDO! O novo adaptador está pronto para a Vercel.");
  } catch (error) {
    console.error("\n❌ ERRO NO TESTE:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
