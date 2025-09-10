import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Users, CreditCard, Truck } from 'lucide-react';
import logo from '@/assets/logo-ext.png';

const TermosCondicao = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 from-0% via-blue-900 via-15% via-orange-400 via-55% to-orange-500 to-100%">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/cadastro">
              <Button variant="outline" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Cadastro
              </Button>
            </Link>
          </div>
          <img src={logo} alt="Logo Vitalis" className="h-12 drop-shadow-lg" />
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto bg-white/95 rounded-xl shadow-xl p-8 backdrop-blur-md">
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos e Condições</h1>
            <p className="text-gray-600 text-lg">Plataforma Vitalis - Sistema para Farmácias</p>
            <p className="text-sm text-gray-500 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8">
            {/* Seção 1: Aceitação dos Termos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                1. Aceitação dos Termos
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-800 leading-relaxed">
                  Ao acessar e utilizar a plataforma Vitalis, você concorda em cumprir e estar vinculado a estes Termos e Condições. 
                  Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
                </p>
              </div>
            </section>

            {/* Seção 2: Descrição do Serviço */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-6 w-6 text-orange-600 mr-2" />
                2. Descrição do Serviço
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  A plataforma Vitalis é um sistema completo de gestão para farmácias que oferece:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Gestão de pedidos e estoque</li>
                  <li>Sistema de delivery e rastreamento</li>
                  <li>Telemedicina e consultas online</li>
                  <li>Gestão de pacientes e prescrições</li>
                  <li>Sistema de pagamentos integrado</li>
                  <li>Relatórios e analytics</li>
      </ul>
              </div>
            </section>

            {/* Seção 3: Responsabilidades da Farmácia */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-2" />
                3. Responsabilidades da Farmácia
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">Qualidade dos Produtos</h3>
                  <p className="text-green-700">
                    A farmácia é responsável por garantir a qualidade, validade e procedência de todos os produtos comercializados através da plataforma.
                  </p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-2">Prescrições Médicas</h3>
                  <p className="text-yellow-700">
                    É obrigatório verificar a autenticidade das prescrições médicas e garantir que os medicamentos sejam dispensados conforme a legislação vigente.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">Dados dos Pacientes</h3>
                  <p className="text-blue-700">
                    A farmácia deve proteger a privacidade e confidencialidade dos dados dos pacientes, seguindo a LGPD (Lei Geral de Proteção de Dados).
                  </p>
                </div>
              </div>
            </section>

            {/* Seção 4: Pagamentos e Cobranças */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-6 w-6 text-purple-600 mr-2" />
                4. Pagamentos e Cobranças
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  A plataforma Vitalis oferece diferentes planos de assinatura:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Plano Básico</h4>
                    <p className="text-purple-700 text-sm">Funcionalidades essenciais para pequenas farmácias</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Plano Profissional</h4>
                    <p className="text-purple-700 text-sm">Recursos avançados para farmácias em crescimento</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Plano Enterprise</h4>
                    <p className="text-purple-700 text-sm">Solução completa para redes de farmácias</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Os pagamentos são processados de forma segura através de gateways de pagamento certificados. 
                  A cobrança é realizada mensalmente ou anualmente, conforme o plano escolhido.
                </p>
              </div>
            </section>

            {/* Seção 5: Privacidade e Segurança */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-red-600 mr-2" />
                5. Privacidade e Segurança
              </h2>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 leading-relaxed">
                  Sua privacidade é fundamental para nós. Todos os dados são criptografados e armazenados em servidores seguros. 
                  Não compartilhamos informações pessoais com terceiros sem seu consentimento explícito, exceto quando exigido por lei.
                </p>
              </div>
            </section>

            {/* Seção 6: Limitação de Responsabilidade */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A plataforma Vitalis é fornecida "como está" e "conforme disponível". 
                  Não garantimos que o serviço será ininterrupto ou livre de erros.
                </p>
                <p>
                  A farmácia é responsável por suas próprias operações, incluindo a qualidade dos produtos, 
                  atendimento ao cliente e cumprimento das regulamentações locais.
                </p>
              </div>
            </section>

            {/* Seção 7: Modificações */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modificações dos Termos</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação na plataforma. 
                  O uso continuado do serviço após as modificações constitui aceitação dos novos termos.
                </p>
              </div>
            </section>

            {/* Seção 8: Contato */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contato</h2>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800">
                  Para dúvidas sobre estes termos, entre em contato conosco:
                </p>
                <div className="mt-4 space-y-2 text-blue-700">
                  <p>📧 Email: suporte@vitalis.com.br</p>
                  <p>📞 Telefone: (11) 9999-9999</p>
                  <p>🌐 Website: www.vitalis.com.br</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Ao utilizar a plataforma Vitalis, você confirma que leu, entendeu e concorda com estes Termos e Condições.
            </p>
            <Link to="/cadastro">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Cadastro
              </Button>
            </Link>
          </div>
        </div>
    </div>
  </div>
);
};

export default TermosCondicao; 