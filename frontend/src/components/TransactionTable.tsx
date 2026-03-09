import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  date: string;
  id: string;
  company: string;
  type: "Crédito" | "Débito";
  amount: string;
  status: "Aprovado" | "Estornado";
}

const transactions: Transaction[] = [
  { date: "08/03/2026", id: "TXN-90281", company: "Tech Solutions Ltda", type: "Crédito", amount: "R$ 1.200,00", status: "Aprovado" },
  { date: "08/03/2026", id: "TXN-90282", company: "Distribuidora Norte", type: "Débito", amount: "R$ 450,00", status: "Aprovado" },
  { date: "08/03/2026", id: "TXN-90283", company: "Loja Central ME", type: "Crédito", amount: "R$ 2.000,00", status: "Estornado" },
  { date: "07/03/2026", id: "TXN-90270", company: "Fornecedor ABC", type: "Débito", amount: "R$ 1.000,00", status: "Aprovado" },
  { date: "07/03/2026", id: "TXN-90265", company: "Mega Atacado S.A.", type: "Crédito", amount: "R$ 800,00", status: "Aprovado" },
  { date: "06/03/2026", id: "TXN-90250", company: "Papelaria Express", type: "Débito", amount: "R$ 320,00", status: "Estornado" },
  { date: "06/03/2026", id: "TXN-90248", company: "Global Importações", type: "Crédito", amount: "R$ 5.600,00", status: "Aprovado" },
];

export function TransactionTable() {
  const handleReverse = (id: string) => {
    toast.info(`Estorno solicitado para ${id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Últimas Transações</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">ID Transação</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Data</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Valor</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/60">
              <TableCell>
                <div className="text-sm font-medium text-foreground">{tx.id}</div>
                <div className="text-xs text-muted-foreground">{tx.company}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
              <TableCell className="text-sm text-foreground">{tx.type}</TableCell>
              <TableCell className="text-sm font-medium text-foreground">{tx.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={tx.status === "Aprovado" ? "success" : "destructive"}
                  className="rounded-full text-[11px] font-medium normal-case tracking-normal"
                >
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
                  onClick={() => handleReverse(tx.id)}
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Estornar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
