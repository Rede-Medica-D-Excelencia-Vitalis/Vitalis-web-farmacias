import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  FileText,
  Star,
  Clock,
  Loader2,
  Plus,
  Eye,
  Edit,
  ShoppingCart,
  Prescription,
  Truck
} from 'lucide-react';
import { patientIntegrationService, Patient, PatientStatus, PatientOrder, PatientPrescription } from '@/lib/patientIntegration';

interface PatientListProps {
  onPatientSelect?: (patient: Patient) => void;
  onViewOrders?: (patient: Patient) => void;
  onViewPrescriptions?: (patient: Patient) => void;
  onSendMessage?: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onPatientSelect,
  onViewOrders,
  onViewPrescriptions,
  onSendMessage
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = false);
  const [patientsStatus, setPatientsStatus] = useState<PatientStatus[]>([]);
  const [selectedPatientOrders, setSelectedPatientOrders] = useState<PatientOrder[]>([]);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState<PatientPrescription[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isPrescriptionsOpen, setIsPrescriptionsOpen] = useState(false);

  // Carregar pacientes
  useEffect(() => {
    carregarPacientes();
  }, []);

  // Carregar status dos pacientes quando a lista mudar
  useEffect(() => {
    if (patients.length > 0) {
      carregarStatusPacientes();
    }
  }, [patients]);

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const pacientes = await patientIntegrationService.listPharmacyPatients();
      setPatients(pacientes);
    } catch (error: any) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const carregarStatusPacientes = async () => {
    try {
      const patientIds = patients.map(p => p.id);
      const status = await patientIntegrationService.getPatientsStatus(patientIds);
      setPatientsStatus(status);
    } catch (error: any) {
      console.error('Erro ao carregar status dos pacientes:', error);
    }
  };

  // Filtrar pacientes
  const pacientesFiltrados = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.cpf.includes(searchTerm);
    return matchesSearch;
  });

  // Obter status do paciente
  const getPatientStatus = (patientId: number): PatientStatus | undefined => {
    return patientsStatus.find(status => status.patientId === patientId);
  };

  // Obter status online/offline
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'busy': return 'Ocupado';
      default: return 'Desconhecido';
    }
  };

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Formatar telefone
  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Formatar CPF
  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Carregar pedidos do paciente
  const carregarPedidosPaciente = async (patientId: number) => {
    try {
      const pedidos = await patientIntegrationService.getPatientOrderHistory(patientId);
      setSelectedPatientOrders(pedidos);
      setIsOrdersOpen(true);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos do paciente');
    }
  };

  // Carregar receitas do paciente
  const carregarReceitasPaciente = async (patientId: number) => {
    try {
      const receitas = await patientIntegrationService.listPharmacyPrescriptions();
      const receitasDoPaciente = receitas.filter(r => r.patientId === patientId);
      setSelectedPatientPrescriptions(receitasDoPaciente);
      setIsPrescriptionsOpen(true);
    } catch (error: any) {
      console.error('Erro ao carregar receitas:', error);
      toast.error('Erro ao carregar receitas do paciente');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando pacientes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pacientes da Farmácia</h3>
          <p className="text-sm text-gray-600">
            {pacientesFiltrados.length} paciente{pacientesFiltrados.length !== 1 ? 's' : ''} encontrado{pacientesFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar paciente por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de pacientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pacientesFiltrados.map((patient) => {
          const status = getPatientStatus(patient.id);
          
          return (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onPatientSelect?.(patient)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${patient.name}&background=10B981&color=fff`} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{patient.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={patient.status === 'ativo' ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {patient.status}
                        </Badge>
                        {status && (
                          <Badge 
                            className={`${getStatusColor(status.status)} text-white text-xs`}
                          >
                            {getStatusText(status.status)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {patient.lastVisit ? `Última visita: ${formatarData(patient.lastVisit)}` : 'Primeira visita'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {/* Informações de contato */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{formatarTelefone(patient.phone)}</span>
                  </div>

                  {/* Endereço */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">
                      {patient.address.street}, {patient.address.number} - {patient.address.city}/{patient.address.state}
                    </span>
                  </div>

                  {/* Data de nascimento */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatarData(patient.birthDate)}</span>
                  </div>

                  {/* Histórico médico */}
                  {patient.medicalHistory && (
                    <div className="pt-2 border-t">
                      <div className="text-xs font-medium text-gray-700 mb-1">Histórico Médico:</div>
                      <div className="space-y-1">
                        {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
                          <div className="text-xs text-red-600">
                            Alergias: {patient.medicalHistory.allergies.slice(0, 2).join(', ')}
                            {patient.medicalHistory.allergies.length > 2 && '...'}
                          </div>
                        )}
                        {patient.medicalHistory.chronicDiseases && patient.medicalHistory.chronicDiseases.length > 0 && (
                          <div className="text-xs text-orange-600">
                            Doenças crônicas: {patient.medicalHistory.chronicDiseases.slice(0, 2).join(', ')}
                            {patient.medicalHistory.chronicDiseases.length > 2 && '...'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatient(patient);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      carregarPedidosPaciente(patient.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Pedidos
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      carregarReceitasPaciente(patient.id);
                    }}
                  >
                    <Prescription className="h-4 w-4 mr-1" />
                    Receitas
                  </Button>
                  
                  {onSendMessage && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(patient);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Mensagem
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem quando não há pacientes */}
      {pacientesFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h4>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Você ainda não possui pacientes cadastrados'
              }
            </p>
            <Button variant="outline" onClick={carregarPacientes}>
              <Loader2 className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de detalhes do paciente */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas sobre {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div>
                <h4 className="font-medium mb-3">Informações Pessoais</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nome:</span>
                    <p className="font-medium">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telefone:</span>
                    <p className="font-medium">{formatarTelefone(selectedPatient.phone)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">CPF:</span>
                    <p className="font-medium">{formatarCPF(selectedPatient.cpf)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Data de Nascimento:</span>
                    <p className="font-medium">{formatarData(selectedPatient.birthDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gênero:</span>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="font-medium mb-3">Endereço</h4>
                <div className="text-sm">
                  <p className="font-medium">
                    {selectedPatient.address.street}, {selectedPatient.address.number}
                    {selectedPatient.address.complement && ` - ${selectedPatient.address.complement}`}
                  </p>
                  <p className="text-gray-600">
                    {selectedPatient.address.neighborhood} - {selectedPatient.address.city}/{selectedPatient.address.state}
                  </p>
                  <p className="text-gray-600">CEP: {selectedPatient.address.zipCode}</p>
                </div>
              </div>

              {/* Contato de emergência */}
              <div>
                <h4 className="font-medium mb-3">Contato de Emergência</h4>
                <div className="text-sm">
                  <p className="font-medium">{selectedPatient.emergencyContact.name}</p>
                  <p className="text-gray-600">{selectedPatient.emergencyContact.phone}</p>
                  <p className="text-gray-600">Relacionamento: {selectedPatient.emergencyContact.relationship}</p>
                </div>
              </div>

              {/* Histórico médico */}
              {selectedPatient.medicalHistory && (
                <div>
                  <h4 className="font-medium mb-3">Histórico Médico</h4>
                  <div className="space-y-3 text-sm">
                    {selectedPatient.medicalHistory.allergies && selectedPatient.medicalHistory.allergies.length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Alergias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.medicalHistory.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPatient.medicalHistory.chronicDiseases && selectedPatient.medicalHistory.chronicDiseases.length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Doenças Crônicas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.medicalHistory.chronicDiseases.map((disease, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {disease}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPatient.medicalHistory.medications && selectedPatient.medicalHistory.medications.length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Medicações:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.medicalHistory.medications.map((medication, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de pedidos do paciente */}
      <Dialog open={isOrdersOpen} onOpenChange={setIsOrdersOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Pedidos</DialogTitle>
            <DialogDescription>
              Pedidos realizados por {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPatientOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum pedido encontrado para este paciente</p>
              </div>
            ) : (
              selectedPatientOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Pedido #{order.id}</h4>
                        <p className="text-sm text-gray-600">
                          {formatarData(order.createdAt)} - {order.status}
                        </p>
                      </div>
                      <Badge variant={order.status === 'entregue' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-medium">R$ {order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frete:</span>
                        <span>R$ {order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Forma de Pagamento:</span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status do Pagamento:</span>
                        <Badge variant={order.paymentStatus === 'pago' ? 'default' : 'destructive'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOrdersOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de receitas do paciente */}
      <Dialog open={isPrescriptionsOpen} onOpenChange={setIsPrescriptionsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Receitas</DialogTitle>
            <DialogDescription>
              Receitas enviadas por {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPatientPrescriptions.length === 0 ? (
              <div className="text-center py-8">
                <Prescription className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma receita encontrada para este paciente</p>
              </div>
            ) : (
              selectedPatientPrescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Receita #{prescription.id}</h4>
                        <p className="text-sm text-gray-600">
                          Dr. {prescription.doctor.name} - {prescription.doctor.specialty}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatarData(prescription.prescriptionDate)} - {prescription.status}
                        </p>
                      </div>
                      <Badge variant={prescription.status === 'aprovada' ? 'default' : 'secondary'}>
                        {prescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Medicamentos:</span>
                        <div className="mt-2 space-y-1">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="pl-4 border-l-2 border-gray-200">
                              <p className="font-medium">{med.medicationName}</p>
                              <p className="text-gray-600">
                                {med.dosage} - {med.frequency} - {med.duration}
                              </p>
                              <p className="text-gray-600">Quantidade: {med.quantity}</p>
                              {med.instructions && (
                                <p className="text-gray-600">Instruções: {med.instructions}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      {prescription.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Observações:</span>
                          <p className="text-gray-600 mt-1">{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsPrescriptionsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientList;
