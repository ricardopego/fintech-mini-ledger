// Simple in-memory store with React state sync
export interface Terminal {
  id: string;
  name: string;
  fee: number; // percentage
}

export interface Transaction {
  id: string;
  date: string;
  type: "entrada" | "saida";
  description: string;
  grossAmount: number;
  fee: number;
  netAmount: number;
  terminalId?: string;
  terminalName?: string;
}

// Default terminals
const defaultTerminals: Terminal[] = [
  { id: "t1", name: "PagBank", fee: 3.49 },
  { id: "t2", name: "Stone", fee: 2.99 },
  { id: "t3", name: "PIX", fee: 0 },
];

// Default transactions
const defaultTransactions: Transaction[] = [
  { id: "TXN-001", date: "10/03/2026", type: "entrada", description: "Venda - PagBank", grossAmount: 1200, fee: 41.88, netAmount: 1158.12, terminalId: "t1", terminalName: "PagBank" },
  { id: "TXN-002", date: "10/03/2026", type: "saida", description: "Compra de estoque", grossAmount: 450, fee: 0, netAmount: 450 },
  { id: "TXN-003", date: "09/03/2026", type: "entrada", description: "Venda - Stone", grossAmount: 2000, fee: 59.80, netAmount: 1940.20, terminalId: "t2", terminalName: "Stone" },
  { id: "TXN-004", date: "09/03/2026", type: "entrada", description: "Venda - PIX", grossAmount: 800, fee: 0, netAmount: 800, terminalId: "t3", terminalName: "PIX" },
  { id: "TXN-005", date: "08/03/2026", type: "saida", description: "Conta de luz", grossAmount: 320, fee: 0, netAmount: 320 },
  { id: "TXN-006", date: "08/03/2026", type: "entrada", description: "Venda - PagBank", grossAmount: 5600, fee: 195.44, netAmount: 5404.56, terminalId: "t1", terminalName: "PagBank" },
  { id: "TXN-007", date: "07/03/2026", type: "saida", description: "Aluguel do ponto", grossAmount: 1500, fee: 0, netAmount: 1500 },
];

let _terminals = [...defaultTerminals];
let _transactions = [...defaultTransactions];
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

export function getTerminals() {
  return _terminals;
}

export function getTransactions() {
  return _transactions;
}

export function addTerminal(name: string, fee: number) {
  const id = `t${Date.now()}`;
  _terminals = [..._terminals, { id, name, fee }];
  notify();
  return id;
}

export function removeTerminal(id: string) {
  _terminals = _terminals.filter((t) => t.id !== id);
  notify();
}

export function addTransaction(tx: Omit<Transaction, "id">) {
  const id = `TXN-${String(_transactions.length + 1).padStart(3, "0")}-${Date.now()}`;
  _transactions = [{ ...tx, id }, ..._transactions];
  notify();
}

export interface Summary {
  totalGross: number;
  totalFees: number;
  totalExits: number;
  balance: number;
}

export function getSummary(): Summary {
  const entries = _transactions.filter((t) => t.type === "entrada");
  const exits = _transactions.filter((t) => t.type === "saida");

  const totalGross = entries.reduce((s, t) => s + t.grossAmount, 0);
  const totalFees = entries.reduce((s, t) => s + t.fee, 0);
  const totalExits = exits.reduce((s, t) => s + t.netAmount, 0);
  const balance = entries.reduce((s, t) => s + t.netAmount, 0) - totalExits;

  return { totalGross, totalFees, totalExits, balance };
}
