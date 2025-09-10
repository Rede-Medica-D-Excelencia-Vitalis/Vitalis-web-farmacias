import { useState, useCallback } from 'react';

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface FormState<T> {
  [K in keyof T]: FormField<T[K]>;
}

export interface FormValidation<T> {
  [K in keyof T]?: (value: T[K], formData: T) => string | undefined;
}

export interface UseFormReturn<T> {
  formData: T;
  formState: FormState<T>;
  errors: { [K in keyof T]?: string };
  isValid: boolean;
  isDirty: boolean;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  handleSubmit: (onSubmit: (data: T) => void) => (e: React.FormEvent) => void;
}

/**
 * Hook para gerenciamento de formulários
 * @param initialValues - Valores iniciais do formulário
 * @param validation - Funções de validação para cada campo
 * @returns Objeto com estado e métodos do formulário
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validation?: FormValidation<T>
): UseFormReturn<T> {
  // Estado do formulário
  const [formState, setFormState] = useState<FormState<T>>(() => {
    const state: FormState<T> = {} as FormState<T>;
    
    Object.keys(initialValues).forEach((key) => {
      const fieldKey = key as keyof T;
      state[fieldKey] = {
        value: initialValues[fieldKey],
        error: undefined,
        touched: false,
        required: validation?.[fieldKey] !== undefined
      };
    });
    
    return state;
  });

  // Dados do formulário (apenas valores)
  const formData = Object.keys(formState).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = formState[fieldKey].value;
    return acc;
  }, {} as T);

  // Erros do formulário
  const errors = Object.keys(formState).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    if (formState[fieldKey].error) {
      acc[fieldKey] = formState[fieldKey].error;
    }
    return acc;
  }, {} as { [K in keyof T]?: string });

  // Verifica se o formulário é válido
  const isValid = Object.keys(errors).length === 0;

  // Verifica se o formulário foi modificado
  const isDirty = Object.keys(formState).some(key => {
    const fieldKey = key as keyof T;
    return formState[fieldKey].touched;
  });

  // Define o valor de um campo
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true
      }
    }));
  }, []);

  // Define o erro de um campo
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error
      }
    }));
  }, []);

  // Define se um campo foi tocado
  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched
      }
    }));
  }, []);

  // Valida um campo específico
  const validateField = useCallback((field: keyof T) => {
    if (!validation?.[field]) return;

    const fieldValue = formState[field].value;
    const error = validation[field]!(fieldValue, formData);
    
    setFieldError(field, error || '');
  }, [formState, formData, validation, setFieldError]);

  // Valida todo o formulário
  const validateForm = useCallback(() => {
    if (!validation) return true;

    let isValid = true;
    
    Object.keys(validation).forEach((key) => {
      const fieldKey = key as keyof T;
      const fieldValue = formState[fieldKey].value;
      const error = validation[fieldKey]!(fieldValue, formData);
      
      if (error) {
        setFieldError(fieldKey, error);
        isValid = false;
      } else {
        setFieldError(fieldKey, '');
      }
    });

    return isValid;
  }, [formState, formData, validation, setFieldError]);

  // Reseta o formulário
  const resetForm = useCallback(() => {
    setFormState(() => {
      const state: FormState<T> = {} as FormState<T>;
      
      Object.keys(initialValues).forEach((key) => {
        const fieldKey = key as keyof T;
        state[fieldKey] = {
          value: initialValues[fieldKey],
          error: undefined,
          touched: false,
          required: validation?.[fieldKey] !== undefined
        };
      });
      
      return state;
    });
  }, [initialValues, validation]);

  // Handler para submit do formulário
  const handleSubmit = useCallback((onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
        onSubmit(formData);
      }
    };
  }, [formData, validateForm]);

  return {
    formData,
    formState,
    errors,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    handleSubmit
  };
}
