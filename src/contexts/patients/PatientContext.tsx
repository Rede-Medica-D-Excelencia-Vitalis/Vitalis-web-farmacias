/**
 * Contexto de Pacientes
 * 
 * Gerencia o estado global dos pacientes da aplicação,
 * incluindo lista de pacientes, filtros, paginação e ações.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PATIENT_STATUS } from '@/config/constants';

// Tipos
export type PatientStatus = typeof PATIENT_STATUS[keyof typeof PATIENT_STATUS];

// Interface do paciente
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: Date;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  allergies?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    number: string;
    validUntil: Date;
  };
}

// Filtros de paciente
export interface PatientFilters {
  status?: PatientStatus;
  name?: string;
  email?: string;
  city?: string;
  hasInsurance?: boolean;
  hasAllergies?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Interface do contexto
interface PatientContextType {
  // Estado
  patients: Patient[];
  filteredPatients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtros e paginação
  filters: PatientFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  
  // Ações
  loadPatients: () => Promise<void>;
  loadPatient: (id: string) => Promise<void>;
  createPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  updatePatientStatus: (id: string, status: PatientStatus) => Promise<void>;
  
  // Seleção
  selectPatient: (patient: Patient | null) => void;
  
  // Filtros
  updateFilters: (filters: Partial<PatientFilters>) => void;
  clearFilters: () => void;
  
  // Paginação
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Utilitários
  getPatientById: (id: string) => Patient | undefined;
  getPatientsByStatus: (status: PatientStatus) => Patient[];
  getPatientsByCity: (city: string) => Patient[];
  getTotalPatients: () => number;
  getActivePatients: () => Patient[];
  getInactivePatients: () => Patient[];
  searchPatients: (query: string) => Patient[];
  getPatientsWithAllergies: () => Patient[];
  getPatientsWithInsurance: () => Patient[];
}

// Contexto
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Provider
interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<PatientFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Computed values
  const filteredPatients = React.useMemo(() => {
    let filtered = [...patients];

    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(patient => patient.status === filters.status);
    }

    if (filters.name) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(patient => 
        patient.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(patient => 
        patient.address.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.hasInsurance !== undefined) {
      filtered = filtered.filter(patient => 
        filters.hasInsurance ? !!patient.insurance : !patient.insurance
      );
    }

    if (filters.hasAllergies !== undefined) {
      filtered = filtered.filter(patient => 
        filters.hasAllergies ? (patient.allergies?.length || 0) > 0 : (patient.allergies?.length || 0) === 0
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter(patient => {
        const patientDate = new Date(patient.createdAt);
        return patientDate >= filters.dateRange!.start && patientDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }, [patients, filters]);

  // Carregar pacientes
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // const response = await apiService.patients.getPatients();
      // setPatients(response.data);
      
      // Por enquanto, usar dados mock
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999',
          cpf: '123.456.789-00',
          dateOfBirth: new Date('1990-01-01'),
          address: {
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
          },
          status: PATIENT_STATUS.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          allergies: ['Penicilina'],
          medications: ['Paracetamol'],
          emergencyContact: {
            name: 'Maria Silva',
            phone: '(11) 88888-8888',
            relationship: 'Esposa',
          },
        }
      ];
      
      setPatients(mockPatients);
      setPagination(prev => ({
        ...prev,
        total: mockPatients.length,
        totalPages: Math.ceil(mockPatients.length / prev.pageSize),
      }));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pacientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar paciente específico
  const loadPatient = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // const response = await apiService.patients.getPatient(id);
      // const patient = response.data;
      
      const patient = patients.find(p => p.id === id);
      if (patient) {
        setSelectedPatient(patient);
      } else {
        setError('Paciente não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar paciente');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar paciente
  const createPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newPatient: Patient = {
        ...patientData,
        id: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Simular chamada à API
      // const response = await apiService.patients.createPatient(newPatient);
      // const createdPatient = response.data;
      
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar paciente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar paciente
  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.patients.updatePatient(id, updates);
      
      setPatients(prev => 
        prev.map(patient => 
          patient.id === id 
            ? { ...patient, ...updates, updatedAt: new Date() }
            : patient
        )
      );
      
      // Atualizar paciente selecionado se for o mesmo
      if (selectedPatient?.id === id) {
        setSelectedPatient(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar paciente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar paciente
  const deletePatient = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.patients.deletePatient(id);
      
      setPatients(prev => prev.filter(patient => patient.id !== id));
      
      // Limpar seleção se for o paciente selecionado
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar paciente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status do paciente
  const updatePatientStatus = async (id: string, status: PatientStatus) => {
    await updatePatient(id, { status });
  };

  // Selecionar paciente
  const selectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
  };

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<PatientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset para primeira página
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Definir página
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Definir tamanho da página
  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize, 
      page: 1,
      totalPages: Math.ceil(prev.total / pageSize),
    }));
  };

  // Utilitários
  const getPatientById = (id: string) => patients.find(patient => patient.id === id);
  
  const getPatientsByStatus = (status: PatientStatus) => 
    patients.filter(patient => patient.status === status);
  
  const getPatientsByCity = (city: string) => 
    patients.filter(patient => 
      patient.address.city.toLowerCase().includes(city.toLowerCase())
    );
  
  const getTotalPatients = () => patients.length;
  
  const getActivePatients = () => 
    patients.filter(patient => patient.status === PATIENT_STATUS.ACTIVE);
  
  const getInactivePatients = () => 
    patients.filter(patient => patient.status === PATIENT_STATUS.INACTIVE);
  
  const searchPatients = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.cpf.includes(query) ||
      patient.phone.includes(query)
    );
  };
  
  const getPatientsWithAllergies = () => 
    patients.filter(patient => (patient.allergies?.length || 0) > 0);
  
  const getPatientsWithInsurance = () => 
    patients.filter(patient => !!patient.insurance);

  // Carregar pacientes na inicialização
  useEffect(() => {
    loadPatients();
  }, []);

  const value: PatientContextType = {
    patients,
    filteredPatients,
    selectedPatient,
    isLoading,
    error,
    filters,
    pagination,
    loadPatients,
    loadPatient,
    createPatient,
    updatePatient,
    deletePatient,
    updatePatientStatus,
    selectPatient,
    updateFilters,
    clearFilters,
    setPage,
    setPageSize,
    getPatientById,
    getPatientsByStatus,
    getPatientsByCity,
    getTotalPatients,
    getActivePatients,
    getInactivePatients,
    searchPatients,
    getPatientsWithAllergies,
    getPatientsWithInsurance,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

// Hook personalizado
export const usePatients = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients deve ser usado dentro de um PatientProvider');
  }
  return context;
};
