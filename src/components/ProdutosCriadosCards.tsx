import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { fetchProducts, insertProduct, deleteProduct, updateProduct } from '../services/productsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Layout } from 'lucide-react';
import { AddProductDialog } from './AddProductDialog';
import { useNavigate } from 'react-router-dom';

export interface Product {
  id_produto: string;
  nome_produto: string;
  preco_produto: number;
  link_venda: string;
  pagina_venda_uuid: string;
}

export const ProdutosCriadosCards: React.FC<{ hidePageEditorButton?: boolean }> = ({ hidePageEditorButton = false }) => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Removido formulário inline, agora via modal

  const buscarProdutos = async (termo?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts(termo);
      setProdutos(res);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarProdutos(search);
  }, [search]);

  const handleInsert = async (novoProduto: Omit<Product, 'id_produto' | 'pagina_venda_uuid'>) => {
    try {
      const produto = await insertProduct(novoProduto);
      setProdutos(prev => [produto, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id_produto: string) => {
    try {
      await deleteProduct(id_produto);
      setProdutos(prev => prev.filter(p => p.id_produto !== id_produto));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (produto: Product) => {
    setProdutoEdit(produto);
    setEditOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoEdit) return;
    setLoading(true);
    setError(null);
    try {
      const produtoAtualizado = await updateProduct(produtoEdit);
      setProdutos(prev => prev.map(p => p.id_produto === produtoAtualizado.id_produto ? produtoAtualizado : p));
      setEditOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-orange-500 flex items-center gap-2">
        <span>📦</span> Produtos Criados
      </h2>
      <div className="mb-4 flex gap-4 items-center">
        <AddProductDialog onAdd={handleInsert} loading={loading} />
        {!hidePageEditorButton && (
          <Button 
            onClick={() => navigate('/page-editor')}
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
          >
            <Layout size={16} />
            Editor de Páginas
          </Button>
        )}
        <Input
          type="text"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64 h-10 text-base border border-border rounded-md px-3 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400"
        />
      </div>
  {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-center py-8 text-foreground/50">Carregando...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {produtos.map(produto => (
            <Card key={produto.id_produto} className="bg-background border-border rounded-xl shadow p-0">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="font-mono text-xs text-gray-500">ID: {produto.id_produto}</div>
                <div className="font-semibold text-base">{produto.nome_produto.slice(0, 20)}</div>
                <div className="text-orange-600 font-bold">R$ {Number(produto.preco_produto).toFixed(2)}</div>
                <a href={produto.link_venda} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-xs">Ver página de venda</a>
                <div className="flex gap-2 mt-2 self-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-orange-500 hover:text-orange-600 hover:bg-orange-500/20 hover:border-orange-500/30"
                    title="Editar"
                    onClick={() => handleEdit(produto)}
                    disabled={loading}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/30"
                    title="Excluir"
                    onClick={() => handleDelete(produto.id_produto)}
                    disabled={loading}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {produtos.length === 0 && (
            <div className="col-span-3 text-center text-foreground/50 py-8">Nenhum produto encontrado</div>
          )}
        </div>
      )}
      {/* Modal de edição de produto */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {produtoEdit && (
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Nome do produto (máx 20)"
                value={produtoEdit.nome_produto}
                maxLength={20}
                onChange={e => setProdutoEdit({ ...produtoEdit, nome_produto: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Preço do produto"
                value={produtoEdit.preco_produto}
                onChange={e => setProdutoEdit({ ...produtoEdit, preco_produto: Number(e.target.value) })}
                required
                min={0.01}
                step={0.01}
              />
              <Input
                type="text"
                placeholder="Link de venda"
                value={produtoEdit.link_venda}
                onChange={e => setProdutoEdit({ ...produtoEdit, link_venda: e.target.value })}
                required
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-500 text-white font-semibold hover:bg-orange-600" disabled={loading}>
                  Salvar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
