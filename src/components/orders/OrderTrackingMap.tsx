/**
 * Componente de Rastreamento de Pedidos com Google Maps
 * 
 * Este arquivo contém:
 * 1. Integração com a API do Google Maps
 * 2. Exibição do mapa com marcador de localização
 * 3. Atualização da posição em tempo real
 */

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface OrderTrackingMapProps {
  latitude: number;
  longitude: number;
  orderId: string;
  className?: string;
}

/**
 * Componente que exibe um mapa do Google Maps com a localização atual do pedido
 * 
 * @param latitude - Latitude da localização
 * @param longitude - Longitude da localização
 * @param orderId - ID do pedido para identificação
 * @param className - Classes CSS adicionais
 * @returns JSX.Element - Mapa com marcador de localização
 */
const OrderTrackingMap = ({ latitude, longitude, orderId, className }: OrderTrackingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Inicializa o loader do Google Maps
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    // Carrega o mapa
    loader.load().then(() => {
      if (!mapRef.current) return;

      // Cria o mapa
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      // Cria o marcador
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: `Pedido #${orderId}`,
        animation: google.maps.Animation.DROP,
      });

      // Armazena as referências
      mapInstanceRef.current = map;
      markerRef.current = marker;
    });
  }, [latitude, longitude, orderId]);

  // Atualiza a posição do marcador quando as coordenadas mudam
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const newPosition = { lat: latitude, lng: longitude };
      markerRef.current.setPosition(newPosition);
      mapInstanceRef.current.panTo(newPosition);
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ height: '400px', width: '100%' }}
    />
  );
};

export default OrderTrackingMap; 