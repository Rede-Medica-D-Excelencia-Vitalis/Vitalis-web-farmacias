/**
 * Componente de Lista de Produtos
 * 
 * Este arquivo contém:
 * 1. Componente ProductForm para adicionar/editar produtos
 * 2. Componente principal ProductsList que gerencia a lista de produtos
 * 3. Funcionalidades de CRUD (Create, Read, Update, Delete)
 * 4. Tabela de produtos com informações detalhadas
 */

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { products as initialProducts } from '@/lib/data';
import { Product } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

/**
 * Componente de formulário para adicionar/editar produtos
 * 
 * @param product - Produto a ser editado (null para novo produto)
 * @param onSave - Função chamada ao salvar o produto
 * @param onCancel - Função chamada ao cancelar a edição
 * @returns JSX.Element - Formulário de produto
 */
const ProductForm = ({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Partial<Product> | null, 
  onSave: (product: Partial<Product>) => void, 
  onCancel: () => void 
}) => {
  // Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      active: true,
      image: '/placeholder.svg',
    }
  );

  /**
   * Atualiza o estado do formulário quando um campo é alterado
   * 
   * @param e - Evento de mudança do input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  /**
   * Envia o formulário quando o usuário clica em salvar
   * 
   * @param e - Evento de submissão do formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Campo de nome do produto */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Campo de descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Campos de preço e estoque */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {/* Campo de categoria */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Switch de produto ativo */}
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            name="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <Label htmlFor="active">Produto Ativo</Label>
        </div>
      </div>
      
      {/* Botões do formulário */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

/**
 * Componente principal que gerencia a lista de produtos
 * 
 * @returns JSX.Element - Lista de produtos com funcionalidades de CRUD
 */
const ProductsList = () => {
  // Estados para gerenciar a lista de produtos e diálogos
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  /**
   * Abre o diálogo para adicionar um novo produto
   */
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };
  
  /**
   * Abre o diálogo para editar um produto existente
   * 
   * @param product - Produto a ser editado
   */
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  /**
   * Abre o diálogo de confirmação para excluir um produto
   * 
   * @param product - Produto a ser excluído
   */
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  
  /**
   * Confirma e executa a exclusão do produto
   */
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      toast({
        title: "Produto excluído",
        description: `${productToDelete.name} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  /**
   * Salva um produto novo ou atualiza um existente
   * 
   * @param formData - Dados do produto a ser salvo
   */
  const handleSaveProduct = (formData: Partial<Product>) => {
    if (selectedProduct) {
      // Atualiza produto existente
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...formData } : p
      );
      setProducts(updatedProducts);
      toast({
        title: "Produto atualizado",
        description: `${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Adiciona novo produto
      const newProduct: Product = {
        id: `${products.length + 1}`,
        name: formData.name!,
        description: formData.description!,
        price: formData.price!,
        stock: formData.stock!,
        category: formData.category!,
        active: formData.active!,
        image: formData.image || '/placeholder.svg',
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Produto adicionado",
        description: `${newProduct.name} foi adicionado com sucesso.`,
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      {/* Cabeçalho com título e botão de adicionar */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos</CardTitle>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </CardHeader>
      <CardContent>
        {/* Tabela de produtos */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 hidden md:block">{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={product.active ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                    {product.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo de adição/edição de produto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir o produto{" "}
              <span className="font-semibold">{productToDelete?.name}</span>?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export { ProductsList };
export default ProductsList;
