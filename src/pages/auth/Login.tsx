import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Loader2, Package, Truck, CreditCard, Users, BarChart3, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { toast } from 'react-hot-toast';
import logo from '@/assets/logo-ext.png';
import logoWhite from '@/assets/logo-ext-w.png';

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  lembrarSenha: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Dados dos cards do carrossel
const featureCards = [
  {
    title: "Gestão Inteligente",
    description: "Controle completo de pedidos, estoque e clientes em uma plataforma integrada e intuitiva.",
    icon: <Package className="h-8 w-8 text-white" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Entrega Rápida",
    description: "Sistema de rastreamento em tempo real para acompanhar cada entrega até o destino final.",
    icon: <Truck className="h-8 w-8 text-white" />,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Pagamentos Seguros",
    description: "Processamento seguro de pagamentos com múltiplas opções de pagamento integradas.",
    icon: <CreditCard className="h-8 w-8 text-white" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Atendimento Personalizado",
    description: "Ferramentas para melhorar o relacionamento com clientes e aumentar a satisfação.",
    icon: <Users className="h-8 w-8 text-white" />,
    color: "from-pink-500 to-pink-600"
  },
  {
    title: "Relatórios Detalhados",
    description: "Análises completas de vendas, performance e tendências para tomada de decisões.",
    icon: <BarChart3 className="h-8 w-8 text-white" />,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Suporte 24/7",
    description: "Sistema de chat integrado para atendimento rápido e eficiente aos clientes.",
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    color: "from-teal-500 to-teal-600"
  },
  {
    title: "Agendamento Inteligente",
    description: "Organize consultas e entregas com um sistema de agenda automatizado e eficiente.",
    icon: <Calendar className="h-8 w-8 text-white" />,
    color: "from-orange-500 to-orange-600"
  },
  {
    title: "Documentação Digital",
    description: "Gerencie prescrições e documentos médicos de forma segura e organizada.",
    icon: <FileText className="h-8 w-8 text-white" />,
    color: "from-red-500 to-red-600"
  }
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-rotacionar carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % featureCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Verificar se foi redirecionado por acesso negado
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessDenied = urlParams.get('accessDenied');
    const userType = urlParams.get('userType');
    const requiredType = urlParams.get('requiredType');
    
    if (accessDenied === 'true') {
      let message = 'Você não tem permissão para acessar esta área.';
      
      if (userType && requiredType) {
        message += `\n\nTipo de usuário atual: ${userType}\nTipos permitidos: ${requiredType}`;
      }
      
      message += '\n\nPor favor, faça login com uma conta de farmácia para continuar.';
      
      setInfoMessage(message);
    }
  }, []);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
      lembrarSenha: false,
    },
  });

  // Função para limpar mensagem quando o usuário começar a digitar
  const handleFieldFocus = () => {
    if (infoMessage) {
      setInfoMessage(null);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    console.log('🔐 Iniciando processo de login...', data);
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.senha);
      if (success) {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        // Mostrar mensagem de erro mais específica
        setInfoMessage('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        // Limpar campos de senha
        loginForm.setValue('senha', '');
        // Focar no campo de senha
        document.getElementById('senha')?.focus();
      }
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      // Mensagens de erro mais específicas baseadas no tipo de erro
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Conta bloqueada ou inativa. Entre em contato com o suporte.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      setInfoMessage(errorMessage);
      // Limpar campos de senha
      loginForm.setValue('senha', '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-orange-50 flex relative overflow-hidden" data-testid="login-page">
      {/* Partículas flutuantes animadas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-float delay-1000 opacity-60"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-400 rounded-full animate-float delay-2000 opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-orange-400 rounded-full animate-float delay-3000 opacity-60"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float delay-1500 opacity-60"></div>
        <div className="absolute top-80 right-1/3 w-3 h-3 bg-orange-400 rounded-full animate-float delay-2500 opacity-60"></div>
      </div>

      {/* Lado esquerdo - Carrossel de recursos */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-orange-500 p-8 items-center justify-center relative overflow-hidden">
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-3000"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-md flex flex-col items-center">
          <img src={logoWhite} alt="Logo Vitalis" className="h-24 drop-shadow-lg mb-4" />
          <p className="text-base text-blue-50 mb-8 px-2">
            O Gestor de Pedidos Vitalis foi desenvolvido para facilitar o controle, o acompanhamento e a automação dos pedidos da sua farmácia. Tenha mais agilidade, organização e integração em todos os processos, do estoque à entrega.
          </p>
          {/* Carrossel de cards */}
          <div className="relative h-72 mb-8 w-full">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentCard
                    ? 'opacity-100 translate-x-0 scale-100 rotate-y-0'
                    : index < currentCard
                    ? 'opacity-0 -translate-x-full scale-95 rotate-y-12'
                    : 'opacity-0 translate-x-full scale-95 -rotate-y-12'
                }`}
              >
                <Card className={`bg-white/10 backdrop-blur-sm border-white/20 text-white card-hover h-full`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-4 bg-gradient-to-r ${card.color} rounded-full shadow-lg animate-pulse-glow`}>
                        {card.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-100 text-lg leading-relaxed font-medium">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-3">
            {featureCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCard 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md animate-slide-in-right">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Logo Vitalis" className="h-20 mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Vitalis</h2>
            <p className="text-gray-600">Gerencie sua farmácia de forma inteligente e eficiente</p>
          </div>
          
          {/* Mensagem Informativa ou de Erro */}
          {infoMessage && (
            <div className={`mb-6 p-4 border rounded-lg ${
              infoMessage.includes('Credenciais inválidas') || 
              infoMessage.includes('Email ou senha incorretos') ||
              infoMessage.includes('Conta bloqueada') ||
              infoMessage.includes('Erro ao fazer login') ||
              infoMessage.includes('Erro no servidor') ||
              infoMessage.includes('Erro de conexão')
                ? 'bg-red-50 border-red-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {infoMessage.includes('Credenciais inválidas') || 
                   infoMessage.includes('Email ou senha incorretos') ||
                   infoMessage.includes('Conta bloqueada') ||
                   infoMessage.includes('Erro ao fazer login') ||
                   infoMessage.includes('Erro no servidor') ||
                   infoMessage.includes('Erro de conexão') ? (
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${
                      infoMessage.includes('Credenciais inválidas') || 
                      infoMessage.includes('Email ou senha incorretos') ||
                      infoMessage.includes('Conta bloqueada') ||
                      infoMessage.includes('Erro ao fazer login') ||
                      infoMessage.includes('Erro no servidor') ||
                      infoMessage.includes('Erro de conexão')
                        ? 'text-red-800' 
                        : 'text-blue-800'
                    }`}>
                      {infoMessage.includes('Credenciais inválidas') || 
                       infoMessage.includes('Email ou senha incorretos') ||
                       infoMessage.includes('Conta bloqueada') ||
                       infoMessage.includes('Erro ao fazer login') ||
                       infoMessage.includes('Erro no servidor') ||
                       infoMessage.includes('Erro de conexão') 
                        ? 'Erro de Login' 
                        : 'Informação Importante'
                      }
                    </h3>
                    <button
                      onClick={() => setInfoMessage(null)}
                      className={`hover:opacity-70 transition-opacity ${
                        infoMessage.includes('Credenciais inválidas') || 
                        infoMessage.includes('Email ou senha incorretos') ||
                        infoMessage.includes('Conta bloqueada') ||
                        infoMessage.includes('Erro ao fazer login') ||
                        infoMessage.includes('Erro no servidor') ||
                        infoMessage.includes('Erro de conexão')
                          ? 'text-red-400' 
                          : 'text-blue-400'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className={`text-sm whitespace-pre-line ${
                    infoMessage.includes('Credenciais inválidas') || 
                    infoMessage.includes('Email ou senha incorretos') ||
                    infoMessage.includes('Conta bloqueada') ||
                    infoMessage.includes('Erro ao fazer login') ||
                    infoMessage.includes('Erro no servidor') ||
                    infoMessage.includes('Erro de conexão')
                      ? 'text-red-700' 
                      : 'text-blue-700'
                  }`}>
                    {infoMessage}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              console.log('📝 Form submit event triggered');
              e.preventDefault();
              loginForm.handleSubmit(onLoginSubmit)(e);
            }} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  onFocus={handleFieldFocus}
                  data-testid="email-input"
                  {...loginForm.register('email')}
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500 animate-pulse">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  onFocus={handleFieldFocus}
                  data-testid="password-input"
                  {...loginForm.register('senha')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginForm.formState.errors.senha && (
                <p className="text-sm text-red-500 animate-pulse">
                  {loginForm.formState.errors.senha.message}
                </p>
              )}
            </div>

            {/* Lembrar senha e Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lembrarSenha"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...loginForm.register('lembrarSenha')}
                />
                <Label htmlFor="lembrarSenha" className="text-sm text-gray-700">
                  Lembrar senha
                </Label>
              </div>
              <Link 
                to="/esqueceu-senha" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              disabled={isLoading}
              data-testid="login-button"
              onClick={(e) => {
                console.log('🔘 Botão de login clicado');
                // Não precisamos fazer nada aqui, o form onSubmit vai cuidar
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>

            {/* Link para cadastro */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Não tem uma conta?{' '}
                <Link 
                  to="/cadastro" 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
} 