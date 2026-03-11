import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

const fmt = (v: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function TransactionTable({ transactions }: { transactions: any[] }) {
  const filteredList = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 bg-white">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Extrato de Movimentações</h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-[10px] font-black text-gray-400 uppercase">Tipo</TableHead>
              <TableHead className="text-[10px] font-black text-gray-400 uppercase">Descrição</TableHead>
              <TableHead className="text-[10px] font-black text-gray-400 uppercase">Data</TableHead>
              <TableHead className="text-right text-[10px] font-black text-gray-400 uppercase">Líquido</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredList.map((tx) => {
              const isEntrada = tx.amount > 0;
              const fee = tx.terminal ? (tx.amount * tx.terminal.feePercentage) / 100 : 0;
              const dateObj = new Date(tx.createdAt);

              return (
                <TableRow key={tx.id} className="h-[75px]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isEntrada ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isEntrada ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <Badge className={`rounded-full px-2 py-0 text-[9px] font-bold border-none ${isEntrada ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 leading-tight">
                        {isEntrada 
                          ? (tx.terminal ? `Venda - ${tx.terminal.name}` : (tx.description || "Venda Direta"))
                          : (tx.description || "Saída s/ Descrição")
                        }
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono tracking-tighter uppercase">
                        TXN-{tx.id.toString().substring(0,8)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-gray-500 font-bold">
                    {dateObj.toLocaleDateString("pt-BR")} {dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  
                  <TableCell className={`text-right text-sm font-black ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                    {fmt(tx.amount - fee)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}