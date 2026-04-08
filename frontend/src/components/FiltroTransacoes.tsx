import React, { useState, useMemo } from 'react';

// --- TIPAGENS (TypeScript) ---
export interface Transacao {
  id: number;
  descricao: string;
  tipo: 'entrada' | 'saida' | '';
  valor: string;
  maquininha: string;
}

export interface Filtros {
  tipo: 'entrada' | 'saida' | '';
  valor: string;
  maquininha: string;
}

// --- DADOS DE TESTE ---
const DADOS_TESTE: Transacao[] = [
  { id: 1, descricao: 'Venda Camiseta', tipo: 'entrada', valor: '150', maquininha: 'Stone' },
  { id: 2, descricao: 'Pagamento Internet', tipo: 'saida', valor: '150', maquininha: '-' },
  { id: 3, descricao: 'Venda Tênis', tipo: 'entrada', valor: '300', maquininha: 'Cielo' },
  { id: 4, descricao: 'Venda Boné', tipo: 'entrada', valor: '50', maquininha: 'Stone' },
  { id: 5, descricao: 'Compra Fornecedor', tipo: 'saida', valor: '800', maquininha: '-' },
];

export default function FiltroTransacoes() {
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  // Estado Oficial
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({
    tipo: '',
    valor: '',
    maquininha: ''
  });

  // Estado Temporário (Modal)
  const [filtrosModal, setFiltrosModal] = useState<Filtros>({
    tipo: '',
    valor: '',
    maquininha: ''
  });

  const abrirModal = () => {
    setFiltrosModal(filtrosAplicados);
    setModalAberto(true);
  };

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtrosModal);
    setModalAberto(false);
  };

  // Usamos keyof Filtros para o TypeScript saber que só podemos passar 'tipo', 'valor' ou 'maquininha'
  const removerFiltro = (chaveDoFiltro: keyof Filtros) => {
    setFiltrosAplicados(estadoAnterior => ({
      ...estadoAnterior,
      [chaveDoFiltro]: ''
    }));
  };

  const transacoesFiltradas = useMemo(() => {
    return DADOS_TESTE.filter(transacao => {
      if (filtrosAplicados.tipo && transacao.tipo !== filtrosAplicados.tipo) return false;
      if (filtrosAplicados.valor && transacao.valor !== filtrosAplicados.valor) return false;
      if (filtrosAplicados.maquininha && !transacao.maquininha.toLowerCase().includes(filtrosAplicados.maquininha.toLowerCase())) return false;
      return true;
    });
  }, [filtrosAplicados]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Meu Extrato</h2>
        <button 
          onClick={abrirModal}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          ⚙️ Filtrar
        </button>
      </div>

      {/* CHIPS (Filtros Ativos) */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
        {filtrosAplicados.tipo && (
          <div className="chip">
            Tipo: <strong>{filtrosAplicados.tipo}</strong>
            <span className="chip-close" onClick={() => removerFiltro('tipo')}>X</span>
          </div>
        )}
        {filtrosAplicados.valor && (
          <div className="chip">
            Valor: <strong>R$ {filtrosAplicados.valor}</strong>
            <span className="chip-close" onClick={() => removerFiltro('valor')}>X</span>
          </div>
        )}
        {filtrosAplicados.maquininha && (
          <div className="chip">
            Maquininha: <strong>{filtrosAplicados.maquininha}</strong>
            <span className="chip-close" onClick={() => removerFiltro('maquininha')}>X</span>
          </div>
        )}
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

      {/* LISTA */}
      <div>
        {transacoesFiltradas.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Descrição</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Tipo</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Maquininha</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map(t => (
                <tr key={t.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.descricao}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {t.tipo === 'entrada' ? '🟢 Entrada' : '🔴 Saída'}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.maquininha}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>R$ {t.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0 }}>Filtros</h3>

            <div style={{ marginBottom: '15px' }}>
              <label>Tipo:</label>
              <select 
                value={filtrosModal.tipo} 
                onChange={(e) => setFiltrosModal({...filtrosModal, tipo: e.target.value as 'entrada' | 'saida' | ''})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Valor exato (R$):</label>
              <input 
                type="number" 
                value={filtrosModal.valor}
                onChange={(e) => setFiltrosModal({...filtrosModal, valor: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>Maquininha:</label>
              <input 
                type="text" 
                value={filtrosModal.maquininha}
                onChange={(e) => setFiltrosModal({...filtrosModal, maquininha: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalAberto(false)} style={{ padding: '8px 16px' }}>Cancelar</button>
              <button onClick={aplicarFiltros} style={{ padding: '8px 16px', backgroundColor: '#28A745', color: 'white', border: 'none' }}>Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS TEMPORÁRIOS */}
      <style>{`
        .chip { display: inline-flex; align-items: center; background-color: #e0e0e0; padding: 6px 12px; border-radius: 16px; font-size: 14px; }
        .chip-close { margin-left: 8px; background-color: #bbb; color: white; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px; cursor: pointer; }
        .chip-close:hover { background-color: #f44336; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999; }
        .modal-content { background-color: white; padding: 20px; border-radius: 8px; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}