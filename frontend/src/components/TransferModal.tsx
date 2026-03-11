import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios"; // Importamos o Axios para falar com o Java

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  terminals: any[];    // Recebemos a lista real do Index.tsx
  onSuccess: () => void; // Função para atualizar a lista após vender
}

export function TransferModal({ open, onOpenChange, terminals, onSuccess }: TransferModalProps) {
  const [terminalId, setTerminalId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminalId || !amount) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // ENVIANDO PARA O JAVA (localhost:8080)
      // O seu backend espera: { amount: Double, terminal: { id: UUID } }
      await axios.post("http://localhost:8080/api/transactions", {
        amount: parseFloat(amount),
        terminal: {
          id: terminalId
        }
      });

      toast.success(`Venda de R$ ${parseFloat(amount).toFixed(2)} registrada com sucesso!`);
      
      // Limpa os campos e fecha o modal
      setTerminalId("");
      setAmount("");
      onSuccess(); // Dispara o refresh dos dados no Dashboard
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erro ao registrar venda no Java:", error);
      toast.error("Erro ao salvar no banco de dados. O Java está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Nova Venda (Backend Java)</DialogTitle>
          <DialogDescription>
            Selecione uma maquininha e registre o valor da venda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Terminal / Maquininha</Label>
            <Select value={terminalId} onValueChange={setTerminalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o terminal do banco" />
              </SelectTrigger>
              <SelectContent>
                {terminals.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} (Taxa: {t.feePercentage}%)
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
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              {loading ? "Salvando..." : "Confirmar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}