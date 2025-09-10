import React from 'react';

const TermosConduta = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Termos de Conduta - Vitalis para Farmácias</h1>
      <p className="mb-4 text-gray-700">Estes Termos de Conduta visam garantir a ética, a responsabilidade e o respeito no uso da plataforma Vitalis por farmácias parceiras.</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Respeitar a privacidade e os dados dos pacientes e clientes.</li>
        <li>Utilizar a plataforma apenas para fins lícitos e autorizados.</li>
        <li>Manter informações cadastrais e de pedidos sempre atualizadas e verdadeiras.</li>
        <li>Não compartilhar acessos ou informações confidenciais com terceiros não autorizados.</li>
        <li>Colaborar para um ambiente digital seguro e confiável para todos os usuários.</li>
      </ul>
      <p className="mt-6 text-gray-600 text-sm">Em caso de dúvidas, entre em contato com o suporte Vitalis.</p>
    </div>
  </div>
);

export default TermosConduta; 