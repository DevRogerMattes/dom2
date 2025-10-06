import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from './ProdutosCriadosCards';

interface AddProductDialogProps {
  onAdd: (produto: Omit<Product, 'id_produto' | 'pagina_venda_uuid'>) => Promise<void>;
  loading: boolean;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({ onAdd, loading }) => {
  const [open, setOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState<Omit<Product, 'id_produto' | 'pagina_venda_uuid'>>({
    nome_produto: '',
    preco_produto: undefined as any,
    link_venda: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onAdd(novoProduto);
  setNovoProduto({ nome_produto: '', preco_produto: undefined, link_venda: '' });
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow hover:from-orange-600 hover:to-orange-700 text-base font-semibold"
          style={{ minWidth: '160px', height: '40px' }}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          + Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Nome do produto (máx 20)"
            value={novoProduto.nome_produto}
            maxLength={20}
            onChange={e => setNovoProduto({ ...novoProduto, nome_produto: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Preço do produto"
            value={novoProduto.preco_produto === undefined ? '' : novoProduto.preco_produto}
            onChange={e => setNovoProduto({ ...novoProduto, preco_produto: e.target.value ? Number(e.target.value) : undefined })}
            required
            min={0.01}
            step={0.01}
          />
          <Input
            type="text"
            placeholder="Link de venda"
            value={novoProduto.link_venda}
            onChange={e => setNovoProduto({ ...novoProduto, link_venda: e.target.value })}
            required
          />
          {/* Campo UUID página de venda removido */}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 text-white font-semibold hover:bg-orange-600" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
