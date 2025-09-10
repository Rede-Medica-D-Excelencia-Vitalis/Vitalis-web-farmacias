import { Package } from 'lucide-react';
import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProductImage = ({ src, alt, className = '', size = 'md' }: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Log para debug
  console.log(`🖼️ ProductImage - src:`, src, `alt:`, alt);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  // Se não há src ou houve erro, mostrar placeholder
  if (!src || imageError) {
    console.log(`🖼️ ProductImage - Mostrando placeholder para:`, alt);
    return (
      <div className={`${sizeClasses[size]} bg-gray-100 rounded border flex items-center justify-center ${className}`}>
        <Package className={`${iconSizes[size]} text-gray-400`} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizeClasses[size]} object-cover rounded border ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default ProductImage;
