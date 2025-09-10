import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import logo from '@/assets/logo-ext.png';

const CadastroConcluido = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Sequência de animações
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowCheckmark(true), 800);
    const timer3 = setTimeout(() => setShowFeatures(true), 1200);
    const timer4 = setTimeout(() => setShowButton(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Gestão Completa",
      description: "Controle total do seu negócio"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Experiência Premium",
      description: "Interface moderna e intuitiva"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Suporte 24/7",
      description: "Assistência sempre disponível"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 from-0% via-blue-900 via-15% via-orange-400 via-55% to-orange-500 to-100% relative overflow-hidden">
      {/* Partículas animadas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white/95 rounded-xl shadow-2xl p-8 animate-fade-in backdrop-blur-md relative z-10">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Logo Vitalis" 
            className={`h-16 mx-auto mb-4 drop-shadow-lg transition-all duration-1000 ${
              showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`} 
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="text-center space-y-6">
          {/* Título e Subtítulo */}
          <div className={`transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cadastro Concluído!
            </h1>
            <p className="text-xl text-gray-600">
              Bem-vindo à plataforma Vitalis
            </p>
          </div>

          {/* Checkmark Animado */}
          <div className={`flex justify-center transition-all duration-1000 delay-500 ${
            showCheckmark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
              </div>
              {/* Círculos concêntricos animados */}
              <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-green-400 animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Mensagem de Sucesso */}
          <div className={`transition-all duration-1000 delay-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-lg text-gray-700 mb-2">
              Sua conta foi criada com sucesso!
            </p>
            <p className="text-gray-600">
              Enviamos um email de confirmação para ativar sua conta.
            </p>
          </div>

          {/* Features Cards */}
          <div className={`grid md:grid-cols-3 gap-4 mt-8 transition-all duration-1000 delay-1000 ${
            showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-blue-50 to-orange-50 p-6 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${1200 + index * 200}ms` }}
              >
                <div className="text-blue-600 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className={`flex justify-center mt-8 transition-all duration-1000 delay-1500 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ir para Login
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Informações Adicionais */}
          <div className={`mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-1000 delay-2000 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-sm text-blue-800">
              🎉 <strong>Parabéns!</strong> Sua farmácia agora faz parte da plataforma Vitalis.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Faça login para começar a usar todas as funcionalidades disponíveis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroConcluido; 