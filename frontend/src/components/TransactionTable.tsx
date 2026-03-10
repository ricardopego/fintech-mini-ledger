import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useTransactions } from "@/hooks/useStore";

function fmt(v: number) {
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function TransactionTable() {
  const transactions = useTransactions();

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Extrato de Movimentações</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Descrição</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Data</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Valor Bruto</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Taxa</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Valor Líquido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isEntry = tx.type === "entrada";
            return (
              <TableRow key={tx.id} className="hover:bg-muted/60">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${isEntry ? "bg-success/10" : "bg-destructive/10"}`}>
                      {isEntry ? (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </div>
                    <Badge
                      variant={isEntry ? "success" : "destructive"}
                      className="rounded-full text-[11px] font-medium normal-case tracking-normal"
                    >
                      {isEntry ? "Entrada" : "Saída"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">{tx.description}</div>
                  <div className="text-xs text-muted-foreground">{tx.id}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                <TableCell className={`text-sm font-medium ${isEntry ? "text-success" : "text-destructive"}`}>
                  {isEntry ? "+" : "-"}{fmt(tx.grossAmount)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {tx.fee > 0 ? `-${fmt(tx.fee)}` : "—"}
                </TableCell>
                <TableCell className={`text-sm font-semibold ${isEntry ? "text-success" : "text-destructive"}`}>
                  {isEntry ? "+" : "-"}{fmt(tx.netAmount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
