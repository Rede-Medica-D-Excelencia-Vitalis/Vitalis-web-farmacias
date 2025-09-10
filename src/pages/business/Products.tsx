import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Percent
} from 'lucide-react';
import { apiService, Produto } from '@/lib/api';

const Products = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [temDesconto, setTemDesconto] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria_id: '',
    preco_custo: '',
    preco_venda: '',
    desconto_percentual: '',
    estoque: '',
    ativo: 1, // 1 = ativo, 0 = inativo
    imagem_url: '',
    concentracao: '',
    unidade_medida: '',
    fabricante: '',
    codigo_barras: '',
    principio_ativo: '',
    forma_farmaceutica: '',
    receita_obrigatoria: false,
    data_validade: '',
    estoque_minimo: '',
    estoque_maximo: ''
  });

  // Calcular preço final com desconto
  const calcularPrecoFinal = () => {
    const precoVenda = parseFloat(formData.preco_venda) || 0;
    const desconto = parseFloat(formData.desconto_percentual) || 0;
    
    if (desconto > 0) {
      return precoVenda - (precoVenda * desconto / 100);
    }
    return precoVenda;
  };

  // Calcular margem de lucro baseada no preço de custo
  const calcularMargemLucro = () => {
    const precoCusto = parseFloat(formData.preco_custo) || 0;
    const precoFinal = calcularPrecoFinal();
    
    if (precoCusto > 0 && precoFinal > 0) {
      return ((precoFinal - precoCusto) / precoCusto) * 100;
    }
    return 0;
  };

  // Calcular valor de lucro por unidade
  const calcularLucroUnidade = () => {
    const precoCusto = parseFloat(formData.preco_custo) || 0;
    const precoFinal = calcularPrecoFinal();
    return precoFinal - precoCusto;
  };

  // Calcular percentual de ganho sobre o preço de venda
  const calcularPercentualGanho = () => {
    const precoFinal = calcularPrecoFinal();
    const lucroUnidade = calcularLucroUnidade();
    
    if (precoFinal > 0) {
      return (lucroUnidade / precoFinal) * 100;
    }
    return 0;
  };

  // Carregar categorias
  const carregarCategorias = async () => {
    try {
      const data = await apiService.categorias.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Carregar produtos
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await apiService.produtos.listarPorFarmacia();
      
      // Verificar se há produtos com dados problemáticos
      console.log('📦 Produtos carregados:', data);
      
      // Log detalhado para verificar o campo imagem
      data.forEach((produto, index) => {
        console.log(`🔍 Produto ${index + 1} - ID: ${produto.id}, Nome: ${produto.nome}`);
        console.log(`🖼️ Campo imagem:`, produto.imagem);
        console.log(`📋 Todos os campos:`, produto);
      });
      
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const nome = produto.name || produto.nome || '';
    const descricao = produto.description || produto.descricao || '';
    const ativo = produto.active !== undefined ? produto.active : (produto.ativo !== undefined ? produto.ativo : 1);
    
    const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || 
                         (selectedStatus === 'ativo' && ativo === 1) ||
                         (selectedStatus === 'inativo' && ativo === 0);
    return matchesSearch && matchesStatus;
  });

  // Função para lidar com seleção de arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover imagem
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imagem_url: '' });
  };

  // Função para fazer upload da imagem
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);
      
      // Converter para base64 em vez de fazer upload para o servidor
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log('✅ Imagem convertida para base64');
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          console.error('❌ Erro ao converter imagem para base64');
          reject(new Error('Erro ao ler arquivo'));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  // Abrir modal para criar/editar
  const abrirModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      
      // Mapear campos da API para o formato esperado pelo frontend
      const produtoMapeado = {
        id: produto.id,
        nome: produto.name || produto.nome || '',
        descricao: produto.description || produto.descricao || '',
        categoria_id: produto.categoryId || produto.categoria_id,
        preco: produto.price || produto.preco || 0,
        preco_original: produto.originalPrice || produto.preco_original,
        preco_custo: produto.costPrice || produto.preco_custo || 0,
        estoque: produto.stock || produto.estoque || 0,
        ativo: produto.active !== undefined ? produto.active : (produto.ativo !== undefined ? produto.ativo : 1),
        imagem_url: produto.image || produto.imagem_url || '',
        concentracao: produto.concentration || produto.concentracao || '',
        unidade_medida: produto.unit || produto.unidade_medida || '',
        fabricante: produto.manufacturer || produto.fabricante || '',
        codigo_barras: produto.barcode || produto.codigo_barras || '',
        principio_ativo: produto.activePrinciple || produto.principio_ativo || '',
        forma_farmaceutica: produto.pharmaceuticalForm || produto.forma_farmaceutica || '',
        receita_obrigatoria: produto.requiresPrescription || produto.receita_obrigatoria || false,
        data_validade: produto.expiryDate || produto.data_validade || '',
        estoque_minimo: produto.minStock || produto.estoque_minimo || 0,
        estoque_maximo: produto.maxStock || produto.estoque_maximo || 0
      };
      
      // Calcular se tem desconto baseado no preço original
      const temDescontoProduto = produtoMapeado.preco_original && Number(produtoMapeado.preco_original) > Number(produtoMapeado.preco);
      setTemDesconto(temDescontoProduto);
      
      // Calcular percentual de desconto
      let descontoPercentual = '';
      if (temDescontoProduto && produtoMapeado.preco_original) {
        descontoPercentual = (((Number(produtoMapeado.preco_original) - Number(produtoMapeado.preco)) / Number(produtoMapeado.preco_original)) * 100).toFixed(2);
      }
      
      // Formatar data de validade para o input date
      let dataValidadeFormatada = '';
      if (produtoMapeado.data_validade) {
        // Se a data vier como ISO string, converter para YYYY-MM-DD
        if (typeof produtoMapeado.data_validade === 'string' && produtoMapeado.data_validade.includes('T')) {
          dataValidadeFormatada = produtoMapeado.data_validade.split('T')[0];
        } else {
          dataValidadeFormatada = produtoMapeado.data_validade;
        }
      }
      
      setFormData({
        nome: produtoMapeado.nome,
        descricao: produtoMapeado.descricao,
        categoria_id: produtoMapeado.categoria_id?.toString() || '1',
        preco_custo: produtoMapeado.preco_custo?.toString() || '',
        preco_venda: produtoMapeado.preco_original?.toString() || Number(produtoMapeado.preco).toString(),
        desconto_percentual: descontoPercentual,
        estoque: produtoMapeado.estoque?.toString() || '0',
        ativo: produtoMapeado.ativo,
        imagem_url: produtoMapeado.imagem_url,
        concentracao: produtoMapeado.concentracao,
        unidade_medida: produtoMapeado.unidade_medida,
        fabricante: produtoMapeado.fabricante,
        codigo_barras: produtoMapeado.codigo_barras,
        principio_ativo: produtoMapeado.principio_ativo,
        forma_farmaceutica: produtoMapeado.forma_farmaceutica,
        receita_obrigatoria: produtoMapeado.receita_obrigatoria,
        data_validade: dataValidadeFormatada,
        estoque_minimo: produtoMapeado.estoque_minimo?.toString() || '',
        estoque_maximo: produtoMapeado.estoque_maximo?.toString() || ''
      });
      setImagePreview(produtoMapeado.imagem_url || null);
      setSelectedFile(null);
    } else {
      setEditingProduto(null);
      setTemDesconto(false);
      setFormData({
        nome: '',
        descricao: '',
        categoria_id: '',
        preco_custo: '',
        preco_venda: '',
        desconto_percentual: '',
        estoque: '',
        ativo: 1,
        imagem_url: '',
        concentracao: '',
        unidade_medida: '',
        fabricante: '',
        codigo_barras: '',
        principio_ativo: '',
        forma_farmaceutica: '',
        receita_obrigatoria: false,
        data_validade: '',
        estoque_minimo: '',
        estoque_maximo: ''
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  // Salvar produto
  const salvarProduto = async () => {
    try {
      let imagemUrl = formData.imagem_url;

      // Se há um arquivo selecionado, fazer upload
      if (selectedFile) {
        imagemUrl = await uploadImage(selectedFile);
      }

      const precoFinal = calcularPrecoFinal();
      const precoOriginal = parseFloat(formData.preco_venda) || 0;

      // Converter data para formato YYYY-MM-DD se existir
      let dataValidade = formData.data_validade;
      if (dataValidade) {
        // Se a data vier como ISO string, converter para YYYY-MM-DD
        if (dataValidade.includes('T')) {
          dataValidade = dataValidade.split('T')[0];
        }
      }

      const dados = {
        ...formData,
        categoria_id: formData.categoria_id && formData.categoria_id.trim() !== '' ? parseInt(formData.categoria_id) : 1, // Usar 1 como padrão se estiver vazio
        preco: precoFinal,
        preco_original: temDesconto ? precoOriginal : undefined,
        preco_custo: parseFloat(formData.preco_custo) || 0,
        estoque: parseInt(formData.estoque),
        estoque_minimo: parseInt(formData.estoque_minimo) || 0,
        estoque_maximo: parseInt(formData.estoque_maximo) || 0,
        imagem: imagemUrl, // Usar 'imagem' em vez de 'imagem_url'
        data_validade: dataValidade,
        ativo: formData.ativo,
        farmacia_id: 1 // TODO: Pegar do contexto de autenticação
      };

      // Log para debug
      console.log('📤 Dados sendo enviados:', dados);
      console.log('🖼️ Imagem sendo enviada:', imagemUrl ? 'Sim' : 'Não');
      if (imagemUrl) {
        console.log('🖼️ Tipo da imagem:', imagemUrl.substring(0, 50) + '...');
      }

      if (editingProduto) {
        await apiService.produtos.atualizar(editingProduto.id, dados);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await apiService.produtos.criar(dados);
        toast.success('Produto criado com sucesso!');
      }

      setIsModalOpen(false);
      carregarProdutos();
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error('Erro:', error);
    }
  };

  // Excluir produto
  const excluirProduto = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await apiService.produtos.deletar(id);
        toast.success('Produto excluído com sucesso!');
        carregarProdutos();
      } catch (error) {
        toast.error('Erro ao excluir produto');
        console.error('Erro:', error);
      }
    }
  };

  // Calcular desconto
  const calcularDesconto = (preco: number, precoOriginal?: number) => {
    const precoNum = Number(preco) || 0;
    const precoOriginalNum = Number(precoOriginal) || 0;
    
    if (!precoOriginalNum || precoOriginalNum <= precoNum) return 0;
    return Math.round(((precoOriginalNum - precoNum) / precoOriginalNum) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Espaço para não sobrepor o sino de notificação */}
      <div className="h-12 md:h-0" />
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos da sua farmácia</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduto ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Paracetamol 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoria</Label>
                  <Select value={formData.categoria_id} onValueChange={(value) => setFormData({...formData, categoria_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                  <Input
                    id="preco_custo"
                    type="number"
                    step="0.01"
                    value={formData.preco_custo}
                    onChange={(e) => setFormData({...formData, preco_custo: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_validade">Data de Validade</Label>
                  <Input
                    id="data_validade"
                    type="date"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({...formData, data_validade: e.target.value})}
                  />
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Informações Técnicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="principio_ativo">Princípio Ativo</Label>
                    <Input
                      id="principio_ativo"
                      value={formData.principio_ativo}
                      onChange={(e) => setFormData({...formData, principio_ativo: e.target.value})}
                      placeholder="Ex: Paracetamol"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concentracao">Concentração</Label>
                    <Input
                      id="concentracao"
                      value={formData.concentracao}
                      onChange={(e) => setFormData({...formData, concentracao: e.target.value})}
                      placeholder="Ex: 500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unidade_medida">Unidade de Medida</Label>
                    <Select value={formData.unidade_medida} onValueChange={(value) => setFormData({...formData, unidade_medida: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mg">mg (miligramas)</SelectItem>
                        <SelectItem value="g">g (gramas)</SelectItem>
                        <SelectItem value="ml">ml (mililitros)</SelectItem>
                        <SelectItem value="l">L (litros)</SelectItem>
                        <SelectItem value="mcg">mcg (microgramas)</SelectItem>
                        <SelectItem value="UI">UI (Unidades Internacionais)</SelectItem>
                        <SelectItem value="unidade">Unidade</SelectItem>
                        <SelectItem value="comprimido">Comprimido</SelectItem>
                        <SelectItem value="capsula">Cápsula</SelectItem>
                        <SelectItem value="ampola">Ampola</SelectItem>
                        <SelectItem value="frasco">Frasco</SelectItem>
                        <SelectItem value="tubo">Tubo</SelectItem>
                        <SelectItem value="sachê">Sachê</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forma_farmaceutica">Forma Farmacêutica</Label>
                    <Select value={formData.forma_farmaceutica} onValueChange={(value) => setFormData({...formData, forma_farmaceutica: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprimido">Comprimido</SelectItem>
                        <SelectItem value="capsula">Cápsula</SelectItem>
                        <SelectItem value="xarope">Xarope</SelectItem>
                        <SelectItem value="suspensao">Suspensão</SelectItem>
                        <SelectItem value="injetavel">Injetável</SelectItem>
                        <SelectItem value="pomada">Pomada</SelectItem>
                        <SelectItem value="creme">Creme</SelectItem>
                        <SelectItem value="gel">Gel</SelectItem>
                        <SelectItem value="spray">Spray</SelectItem>
                        <SelectItem value="gotas">Gotas</SelectItem>
                        <SelectItem value="pasta">Pasta</SelectItem>
                        <SelectItem value="supositorio">Supositório</SelectItem>
                        <SelectItem value="aerosol">Aerosol</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição detalhada do produto..."
                  rows={2}
                />
              </div>

              {/* Informações do Fabricante */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Informações do Fabricante</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fabricante">Fabricante</Label>
                    <Input
                      id="fabricante"
                      value={formData.fabricante}
                      onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                      placeholder="Ex: EMS, Aché, Eurofarma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_barras">Código de Barras</Label>
                    <Input
                      id="codigo_barras"
                      value={formData.codigo_barras}
                      onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})}
                      placeholder="7891234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Preços */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Preços e Descontos</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
                    <Input
                      id="preco_venda"
                      type="number"
                      step="0.01"
                      value={formData.preco_venda}
                      onChange={(e) => setFormData({...formData, preco_venda: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preço Final</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="text-md font-bold text-green-600">
                        R$ {calcularPrecoFinal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkbox de Desconto */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tem_desconto"
                    checked={temDesconto}
                    onCheckedChange={(checked) => {
                      setTemDesconto(checked as boolean);
                      if (!checked) {
                        setFormData({...formData, desconto_percentual: ''});
                      }
                    }}
                  />
                  <Label htmlFor="tem_desconto" className="text-sm font-medium">
                    Aplicar desconto
                  </Label>
                </div>

                {/* Campo de Desconto */}
                {temDesconto && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="desconto_percentual">Desconto (%)</Label>
                      <div className="relative">
                        <Input
                          id="desconto_percentual"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.desconto_percentual}
                          onChange={(e) => setFormData({...formData, desconto_percentual: e.target.value})}
                          placeholder="0,00"
                        />
                        <Percent className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Valor do Desconto</Label>
                      <div className="p-2 bg-red-50 rounded-md">
                        <span className="text-md font-bold text-red-600">
                          R$ {((parseFloat(formData.preco_venda) || 0) * (parseFloat(formData.desconto_percentual) || 0) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumo dos Preços */}
                <div className="space-y-2">
                  <Label>Resumo dos Preços</Label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <div className="font-semibold text-gray-700">Preço de Custo</div>
                      <div className="text-gray-600">R$ {(parseFloat(formData.preco_custo) || 0).toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md">
                      <div className="font-semibold text-blue-700">Preço de Venda</div>
                      <div className="text-blue-600">R$ {(parseFloat(formData.preco_venda) || 0).toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-md">
                      <div className="font-semibold text-green-700">Preço Final</div>
                      <div className="text-green-600">R$ {calcularPrecoFinal().toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Margem de Lucro */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Margem de Lucro</Label>
                    <div className="p-2 bg-blue-50 rounded-md">
                      <span className={`text-md font-bold ${calcularMargemLucro() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {calcularMargemLucro().toFixed(2)}%
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Sobre o custo
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Percentual de Ganho</Label>
                    <div className="p-2 bg-purple-50 rounded-md">
                      <span className={`text-md font-bold ${calcularPercentualGanho() >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                        {calcularPercentualGanho().toFixed(2)}%
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Sobre a venda
                      </div>
                    </div>
                  </div>
                </div>

                {/* Valor de Lucro */}
                <div className="space-y-2">
                  <Label>Lucro por Unidade</Label>
                  <div className="p-2 bg-green-50 rounded-md">
                    <span className={`text-md font-bold ${calcularLucroUnidade() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {calcularLucroUnidade().toFixed(2)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Preço final - Preço de custo
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque Atual</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => setFormData({...formData, estoque: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ativo">Status</Label>
                  <Select value={formData.ativo.toString()} onValueChange={(value: string) => setFormData({...formData, ativo: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="0">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Controle de Estoque */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Controle de Estoque</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                    <Input
                      id="estoque_minimo"
                      type="number"
                      value={formData.estoque_minimo}
                      onChange={(e) => setFormData({...formData, estoque_minimo: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque_maximo">Estoque Máximo</Label>
                    <Input
                      id="estoque_maximo"
                      type="number"
                      value={formData.estoque_maximo}
                      onChange={(e) => setFormData({...formData, estoque_maximo: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Controle de Validade e Receita */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Controle de Validade e Receita</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_validade">Data de Validade</Label>
                    <Input
                      id="data_validade"
                      type="date"
                      value={formData.data_validade}
                      onChange={(e) => setFormData({...formData, data_validade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="receita_obrigatoria"
                        checked={formData.receita_obrigatoria}
                        onCheckedChange={(checked) => setFormData({...formData, receita_obrigatoria: checked as boolean})}
                      />
                      <Label htmlFor="receita_obrigatoria" className="text-sm font-medium">
                        Receita Obrigatória
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label>Imagem do Produto</Label>
                <div className="space-y-3">
                  {/* Preview da imagem */}
                  {imagePreview && (
                    <div className="relative">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden max-h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Área de upload */}
                  {!imagePreview && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                      <div className="space-y-2">
                        <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto" />
                        <div>
                          <Label htmlFor="imagem-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-muted-foreground">
                              Clique para selecionar uma imagem
                            </span>
                            <br />
                            <span className="text-xs text-muted-foreground">
                              PNG, JPG ou GIF até 5MB
                            </span>
                          </Label>
                          <Input
                            id="imagem-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão para trocar imagem */}
                  {imagePreview && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('imagem-upload')?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Trocar Imagem
                      </Button>
                      <Input
                        id="imagem-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarProduto} disabled={uploadingImage}>
                {uploadingImage && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingProduto ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Produtos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((produto) => {
            // Log para debug da imagem
            console.log(`🖼️ Produto ${produto.id} - Imagem:`, produto.imagem);
            
            // Os dados já vêm no formato correto da nova API
            return (
              <Card key={produto.id} className="overflow-hidden">
                {produto.imagem && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`❌ Erro ao carregar imagem do produto ${produto.id}:`, e);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log(`✅ Imagem carregada com sucesso para produto ${produto.id}`);
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{produto.nome}</CardTitle>
                      {produto.principio_ativo && (
                        <p className="text-xs text-blue-600 mt-1">
                          {produto.principio_ativo}
                          {produto.concentracao && produto.unidade_medida && ` ${produto.concentracao}${produto.unidade_medida}`}
                        </p>
                      )}
                      {produto.descricao && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {produto.descricao}
                        </p>
                      )}
                      {produto.fabricante && (
                        <p className="text-xs text-gray-500 mt-1">
                          {produto.fabricante}
                        </p>
                      )}
                    </div>
                    <Badge variant={produto.ativo === 1 ? 'default' : 'secondary'}>
                      {produto.ativo === 1 ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-lg">
                        R$ {(Number(produto.preco) || 0).toFixed(2)}
                      </span>
                    </div>
                    {produto.preco_original && Number(produto.preco_original) > Number(produto.preco) && (
                      <Badge variant="destructive">
                        -{calcularDesconto(Number(produto.preco) || 0, Number(produto.preco_original))}%
                      </Badge>
                    )}
                  </div>
                  
                  {produto.preco_original && Number(produto.preco_original) > Number(produto.preco) && (
                    <p className="text-sm text-muted-foreground line-through">
                      De: R$ {(Number(produto.preco_original) || 0).toFixed(2)}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Estoque: {produto.estoque || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {produto.receita_obrigatoria && (
                        <Badge variant="destructive" className="text-xs">
                          Receita
                        </Badge>
                      )}
                      {(produto.estoque || 0) <= 10 && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => abrirModal(produto)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => excluirProduto(produto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && produtosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedStatus !== 'todos' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro produto'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Products; 