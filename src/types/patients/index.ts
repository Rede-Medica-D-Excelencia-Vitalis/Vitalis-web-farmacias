/**
 * Tipos de Pacientes
 * 
 * Esta pasta contém todos os tipos relacionados aos pacientes,
 * informações pessoais, histórico médico e operações de pacientes.
 */

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: Gender;
  address: PatientAddress;
  emergencyContact?: EmergencyContact;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastVisitAt?: string;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface PatientAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PatientCreateRequest {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: Gender;
  address: PatientAddress;
  emergencyContact?: EmergencyContact;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  notes?: string;
}

export interface PatientUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: Gender;
  address?: PatientAddress;
  emergencyContact?: EmergencyContact;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  notes?: string;
  isActive?: boolean;
}

export interface PatientFilters {
  search?: string;
  gender?: Gender;
  city?: string;
  state?: string;
  hasAllergies?: boolean;
  hasChronicConditions?: boolean;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  newThisWeek: number;
  withAllergies: number;
  withChronicConditions: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    prefer_not_to_say: number;
  };
}

export interface PatientHistory {
  id: string;
  patientId: string;
  type: PatientHistoryType;
  title: string;
  description: string;
  date: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export type PatientHistoryType = 
  | 'consultation'     // Consulta
  | 'prescription'     // Prescrição
  | 'allergy'          // Alergia
  | 'condition'        // Condição crônica
  | 'medication'       // Medicação
  | 'note'             // Observação
  | 'contact_update'   // Atualização de contato
  | 'address_update';  // Atualização de endereço

export interface PatientSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  lastVisitAt?: string;
  isActive: boolean;
}

export interface PatientQuickInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  hasAllergies: boolean;
  hasChronicConditions: boolean;
  lastVisitAt?: string;
}

