import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id_produto: string;
  nome_produto: string;
  preco_produto: number;
  link_venda: string;
  pagina_venda_uuid: string;
  user_id: string;
}

export const ProdutosCriados: React.FC = () => {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      // Debug: verificar dados do usuário
      console.log('Usuário logado:', user);
      console.log('ID do usuário:', user.id);

      try {
        const url = `http://localhost:3001/api/products?user_id=${user.id}`;
        console.log('Fazendo requisição para:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Produtos recebidos:', data);
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError(`Erro ao buscar produtos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Produtos Criados</h2>
        <div className="text-center py-8">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Produtos Criados</h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Produtos Criados</h2>
      {produtos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto encontrado. Crie seu primeiro produto usando o Agente de Cadastro de Produtos!
        </div>
      ) : (
        <table className="w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-xs">ID Produto</th>
              <th className="p-2 text-left text-xs">Nome</th>
              <th className="p-2 text-left text-xs">Preço</th>
              <th className="p-2 text-left text-xs">Link de Venda</th>
              <th className="p-2 text-left text-xs">UUID Página</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id_produto} className="border-t">
                <td className="p-2 text-xs font-mono">{produto.id_produto}</td>
                <td className="p-2 text-xs">{produto.nome_produto.slice(0, 20)}</td>
                <td className="p-2 text-xs">R$ {produto.preco_produto.toFixed(2)}</td>
                <td className="p-2 text-xs">
                  <a href={produto.link_venda} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Ver página</a>
                </td>
                <td className="p-2 text-xs font-mono">{produto.pagina_venda_uuid || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
