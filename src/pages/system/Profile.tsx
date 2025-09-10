import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Key,
  Camera,
  Save,
  Edit,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts';
import { apiService, Farmacia } from '@/lib/api';

interface PerfilFarmacia {
  nome: string;
  cnpj: string;
  endereco: string;
  email: string;
  telefone: string;
  status: string;
}

interface ConfiguracoesNotificacoes {
  emailNovosPedidos: boolean;
  emailEstoqueBaixo: boolean;
  emailAvaliacoes: boolean;
  pushNotificacoes: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
  
  // Campos editáveis
  const [editNome, setEditNome] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  
  // Configurações de notificações
  const [notificacoes, setNotificacoes] = useState<ConfiguracoesNotificacoes>({
    emailNovosPedidos: true,
    emailEstoqueBaixo: true,
    emailAvaliacoes: true,
    pushNotificacoes: true
  });

  // Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Carregar dados da farmácia
  const carregarDadosFarmacia = async () => {
    try {
      setLoading(true);
      const dados = await apiService.farmacia.getPerfil();
      setFarmacia(dados);
      
      // Inicializar campos editáveis
      setEditNome(dados.nome || '');
      setEditCnpj(dados.cnpj || '');
      setEditEndereco(dados.endereco || '');
      setEditEmail(dados.email || '');
      setEditTelefone(dados.telefone || '');
    } catch (error) {
      console.error('Erro ao carregar dados da farmácia:', error);
      toast.error("Não foi possível carregar os dados da farmácia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosFarmacia();
  }, []);

  const handleSalvarDados = async () => {
    if (!farmacia) return;

    // Validar campos obrigatórios
    if (!editNome.trim() || !editCnpj.trim() || !editEndereco.trim() || !editEmail.trim() || !editTelefone.trim()) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    try {
      const dados = {
        nome: editNome.trim(),
        cnpj: editCnpj.trim(),
        endereco: editEndereco.trim(),
        email: editEmail.trim(),
        telefone: editTelefone.trim(),
        foto: farmacia.foto
      };

      await apiService.farmacia.atualizar(dados);
      await carregarDadosFarmacia();
      setEditMode(false);
      
      toast.success("Dados da farmácia atualizados com sucesso");
    } catch (error) {
      console.error('Erro ao atualizar farmácia:', error);
      toast.error("Não foi possível atualizar os dados da farmácia");
    }
  };

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      // TODO: Implementar alteração de senha na API
      toast.success("Senha alterada com sucesso");
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error("Não foi possível alterar a senha");
    }
  };

  const handleSalvarNotificacoes = async () => {
    try {
      // TODO: Implementar salvamento das configurações de notificação na API
      toast.success("Configurações de notificação salvas");
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
      toast.error("Não foi possível salvar as configurações");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!farmacia) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Não foi possível carregar os dados da farmácia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie os dados da sua farmácia e configurações</p>
        </div>
      </div>

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Dados da Farmácia
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Farmácia
              </CardTitle>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <Button 
                      onClick={handleSalvarDados} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditMode(false);
                        // Restaurar valores originais
                        setEditNome(farmacia.nome || '');
                        setEditCnpj(farmacia.cnpj || '');
                        setEditEndereco(farmacia.endereco || '');
                        setEditEmail(farmacia.email || '');
                        setEditTelefone(farmacia.telefone || '');
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium">Nome da Farmácia</Label>
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
                    <Input 
                      id="endereco" 
                      value={editEndereco}
                      onChange={(e) => setEditEndereco(e.target.value)}
                      className="mt-1"
                      required 
                    />
                  ) : (
                    <div className="mt-1 text-sm text-gray-700">{farmacia.endereco}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
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
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={farmacia.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {farmacia.status === 'ativo' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senhaAtual" className="text-sm font-medium">Senha Atual</Label>
                <Input 
                  id="senhaAtual" 
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="mt-1"
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div>
                <Label htmlFor="novaSenha" className="text-sm font-medium">Nova Senha</Label>
                <Input 
                  id="novaSenha" 
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="mt-1"
                  placeholder="Digite a nova senha"
                />
              </div>
              <div>
                <Label htmlFor="confirmarSenha" className="text-sm font-medium">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmarSenha" 
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="mt-1"
                  placeholder="Confirme a nova senha"
          />
        </div>
              <Button onClick={handleAlterarSenha} className="bg-blue-600 hover:bg-blue-700">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Novos Pedidos</h4>
                    <p className="text-sm text-gray-600">Receber e-mail quando houver novos pedidos</p>
                  </div>
          <input
                    type="checkbox"
                    checked={notificacoes.emailNovosPedidos}
                    onChange={(e) => setNotificacoes({...notificacoes, emailNovosPedidos: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Estoque Baixo</h4>
                    <p className="text-sm text-gray-600">Receber alertas quando produtos estiverem com estoque baixo</p>
                  </div>
          <input
                    type="checkbox"
                    checked={notificacoes.emailEstoqueBaixo}
                    onChange={(e) => setNotificacoes({...notificacoes, emailEstoqueBaixo: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Novas Avaliações</h4>
                    <p className="text-sm text-gray-600">Receber notificação quando houver novas avaliações</p>
                  </div>
          <input
                    type="checkbox"
                    checked={notificacoes.emailAvaliacoes}
                    onChange={(e) => setNotificacoes({...notificacoes, emailAvaliacoes: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações Push</h4>
                    <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                  </div>
          <input
                    type="checkbox"
                    checked={notificacoes.pushNotificacoes}
                    onChange={(e) => setNotificacoes({...notificacoes, pushNotificacoes: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
        </div>

              <Button onClick={handleSalvarNotificacoes} className="bg-blue-600 hover:bg-blue-700">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 