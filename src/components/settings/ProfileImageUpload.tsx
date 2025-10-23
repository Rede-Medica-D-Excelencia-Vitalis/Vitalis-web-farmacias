/**
 * Componente de Upload de Imagem de Perfil
 * 
 * Permite fazer upload da logo/imagem de perfil
 * A imagem é convertida para Base64 e salva no backend
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';

interface ProfileImageUploadProps {
  farmaciaId: number;
  currentImage?: string | null;
  onImageUpdate?: (imageBase64: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ 
  farmaciaId, 
  currentImage,
  onImageUpdate 
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageSize, setImageSize] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  /**
   * Converter arquivo para Base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Calcular tamanho da imagem em MB
   */
  const calculateSize = (base64: string): string => {
    const sizeInBytes = (base64.length * 3/4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2);
  };

  /**
   * Validar arquivo de imagem
   */
  const validateImage = (file: File): string | null => {
    // Verificar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Formato inválido. Use JPG, PNG ou WebP.';
    }

    // Verificar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Imagem muito grande. Máximo 5MB.';
    }

    return null;
  };

  /**
   * Lidar com seleção de arquivo
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validar arquivo
    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      // Converter para Base64
      const base64 = await fileToBase64(file);
      
      // Calcular tamanho
      const size = calculateSize(base64);
      setImageSize(size);

      // Mostrar preview
      setPreview(base64);

      // Fazer upload
      await uploadImage(base64);

    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError('Erro ao processar imagem. Tente novamente.');
      toast.error('Erro ao processar imagem');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fazer upload da imagem para o backend
   */
  const uploadImage = async (imageBase64: string) => {
    try {
      const response = await apiService.post(`/farmacias/${farmaciaId}/foto`, {
        foto_base64: imageBase64
      });

      if (response.data.sucesso) {
        setSuccess(true);
        toast.success('Imagem de perfil atualizada com sucesso!');
        
        // Atualizar dados do usuário no localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.profile_image_url = imageBase64;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Callback para atualizar no componente pai
        if (onImageUpdate) {
          onImageUpdate(imageBase64);
        }

        // Limpar mensagens após 3 segundos
        setTimeout(() => {
          setSuccess(false);
          setError(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      const errorMessage = err.response?.data?.erro || 'Erro ao fazer upload. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Reverter preview
      setPreview(currentImage || null);
    }
  };

  /**
   * Remover imagem
   */
  const handleRemoveImage = async () => {
    if (!confirm('Deseja realmente remover a imagem de perfil?')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.delete(`/farmacias/${farmaciaId}/foto`);

      if (response.data.sucesso) {
        setPreview(null);
        setImageSize('');
        toast.success('Imagem removida com sucesso!');
        
        // Atualizar dados do usuário no localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.profile_image_url = null;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        if (onImageUpdate) {
          onImageUpdate('');
        }
      }
    } catch (err: any) {
      console.error('Erro ao remover imagem:', err);
      const errorMessage = err.response?.data?.erro || 'Erro ao remover imagem';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abrir seletor de arquivo
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* Preview da Imagem */}
        <div className="flex justify-center">
          <div className="relative">
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                {/* Overlay com botão de remover */}
                <button
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="Remover imagem"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Informações e Botões */}
        <div className="space-y-3">
          {/* Input hidden para arquivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Botão de Upload */}
          <Button
            onClick={handleButtonClick}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {preview ? 'Alterar Imagem' : 'Fazer Upload'}
              </>
            )}
          </Button>

          {/* Mensagem de sucesso */}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Imagem atualizada com sucesso!
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload;

