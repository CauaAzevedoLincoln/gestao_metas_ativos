"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, Meta } from "@prisma/client";

/**
 * Interface rigorosa para input de criação de meta, 
 * desacoplando a representação de UI do contrato do banco.
 */
export interface CreateActivityPayload {
  analista: string;
  mesAno: string;
  semana: string;
  atividade: string;
  meta: number | string;
  realizado: number | string;
  status?: string | null;
  justificativa?: string;
}

/**
 * Busca todas as metas (atividades) registradas no banco.
 * POR QUÊ: Utiliza a ordenação decrescente por data para exibir as entradas mais recentes na interface.
 */
export async function getMetas() {
  try {
    const metas: Meta[] = await prisma.meta.findMany({
      orderBy: { dataCriacao: "desc" }
    });
    return { success: true, data: metas };
  } catch (error) {
    // Observabilidade: Logging estruturado para monitoramento (ex: Datadog, CloudWatch)
    console.error(JSON.stringify({
      level: "error",
      context: "getMetas",
      timestamp: new Date().toISOString(),
      message: "Falha na busca de registros de atividades.",
      error: error instanceof Error ? error.message : String(error)
    }));
    return { success: false, error: "Falha ao buscar metas", data: [] };
  }
}

/**
 * Persiste um novo registro de atividade.
 * POR QUÊ: Garante que os tipos sejam castados para numéricos antes de persistir, 
 * e utiliza validação no try/catch para lidar com falhas de conexão/restrição do Neon.
 */
export async function createMeta(activityPayload: CreateActivityPayload) {
  try {
    const dataToCreate: Prisma.MetaCreateInput = {
      analista: activityPayload.analista,
      mesAno: activityPayload.mesAno,
      semana: activityPayload.semana,
      atividade: activityPayload.atividade,
      meta: Number(activityPayload.meta),
      realizado: Number(activityPayload.realizado),
      status: activityPayload.status,
      observacao: activityPayload.justificativa
    };

    const novaMeta: Meta = await prisma.meta.create({
      data: dataToCreate
    });
    
    // Invalida o cache da rota raiz para garantir que a UI reflita a inserção instantaneamente
    revalidatePath("/");
    
    return { success: true, data: novaMeta };
  } catch (error) {
    let errorMessage = "Falha ao criar meta";
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') errorMessage = "Violação de restrição única (registro duplicado).";
      if (error.code === 'P2003') errorMessage = "Falha de chave estrangeira ao inserir registro.";
    }

    console.error(JSON.stringify({
      level: "error",
      context: "createMeta",
      timestamp: new Date().toISOString(),
      payload: activityPayload,
      message: errorMessage,
      error: error instanceof Error ? error.message : String(error)
    }));
    return { success: false, error: errorMessage };
  }
}

/**
 * Remove fisicamente uma atividade pelo ID.
 * POR QUÊ: Exclusões simples sem soft-delete são suficientes por enquanto (KISS), 
 * garantindo alívio de espaço no banco (Neon).
 */
export async function deleteMeta(activityId: number) {
  try {
    await prisma.meta.delete({
      where: { id: activityId }
    });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    let errorMessage = "Falha ao deletar meta";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') errorMessage = "Registro não encontrado para exclusão.";
    }

    console.error(JSON.stringify({
      level: "error",
      context: "deleteMeta",
      timestamp: new Date().toISOString(),
      activityId,
      message: errorMessage,
      error: error instanceof Error ? error.message : String(error)
    }));
    return { success: false, error: errorMessage };
  }
}
