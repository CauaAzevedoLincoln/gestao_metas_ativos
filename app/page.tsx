"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Send,
  Target,
  Activity,
  Trash2
} from "lucide-react";
import { getMetas, createMeta, deleteMeta } from "./actions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Meta {
  id?: number;
  analista: string;
  mesAno: string;
  semana: string;
  atividade: string;
  meta: number;
  realizado: number;
  justificativa?: string;
  observacao?: string | null;
  dataCriacao?: string | Date;
  status?: "Verde" | "Amarelo" | "Vermelho" | string | null;
}

export default function MetasTimePage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; idToDelete?: number }>({ isOpen: false });

  const [filtroAnalista, setFiltroAnalista] = useState<string>("Todos");
  const [filtroMesAno, setFiltroMesAno] = useState<string>("Todos");
  const [filtroSemana, setFiltroSemana] = useState<string>("Todas");

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Meta>();
  const watchRealizado = watch("realizado", 0);
  const watchMeta = watch("meta", 0);

  const calcularStatus = (realizado: number, meta: number) => {
    if (realizado >= meta && meta > 0) return "Verde";
    if (realizado >= meta && meta == 0 && realizado == 0) return "Verde";
    if (realizado > 0 && realizado < meta) return "Amarelo";
    return "Vermelho";
  };

  const currentStatus = calcularStatus(watchRealizado, watchMeta);
  const isJustificativaRequired = currentStatus === "Amarelo" || currentStatus === "Vermelho";

  const fetchMetas = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMetas();
      if (res.success && res.data) {
        const loadedMetas = res.data.map((m: Meta) => ({
          ...m,
          justificativa: m.observacao || m.justificativa,
          status: calcularStatus(Number(m.realizado), Number(m.meta))
        }));
        setMetas(loadedMetas);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetas(); }, [fetchMetas]);

  const onSubmit = async (data: Meta) => {
    try {
      data.meta = Number(data.meta);
      data.realizado = Number(data.realizado);
      data.status = calcularStatus(data.realizado, data.meta);
      const res = await createMeta(data);
      if (res.success) {
        reset();
        fetchMetas();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRow = (id: number | undefined) => {
    if (!id) return;
    setConfirmModal({ isOpen: true, idToDelete: id });
  };

  const executeDeleteRow = async () => {
    const id = confirmModal.idToDelete;
    setConfirmModal({ isOpen: false });
    if (!id) return;
    try {
      const res = await deleteMeta(id);
      if (res.success) { fetchMetas(); }
    } catch (e) { console.error(e); }
  };

  const filteredMetas = useMemo(() => {
    return metas.filter((m) => {
      const matchAnalista = filtroAnalista === "Todos" || m.analista === filtroAnalista;
      const matchMesAno = filtroMesAno === "Todos" || m.mesAno === filtroMesAno;
      const matchSemana = filtroSemana === "Todas" || m.semana === filtroSemana;
      return matchAnalista && matchSemana && matchMesAno;
    });
  }, [metas, filtroAnalista, filtroSemana, filtroMesAno]);

  const stats = useMemo(() => {
    const total = filteredMetas.length;
    let sumMeta = 0, sumRealizado = 0, countVermelho = 0;
    filteredMetas.forEach(m => {
      sumMeta += Number(m.meta);
      sumRealizado += Number(m.realizado);
      if (m.status === "Vermelho") countVermelho++;
    });
    const percent = sumMeta > 0 ? Math.min(100, Math.round((sumRealizado / sumMeta) * 100)) : (total > 0 ? 100 : 0);
    return { total, percent, countVermelho };
  }, [filteredMetas]);

  const barChartData = useMemo(() => {
    const analistas = ["Cauã", "Mariana", "Carlos"];
    const verde   = analistas.map(a => filteredMetas.filter(m => m.analista === a && m.status === "Verde").length);
    const amarelo = analistas.map(a => filteredMetas.filter(m => m.analista === a && m.status === "Amarelo").length);
    const vermelho = analistas.map(a => filteredMetas.filter(m => m.analista === a && m.status === "Vermelho").length);
    return {
      labels: analistas,
      datasets: [
        { label: "Atingido",      data: verde,   backgroundColor: "#10b981", borderRadius: 4 },
        { label: "Parcial",       data: amarelo,  backgroundColor: "#f59e0b", borderRadius: 4 },
        { label: "Não Atingido",  data: vermelho, backgroundColor: "#ef4444", borderRadius: 4 },
      ]
    };
  }, [filteredMetas]);

  const donutData = useMemo(() => {
    const verde   = filteredMetas.filter(m => m.status === "Verde").length;
    const amarelo = filteredMetas.filter(m => m.status === "Amarelo").length;
    const vermelho = filteredMetas.filter(m => m.status === "Vermelho").length;
    return {
      labels: ["Verde (Atingido)", "Amarelo (Parcial)", "Vermelho (Não Atingido)"],
      datasets: [{ data: [verde, amarelo, vermelho], backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], borderWidth: 0 }]
    };
  }, [filteredMetas]);

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-slate-900";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Gestão de Metas do Time</h1>
            <p className="text-xs text-slate-500 mt-0.5">Acompanhamento gerencial · Responsável: Talita</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
            Sistema Standalone
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto p-6 space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Formulário */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Lançamento de Atividade</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Analista</label>
                <select {...register("analista", { required: true })} className={inputClass}>
                  <option value="">Selecione...</option>
                  <option value="Cauã">Cauã</option>
                  <option value="Mariana">Mariana</option>
                  <option value="Carlos">Carlos</option>
                </select>
                {errors.analista && <span className="text-xs text-red-500">Obrigatório</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mês/Ano</label>
                  <select {...register("mesAno", { required: true })} className={inputClass}>
                    <option value="">Selecione...</option>
                    {["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"].map(m => (
                      <option key={m} value={`${m}/2026`}>{m}/2026</option>
                    ))}
                  </select>
                  {errors.mesAno && <span className="text-xs text-red-500">Obrigatório</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semana</label>
                  <select {...register("semana", { required: true })} className={inputClass}>
                    <option value="">Selecione...</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                  </select>
                  {errors.semana && <span className="text-xs text-red-500">Obrigatório</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Atividade</label>
                <input type="text" placeholder="Ex: Atualização de Relatórios..." {...register("atividade", { required: true })} className={inputClass} />
                {errors.atividade && <span className="text-xs text-red-500">Obrigatório</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta</label>
                  <input type="number" placeholder="0" {...register("meta", { required: true, min: 0 })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Realizado</label>
                  <input type="number" placeholder="0" {...register("realizado", { required: true, min: 0 })} className={inputClass} />
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between text-sm font-medium ${
                currentStatus === "Verde"   ? "bg-green-50  border-green-200  text-green-700"  :
                currentStatus === "Amarelo" ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                                              "bg-red-50    border-red-200    text-red-700"
              }`}>
                <span>Status Estimado:</span>
                <span className="flex items-center gap-1">
                  {currentStatus === "Verde"   && <CheckCircle    className="w-4 h-4" />}
                  {currentStatus === "Amarelo" && <AlertTriangle  className="w-4 h-4" />}
                  {currentStatus === "Vermelho" && <XCircle       className="w-4 h-4" />}
                  {currentStatus}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observação/Justificativa {isJustificativaRequired && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={3}
                  {...register("justificativa", { required: isJustificativaRequired })}
                  placeholder={isJustificativaRequired ? "Por que a meta não foi totalmente atingida?" : "Opcional"}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none text-slate-900 ${errors.justificativa ? "border-red-500" : "border-slate-200"}`}
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Salvar Atividade
              </button>
            </form>
          </div>

          {/* Dashboard */}
          <div className="lg:col-span-2 space-y-6">

            {/* Filtros */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 text-slate-500">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              {[
                { value: filtroAnalista, onChange: setFiltroAnalista, options: [["Todos","Todos Analistas"],["Cauã","Cauã"],["Mariana","Mariana"],["Carlos","Carlos"]] },
                { value: filtroMesAno,   onChange: setFiltroMesAno,   options: [["Todos","Todos os Meses"],...["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"].map(m => [`${m}/2026`,`${m}/2026`])] },
                { value: filtroSemana,   onChange: setFiltroSemana,   options: [["Todas","Todas Semanas"],["S1","S1"],["S2","S2"],["S3","S3"],["S4","S4"]] },
              ].map((sel, i) => (
                <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none text-slate-900 min-w-[140px]">
                  {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2 flex justify-between items-center">
                  Total de Atividades
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-5 h-5"/></div>
                </div>
                <div className="text-3xl font-bold text-slate-900">{loading ? "…" : stats.total}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2 flex justify-between items-center">
                  Atingimento Geral
                  <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Target className="w-5 h-5"/></div>
                </div>
                <div className="text-3xl font-bold text-green-600">{loading ? "…" : `${stats.percent}%`}</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${stats.percent}%` }} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                <div className="text-sm font-semibold text-slate-500 mb-2 flex justify-between items-center">
                  Alerta Vermelho
                  <div className="p-2 bg-red-50 text-red-500 rounded-xl"><AlertTriangle className="w-5 h-5"/></div>
                </div>
                <div className="text-3xl font-bold text-red-500">{loading ? "…" : stats.countVermelho}</div>
                <div className="text-xs text-slate-400 mt-2 font-medium">atividades zeradas</div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Atividades por Analista</h3>
                <div className="h-[250px] flex items-center justify-center">
                  {stats.total > 0 ? (
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, border: { display: false } } }, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 6 } } } }} />
                  ) : <span className="text-slate-400 text-sm">Sem dados</span>}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Distribuição de Status</h3>
                <div className="h-[250px] flex items-center justify-center">
                  {stats.total > 0 ? (
                    <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: "70%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 6 } } } }} />
                  ) : <span className="text-slate-400 text-sm">Sem dados</span>}
                </div>
              </div>
            </div>

            {/* Tabela */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Detalhamento das Atividades</h3>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto hide-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                    <tr>
                      {["Status","Analista","Mês/Ano","Semana","Atividade","M / R","Justificativa","Ações"].map(h => (
                        <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase ${h === "M / R" || h === "Ações" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMetas.length > 0 ? filteredMetas.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50 text-sm">
                        <td className="px-4 py-3">
                          <div className={`inline-flex p-1.5 rounded-full ${
                            item.status === "Verde"   ? "bg-green-100  text-green-600"  :
                            item.status === "Amarelo" ? "bg-yellow-100 text-yellow-600" :
                                                        "bg-red-100    text-red-600"
                          }`}>
                            {item.status === "Verde"   && <CheckCircle   className="w-4 h-4" />}
                            {item.status === "Amarelo" && <AlertTriangle className="w-4 h-4" />}
                            {item.status === "Vermelho" && <XCircle      className="w-4 h-4" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.analista}</td>
                        <td className="px-4 py-3 text-slate-600">{item.mesAno || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{item.semana}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={item.atividade}>{item.atividade}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-600">{item.meta} / {item.realizado}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs max-w-[250px] truncate" title={item.justificativa}>{item.justificativa || "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDeleteRow(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                          {loading ? "Carregando..." : "Nenhuma atividade encontrada"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Excluir atividade?</h3>
              <p className="text-slate-500 text-sm">Tem certeza que deseja excluir este registro permanentemente? Esta ação não poderá ser desfeita.</p>
              <div className="flex gap-3 w-full mt-4">
                <button onClick={() => setConfirmModal({ isOpen: false })} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">
                  Cancelar
                </button>
                <button onClick={executeDeleteRow} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors">
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
