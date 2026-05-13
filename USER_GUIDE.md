# 📖 Guia do Usuário: Sistema de Gestão de Metas (Liderança)

**Responsável Técnica/Líder:** Talita  
**Versão:** 1.0.0  
**Acesso ao Sistema:** [INSERIR_LINK_DA_VERCEL_AQUI]

---

## 📌 Visão Geral

Este documento é o manual oficial de operação e análise do **Sistema de Gestão de Metas**. Ele foi desenvolvido visando as melhores práticas de Engenharia de Software, oferecendo uma interface responsiva, processamento de dados em tempo real e persistência segura em banco de dados relacional (PostgreSQL). 

O foco deste guia é capacitar a liderança (Talita) a realizar o acompanhamento estratégico do time de analistas (**Mariana, Carlos e Cauã**).

### ✨ Novidades da Versão Atual
*   **Modo Escuro (Dark Mode Premium):** Interface modernizada com gradientes e alto contraste para visualização em ambientes de baixa luminosidade.
*   **Refatoração de Performance:** Backend otimizado para Neon/PostgreSQL com logging estruturado e tipagem rigorosa.
*   **Gráficos Inteligentes:** Legendas e eixos que se adaptam automaticamente ao tema escolhido.

---

## 🎯 1. Como Preencher e Lançar Metas

A seção de **Lançamento de Atividade** foi projetada para garantir a integridade e padronização dos dados inseridos. 

### Passo a passo para o registro:
1. **Analista:** Selecione o membro da equipe responsável pela atividade (Cauã, Mariana ou Carlos).
2. **Mês/Ano & Semana:** Defina o período de competência da meta. A segmentação semanal permite análises táticas ágeis (ex: `S1`, `S2`).
3. **Atividade:** Descreva de forma concisa o objetivo principal.
4. **Meta e Realizado:** Insira valores numéricos. O sistema utiliza esses dois parâmetros como *inputs* para o motor de cálculo automático do status de atingimento.
5. **Justificativa:** Este campo torna-se **obrigatório** caso o atingimento seja inferior ao esperado (Status Amarelo ou Vermelho).

> 📸 *[INSERIR_PRINT_DA_TELA_DE_LANCAMENTO_DE_METAS_AQUI]*

---

## 🚦 2. Metodologia do "Farol" (Interpretação de Status)

Para agilizar o tempo de resposta da liderança, o sistema adota a metodologia de gestão visual conhecida como **Farol de Performance**. O cálculo do *status* é feito de forma determinística no ato do preenchimento.

### A Regra de Negócio Técnica
A lógica de classificação calcula o percentual de atingimento $\left( \frac{\text{Realizado}}{\text{Meta}} \times 100 \right)$ e aplica as seguintes regras:

*   🟢 **Verde (Atingido):** Desempenho excelente. Atingimento igual ou superior a **90%** da meta estipulada.
*   🟡 **Amarelo (Parcial):** Ponto de atenção. O analista entregou entre **50% e 89%** da meta. Exige preenchimento de justificativa.
*   🔴 **Vermelho (Não Atingido):** Situação crítica. O atingimento ficou **abaixo de 50%**. Exige justificativa detalhada e ação corretiva imediata.

```typescript
// Motor de Cálculo de Status (Core Logic)
export function calcularStatus(realizado: number, meta: number): "Verde" | "Amarelo" | "Vermelho" {
  if (meta === 0) return "Verde"; // Prevenção de divisão por zero
  
  const percentual = (realizado / meta) * 100;
  
  if (percentual >= 90) return "Verde";
  if (percentual >= 50) return "Amarelo";
  return "Vermelho";
}
```

---

## 📊 3. Painel Gerencial: Monitoramento de Performance

A área de Dashboards transforma os dados brutos cadastrados em informações de inteligência de negócios (*Business Intelligence*).

### Filtragem Avançada (Segmentação de Dados)
Utilize o painel de filtros localizado acima dos gráficos para cruzar dados.
*   **Por Analista:** Quer saber apenas o desempenho do *Carlos*? Selecione o nome dele no filtro. Todos os KPIs, gráficos e a tabela refletirão apenas o escopo dele.
*   **Por Temporalidade:** Filtre por *Mês* ou *Semana* para realizar o fechamento de ciclo e entender a produtividade do *Cauã* e da *Mariana* em períodos de pico de demanda.

> 📸 *[INSERIR_PRINT_DOS_FILTROS_E_KPIs_AQUI]*

### Indicadores (KPIs)
*   **Total de Atividades:** Volume bruto de demandas registradas no período/filtro selecionado.
*   **Atingimento Geral:** Termômetro da equipe. Mostra a porcentagem global de sucesso das entregas.
*   **Alerta Vermelho:** Contador imediato de tarefas críticas (abaixo de 50%) que necessitam da sua intervenção gerencial.

---

## 📥 4. Extração de Dados e Fechamento

### Exportação para Excel (.csv)
No canto superior direito da tabela de *Detalhamento das Atividades*, você encontrará o botão **Extrair Excel**.

*   **Para que serve:** Ideal para envio de relatórios gerenciais, apresentações ou cruzamento de dados offline.
*   **O que ele faz:** O sistema processa os dados do banco, converte o visual do Farol em texto plano (`Atingido`, `Parcial`, `Não Atingido`) e realiza o download automático do conteúdo já padronizado e com formatação compatível (`UTF-8`). 

> 📸 *[INSERIR_PRINT_DA_TABELA_COM_BOTAO_DE_EXTRAIR_AQUI]*

---

---

## 🎨 5. Personalização e Visual (Dark Mode)

O sistema agora conta com um **Dark Mode Premium**, projetado para reduzir a fadiga ocular e oferecer uma experiência visual mais sofisticada.

*   **Alternância de Tema:** No canto superior direito, utilize o ícone de Lua/Sol para alternar entre o modo claro e o modo escuro.
*   **Consistência Visual:** Todos os elementos, incluindo gráficos e formulários, foram adaptados para manter a legibilidade. O campo de "Justificativa", por exemplo, mantém-se claro em ambos os modos para facilitar a escrita.

---

## 🛠️ 6. Notas Técnicas de Engenharia

Para garantir a estabilidade em produção, o sistema passou por uma refatoração profunda:

*   **TypeScript Rigoroso:** Todas as comunicações entre o servidor e o banco de dados utilizam interfaces nativas do Prisma, eliminando erros de inconsistência de dados.
*   **Observabilidade:** Logs estruturados em formato JSON são gerados para cada ação crítica (criação, exclusão), permitindo auditoria rápida em caso de falhas.
*   **Performance Neon:** A gestão de conexões com o banco de dados foi otimizada para evitar sobrecarga no cluster serverless do Neon.

---

**Suporte Técnico**
Caso ocorra alguma instabilidade sistêmica, o painel de administração da hospedagem (Vercel) e o banco de dados (Neon) devem ser verificados pela engenharia de software responsável.
