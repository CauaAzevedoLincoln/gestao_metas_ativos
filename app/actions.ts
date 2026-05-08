"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMetas() {
  try {
    const metas = await prisma.meta.findMany({
      orderBy: { dataCriacao: "desc" }
    });
    return { success: true, data: metas };
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    return { success: false, error: "Falha ao buscar metas", data: [] };
  }
}

export async function createMeta(data: any) {
  try {
    const novaMeta = await prisma.meta.create({
      data: {
        analista: data.analista,
        mesAno: data.mesAno,
        semana: data.semana,
        atividade: data.atividade,
        meta: Number(data.meta),
        realizado: Number(data.realizado),
        status: data.status,
        observacao: data.justificativa
      }
    });
    revalidatePath("/");
    return { success: true, data: novaMeta };
  } catch (error) {
    console.error("Erro ao criar meta:", error);
    return { success: false, error: "Falha ao criar meta" };
  }
}

export async function deleteMeta(id: number) {
  try {
    await prisma.meta.delete({
      where: { id }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar meta:", error);
    return { success: false, error: "Falha ao deletar meta" };
  }
}
