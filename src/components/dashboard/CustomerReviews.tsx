/**
 * Componente de Avaliações dos Clientes
 * 
 * Este arquivo contém:
 * 1. Componente StarRating para exibir avaliações em estrelas
 * 2. Componente ReviewCard para exibir uma avaliação individual
 * 3. Componente principal CustomerReviews que lista todas as avaliações
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { reviews } from '@/lib/data';
import { Review } from '@/types';
import { Star, User } from 'lucide-react';

/**
 * Componente para exibir avaliação em estrelas
 * 
 * @param rating - Número de estrelas (1-5)
 * @returns JSX.Element - Estrelas preenchidas/vazias baseado na avaliação
 */
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Componente para exibir uma avaliação individual
 * 
 * @param review - Objeto contendo os dados da avaliação
 * @returns JSX.Element - Card com os detalhes da avaliação
 */
const ReviewCard = ({ review }: { review: typeof reviews[0] }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Avatar do cliente */}
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.customer.name.charAt(0)}
            </span>
          </div>
          
          {/* Conteúdo da avaliação */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{review.customer.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            
            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            
            <div className="mt-2 text-xs text-gray-500">
              Pedido #{review.orderNumber}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Componente principal que lista todas as avaliações
 * 
 * @returns JSX.Element - Lista de avaliações dos clientes
 */
const CustomerReviews = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Avaliações dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Área de rolagem para a lista de avaliações */}
        <ScrollArea className="h-[400px] pr-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CustomerReviews;
