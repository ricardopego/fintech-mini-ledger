import { useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // <--- Importação da notificação adicionada aqui

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  terminals: any[];
  onSuccess: () => void;
}

export function TransferModal({ open, onOpenChange, terminals, onSuccess }: TransferModalProps) {
  const [amount, setAmount] = useState("");
  const [terminalId, setTerminalId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setAmount("");
      return;
    }
    const numericValue = Number(value) / 100;
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
    
    setAmount(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanAmount = Number(amount.replace(/\D/g, "")) / 100;

      // Encontra o nome da maquininha selecionada para usar como descrição
      const selectedTerminal = terminals.find((t) => t.id.toString() === terminalId);
      const terminalName = selectedTerminal ? selectedTerminal.name : "Venda via Maquininha";

      const payload = {
        amount: cleanAmount,
        description: terminalName, // Envia o nome da maquininha direto pro banco
        terminalId: terminalId,
        type: "INCOME" // Se o Java usar ENTRADA, troque aqui
      };

      await api.post("/api/transactions", payload);

      // <--- Notificação de sucesso adicionada aqui
      toast.success("Venda registrada!"); 

      setAmount("");
      setTerminalId("");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      // <--- Notificação de erro bonitona substituindo o alert()
      toast.error("Erro ao registrar venda no servidor."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nova Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* 1. Seleção da Maquininha */}
          <div className="space-y-2">
            <Label>Maquininha (Terminal)</Label>
            <Select value={terminalId} onValueChange={setTerminalId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o terminal" />
              </SelectTrigger>
              <SelectContent>
                {terminals.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Valor com teclado numérico */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={amount}
              onChange={handleAmountChange}
              required
              className="text-lg font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar Venda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}