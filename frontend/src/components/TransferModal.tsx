import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useTerminals } from "@/hooks/useStore";
import { addTransaction } from "@/lib/store";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const terminals = useTerminals();
  const [terminalId, setTerminalId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalId || !amount) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const terminal = terminals.find((t) => t.id === terminalId);
    if (!terminal) return;

    const gross = parseFloat(amount);
    const fee = gross * (terminal.fee / 100);
    const net = gross - fee;
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    addTransaction({
      date,
      type: "entrada",
      description: `Venda - ${terminal.name}`,
      grossAmount: gross,
      fee,
      netAmount: net,
      terminalId: terminal.id,
      terminalName: terminal.name,
    });

    toast.success(`Venda de R$ ${gross.toFixed(2)} registrada via ${terminal.name}. Taxa: R$ ${fee.toFixed(2)}`);
    setTerminalId("");
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Nova Venda</DialogTitle>
          <DialogDescription>Registre uma venda e a taxa será calculada automaticamente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Terminal</Label>
            <Select value={terminalId} onValueChange={setTerminalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o terminal" />
              </SelectTrigger>
              <SelectContent>
                {terminals.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.fee.toFixed(2)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="saleAmount" className="text-sm font-medium">Valor Bruto (R$)</Label>
            <Input
              id="saleAmount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-success hover:bg-success/90 text-success-foreground">
              Confirmar Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
