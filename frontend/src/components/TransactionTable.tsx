import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

const fmt = (v: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function TransactionTable({ transactions = [] }: { transactions: any[] }) {
  // 1. GARANTE que é um array (evita o erro do filter)
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // 2. FILTRO DE LIMPEZA: Remove dados corrompidos, vazios ou sem ID antes de renderizar
  const validTransactions = safeTransactions.filter(tx => tx && tx.id && tx.createdAt);

  // 3. ORDENAÇÃO
  const sortedList = [...validTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Extrato de Movimentações</h3>
        </div>
      </div>

      {/* ADICIONADO: Wrapper de responsividade com overflow horizontal */}
      <div className="w-full overflow-x-auto">
        {/* ADICIONADO: Largura mínima para evitar que as colunas se esmaguem no mobile */}
        <div className="min-w-[800px]">
          <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <Table>
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black text-gray-400 uppercase">Tipo</TableHead>
                  <TableHead className="text-[10px] font-black text-gray-400 uppercase">Descrição / Máquina</TableHead>
                  <TableHead className="text-[10px] font-black text-gray-400 uppercase">Data</TableHead>
                  <TableHead className="text-[10px] font-black text-gray-400 uppercase">Horário</TableHead>
                  <TableHead className="text-right text-[10px] font-black text-gray-400 uppercase">Valor Bruto</TableHead>
                  <TableHead className="text-right text-[10px] font-black text-gray-400 uppercase">Líquido</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Nenhuma movimentação válida encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedList.map((tx) => {
                    const amount = tx.amount || 0;
                    const isEntrada = amount > 0;
                    const fee = tx.terminal ? (amount * tx.terminal.feePercentage) / 100 : 0;
                    const dateObj = new Date(tx.createdAt);
                    
                    const txIdStr = tx.id?.toString().substring(0, 8) || "ERROR";

                    return (
                      <TableRow key={tx.id} className="h-[75px] hover:bg-gray-50/50 transition-colors border-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isEntrada ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {isEntrada ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                            </div>
                            <Badge className={`rounded-full px-2 py-0 text-[9px] font-bold border-none shadow-none ${isEntrada ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700 leading-tight">
                              {isEntrada ? (
                                tx.terminal?.name ? `Venda - ${tx.terminal.name}` : (tx.description || "Venda Direta")
                              ) : (
                                tx.description || "Saída sem Descrição"
                              )}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono tracking-tighter uppercase">
                              TXN-{txIdStr}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-gray-500 font-bold">
                          {dateObj.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-xs text-gray-400 font-medium">
                          {dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>

                        <TableCell className={`text-right text-sm font-bold ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                          {isEntrada ? '+' : ''}{fmt(amount)}
                        </TableCell>

                        <TableCell className={`text-right text-sm font-black ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                          {fmt(amount - fee)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}