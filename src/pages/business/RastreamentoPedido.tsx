import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Package, Clock, Phone, Navigation, ArrowLeft, Truck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

interface Localizacao {
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
  velocidade?: number;
}

interface DadosEntrega {
  entrega_id: number;
  pedido_id: number;
  status: string;
  endereco_entrega: string;
  farmacia_endereco: string;
  farmacia_coordenadas?: {
    latitude: number;
    longitude: number;
  };
  ultima_localizacao?: Localizacao;
}

export default function RastreamentoPedido() {
  const { entregaId } = useParams<{ entregaId: string }>();
  const navigate = useNavigate();
  
  const [mapa, setMapa] = useState<google.maps.Map | null>(null);
  const [localizacaoMotoboy, setLocalizacaoMotoboy] = useState<Localizacao | null>(null);
  const [dadosEntrega, setDadosEntrega] = useState<DadosEntrega | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tempoEstimado, setTempoEstimado] = useState<string | null>(null);
  const [distanciaRestante, setDistanciaRestante] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerMotoboyRef = useRef<google.maps.Marker | null>(null);
  const markerFarmaciaRef = useRef<google.maps.Marker | null>(null);
  const markerDestinoRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  // Inicializar Google Maps
  const inicializarMapa = useCallback(async () => {
    if (!mapContainerRef.current) return;

    try {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry'],
      });

      await loader.load();

      const mapInstance = new google.maps.Map(mapContainerRef.current, {
        center: { lat: -23.550520, lng: -46.633308 }, // São Paulo como centro padrão
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      directionsServiceRef.current = new google.maps.DirectionsService();
      setMapa(mapInstance);
      
      console.log('✅ Google Maps inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar Google Maps:', error);
      setErro('Não foi possível carregar o mapa');
    }
  }, []);

  // Conectar WebSocket
  const conectarWebSocket = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErro('Token de autenticação não encontrado');
        return;
      }

      const ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        
        // Entrar na sala de rastreamento
        ws.send(JSON.stringify({
          tipo: 'rastreamento_entrar_sala',
          entrega_id: parseInt(entregaId!),
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📡 WebSocket mensagem:', data);

        if (data.tipo === 'rastreamento_sala_entrou') {
          setDadosEntrega(data.dados);
          if (data.dados.ultima_localizacao) {
            setLocalizacaoMotoboy(data.dados.ultima_localizacao);
          }
          setCarregando(false);
        } else if (data.tipo === 'rastreamento_localizacao_atualizada') {
          setLocalizacaoMotoboy({
            latitude: data.dados.latitude,
            longitude: data.dados.longitude,
            timestamp: data.dados.timestamp,
            status: data.dados.status,
            velocidade: data.dados.velocidade,
          });
        } else if (data.tipo === 'erro') {
          setErro(data.mensagem);
          setCarregando(false);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Erro WebSocket:', error);
        setErro('Erro na conexão em tempo real');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        // Tentar reconectar após 5 segundos
        setTimeout(conectarWebSocket, 5000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('❌ Erro ao conectar WebSocket:', error);
      setErro('Não foi possível conectar ao servidor');
    }
  }, [entregaId]);

  // Atualizar marcadores no mapa
  const atualizarMarcadores = useCallback(() => {
    if (!mapa || !dadosEntrega) return;

    // Marcador da Farmácia
    if (dadosEntrega.farmacia_coordenadas && !markerFarmaciaRef.current) {
      markerFarmaciaRef.current = new google.maps.Marker({
        position: {
          lat: dadosEntrega.farmacia_coordenadas.latitude,
          lng: dadosEntrega.farmacia_coordenadas.longitude,
        },
        map: mapa,
        title: 'Farmácia',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });
    }

    // Marcador do Motoboy
    if (localizacaoMotoboy) {
      if (markerMotoboyRef.current) {
        // Animar movimento do marcador
        markerMotoboyRef.current.setPosition({
          lat: localizacaoMotoboy.latitude,
          lng: localizacaoMotoboy.longitude,
        });
      } else {
        markerMotoboyRef.current = new google.maps.Marker({
          position: {
            lat: localizacaoMotoboy.latitude,
            lng: localizacaoMotoboy.longitude,
          },
          map: mapa,
          title: 'Motoboy',
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#10B981',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            rotation: 0,
          },
          animation: google.maps.Animation.DROP,
        });
      }

      // Centralizar mapa no motoboy
      mapa.panTo({
        lat: localizacaoMotoboy.latitude,
        lng: localizacaoMotoboy.longitude,
      });

      // Calcular rota
      calcularRota();
    }
  }, [mapa, dadosEntrega, localizacaoMotoboy]);

  // Calcular rota até o destino
  const calcularRota = useCallback(async () => {
    if (!directionsServiceRef.current || !localizacaoMotoboy || !dadosEntrega) return;

    try {
      const origem = new google.maps.LatLng(
        localizacaoMotoboy.latitude,
        localizacaoMotoboy.longitude
      );

      // Usar geocoding para o endereço de entrega se não tiver coordenadas
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: dadosEntrega.endereco_entrega }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const destino = results[0].geometry.location;

          directionsServiceRef.current!.route(
            {
              origin: origem,
              destination: destino,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK' && result) {
                const leg = result.routes[0].legs[0];
                setDistanciaRestante(leg.distance?.text || null);
                setTempoEstimado(leg.duration?.text || null);

                // Desenhar rota no mapa
                if (polylineRef.current) {
                  polylineRef.current.setMap(null);
                }

                polylineRef.current = new google.maps.Polyline({
                  path: result.routes[0].overview_path,
                  geodesic: true,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  map: mapa,
                });
              }
            }
          );
        }
      });
    } catch (error) {
      console.error('❌ Erro ao calcular rota:', error);
    }
  }, [localizacaoMotoboy, dadosEntrega, mapa]);

  // Inicializar componente
  useEffect(() => {
    inicializarMapa();
    conectarWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          tipo: 'rastreamento_sair_sala',
          entrega_id: parseInt(entregaId!),
        }));
        wsRef.current.close();
      }
    };
  }, [inicializarMapa, conectarWebSocket, entregaId]);

  // Atualizar marcadores quando dados mudarem
  useEffect(() => {
    atualizarMarcadores();
  }, [atualizarMarcadores]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any; icon: React.ReactNode }> = {
      aceita: { label: 'Aceita', variant: 'secondary', icon: <Package className="w-4 h-4" /> },
      em_rota: { label: 'Em Rota', variant: 'default', icon: <Truck className="w-4 h-4" /> },
      entregue: { label: 'Entregue', variant: 'success' as any, icon: <Package className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || statusConfig.aceita;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-2">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Rastreamento de Entrega #{entregaId}
                </h1>
                {dadosEntrega && (
                  <p className="text-sm text-gray-600">
                    Pedido #{dadosEntrega.pedido_id}
                  </p>
                )}
              </div>
            </div>

            {dadosEntrega && getStatusBadge(dadosEntrega.status)}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex">
        {/* Mapa */}
        <div className="flex-1 relative">
          {carregando && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando rastreamento...</p>
              </div>
            </div>
          )}
          
          {erro && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96">
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Painel Lateral */}
        <div className="w-96 bg-white border-l overflow-y-auto p-6 space-y-6">
          {/* Status Atual */}
          {localizacaoMotoboy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Localização Atual
                </CardTitle>
                <CardDescription>
                  Atualizado em {new Date(localizacaoMotoboy.timestamp).toLocaleTimeString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {localizacaoMotoboy.velocidade && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Velocidade</span>
                    <span className="font-medium">{localizacaoMotoboy.velocidade.toFixed(1)} km/h</span>
                  </div>
                )}
                
                {tempoEstimado && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Tempo Estimado
                    </span>
                    <span className="font-medium text-blue-600">{tempoEstimado}</span>
                  </div>
                )}
                
                {distanciaRestante && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Distância
                    </span>
                    <span className="font-medium">{distanciaRestante}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informações da Entrega */}
          {dadosEntrega && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Endereço de Entrega</label>
                  <p className="mt-1 text-gray-900">{dadosEntrega.endereco_entrega}</p>
                </div>
                
                {!localizacaoMotoboy && (
                  <Alert>
                    <AlertDescription>
                      Aguardando motoboy iniciar o rastreamento...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

