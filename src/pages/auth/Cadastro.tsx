import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Phone, MapPin, Lock, Briefcase, FileText, Eye, EyeOff, FileCheck, Shield, User, Award, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import logo from '@/assets/logo-ext.png';
import { api } from '@/lib/api';
import { apiService } from '@/lib/api';

const tiposEmpresa = [
  'MEI', 'LTDA', 'EIRELI', 'SA', 'EI', 'Outra'
];

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const cadastroSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  tipoEmpresa: z.string().min(2, 'Selecione o tipo de empresa'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  rua: z.string().min(2, 'Rua obrigatória'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.string().min(2, 'Estado obrigatório'),
  cep: z.string().min(8, 'CEP inválido'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo')
    .refine((email) => {
      // Validar caracteres especiais no email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Email contém caracteres inválidos'),
  senha: z.string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
  // Documentos
  alvaraFuncionamento: z.string().min(1, 'Alvará de funcionamento é obrigatório'),
  autorizacaoVigilancia: z.string().min(1, 'Autorização da vigilância sanitária é obrigatória'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  responsavelTecnico: z.string().min(2, 'Nome do responsável técnico é obrigatório'),
  registroCRF: z.string().min(1, 'Registro CRF é obrigatório'),
  termos: z.boolean().refine(val => val, { message: 'Você deve aceitar os termos.' })
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não coincidem",
  path: ["confirmarSenha"],
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

// Função para formatar CNPJ
function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18);
}

// Função para formatar CEP
function formatCEP(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
}

// Função para formatar telefone
function formatTelefone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 12);
}

// Função para buscar CEP na API
async function buscarCEP(cep: string) {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return null;
    
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) return null;
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

const Cadastro = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [validandoCNPJ, setValidandoCNPJ] = useState(false);
  const [validandoDocumentos, setValidandoDocumentos] = useState({
    alvara: false,
    vigilancia: false,
    crf: false
  });
  const [resultadosValidacao, setResultadosValidacao] = useState({
    cnpj: null,
    alvara: null,
    vigilancia: null,
    crf: null
  });

  const cadastroForm = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { termos: false }
  });

  // Função para sanitizar inputs maliciosos
  const sanitizeInput = (value: string) => {
    // Remover tags HTML e scripts
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  // Função para validar caracteres especiais
  const validateSpecialChars = (value: string, field: 'email' | 'password') => {
    if (field === 'email') {
      // Email não deve conter caracteres especiais perigosos
      const dangerousChars = /[<>\"'%;()&+]/.test(value);
      return !dangerousChars;
    }
    // Senha pode conter caracteres especiais
    return true;
  };

  // Função para lidar com a busca do CEP
  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepFormatado = formatCEP(e.target.value);
    cadastroForm.setValue('cep', cepFormatado);
    
    const cepLimpo = cepFormatado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setBuscandoCEP(true);
      try {
        const dadosCEP = await buscarCEP(cepFormatado);
        if (dadosCEP) {
          cadastroForm.setValue('rua', dadosCEP.logradouro);
          cadastroForm.setValue('cidade', dadosCEP.localidade);
          cadastroForm.setValue('estado', dadosCEP.uf);
          toast.success('Endereço encontrado!');
        } else {
          toast.error('CEP não encontrado. Preencha manualmente.');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP. Preencha manualmente.');
      } finally {
        setBuscandoCEP(false);
      }
    }
  };

  // Função para validar CNPJ em tempo real
  const handleCNPJChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cnpjFormatado = formatCNPJ(e.target.value);
    cadastroForm.setValue('cnpj', cnpjFormatado);
    
    const cnpjLimpo = cnpjFormatado.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      setValidandoCNPJ(true);
      try {
        const resultado = await apiService.validacaoDocumentos.validarCNPJ(cnpjLimpo);
        setResultadosValidacao(prev => ({ ...prev, cnpj: resultado }));
        
        if (resultado.valido && !resultado.existe) {
          toast.success('CNPJ válido!');
        } else if (resultado.existe) {
          toast.error(resultado.erro);
        } else {
          toast.error(resultado.erro);
        }
      } catch (error) {
        toast.error('Erro ao validar CNPJ');
        setResultadosValidacao(prev => ({ ...prev, cnpj: { valido: false, erro: 'Erro na validação' } }));
      } finally {
        setValidandoCNPJ(false);
      }
    }
  };

  // Função para lidar com a mudança do telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefoneFormatado = formatTelefone(e.target.value);
    cadastroForm.setValue('telefone', telefoneFormatado);
  };

  // Função para validar alvará
  const validarAlvara = async () => {
    const numero = cadastroForm.watch('alvaraFuncionamento');
    const estado = cadastroForm.watch('estado');
    
    if (!numero || !estado) return;
    
    setValidandoDocumentos(prev => ({ ...prev, alvara: true }));
    try {
      const resultado = await apiService.validacaoDocumentos.validarAlvara(numero, estado);
      setResultadosValidacao(prev => ({ ...prev, alvara: resultado }));
      
      if (resultado.valido && !resultado.existe) {
        if (resultado.requer_aprovacao) {
          toast.success('Alvará válido! Aguardará aprovação após o cadastro.');
        } else {
          toast.success('Alvará válido!');
        }
      } else if (resultado.existe) {
        toast.error(resultado.erro);
      } else {
        toast.error(resultado.erro || 'Alvará inválido');
      }
    } catch (error) {
      toast.error('Erro ao validar alvará');
      setResultadosValidacao(prev => ({ ...prev, alvara: { valido: false, erro: 'Erro na validação' } }));
    } finally {
      setValidandoDocumentos(prev => ({ ...prev, alvara: false }));
    }
  };

  // Função para validar autorização da vigilância
  const validarVigilancia = async () => {
    const numero = cadastroForm.watch('autorizacaoVigilancia');
    const estado = cadastroForm.watch('estado');
    
    if (!numero || !estado) return;
    
    setValidandoDocumentos(prev => ({ ...prev, vigilancia: true }));
    try {
      const resultado = await apiService.validacaoDocumentos.validarVigilancia(numero, estado);
      setResultadosValidacao(prev => ({ ...prev, vigilancia: resultado }));
      
      if (resultado.valido && !resultado.existe) {
        toast.success('Autorização válida!');
      } else if (resultado.existe) {
        toast.error(resultado.erro);
      } else {
        toast.error('Autorização inválida');
      }
    } catch (error) {
      toast.error('Erro ao validar autorização');
    } finally {
      setValidandoDocumentos(prev => ({ ...prev, vigilancia: false }));
    }
  };

  // Função para validar CRF
  const validarCRF = async () => {
    const registro = cadastroForm.watch('registroCRF');
    const estado = cadastroForm.watch('estado');
    
    if (!registro || !estado) return;
    
    setValidandoDocumentos(prev => ({ ...prev, crf: true }));
    try {
      const resultado = await apiService.validacaoDocumentos.validarCRF(registro, estado);
      setResultadosValidacao(prev => ({ ...prev, crf: resultado }));
      
      if (resultado.valido && !resultado.existe) {
        toast.success('Registro CRF válido!');
      } else if (resultado.existe) {
        toast.error(resultado.erro);
      } else {
        toast.error('Registro CRF inválido');
      }
    } catch (error) {
      toast.error('Erro ao validar CRF');
    } finally {
      setValidandoDocumentos(prev => ({ ...prev, crf: false }));
    }
  };

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await cadastroForm.trigger(['nome', 'cnpj', 'tipoEmpresa', 'telefone']);
    } else if (step === 2) {
      valid = await cadastroForm.trigger(['rua', 'numero', 'cidade', 'estado', 'cep']);
    } else if (step === 3) {
      valid = await cadastroForm.trigger(['email', 'senha', 'confirmarSenha']);
    } else if (step === 4) {
      valid = await cadastroForm.trigger(['alvaraFuncionamento', 'autorizacaoVigilancia', 'responsavelTecnico', 'registroCRF']);
    }
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onCadastroSubmit = async (data: CadastroFormData) => {
    setIsLoading(true);
    try {
      // Sanitizar dados de entrada
      const sanitizedData = {
        nome: sanitizeInput(data.nome),
        email: sanitizeInput(data.email),
        senha: sanitizeInput(data.senha),
        cnpj: sanitizeInput(data.cnpj).replace(/\D/g, ''), // Remove formatação
        telefone: sanitizeInput(data.telefone).replace(/\D/g, ''), // Remove formatação
        endereco: {
          logradouro: sanitizeInput(data.rua),
          numero: sanitizeInput(data.numero),
          complemento: sanitizeInput(data.complemento || ''),
          bairro: '', // Campo opcional
          cidade: sanitizeInput(data.cidade),
          estado: sanitizeInput(data.estado),
          cep: sanitizeInput(data.cep).replace(/\D/g, '') // Remove formatação
        },
        // Documentos
        documentos: {
          alvara_funcionamento: sanitizeInput(data.alvaraFuncionamento),
          autorizacao_vigilancia: sanitizeInput(data.autorizacaoVigilancia),
          inscricao_estadual: sanitizeInput(data.inscricaoEstadual || ''),
          inscricao_municipal: sanitizeInput(data.inscricaoMunicipal || ''),
          responsavel_tecnico: sanitizeInput(data.responsavelTecnico),
          registro_crf: sanitizeInput(data.registroCRF)
        }
      };

      // Chamar API do backend - rota específica para farmácia
      const response = await api.post('/cadastro/farmacia', sanitizedData);
      
      if (response.status === 201 || response.status === 200) {
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
        cadastroForm.reset();
        navigate('/login');
      } else {
        throw new Error('Erro no cadastro');
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      // Tratar erros específicos do backend
      if (error.response?.data?.erro) {
        toast.error(error.response.data.erro);
      } else if (error.response?.status === 409) {
        toast.error('Email ou CNPJ já cadastrado no sistema.');
      } else if (error.response?.status === 400) {
        toast.error('Dados inválidos. Verifique as informações.');
      } else {
        toast.error('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    'Dados da Farmácia',
    'Endereço',
    'Acesso',
    'Documentos',
    'Termos'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 from-0% via-blue-900 via-15% via-orange-400 via-55% to-orange-500 to-100%">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8 animate-fade-in backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo Vitalis" className="h-20 mb-4 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Farmácia</h2>
          <p className="text-gray-600">Preencha os dados para criar sua conta.</p>
        </div>
        
        {/* Indicador de Progresso */}
        <div className="flex justify-between items-center mb-8 px-2 relative">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center z-10 min-w-[70px]">
                <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300
                  ${step === idx+1 ? 'bg-blue-400 border-blue-500 text-white scale-110 shadow-lg animate-pulse' :
                    step > idx+1 ? 'bg-orange-400 border-orange-400 text-white' : 'bg-white border-blue-200 text-blue-400'}`}
                >
                  {idx+1}
                </div>
                <span className={`mt-2 text-xs font-medium text-center transition-all duration-300 ${step === idx+1 ? 'text-orange-600' : 'text-gray-500'}`}>{label}</span>
              </div>
              {idx < steps.length-1 && (
                <div className="flex-1 h-1 mx-1 bg-transparent flex items-center">
                  <div className={`h-1 w-full rounded transition-all duration-300 ${step > idx+1 ? 'bg-orange-400' : 'bg-blue-200'}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={cadastroForm.handleSubmit(onCadastroSubmit)} className="space-y-4">
          {/* Passo 1: Dados da Farmácia */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Farmácia</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="nome" type="text" placeholder="Nome da farmácia" className="pl-10" {...cadastroForm.register('nome')} />
                </div>
                {cadastroForm.formState.errors.nome && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.nome.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="relative">
                  <Input
                    id="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cadastroForm.watch('cnpj')}
                    onChange={handleCNPJChange}
                    maxLength={18}
                    className={`pr-10 ${resultadosValidacao.cnpj ? (resultadosValidacao.cnpj.valido && !resultadosValidacao.cnpj.existe ? 'border-green-500' : 'border-red-500') : ''}`}
                  />
                  {validandoCNPJ && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {resultadosValidacao.cnpj && !validandoCNPJ && (
                    <div className="absolute right-3 top-3">
                      {resultadosValidacao.cnpj.valido && !resultadosValidacao.cnpj.existe ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {cadastroForm.formState.errors.cnpj && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.cnpj.message}</p>}
                {resultadosValidacao.cnpj && (
                  <p className={`text-xs ${resultadosValidacao.cnpj.valido && !resultadosValidacao.cnpj.existe ? 'text-green-600' : 'text-red-600'}`}>
                    {resultadosValidacao.cnpj.valido && !resultadosValidacao.cnpj.existe ? 'CNPJ válido' : resultadosValidacao.cnpj.erro}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEmpresa">Tipo de Empresa</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    id="tipoEmpresa"
                    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...cadastroForm.register('tipoEmpresa')}
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposEmpresa.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                {cadastroForm.formState.errors.tipoEmpresa && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.tipoEmpresa.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefone"
                    type="text"
                    placeholder="11 0000-0000"
                    value={cadastroForm.watch('telefone')}
                    onChange={handleTelefoneChange}
                    maxLength={12}
                    className="pl-10"
                  />
                </div>
                {cadastroForm.formState.errors.telefone && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.telefone.message}</p>}
              </div>
            </>
          )}

          {/* Passo 2: Endereço */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={cadastroForm.watch('cep')}
                    onChange={handleCEPChange}
                    maxLength={9}
                    className="pl-10"
                  />
                  {buscandoCEP && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {cadastroForm.formState.errors.cep && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.cep.message}</p>}
                <p className="text-xs text-gray-500">Digite o CEP para preenchimento automático do endereço</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rua">Rua</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="rua" 
                    type="text" 
                    placeholder="Nome da rua" 
                    className="pl-10" 
                    {...cadastroForm.register('rua')} 
                  />
                </div>
                {cadastroForm.formState.errors.rua && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.rua.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero" 
                    type="text" 
                    placeholder="Número" 
                    {...cadastroForm.register('numero')} 
                  />
                  {cadastroForm.formState.errors.numero && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.numero.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input 
                    id="complemento" 
                    type="text" 
                    placeholder="Apto, bloco, etc." 
                    {...cadastroForm.register('complemento')} 
                  />
                  {cadastroForm.formState.errors.complemento && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.complemento.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    type="text" 
                    placeholder="Cidade" 
                    {...cadastroForm.register('cidade')} 
                  />
                  {cadastroForm.formState.errors.cidade && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.cidade.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...cadastroForm.register('estado')}
                  >
                    <option value="">UF</option>
                    {estados.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                  {cadastroForm.formState.errors.estado && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.estado.message}</p>}
                </div>
              </div>
            </>
          )}

          {/* Passo 3: Acesso */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" {...cadastroForm.register('email')} />
                </div>
                {cadastroForm.formState.errors.email && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                    data-testid="password-input"
                    {...cadastroForm.register('senha')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {cadastroForm.formState.errors.senha && <p className="text-sm text-red-500 animate-pulse" data-testid="password-error">{cadastroForm.formState.errors.senha.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    className="pl-10 pr-10"
                    data-testid="confirm-password-input"
                    {...cadastroForm.register('confirmarSenha')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {cadastroForm.formState.errors.confirmarSenha && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.confirmarSenha.message}</p>}
              </div>
            </>
          )}

          {/* Passo 4: Documentos */}
          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="alvaraFuncionamento">Alvará de Funcionamento</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FileCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="alvaraFuncionamento"
                      type="text"
                      placeholder="Número do alvará"
                      className="pl-10"
                      {...cadastroForm.register('alvaraFuncionamento')}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={validarAlvara}
                    disabled={validandoDocumentos.alvara || !cadastroForm.watch('alvaraFuncionamento') || !cadastroForm.watch('estado')}
                  >
                    {validandoDocumentos.alvara ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      'Validar'
                    )}
                  </Button>
                </div>
                {cadastroForm.formState.errors.alvaraFuncionamento && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.alvaraFuncionamento.message}</p>}
                {resultadosValidacao.alvara && (
                  <div className="space-y-1">
                    <p className={`text-xs ${resultadosValidacao.alvara.valido && !resultadosValidacao.alvara.existe ? 'text-green-600' : 'text-red-600'}`}>
                      {resultadosValidacao.alvara.valido && !resultadosValidacao.alvara.existe ? 
                        'Alvará válido' : 
                        resultadosValidacao.alvara.erro
                      }
                    </p>
                    {resultadosValidacao.alvara.valido && resultadosValidacao.alvara.requer_aprovacao && (
                      <p className="text-xs text-amber-600 font-medium">
                        ⚠️ Aguardará aprovação manual após o cadastro
                      </p>
                    )}
                    {resultadosValidacao.alvara.mensagem && (
                      <p className="text-xs text-blue-600">
                        💡 {resultadosValidacao.alvara.mensagem}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="autorizacaoVigilancia">Autorização de Vigilância Sanitária</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="autorizacaoVigilancia"
                      type="text"
                      placeholder="Número da autorização"
                      className="pl-10"
                      {...cadastroForm.register('autorizacaoVigilancia')}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={validarVigilancia}
                    disabled={validandoDocumentos.vigilancia || !cadastroForm.watch('autorizacaoVigilancia') || !cadastroForm.watch('estado')}
                  >
                    {validandoDocumentos.vigilancia ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      'Validar'
                    )}
                  </Button>
                </div>
                {cadastroForm.formState.errors.autorizacaoVigilancia && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.autorizacaoVigilancia.message}</p>}
                {resultadosValidacao.vigilancia && (
                  <p className={`text-xs ${resultadosValidacao.vigilancia.valido && !resultadosValidacao.vigilancia.existe ? 'text-green-600' : 'text-red-600'}`}>
                    {resultadosValidacao.vigilancia.valido && !resultadosValidacao.vigilancia.existe ? 'Autorização válida' : resultadosValidacao.vigilancia.erro}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inscricaoEstadual">Inscrição Estadual (Opcional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="inscricaoEstadual"
                      type="text"
                      placeholder="Número da inscrição"
                      className="pl-10"
                      {...cadastroForm.register('inscricaoEstadual')}
                    />
                  </div>
                  {cadastroForm.formState.errors.inscricaoEstadual && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.inscricaoEstadual.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricaoMunicipal">Inscrição Municipal (Opcional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="inscricaoMunicipal"
                      type="text"
                      placeholder="Número da inscrição"
                      className="pl-10"
                      {...cadastroForm.register('inscricaoMunicipal')}
                    />
                  </div>
                  {cadastroForm.formState.errors.inscricaoMunicipal && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.inscricaoMunicipal.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavelTecnico">Responsável Técnico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="responsavelTecnico"
                    type="text"
                    placeholder="Nome do responsável técnico"
                    className="pl-10"
                    {...cadastroForm.register('responsavelTecnico')}
                  />
                </div>
                {cadastroForm.formState.errors.responsavelTecnico && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.responsavelTecnico.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registroCRF">Registro CRF</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registroCRF"
                      type="text"
                      placeholder="Número do registro CRF"
                      className="pl-10"
                      {...cadastroForm.register('registroCRF')}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={validarCRF}
                    disabled={validandoDocumentos.crf || !cadastroForm.watch('registroCRF') || !cadastroForm.watch('estado')}
                  >
                    {validandoDocumentos.crf ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      'Validar'
                    )}
                  </Button>
                </div>
                {cadastroForm.formState.errors.registroCRF && <p className="text-sm text-red-500 animate-pulse">{cadastroForm.formState.errors.registroCRF.message}</p>}
                {resultadosValidacao.crf && (
                  <p className={`text-xs ${resultadosValidacao.crf.valido && !resultadosValidacao.crf.existe ? 'text-green-600' : 'text-red-600'}`}>
                    {resultadosValidacao.crf.valido && !resultadosValidacao.crf.existe ? 'Registro CRF válido' : resultadosValidacao.crf.erro}
                  </p>
                )}
              </div>

              {/* Informações sobre documentos */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">📋 Documentos Necessários</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Para operar uma farmácia, os seguintes documentos são obrigatórios:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• <strong>Alvará de Funcionamento:</strong> Autorização da prefeitura</li>
                  <li>• <strong>Autorização da Vigilância Sanitária:</strong> Licença sanitária</li>
                  <li>• <strong>Responsável Técnico:</strong> Farmacêutico responsável</li>
                  <li>• <strong>Registro CRF:</strong> Conselho Regional de Farmácia</li>
                </ul>
                <p className="text-xs text-yellow-700 mt-2">
                  Os documentos serão verificados pela nossa equipe antes da aprovação da conta.
                </p>
              </div>
            </>
          )}

          {/* Passo 5: Termos */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Termos e Condições</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade. 
                  Sua farmácia será responsável por manter a qualidade dos produtos e serviços oferecidos.
                </p>
                <div className="mb-4">
                  <Link 
                    to="/termos-condicao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ler Termos e Condições Completos
                  </Link>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="termos"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...cadastroForm.register('termos')}
                  />
                  <Label htmlFor="termos" className="text-sm text-blue-800">
                    Li e aceito os termos e condições
                  </Label>
                </div>
                {cadastroForm.formState.errors.termos && <p className="text-sm text-red-500 animate-pulse mt-2">{cadastroForm.formState.errors.termos.message}</p>}
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 mr-2"
              >
                Anterior
              </Button>
            )}
            
            {step < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1"
                disabled={isLoading}
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="register-button"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            )}
          </div>

          {/* Link para Login */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;