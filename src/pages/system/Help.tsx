import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Video,
  Download,
  ExternalLink
} from 'lucide-react';

interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  dataCriacao: string;
  ultimaAtualizacao: string;
  resposta?: string;
}

interface FAQ {
  categoria: string;
  perguntas: Array<{
    pergunta: string;
    resposta: string;
    tags: string[];
  }>;
}

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    prioridade: 'media' as const
  });

  // Dados simulados de tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      titulo: 'Problema ao cadastrar produtos',
      descricao: 'Não consigo adicionar novos produtos no sistema. Aparece erro 500.',
      categoria: 'Produtos',
      prioridade: 'alta',
      status: 'em_andamento',
      dataCriacao: '2025-07-08T10:00:00Z',
      ultimaAtualizacao: '2025-07-08T14:30:00Z',
      resposta: 'Estamos investigando o problema. Em breve entraremos em contato.'
    },
    {
      id: 2,
      titulo: 'Dúvida sobre relatórios',
      descricao: 'Como posso exportar relatórios em PDF?',
      categoria: 'Relatórios',
      prioridade: 'baixa',
      status: 'resolvido',
      dataCriacao: '2025-07-07T15:20:00Z',
      ultimaAtualizacao: '2025-07-08T09:15:00Z',
      resposta: 'Na página de relatórios, clique no botão "Exportar PDF" no canto superior direito.'
    }
  ]);

  // FAQ completo
  const faqs: FAQ[] = [
    {
      categoria: 'Produtos',
      perguntas: [
        {
          pergunta: 'Como adicionar um novo produto?',
          resposta: 'Acesse a página "Produtos" e clique no botão "Adicionar Produto". Preencha todos os campos obrigatórios (nome, preço, estoque) e clique em "Salvar". Você pode adicionar uma imagem do produto e definir se é necessário receita médica.',
          tags: ['produtos', 'cadastro', 'estoque']
        },
        {
          pergunta: 'Como editar informações de um produto?',
          resposta: 'Na lista de produtos, clique no botão "Editar" ao lado do produto desejado. Faça as alterações necessárias e clique em "Salvar". As mudanças são aplicadas imediatamente.',
          tags: ['produtos', 'edição', 'atualização']
        },
        {
          pergunta: 'Como gerenciar o estoque?',
          resposta: 'O estoque é atualizado automaticamente quando há vendas. Para ajustes manuais, edite o produto e altere a quantidade em estoque. Produtos com estoque baixo (≤5 unidades) aparecem destacados em vermelho.',
          tags: ['estoque', 'inventário', 'controle']
        },
        {
          pergunta: 'Como definir descontos em produtos?',
          resposta: 'Ao editar um produto, você pode definir um valor de desconto. O preço final será calculado automaticamente (preço original - desconto). Descontos aparecem destacados na interface.',
          tags: ['descontos', 'preços', 'promoções']
        }
      ]
    },
    {
      categoria: 'Pedidos',
      perguntas: [
        {
          pergunta: 'Como visualizar todos os pedidos?',
          resposta: 'Acesse a página "Pedidos" para ver todos os pedidos da farmácia. Use os filtros para buscar por status, data ou cliente. Os pedidos são ordenados por data de criação (mais recentes primeiro).',
          tags: ['pedidos', 'visualização', 'filtros']
        },
        {
          pergunta: 'Como alterar o status de um pedido?',
          resposta: 'Na lista de pedidos, clique no botão de ação correspondente ao status desejado. Os status disponíveis são: Pendente, Em Preparo, Pronto para Entrega, Em Entrega, Entregue e Cancelado.',
          tags: ['status', 'pedidos', 'atualização']
        },
        {
          pergunta: 'Como cancelar um pedido?',
          resposta: 'Apenas pedidos com status "Pendente" podem ser cancelados. Clique no botão "Cancelar" e confirme a ação. Pedidos em preparo ou entregues não podem ser cancelados.',
          tags: ['cancelamento', 'pedidos', 'restrições']
        },
        {
          pergunta: 'Como rastrear entregas?',
          resposta: 'Pedidos com status "Em Entrega" mostram informações de rastreamento. Clique no pedido para ver detalhes da entrega, incluindo localização do entregador e tempo estimado.',
          tags: ['rastreamento', 'entrega', 'localização']
        }
      ]
    },
    {
      categoria: 'Relatórios',
      perguntas: [
        {
          pergunta: 'Como acessar relatórios de vendas?',
          resposta: 'Acesse a página "Relatórios" e selecione o período desejado. Você pode visualizar vendas por dia, semana, mês ou ano. Os relatórios incluem gráficos e tabelas detalhadas.',
          tags: ['relatórios', 'vendas', 'análise']
        },
        {
          pergunta: 'Como exportar relatórios?',
          resposta: 'Na página de relatórios, clique no botão "Exportar PDF" ou "Exportar Excel" no canto superior direito. Os arquivos serão baixados automaticamente no seu dispositivo.',
          tags: ['exportação', 'PDF', 'Excel']
        },
        {
          pergunta: 'Quais tipos de relatórios estão disponíveis?',
          resposta: 'Relatórios de vendas, produtos mais vendidos, clientes, pedidos por status, faturamento por período e análise de estoque. Todos os relatórios podem ser filtrados por data.',
          tags: ['tipos', 'relatórios', 'métricas']
        }
      ]
    },
    {
      categoria: 'Configurações',
      perguntas: [
        {
          pergunta: 'Como alterar dados da farmácia?',
          resposta: 'Acesse a página "Farmácia" e clique em "Editar Dados". Você pode alterar nome, CNPJ, endereço, telefone e email. Clique em "Salvar" para aplicar as mudanças.',
          tags: ['perfil', 'dados', 'atualização']
        },
        {
          pergunta: 'Como alterar minha senha?',
          resposta: 'Acesse a página "Perfil" e clique em "Alterar Senha". Digite sua senha atual e a nova senha duas vezes. Clique em "Salvar" para confirmar a alteração.',
          tags: ['senha', 'segurança', 'perfil']
        },
        {
          pergunta: 'Como configurar notificações?',
          resposta: 'Na página "Configurações", você pode ativar/desativar notificações por email e push. Configure alertas para estoque baixo, novos pedidos e problemas do sistema.',
          tags: ['notificações', 'alertas', 'configuração']
        }
      ]
    }
  ];

  // Funções
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCreateTicket = () => {
    if (!newTicket.titulo || !newTicket.descricao || !newTicket.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const ticket: Ticket = {
      id: Date.now(),
      titulo: newTicket.titulo,
      descricao: newTicket.descricao,
      categoria: newTicket.categoria,
      prioridade: newTicket.prioridade,
      status: 'aberto',
      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString()
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ titulo: '', descricao: '', categoria: '', prioridade: 'media' });
    setTicketDialogOpen(false);

    toast.success("Ticket criado com sucesso! Entraremos em contato em breve.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFaqs = faqs.map(categoria => ({
    ...categoria,
    perguntas: categoria.perguntas.filter(faq =>
      (faq.pergunta?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (faq.resposta?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      faq.tags?.some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase())) || false
    )
  })).filter(categoria => categoria.perguntas.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajuda e Suporte</h1>
          <p className="text-gray-600 mt-2">Encontre respostas para suas dúvidas e abra tickets de suporte</p>
        </div>
        <Button onClick={() => setTicketDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Meus Tickets
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Guias
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar no FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Digite sua dúvida ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {filteredFaqs.map((categoria, categoriaIndex) => (
            <Card key={categoriaIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{categoria.categoria}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoria.perguntas.map((faq, faqIndex) => {
                  const globalIndex = categoriaIndex * 100 + faqIndex;
                  const isExpanded = expandedFaqs.includes(globalIndex);
                  
                  return (
                    <div key={faqIndex} className="border rounded-lg">
        <button
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                        onClick={() => toggleFaq(globalIndex)}
        >
                        <span className="font-medium text-gray-900">{faq.pergunta}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-700 mb-3">{faq.resposta}</p>
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
      </div>
                      )}
            </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Meus Tickets de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum ticket encontrado</p>
                  <Button 
                    onClick={() => setTicketDialogOpen(true)} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Criar Primeiro Ticket
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{ticket.titulo}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.prioridade)}>
                              {ticket.prioridade}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{ticket.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Categoria: {ticket.categoria}</span>
                            <span>Criado: {new Date(ticket.dataCriacao).toLocaleDateString()}</span>
                            <span>Atualizado: {new Date(ticket.ultimaAtualizacao).toLocaleDateString()}</span>
                          </div>
                          {ticket.resposta && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">Resposta do Suporte:</p>
                              <p className="text-sm text-blue-800">{ticket.resposta}</p>
        </div>
      )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
            </div>
          ))}
        </div>
      )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Vídeos Tutoriais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Primeiros Passos</h4>
                      <p className="text-sm text-gray-600">Como configurar sua farmácia</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Gerenciando Produtos</h4>
                      <p className="text-sm text-gray-600">Adicionar e editar produtos</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Processando Pedidos</h4>
                      <p className="text-sm text-gray-600">Fluxo completo de pedidos</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Documentação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Manual do Usuário</h4>
                      <p className="text-sm text-gray-600">Guia completo do sistema</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Política de Privacidade</h4>
                      <p className="text-sm text-gray-600">Como protegemos seus dados</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Termos de Uso</h4>
                      <p className="text-sm text-gray-600">Condições de uso do sistema</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contatos de Suporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Suporte Urgente</h4>
                      <p className="text-sm text-gray-600">Problemas críticos do sistema</p>
                      <p className="text-sm font-medium">(11) 99999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Suporte Técnico</h4>
                      <p className="text-sm text-gray-600">Dúvidas e problemas gerais</p>
                      <p className="text-sm font-medium">suporte@vitalis.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Comercial</h4>
                      <p className="text-sm text-gray-600">Planos e contratos</p>
                      <p className="text-sm font-medium">comercial@vitalis.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Segunda a Sexta</span>
                    <span className="text-gray-600">8h às 18h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Sábados</span>
                    <span className="text-gray-600">8h às 12h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Domingos</span>
                    <span className="text-gray-600">Fechado</span>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Suporte 24h:</strong> Para problemas críticos que afetam o funcionamento da farmácia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar novo ticket */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Ticket de Suporte</DialogTitle>
            <DialogDescription>
              Descreva detalhadamente o problema ou dúvida para que possamos ajudá-lo da melhor forma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                placeholder="Resumo do problema..."
                value={newTicket.titulo}
                onChange={(e) => setNewTicket({...newTicket, titulo: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria *</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={newTicket.categoria}
                onChange={(e) => setNewTicket({...newTicket, categoria: e.target.value})}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Produtos">Produtos</option>
                <option value="Pedidos">Pedidos</option>
                <option value="Relatórios">Relatórios</option>
                <option value="Configurações">Configurações</option>
                <option value="Pagamentos">Pagamentos</option>
                <option value="Sistema">Problemas do Sistema</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={newTicket.prioridade}
                onChange={(e) => setNewTicket({...newTicket, prioridade: e.target.value as any})}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição *</label>
              <Textarea
                placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzir, se aplicável..."
                value={newTicket.descricao}
                onChange={(e) => setNewTicket({...newTicket, descricao: e.target.value})}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTicket} className="bg-blue-600 hover:bg-blue-700">
              Criar Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar ticket */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{selectedTicket.titulo}</h3>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(selectedTicket.prioridade)}>
                  {selectedTicket.prioridade}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Descrição:</h4>
                <p className="text-gray-700">{selectedTicket.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Categoria:</span>
                  <p className="text-gray-600">{selectedTicket.categoria}</p>
                </div>
                <div>
                  <span className="font-medium">Criado em:</span>
                  <p className="text-gray-600">{new Date(selectedTicket.dataCriacao).toLocaleString()}</p>
                </div>
              </div>
              {selectedTicket.resposta && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Resposta do Suporte:</h4>
                  <p className="text-blue-800">{selectedTicket.resposta}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    Atualizado em: {new Date(selectedTicket.ultimaAtualizacao).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedTicket(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 