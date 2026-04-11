import { useEffect, useState, useMemo, type ChangeEvent } from "react";
import { api } from "@/lib/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { TransactionTable } from "@/components/TransactionTable";
import { Filter, X, Trash2, FileSpreadsheet, FileText, History, Download } from "lucide-react"; 

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Transaction = {
  id: string | number;
  createdAt: string; 
  amount?: number;
  description?: string;
  terminal?: {
    name?: string;
    feePercentage?: number;
  } | null;
};

// --- NOVO TIPO: LOG DE EXPORTAÇÃO ---
type ExportLog = {
  id: number;
  format: string;
  filtersUsed: string;
  recordsCount: number;
  exportedAt: string;
};

type Filtros = {
  tipo: "entrada" | "saida" | "";
  valor: string;
  terminal: string;
  dataInicial: string;
  dataFinal: string;
};

const Extrato = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // --- ESTADOS DO HISTÓRICO DE EXPORTAÇÃO ---
  const [logs, setLogs] = useState<ExportLog[]>([]);
  const [modalLogsAberto, setModalLogsAberto] = useState(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [logSelecionado, setLogSelecionado] = useState<ExportLog | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({
    tipo: "",
    valor: "",
    terminal: "",
    dataInicial: "",
    dataFinal: "",
  });

  const [filtrosModal, setFiltrosModal] = useState<Filtros>({
    tipo: "",
    valor: "",
    terminal: "",
    dataInicial: "",
    dataFinal: "",
  });

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/api/transactions");
      const newTransactions = Array.isArray(response.data) ? response.data : [];
      setTransactions(newTransactions);
      localStorage.setItem("cache_transactions", JSON.stringify(newTransactions));
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      console.error("Backend Offline. Utilizando dados do cache local.");
    }
  };

  // --- NOVA FUNÇÃO: BUSCAR LOGS DO BANCO ---
  const fetchLogs = async () => {
    try {
      const response = await api.get("/api/exports");
      // Ordena de forma decrescente (mais recentes primeiro)
      const ordenados = response.data.sort((a: ExportLog, b: ExportLog) => b.id - a.id);
      setLogs(ordenados);
    } catch (error) {
      console.error("Erro ao buscar logs de exportação:", error);
    }
  };

  useEffect(() => {
    const cachedTransactions = localStorage.getItem("cache_transactions");
    if (cachedTransactions) {
      setTransactions(JSON.parse(cachedTransactions));
    }
    fetchTransactions();
  }, []);

  const registrarLogExportacao = async (formato: string, totalRegistros: number) => {
    try {
      const filtrosDesc = [
        filtrosAplicados.tipo && `Tipo: ${filtrosAplicados.tipo}`,
        filtrosAplicados.valor && `Valor: ${filtrosAplicados.valor}`,
        filtrosAplicados.terminal && `Terminal: ${filtrosAplicados.terminal}`,
        filtrosAplicados.dataInicial && `Início: ${filtrosAplicados.dataInicial}`,
        filtrosAplicados.dataFinal && `Fim: ${filtrosAplicados.dataFinal}`
      ].filter(Boolean).join(", ") || "Nenhum filtro";

      await api.post("/api/exports", {
        format: formato,
        filtersUsed: filtrosDesc,
        recordsCount: totalRegistros
      });
      console.log("Log de exportação registrado com sucesso.");
      fetchLogs(); // Atualiza a lista na memória após registrar um novo
    } catch (error) {
      console.error("Erro ao registrar log de exportação:", error);
    }
  };

  // --- NOVA FUNÇÃO: FORMATAR DATA E HORA DO LOG (AGORA COM SEGUNDOS) ---
  const formatarDataHoraLog = (dataIso: string) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');
    return `${dataFormatada} às ${horas}:${minutos}:${segundos}`;
  };

  const abrirModal = () => {
    setFiltrosModal(filtrosAplicados);
    setModalAberto(true);
  };

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtrosModal);
    setModalAberto(false);
  };

  const removerFiltro = (chave: keyof Filtros) => {
    setFiltrosAplicados((prev) => ({ ...prev, [chave]: "" }));
    setFiltrosModal((prev) => ({ ...prev, [chave]: "" }));
  };

  const limparTodosFiltros = () => {
    const estadoVazio: Filtros = {
      tipo: "",
      valor: "",
      terminal: "",
      dataInicial: "",
      dataFinal: "",
    };
    setFiltrosAplicados(estadoVazio);
    setFiltrosModal(estadoVazio);
  };

  const temFiltroAtivo = useMemo(() => {
    return Object.values(filtrosAplicados).some(valor => valor !== "");
  }, [filtrosAplicados]);

  const formatarDataBR = (dataIso: string) => {
    if (!dataIso) return "";
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleValorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value === "") {
      setFiltrosModal({ ...filtrosModal, valor: "" });
      return;
    }
    const numericValue = Number(value) / 100;
    const formattedValue = numericValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setFiltrosModal({ ...filtrosModal, valor: formattedValue });
  };

  const transacoesFiltradas = useMemo(() => {
    return transactions.filter((t) => {
      if (filtrosAplicados.tipo === "entrada" && (t.amount || 0) < 0) return false;
      if (filtrosAplicados.tipo === "saida" && (t.amount || 0) >= 0) return false;

      if (filtrosAplicados.valor) {
        const valorNumericoFiltro = Number(filtrosAplicados.valor.replace(/\./g, "").replace(",", "."));
        if (Math.abs(t.amount || 0) !== valorNumericoFiltro) return false;
      }

      if (filtrosAplicados.terminal) {
        const nomeTerminal = t.terminal?.name?.toLowerCase() || "";
        if (!nomeTerminal.includes(filtrosAplicados.terminal.toLowerCase())) return false;
      }

      const dataTransacao = t.createdAt ? t.createdAt.split("T")[0] : "";
      if (filtrosAplicados.dataInicial && dataTransacao < filtrosAplicados.dataInicial) return false;
      if (filtrosAplicados.dataFinal && dataTransacao > filtrosAplicados.dataFinal) return false;

      return true;
    });
  }, [transactions, filtrosAplicados]);

  const exportarCSV = () => {
    if (transacoesFiltradas.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    const cabecalhos = ["Data", "Descrição", "Tipo", "Máquina", "Valor (R$)"];
    const linhas = transacoesFiltradas.map((t) => {
      const data = t.createdAt ? formatarDataBR(t.createdAt.split("T")[0]) : "-";
      const descricao = t.description ? t.description.replace(/;/g, ",") : "-"; 
      const tipo = (t.amount || 0) >= 0 ? "Entrada" : "Saída";
      const maquina = t.terminal?.name || "-";
      const valor = t.amount ? t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00";
      return `${data};${descricao};${tipo};${maquina};${valor}`;
    });

    const conteudoCSV = [cabecalhos.join(";"), ...linhas].join("\n");
    const blob = new Blob(["\uFEFF" + conteudoCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `extrato_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    registrarLogExportacao("CSV", transacoesFiltradas.length);
  };

  const exportarPDF = () => {
    if (transacoesFiltradas.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Extrato de Transações", 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

    const cabecalhos = [["Data", "Descrição", "Tipo", "Máquina", "Valor (R$)"]];
    const linhas = transacoesFiltradas.map((t) => [
      t.createdAt ? formatarDataBR(t.createdAt.split("T")[0]) : "-",
      t.description || "-",
      (t.amount || 0) >= 0 ? "Entrada" : "Saída",
      t.terminal?.name || "-",
      t.amount ? `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ 0,00"
    ]);

    autoTable(doc, {
      head: cabecalhos,
      body: linhas,
      startY: 35,
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255] },
    });

    doc.save(`extrato_${new Date().toISOString().split("T")[0]}.pdf`);

    registrarLogExportacao("PDF", transacoesFiltradas.length);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Topbar isOnline={isOnline} />
          
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Extrato</h1>
              <div className="flex flex-wrap gap-2">
                {temFiltroAtivo && (
                  <button onClick={limparTodosFiltros} className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Limpar
                  </button>
                )}
                <button onClick={exportarCSV} title="Baixar para Excel" className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-green-600 dark:text-green-400">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </button>
                <button onClick={exportarPDF} title="Baixar PDF para impressão" className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-red-600 dark:text-red-400">
                  <FileText className="h-4 w-4" />
                  PDF
                </button>
                <button onClick={abrirModal} className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filtrosAplicados.dataInicial && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>Desde: {formatarDataBR(filtrosAplicados.dataInicial)}</span>
                  <button onClick={() => removerFiltro("dataInicial")} className="hover:bg-muted/50 rounded-full p-0.5 transition-colors"><X className="h-3 w-3" /></button>
                </div>
              )}
              {filtrosAplicados.dataFinal && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>Até: {formatarDataBR(filtrosAplicados.dataFinal)}</span>
                  <button onClick={() => removerFiltro("dataFinal")} className="hover:bg-muted/50 rounded-full p-0.5 transition-colors"><X className="h-3 w-3" /></button>
                </div>
              )}
              {filtrosAplicados.tipo && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>Tipo: {filtrosAplicados.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                  <button onClick={() => removerFiltro("tipo")} className="hover:bg-muted/50 rounded-full p-0.5 transition-colors"><X className="h-3 w-3" /></button>
                </div>
              )}
              {filtrosAplicados.valor && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>Valor: R$ {filtrosAplicados.valor}</span>
                  <button onClick={() => removerFiltro("valor")} className="hover:bg-muted/50 rounded-full p-0.5 transition-colors"><X className="h-3 w-3" /></button>
                </div>
              )}
              {filtrosAplicados.terminal && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>Máquina: {filtrosAplicados.terminal}</span>
                  <button onClick={() => removerFiltro("terminal")} className="hover:bg-muted/50 rounded-full p-0.5 transition-colors"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
              <TransactionTable transactions={transacoesFiltradas} />
              {transacoesFiltradas.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma transação encontrada com os filtros atuais.
                </div>
              )}
            </div>

            {/* --- NOVO: BOTÃO DE HISTÓRICO EMBAIXO DA TABELA --- */}
            <div className="flex justify-center pt-2 pb-6">
              <button 
                onClick={() => { fetchLogs(); setModalLogsAberto(true); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                <History size={16} />
                Ver Histórico de Exportações
              </button>
            </div>

          </main>
        </div>
      </div>

      {/* --- MODAL 1: LISTA DE HISTÓRICO --- */}
      {modalLogsAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-3xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <History className="text-primary" /> Histórico de Exportações
              </h3>
              <button onClick={() => setModalLogsAberto(false)} className="text-muted-foreground hover:text-foreground">
                <X />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground sticky top-0">
                  <tr>
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Formato</th>
                    <th className="p-3 font-medium">Filtros Utilizados</th>
                    <th className="p-3 font-medium text-center">Registros</th>
                    <th className="p-3 font-medium text-right">Data e Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhuma exportação registrada ainda.</td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr 
                        key={log.id} 
                        onClick={() => { setLogSelecionado(log); setModalConfirmacaoAberto(true); }}
                        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-mono text-xs text-muted-foreground">#{log.id}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${log.format === 'PDF' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {log.format}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-foreground max-w-xs truncate" title={log.filtersUsed}>
                          {log.filtersUsed}
                        </td>
                        <td className="p-3 text-center">{log.recordsCount}</td>
                        <td className="p-3 text-right text-xs text-muted-foreground">{formatarDataHoraLog(log.exportedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CONFIRMAÇÃO DE RE-DOWNLOAD --- */}
      {modalConfirmacaoAberto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl p-6 w-80 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-center text-primary">
              <div className="p-3 bg-primary/10 rounded-full">
                <Download size={32} />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-foreground">Deseja baixar novamente?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Formato: {logSelecionado?.format} <br/>
                {logSelecionado?.recordsCount} registros
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setModalConfirmacaoAberto(false)}
                className="flex-1 px-4 py-2 border border-input bg-background rounded-md hover:bg-accent text-foreground transition-colors"
              >
                Não
              </button>
              <button 
                onClick={() => {
                   if (logSelecionado?.format === 'PDF') {
                     exportarPDF();
                   } else {
                     exportarCSV();
                   }
                   setModalConfirmacaoAberto(false);
                }}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL ORIGINAL DE FILTROS --- */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Configurar Filtros</h3>
              <button onClick={() => setModalAberto(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-foreground">Data Inicial</label>
                  <input type="date" value={filtrosModal.dataInicial} onChange={(e) => setFiltrosModal({ ...filtrosModal, dataInicial: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-foreground">Data Final</label>
                  <input type="date" value={filtrosModal.dataFinal} onChange={(e) => setFiltrosModal({ ...filtrosModal, dataFinal: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground">Tipo de Transação</label>
                <select value={filtrosModal.tipo} onChange={(e) => setFiltrosModal({ ...filtrosModal, tipo: e.target.value as Filtros["tipo"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                  <option value="">Todos os tipos</option>
                  <option value="entrada">Entradas (Positivas)</option>
                  <option value="saida">Saídas (Negativas)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground">Valor exato (R$)</label>
                <input type="text" placeholder="0,00" value={filtrosModal.valor} onChange={handleValorChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground">Maquininha (Terminal)</label>
                <input type="text" placeholder="Ex: Stone, Cielo..." value={filtrosModal.terminal} onChange={(e) => setFiltrosModal({ ...filtrosModal, terminal: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalAberto(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4">Cancelar</button>
              <button onClick={aplicarFiltros} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4">Aplicar Filtros</button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default Extrato;