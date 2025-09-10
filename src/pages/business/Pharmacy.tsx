/**
 * Página da Farmácia
 * 
 * Este arquivo contém:
 * 1. Dados da farmácia
 * 2. Estatísticas de produtos
 * 3. Tipos de produtos
 * 4. Avaliações da farmácia
 * 5. Equipe responsável
 * 6. Lista de produtos
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsList from '@/components/products/ProductsList';
import ProductImage from '@/components/products/ProductImage';
import { Package, Plus, Building2, Mail, Phone, User, Star, Tag, ShieldCheck, MessageCircle, Upload, Camera, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/ui/use-toast';
import { apiService, Farmacia, Avaliacao, Produto } from '@/lib/api';
import { useAuth } from '@/contexts';
import { OrderChat } from '@/components/orders/OrderChat';

interface EstatisticasProdutos {
  total: number;
  emEstoque: number;
  baixoEstoque: number;
  inativos: number;
}

interface MediaAvaliacoes {
  media_nota: number;
  total_avaliacoes: number;
  cinco_estrelas: number;
  quatro_estrelas: number;
  tres_estrelas: number;
  duas_estrelas: number;
  uma_estrela: number;
}

const Pharmacy = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProdutos>({
    total: 0,
    emEstoque: 0,
    baixoEstoque: 0,
    inativos: 0
  });
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState<MediaAvaliacoes | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroNota, setFiltroNota] = useState<number | null>(null);
  const [respostas, setRespostas] = useState<{[key:number]: string}>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [produtoDesativar, setProdutoDesativar] = useState<Produto | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Estados para pedidos e chat
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<any>(null);
  
  // Campos editáveis
  const [editNome, setEditNome] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editRua, setEditRua] = useState('');
  const [editNumero, setEditNumero] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editEstado, setEditEstado] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelefone, setEditTelefone] = useState('');

  // Carregar pedidos da farmácia
  const carregarPedidos = async () => {
    try {
      setPedidosLoading(true);
      const response = await apiService.dashboard.getTodosPedidos();
      setPedidos(response.pedidos || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos",
        variant: "destructive",
      });
    } finally {
      setPedidosLoading(false);
    }
  };

  // Carregar dados da farmácia
  const carregarDadosFarmacia = async () => {
    try {
      setLoading(true);
      const dados = await apiService.farmacia.getPerfil();
      setFarmacia(dados);
      setLogoPreview(dados.foto || null);
      
      // Inicializar campos editáveis
      setEditNome(dados.nome || '');
      setEditCnpj(dados.cnpj || '');
      
      // Usar campos individuais do endereço se existirem
      if (dados.rua || dados.cidade || dados.estado) {
        // Se os campos individuais existem, usar diretamente
        setEditRua(dados.rua || '');
        setEditNumero(dados.numero || '');
        setEditBairro(dados.bairro || '');
        setEditCidade(dados.cidade || '');
        setEditEstado(dados.estado || '');
        setEditCep(dados.cep || '');
      } else if (dados.endereco) {
        // Fallback para endereço como string/JSON (caso antigo)
        try {
          const enderecoObj = typeof dados.endereco === 'string' ? JSON.parse(dados.endereco) : dados.endereco;
          setEditRua(enderecoObj.rua || '');
          setEditNumero(enderecoObj.numero || '');
          setEditBairro(enderecoObj.bairro || '');
          setEditCidade(enderecoObj.cidade || '');
          setEditEstado(enderecoObj.estado || '');
          setEditCep(enderecoObj.cep || '');
        } catch (error) {
          console.log('🔍 Debug - Endereço original:', dados.endereco);
          
          // Se não conseguir fazer parse, tentar extrair informações do endereço como string
          const enderecoStr = dados.endereco || '';
          
          // Limpar campos primeiro
          setEditRua('');
          setEditNumero('');
          setEditBairro('');
          setEditCidade('');
          setEditEstado('');
          setEditCep('');
          
          // Padrão: "Rua Conceição, 321 - , São Caetano do Sul/SP - CEP: 09530060"
          
          // Extrair CEP (formato: CEP: 00000000)
          const cepMatch = enderecoStr.match(/CEP:\s*(\d{8})/);
          if (cepMatch) {
            setEditCep(cepMatch[1]);
          }
          
          // Extrair estado (formato: /SP ou /SP -)
          const estadoMatch = enderecoStr.match(/\/([A-Z]{2})(?:\s*-)?/);
          if (estadoMatch) {
            setEditEstado(estadoMatch[1]);
          }
          
          // Extrair cidade (mais específico)
          // Procurar por padrão: "São Caetano do Sul/SP"
          const cidadeEstadoMatch = enderecoStr.match(/([^\/]+)\/([A-Z]{2})/);
          if (cidadeEstadoMatch) {
            const cidadeCompleta = cidadeEstadoMatch[1].trim();
            console.log('🔍 Debug - Cidade completa extraída:', cidadeCompleta);
            // Dividir por vírgulas e pegar a última parte (que deve ser a cidade)
            const partes = cidadeCompleta.split(',').map(p => p.trim()).filter(p => p);
            console.log('🔍 Debug - Partes da cidade:', partes);
            if (partes.length > 0) {
              const cidadeFinal = partes[partes.length - 1];
              console.log('🔍 Debug - Cidade final:', cidadeFinal);
              setEditCidade(cidadeFinal);
            }
          }
          
          // Extrair número (formato: , 321 -)
          const numeroMatch = enderecoStr.match(/,\s*(\d+)\s*-/);
          if (numeroMatch) {
            setEditNumero(numeroMatch[1]);
          }
          
          // Extrair rua (antes da vírgula e número)
          const ruaMatch = enderecoStr.match(/^([^,]+)/);
          if (ruaMatch) {
            setEditRua(ruaMatch[1].trim());
          }
          
          // Bairro está vazio no exemplo, então deixar vazio
          setEditBairro('');
          
          console.log('🔍 Debug - Campos extraídos:', {
            rua: editRua,
            numero: editNumero,
            bairro: editBairro,
            cidade: editCidade,
            estado: editEstado,
            cep: editCep
          });
        }
      } else {
        setEditRua('');
        setEditNumero('');
        setEditBairro('');
        setEditCidade('');
        setEditEstado('');
        setEditCep('');
      }
      
      setEditEmail(dados.email || '');
      setEditTelefone(dados.telefone || '');
    } catch (error) {
      console.error('Erro ao carregar dados da farmácia:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da farmácia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar avaliações
  const carregarAvaliacoes = async () => {
    if (!farmacia) return;
    
    try {
      const avaliacoesData = await apiService.avaliacoes.listarPorFarmacia(farmacia.id);
      setAvaliacoes(avaliacoesData);
      
      const mediaData = await apiService.avaliacoes.getMediaAvaliacoes(farmacia.id);
      console.log('🔍 Debug - Dados de média recebidos:', mediaData);
      console.log('🔍 Debug - Tipo de media_nota:', typeof mediaData?.media_nota);
      console.log('🔍 Debug - Valor de media_nota:', mediaData?.media_nota);
      
      // Validar se media_nota é um número válido
      if (mediaData && typeof mediaData.media_nota !== 'number') {
        console.warn('⚠️ media_nota não é um número:', mediaData.media_nota);
        // Converter para número se possível, ou usar valor padrão
        mediaData.media_nota = Number(mediaData.media_nota) || 5.0;
      }
      
      setMediaAvaliacoes(mediaData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  // Carregar produtos
  const carregarProdutos = async () => {
    try {
      // Usar listarPorFarmacia para buscar apenas produtos da farmácia logada
      const produtosData = await apiService.produtos.listarPorFarmacia();
      
      // Log para debug das imagens
      console.log('📦 Produtos carregados:', produtosData);
      produtosData.forEach((produto, index) => {
        console.log(`🔍 Produto ${index + 1} - ID: ${produto.id}, Nome: ${produto.nome}`);
        console.log(`🖼️ Campo imagem:`, produto.imagem);
        console.log(`📋 Todos os campos:`, produto);
      });
      
      setProdutos(produtosData);
      
      // Calcular estatísticas
      const total = produtosData.length;
      const emEstoque = produtosData.filter(p => (Number(p.estoque) || 0) > 0).length;
      const baixoEstoque = produtosData.filter(p => (Number(p.estoque) || 0) <= 5 && (Number(p.estoque) || 0) > 0).length;
      const inativos = produtosData.filter(p => p.ativo === 0).length;
      
      setEstatisticas({ total, emEstoque, baixoEstoque, inativos });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    }
  };

  // Carregar todos os dados
  useEffect(() => {
    carregarDadosFarmacia();
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (farmacia) {
      carregarAvaliacoes();
      carregarProdutos();
    }
  }, [farmacia]);

  const handleEdit = async () => {
    if (!farmacia) return;

    // Validar campos obrigatórios
    if (!editNome.trim() || !editCnpj.trim() || !editRua.trim() || !editCidade.trim() || !editEstado.trim() || !editEmail.trim() || !editTelefone.trim()) {
      toast({
        title: "Erro",
        description: "Nome, CNPJ, Rua, Cidade, Estado, Email e Telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const dados = {
        nome: editNome.trim(),
        cnpj: editCnpj.trim(),
        // Campos individuais do endereço
        rua: editRua.trim(),
        numero: editNumero.trim(),
        bairro: editBairro.trim(),
        cidade: editCidade.trim(),
        estado: editEstado.trim(),
        cep: editCep.trim(),
        email: editEmail.trim(),
        telefone: editTelefone.trim(),
        foto: logoPreview || farmacia.foto
      };

      await apiService.farmacia.atualizar(dados);
      await carregarDadosFarmacia();
      setEditMode(false);
      
      toast({
        title: "Sucesso",
        description: "Dados da farmácia atualizados com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar farmácia:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados da farmácia",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    // Recarregar os dados originais
    if (farmacia) {
      setEditNome(farmacia.nome || '');
      setEditCnpj(farmacia.cnpj || '');
      
      // Usar campos individuais do endereço se existirem
      if (farmacia.rua || farmacia.cidade || farmacia.estado) {
        setEditRua(farmacia.rua || '');
        setEditNumero(farmacia.numero || '');
        setEditBairro(farmacia.bairro || '');
        setEditCidade(farmacia.cidade || '');
        setEditEstado(farmacia.estado || '');
        setEditCep(farmacia.cep || '');
      } else if (farmacia.endereco) {
        // Fallback para endereço como string/JSON (caso antigo)
        try {
          const enderecoObj = typeof farmacia.endereco === 'string' ? JSON.parse(farmacia.endereco) : farmacia.endereco;
          setEditRua(enderecoObj.rua || '');
          setEditNumero(enderecoObj.numero || '');
          setEditBairro(enderecoObj.bairro || '');
          setEditCidade(enderecoObj.cidade || '');
          setEditEstado(enderecoObj.estado || '');
          setEditCep(enderecoObj.cep || '');
        } catch (error) {
          // Usar a mesma lógica de extração da função carregarDadosFarmacia
          const enderecoStr = farmacia.endereco || '';
          
          // Limpar campos primeiro
          setEditRua('');
          setEditNumero('');
          setEditBairro('');
          setEditCidade('');
          setEditEstado('');
          setEditCep('');
          
          // Padrão: "Rua Conceição, 321 - , São Caetano do Sul/SP - CEP: 09530060"
          
          // Extrair CEP (formato: CEP: 00000000)
          const cepMatch = enderecoStr.match(/CEP:\s*(\d{8})/);
          if (cepMatch) {
            setEditCep(cepMatch[1]);
          }
          
          // Extrair estado (formato: /SP ou /SP -)
          const estadoMatch = enderecoStr.match(/\/([A-Z]{2})(?:\s*-)?/);
          if (estadoMatch) {
            setEditEstado(estadoMatch[1]);
          }
          
          // Extrair cidade (mais específico)
          // Procurar por padrão: "São Caetano do Sul/SP"
          const cidadeEstadoMatch = enderecoStr.match(/([^\/]+)\/([A-Z]{2})/);
          if (cidadeEstadoMatch) {
            const cidadeCompleta = cidadeEstadoMatch[1].trim();
            console.log('🔍 Debug - Cidade completa extraída:', cidadeCompleta);
            // Dividir por vírgulas e pegar a última parte (que deve ser a cidade)
            const partes = cidadeCompleta.split(',').map(p => p.trim()).filter(p => p);
            console.log('🔍 Debug - Partes da cidade:', partes);
            if (partes.length > 0) {
              const cidadeFinal = partes[partes.length - 1];
              console.log('🔍 Debug - Cidade final:', cidadeFinal);
              setEditCidade(cidadeFinal);
            }
          }
          
          // Extrair número (formato: , 321 -)
          const numeroMatch = enderecoStr.match(/,\s*(\d+)\s*-/);
          if (numeroMatch) {
            setEditNumero(numeroMatch[1]);
          }
          
          // Extrair rua (antes da vírgula e número)
          const ruaMatch = enderecoStr.match(/^([^,]+)/);
          if (ruaMatch) {
            setEditRua(ruaMatch[1].trim());
          }
          
          // Bairro está vazio no exemplo, então deixar vazio
          setEditBairro('');
        }
      }
      
      setEditEmail(farmacia.email || '');
      setEditTelefone(farmacia.telefone || '');
    }
    setEditMode(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResponder = async (avaliacaoId: number) => {
    if (!respostas[avaliacaoId]) return;

    try {
      await apiService.avaliacoes.responder(avaliacaoId, respostas[avaliacaoId]);
      setRespostas({ ...respostas, [avaliacaoId]: '' });
      await carregarAvaliacoes();
      
      toast({
        title: "Sucesso",
        description: "Resposta enviada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta",
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = async () => {
    if (!farmacia) return;

    try {
      const novoStatus = farmacia.status === 'ativo' ? 'inativo' : 'ativo';
      await apiService.farmacia.atualizar({ status: novoStatus });
      await carregarDadosFarmacia();
      
      toast({
        title: "Sucesso",
        description: `Farmácia ${novoStatus === 'ativo' ? 'ativada' : 'desativada'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da farmácia",
        variant: "destructive",
      });
    }
  };

  // Função para ativar produto
  const handleAtivarProduto = async (produtoId: number) => {
    try {
      await apiService.produtos.atualizar(produtoId, { ativo: 1 });
      await carregarProdutos();
      
      toast({
        title: "Sucesso",
        description: "Produto ativado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao ativar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar o produto",
        variant: "destructive",
      });
    }
  };

  // Função para desativar produto
  const handleDesativarProduto = async (produtoId: number) => {
    try {
      await apiService.produtos.atualizar(produtoId, { ativo: 0 });
      await carregarProdutos();
      
      toast({
        title: "Sucesso",
        description: "Produto desativado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao desativar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar o produto",
        variant: "destructive",
      });
    }
  };

  // Função para excluir produto permanentemente
  const handleExcluirProduto = async () => {
    if (!produtoDesativar) return;

    try {
      await apiService.produtos.deletar(produtoDesativar.id);
      await carregarProdutos();
      setConfirmOpen(false);
      setProdutoDesativar(null);
      
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      });
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados da farmácia...</div>
      </div>
    );
  }

  if (!farmacia) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro ao carregar dados da farmácia</div>
      </div>
    );
  }

  const notas = [5, 4, 3, 2, 1];

  return (
    <Tabs defaultValue="dados" className="space-y-8">
      <TabsList className="w-full flex flex-wrap gap-2 mb-6">
        <TabsTrigger value="dados">Dados da Farmácia</TabsTrigger>
        <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        <TabsTrigger value="produtos">Lista de Produtos</TabsTrigger>
      </TabsList>

      <TabsContent value="dados">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg font-bold">Dados da Farmácia</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={farmacia.status === 'ativo' ? 'secondary' : 'destructive'} 
                onClick={handleStatusToggle}
              >
                {farmacia.status === 'ativo' ? 'Desativar' : 'Ativar'}
              </Button>
              {editMode ? (
                <>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleEdit}>
                    Salvar
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  Editar Dados
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo da Farmácia */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {logoPreview ? (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Logo da Farmácia" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2"
                  onClick={() => document.getElementById('logo-input')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  id="logo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>
            
            {/* Campos de dados */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">Nome</Label>
                {editMode ? (
                  <Input 
                    id="nome" 
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="mt-1"
                    required 
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-700">{farmacia.nome}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
                {editMode ? (
                  <Input 
                    id="cnpj" 
                    value={editCnpj}
                    onChange={(e) => setEditCnpj(e.target.value)}
                    className="mt-1"
                    required 
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-700">{farmacia.cnpj}</div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="endereco" className="text-sm font-medium">Endereço</Label>
                {editMode ? (
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <Label htmlFor="rua" className="text-xs text-gray-600">Rua</Label>
                      <Input 
                        id="rua" 
                        value={editRua}
                        onChange={(e) => setEditRua(e.target.value)}
                        className="mt-1"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero" className="text-xs text-gray-600">Número</Label>
                      <Input 
                        id="numero" 
                        value={editNumero}
                        onChange={(e) => setEditNumero(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro" className="text-xs text-gray-600">Bairro</Label>
                      <Input 
                        id="bairro" 
                        value={editBairro}
                        onChange={(e) => setEditBairro(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep" className="text-xs text-gray-600">CEP</Label>
                      <Input 
                        id="cep" 
                        value={editCep}
                        onChange={(e) => setEditCep(e.target.value)}
                        className="mt-1"
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cidade" className="text-xs text-gray-600">Cidade</Label>
                      <Input 
                        id="cidade" 
                        value={editCidade}
                        onChange={(e) => setEditCidade(e.target.value)}
                        className="mt-1"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado" className="text-xs text-gray-600">Estado</Label>
                      <select 
                        id="estado" 
                        value={editEstado}
                        onChange={(e) => setEditEstado(e.target.value)}
                        className="w-full border rounded px-3 py-2 mt-1"
                        required 
                      >
                        <option value="">Selecione...</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-700">
                    {(() => {
                      // Usar campos individuais se existirem
                      if (farmacia.rua || farmacia.cidade || farmacia.estado) {
                        const enderecoFormatado = [
                          farmacia.rua,
                          farmacia.numero && `Nº ${farmacia.numero}`,
                          farmacia.bairro,
                          farmacia.cidade,
                          farmacia.estado,
                          farmacia.cep
                        ].filter(Boolean).join(', ');
                        return enderecoFormatado;
                      }
                      
                      // Fallback para endereço como JSON/string (caso antigo)
                      try {
                        const enderecoObj = typeof farmacia.endereco === 'string' ? JSON.parse(farmacia.endereco) : farmacia.endereco;
                        if (enderecoObj && typeof enderecoObj === 'object') {
                          const enderecoFormatado = [
                            enderecoObj.rua,
                            enderecoObj.numero && `Nº ${enderecoObj.numero}`,
                            enderecoObj.bairro,
                            enderecoObj.cidade,
                            enderecoObj.estado,
                            enderecoObj.cep
                          ].filter(Boolean).join(', ');
                          return enderecoFormatado || farmacia.endereco;
                        }
                        return farmacia.endereco;
                      } catch (error) {
                        return farmacia.endereco;
                      }
                    })()}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                {editMode ? (
                  <Input 
                    id="email" 
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="mt-1"
                    required 
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-700">{farmacia.email}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                {editMode ? (
                  <Input 
                    id="telefone" 
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    className="mt-1"
                    required 
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-700">{farmacia.telefone}</div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Avaliação</Label>
                <div className="mt-1 text-sm text-gray-700">
                  {typeof mediaAvaliacoes?.media_nota === 'number' ? mediaAvaliacoes.media_nota.toFixed(1) : '5.0'} ★ ({mediaAvaliacoes?.total_avaliacoes || 0} avaliações)
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <span className={`text-sm ${farmacia.status === 'ativo' ? 'text-green-700' : 'text-red-700'}`}>
                    {farmacia.status === 'ativo' ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>
      </div>


          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="estatisticas">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <CardTitle className="text-lg font-bold">Estatísticas da Farmácia</CardTitle>
            <div className="flex gap-2 items-center">
              <select className="border rounded px-2 py-1 text-sm" defaultValue="mes">
                <option value="dia">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="ano">Este Ano</option>
              </select>
              <Button size="sm" variant="outline">Exportar PDF</Button>
              <Button size="sm" variant="outline">Exportar Excel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gráfico de Vendas */}
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-blue-700 font-semibold mb-2">Gráfico de Vendas</span>
                <div className="w-full h-40 flex items-center justify-center text-blue-300">[Gráfico de Vendas Aqui]</div>
              </div>
              {/* Gráfico Comparativo */}
              <div className="bg-orange-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-orange-700 font-semibold mb-2">Comparativo com Período Anterior</span>
                <div className="w-full h-40 flex items-center justify-center text-orange-300">[Gráfico Comparativo Aqui]</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total de Produtos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{estatisticas.total}</div>
              <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{estatisticas.emEstoque}</div>
              <p className="text-xs text-muted-foreground">{estatisticas.total > 0 ? Math.round((estatisticas.emEstoque / estatisticas.total) * 100) : 0}% do total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{estatisticas.baixoEstoque}</div>
              <p className="text-xs text-muted-foreground">Necessitam de reposição</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Inativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{estatisticas.inativos}</div>
              <p className="text-xs text-muted-foreground">{estatisticas.total > 0 ? Math.round((estatisticas.inativos / estatisticas.total) * 100) : 0}% do total</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="avaliacoes">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base font-semibold">Avaliações da Farmácia</CardTitle>
            <span className="ml-auto text-sm font-bold text-yellow-600">{typeof mediaAvaliacoes?.media_nota === 'number' ? mediaAvaliacoes.media_nota.toFixed(1) : '0.0'} ★</span>
            <span className="ml-2 text-xs text-gray-500">({mediaAvaliacoes?.total_avaliacoes || 0} avaliações)</span>
          </CardHeader>
          <CardContent>
            {/* Filtro por nota */}
            <div className="mb-6 flex gap-2 items-center flex-wrap">
              <span className="text-sm text-gray-700">Filtrar por nota:</span>
              {notas.map(nota => (
                <button
                  key={nota}
                  className={`px-3 py-1 rounded-full text-sm font-bold border-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400
                    ${filtroNota === nota ? 'bg-yellow-400 text-white border-yellow-500 scale-105' : 'bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-100'}`}
                  onClick={() => setFiltroNota(filtroNota === nota ? null : nota)}
                >
                  {nota}★
                </button>
              ))}
              {filtroNota && (
                <button className="ml-2 text-xs text-blue-600 underline" onClick={() => setFiltroNota(null)}>
                  Limpar filtro
                </button>
              )}
            </div>
            <div className="space-y-6">
              {avaliacoes
                .filter(a => !filtroNota || a.nota === filtroNota)
                .map((avaliacao) => {
                  // Cores por nota
                  const notaColor = avaliacao.nota === 5 ? 'border-green-400' : avaliacao.nota === 4 ? 'border-yellow-400' : avaliacao.nota === 3 ? 'border-orange-400' : 'border-red-400';
                  const notaBg = avaliacao.nota === 5 ? 'bg-green-50' : avaliacao.nota === 4 ? 'bg-yellow-50' : avaliacao.nota === 3 ? 'bg-orange-50' : 'bg-red-50';
                  // Avatar com iniciais
                  const iniciais = avaliacao.paciente_nome?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U';
                  return (
                    <div key={avaliacao.id} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg shadow border-l-8 ${notaColor} ${notaBg}`}>
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white ${avaliacao.nota === 5 ? 'bg-green-400' : avaliacao.nota === 4 ? 'bg-yellow-400' : avaliacao.nota === 3 ? 'bg-orange-400' : 'bg-red-400'}`}>{iniciais}</div>
                        <div>
                          <span className="font-semibold text-gray-900">{avaliacao.paciente_nome || 'Usuário'}</span>
                          <div className="text-xs text-gray-500">{avaliacao.nota}★</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 text-gray-800 text-base">{avaliacao.comentario}</div>
                        {avaliacao.resposta ? (
                          <div className="text-sm text-blue-600 mt-2">
                            <span className="font-semibold">Resposta:</span> {avaliacao.resposta}
                          </div>
                        ) : (
                          <form className="flex gap-2 items-center mt-2" onSubmit={e => {e.preventDefault(); handleResponder(avaliacao.id);}}>
                            <input
                              type="text"
                              className="border-2 border-blue-200 rounded px-3 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="Responder avaliação..."
                              value={respostas[avaliacao.id] || ''}
                              onChange={e => setRespostas({ ...respostas, [avaliacao.id]: e.target.value })}
                            />
                            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!respostas[avaliacao.id]}>Responder</Button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              {avaliacoes.filter(a => !filtroNota || a.nota === filtroNota).length === 0 && (
                <div className="text-center text-gray-500">Nenhuma avaliação encontrada.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pedidos">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold">Pedidos Recebidos</CardTitle>
            <span className="ml-auto text-xs text-gray-500">Total: {pedidos.length}</span>
          </CardHeader>
          <CardContent>
            {pedidosLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Carregando pedidos...</span>
              </div>
            ) : pedidos.length > 0 ? (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Pedido #{pedido.numero_pedido || pedido.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {pedido.paciente_nome || 'Cliente'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                          pedido.status === 'concluido' ? 'bg-green-100 text-green-800' :
                          pedido.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pedido.status === 'pendente' ? 'Pendente' :
                           pedido.status === 'em_andamento' ? 'Em Andamento' :
                           pedido.status === 'concluido' ? 'Concluído' :
                           pedido.status === 'cancelado' ? 'Cancelado' :
                           pedido.status}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrderForChat(pedido);
                            setShowChatModal(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Data do Pedido</p>
                        <p className="font-medium text-gray-900">
                          {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor Total</p>
                        <p className="font-medium text-gray-900">
                          R$ {(Number(pedido.total) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">Itens do Pedido:</p>
                      <div className="space-y-2">
                        {pedido.itens?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-800">{item.produto_nome || 'Produto'}</span>
                            <span className="text-gray-600">
                              {item.quantidade}x R$ {(Number(item.preco) || 0).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Nenhum pedido recebido ainda</p>
                <p className="text-sm">Os pedidos aparecerão aqui quando os clientes fizerem compras</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="produtos">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <Package className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold">Lista de Produtos</CardTitle>
            <span className="ml-auto text-xs text-gray-500">Total: {produtos.length}</span>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {produtos.map((produto) => (
                <div key={produto.id} className="flex flex-col bg-white rounded-lg shadow border p-4 gap-2 relative">
                  <div className="flex items-center gap-3">
                    <ProductImage 
                      src={produto.imagem} 
                      alt={produto.nome} 
                      size="md"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">{produto.nome}</div>
                      <div className="text-xs text-gray-500 mb-1">{produto.descricao}</div>
                      <div className="flex items-center gap-2">
                        {produto.preco_original && produto.preco_original > produto.preco ? (
                          <>
                            <span className="text-sm text-gray-400 line-through">R$ {(Number(produto.preco_original) || 0).toFixed(2)}</span>
                            <span className="text-xl font-bold text-blue-700">R$ {(Number(produto.preco) || 0).toFixed(2)}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              -{Math.round(((Number(produto.preco_original) - Number(produto.preco)) / Number(produto.preco_original)) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-700">R$ {(Number(produto.preco) || 0).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${(Number(produto.estoque) || 0) <= 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      Estoque: {produto.estoque || 0}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${produto.ativo === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {produto.ativo === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="destructive" onClick={() => { setProdutoDesativar(produto); setConfirmOpen(true); }}>Excluir</Button>
                    {produto.ativo === 1 ? (
                      <Button size="sm" variant="outline" onClick={() => handleDesativarProduto(produto.id)}>Desativar</Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleAtivarProduto(produto.id)}>Ativar</Button>
                    )}
                  </div>
                  {produto.preco_original && produto.preco_original > produto.preco && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded shadow">EM DESCONTO</span>
                  )}
                </div>
              ))}
      </div>
          </CardContent>
        </Card>
        
        {/* Modal de confirmação de exclusão */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Produto</DialogTitle>
              <DialogDescription>
                Esta ação irá excluir permanentemente o produto selecionado. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">Tem certeza que deseja excluir o produto <span className="font-bold">{produtoDesativar?.nome}</span>?</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleExcluirProduto}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        

      </TabsContent>

      {/* Modal de Chat do Pedido */}
      {selectedOrderForChat && (
        <OrderChat
          order={selectedOrderForChat}
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedOrderForChat(null);
          }}
        />
      )}
    </Tabs>
  );
};

export default Pharmacy;
