import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  terminals: any[];
  onSuccess: () => void; 
}

// 1. O "= []" garante um valor padrão caso não venha nada do componente pai
export function TransferModal({ open, onOpenChange, terminals = [], onSuccess }: TransferModalProps) {
  const [terminalId, setTerminalId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. TRAVA DE SEGURANÇA: Garante que é um array antes de tentar fazer o .map()
  const safeTerminals = Array.isArray(terminals) ? terminals : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminalId || !amount) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const valorNumerico = parseFloat(amount);
      
      // Encontra o nome da maquininha selecionada para salvar como descrição
      const terminalSelecionado = safeTerminals.find(t => t.id === terminalId);
      const descText = terminalSelecionado ? `Venda - ${terminalSelecionado.name}` : "Venda Direta";

      // 3. PAYLOAD CORRIGIDO: Enviando exatamente o que o Java espera (description, amount, terminalId)
      await axios.post("http://localhost:8080/api/transactions", {
        description: descText,
        amount: valorNumerico,
        terminalId: terminalId 
      });

      toast.success(`Venda de R$ ${valorNumerico.toFixed(2)} registrada com sucesso!`);
      
      setTerminalId("");
      setAmount("");
      onSuccess(); 
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
          <DialogTitle className="text-lg font-semibold">Nova Venda</DialogTitle>
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
                {/* 4. MAP SEGURO: Usando a variável blindada */}
                {safeTerminals.length === 0 ? (
                  <SelectItem value="none" disabled>Nenhuma maquininha encontrada</SelectItem>
                ) : (
                  safeTerminals.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} (Taxa: {t.feePercentage}%)
                    </SelectItem>
                  ))
                )}
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Salvando..." : "Confirmar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}