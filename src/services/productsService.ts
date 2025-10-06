import { Product } from '../components/ProdutosCriadosCards';
import { apiService } from './apiService';

const API_URL = '/api/products';

// Função para obter o usuário logado do localStorage
function getCurrentUser() {
  const storedUser = localStorage.getItem('auth-user');
  return storedUser ? JSON.parse(storedUser) : null;
}

export async function fetchProducts(search?: string): Promise<Product[]> {
  const user = getCurrentUser();
  if (!user?.id) {
    throw new Error('Usuário não autenticado');
  }
  
  let url = `${API_URL}?user_id=${user.id}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const res = await apiService.get(url);
  if (res.status !== 200) throw new Error('Erro ao buscar produtos');
  return res.data;
}

export async function insertProduct(produto: Omit<Product, 'id_produto' | 'pagina_venda_uuid'>): Promise<Product> {
  const user = getCurrentUser();
  if (!user?.id) {
    throw new Error('Usuário não autenticado');
  }
  
  // Remove pagina_venda_uuid se vier por engano e adiciona user_id
  const { nome_produto, preco_produto, link_venda } = produto;
  const res = await apiService.post(API_URL, { 
    nome_produto, 
    preco_produto, 
    link_venda, 
    user_id: user.id 
  });
  if (res.status !== 200 && res.status !== 201) throw new Error('Erro ao inserir produto');
  return res.data;
}

export async function deleteProduct(id_produto: string): Promise<void> {
  const user = getCurrentUser();
  if (!user?.id) {
    throw new Error('Usuário não autenticado');
  }
  
  const res = await apiService.delete(`${API_URL}/${id_produto}?user_id=${user.id}`);
  if (res.status !== 200 && res.status !== 204) throw new Error('Erro ao deletar produto');
}

export async function updateProduct(produto: Product): Promise<Product> {
  const user = getCurrentUser();
  if (!user?.id) {
    throw new Error('Usuário não autenticado');
  }
  
  const { id_produto, nome_produto, preco_produto, link_venda } = produto;
  const res = await apiService.put(`${API_URL}/${id_produto}?user_id=${user.id}`, { 
    nome_produto, 
    preco_produto, 
    link_venda 
  });
  if (res.status !== 200) throw new Error('Erro ao atualizar produto');
  return res.data;
}
