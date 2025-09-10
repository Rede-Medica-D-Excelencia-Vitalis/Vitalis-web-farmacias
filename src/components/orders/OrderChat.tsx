import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '@/contexts';

interface Message {
  id: number;
  chat_id: number;
  autor_id: number;
  conteudo: string;
  tipo: string;
  criado_em: string;
  autor_nome?: string;
  tipo_usuario?: string;
}

interface Chat {
  id: number;
  pedido_id: number;
  tipo_problema: string;
  descricao: string;
  prioridade: string;
  status: 'aberto' | 'em_andamento' | 'fechado';
  criado_em: string;
  farmacia_nome: string;
  paciente_nome: string;
}

interface OrderChatProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderChat: React.FC<OrderChatProps> = ({ order, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && order) {
      loadChat();
    }
  }, [isOpen, order]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar chat existente ou criar novo
  const loadChat = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      // Primeiro, tentar buscar um chat existente
      const data = await listarChats(order.id);
      
      if (data.chats && data.chats.length > 0) {
        // Chat existe, carregar mensagens
        const existingChat = data.chats[0];
        setChat(existingChat);
        await loadMessages(existingChat.id);
      } else {
        // Não há chat, criar um novo
        await createNewChat();
      }
    } catch (error) {
      console.error('Erro ao carregar chat:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listar chats de um pedido
  const listarChats = async (pedidoId: number): Promise<{ chats: Chat[] }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido-chat/listar?pedido_id=${pedidoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao listar chats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar chats:', error);
      return { chats: [] };
    }
  };

  // Criar novo chat
  const createNewChat = async () => {
    try {
      const data = await criarChat({
        pedido_id: order.id,
        tipo_problema: 'outro',
        descricao: `Dúvida sobre pedido #${order.numero_pedido || order.id}`,
        prioridade: 'media'
      });
      
      setChat(data.chat);
      setMessages([]);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  // Criar novo chat
  const criarChat = async (data: {
    pedido_id: number;
    tipo_problema: string;
    descricao: string;
    prioridade: string;
  }): Promise<{ chat: Chat }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido-chat/criar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar chat');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      throw error;
    }
  };

  // Carregar mensagens do chat
  const loadMessages = async (chatId: number) => {
    try {
      const data = await buscarChat(chatId);
      setMessages(data.mensagens || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  // Buscar chat específico
  const buscarChat = async (chatId: number): Promise<{ chat: Chat; mensagens: Message[] }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido-chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar chat');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar chat:', error);
      throw error;
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    try {
      const data = await enviarMensagem(chat.id, {
        conteudo: newMessage.trim(),
        tipo: 'texto'
      });
      
      setMessages(prev => [...prev, data.dados]);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  // Enviar mensagem
  const enviarMensagem = async (chatId: number, data: {
    conteudo: string;
    tipo: string;
  }): Promise<{ dados: Message }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido-chat/${chatId}/mensagem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  // Formatar data da mensagem
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Verificar se a mensagem é do usuário atual
  const isOwnMessage = (message: Message) => {
    return message.autor_id === user?.id;
  };

  // Determinar o tipo de mensagem para exibição
  const getMessageType = (message: Message) => {
    if (message.tipo === 'sistema') return 'sistema';
    if (message.tipo_usuario === 'farmacia') return 'farmacia';
    return 'paciente';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Chat do Pedido #{order?.numero_pedido || order?.id}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {chat && (
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Cliente: {chat.paciente_nome}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  chat.status === 'aberto' ? 'bg-green-100 text-green-800' :
                  chat.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {chat.status === 'aberto' ? 'Aberto' :
                   chat.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                </span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Carregando chat...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Área de mensagens */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          getMessageType(message) === 'sistema' 
                            ? 'bg-gray-100 text-gray-700 mx-auto' 
                            : isOwnMessage(message)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          <div className="text-sm">{message.conteudo}</div>
                          <div className={`text-xs mt-1 ${
                            getMessageType(message) === 'sistema' 
                              ? 'text-gray-500' 
                              : isOwnMessage(message)
                              ? 'text-blue-200'
                              : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.criado_em)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma mensagem ainda</p>
                      <p className="text-sm">Inicie a conversa sobre o pedido</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Área de input */}
              <div className="border-t p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={sending || !chat}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={sending || !newMessage.trim() || !chat}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use este chat para conversar com o cliente sobre o pedido
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
