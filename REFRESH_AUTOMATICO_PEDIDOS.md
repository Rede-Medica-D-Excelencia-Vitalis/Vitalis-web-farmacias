# Sistema de Refresh Automático de Pedidos

## Visão Geral

A tela de pedidos agora possui um **sistema de atualização automática invisível** que verifica novos pedidos a cada 10 segundos, sem necessidade de interação do usuário.

## Características

### ✅ Totalmente Invisível

- **Sem botões ou controles visíveis**
- Funciona automaticamente em segundo plano
- Não interrompe a experiência do usuário
- Interface limpa e sem elementos adicionais

### ⏱️ Atualização Inteligente

- **Intervalo:** A cada 10 segundos
- **Silencioso:** Não mostra loading na tela durante refresh automático
- **Primeira carga:** Mostra loading apenas quando a página é carregada inicialmente
- **Otimizado:** Não sobrecarrega o servidor com requisições desnecessárias

### 🔔 Notificações Automáticas

Quando novos pedidos são detectados:

#### Para 1 Novo Pedido:

- Toca o som **bell-notification-337658.mp3** (som da farmácia)
- Mostra notificação com número do pedido e nome do cliente
- Exemplo: "Novo Pedido Recebido - Pedido #12345 de João Silva"

#### Para Múltiplos Novos Pedidos:

- Toca o som **bell-notification-337658.mp3** (som da farmácia)
- Mostra notificação informando a quantidade
- Exemplo: "Novos Pedidos Recebidos - 3 novos pedidos foram recebidos!"

## Como Funciona

### Implementação Técnica

```typescript
// Referência para o intervalo
const intervalRef = useRef<NodeJS.Timeout | null>(null);
const previousPedidosCount = useRef<number>(0);

// Configuração do refresh automático
useEffect(() => {
  // Intervalo de 10 segundos
  intervalRef.current = setInterval(() => {
    carregarPedidos(true); // true = silencioso
  }, 10000);

  // Cleanup ao desmontar componente
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);
```

### Detecção de Novos Pedidos

```typescript
// Compara quantidade atual com quantidade anterior
if (silencioso && novosPedidos.length > previousPedidosCount.current) {
  const qtdNovos = novosPedidos.length - previousPedidosCount.current;

  // Notifica e toca som
  notificationService.newOrder(numero, cliente);
}
```

## Comportamento

### Ao Entrar na Tela

1. Carrega os pedidos pela primeira vez (com loading visível)
2. Inicia o timer de 10 segundos automaticamente
3. Salva a quantidade inicial de pedidos como referência

### Durante a Navegação

1. A cada 10 segundos:

   - Busca novos pedidos silenciosamente
   - Compara com a quantidade anterior
   - Se houver novos pedidos → notifica + toca som
   - Atualiza a lista na tela automaticamente

2. O usuário pode:
   - Continuar interagindo com a tela normalmente
   - Filtrar pedidos (o refresh continua funcionando)
   - Buscar pedidos (o refresh continua funcionando)
   - Ver detalhes de pedidos (o refresh continua funcionando)

### Ao Sair da Tela

- O intervalo é automaticamente limpo
- Para de fazer requisições
- Libera recursos do sistema

## Integração com Notificações

### Sons Utilizados

**bell-notification-337658.mp3** - Para novos pedidos da farmácia

- Usado exclusivamente para alertar sobre novos pedidos
- Som mais chamativo que o padrão
- Garante que farmacêutico não perca nenhum pedido

### Tipos de Notificação

1. **Pedido Individual:**

```typescript
notificationService.newOrder(
  "PED-12345", // Número do pedido
  "Maria Silva" // Nome do cliente
);
```

2. **Múltiplos Pedidos:**

```typescript
notificationService.info(
  "Novos Pedidos Recebidos",
  `${qtd} novos pedidos foram recebidos!`,
  {
    sound: true,
    usePharmacySound: true,
    duration: 6000,
  }
);
```

## Vantagens

### ✅ Para o Usuário

- Não precisa ficar atualizando manualmente
- Recebe alertas sonoros de novos pedidos
- Interface limpa sem poluição visual
- Experiência fluida e sem interrupções

### ✅ Para o Negócio

- Resposta mais rápida a novos pedidos
- Reduz tempo de espera do cliente
- Melhora eficiência operacional
- Diminui chance de perder pedidos

### ✅ Para o Sistema

- Otimizado para não sobrecarregar o servidor
- Limpa recursos automaticamente
- Não causa vazamento de memória
- Funciona mesmo com a aba em segundo plano

## Logs no Console

Para desenvolvimento/debug, o sistema registra:

```
✅ Refresh automático ativado - Atualizando pedidos a cada 10 segundos
🔄 Atualizando pedidos automaticamente (silencioso)...
🔔 2 novo(s) pedido(s) detectado(s)!
⏸️ Limpando intervalo de refresh automático
```

## Configurações

### Alterar Intervalo de Atualização

Para mudar o intervalo de 10 segundos para outro valor:

```typescript
intervalRef.current = setInterval(() => {
  carregarPedidos(true);
}, 15000); // 15 segundos ao invés de 10
```

### Desabilitar Notificações Sonoras

Se necessário, pode-se desabilitar apenas o som:

```typescript
notificationService.newOrder(numero, cliente, { sound: false });
```

## Compatibilidade

- ✅ **Navegadores:** Chrome, Firefox, Safari, Edge
- ✅ **Mobile:** Funciona em navegadores mobile
- ✅ **Background:** Continua funcionando com aba em segundo plano
- ✅ **Performance:** Otimizado para não consumir recursos excessivos

## Monitoramento

### Indicadores de Funcionamento

1. **Console Logs:** Mensagens a cada 10 segundos
2. **Network Tab:** Requisições periódicas à API
3. **Notificações:** Alertas quando novos pedidos chegam

### Verificação

Para confirmar que está funcionando:

1. Abra a tela de pedidos
2. Abra o console do navegador (F12)
3. Aguarde 10 segundos
4. Deve aparecer: "🔄 Atualizando pedidos automaticamente (silencioso)..."

## Arquivos Modificados

- **`src/pages/business/Orders.tsx`**
  - Adicionado `useRef` para gerenciar intervalo
  - Implementado sistema de refresh automático
  - Adicionado detecção de novos pedidos
  - Integrado notificações sonoras

## Notas Importantes

⚠️ **Importante:** O refresh automático é **sempre ativo** quando a tela está aberta. Não há necessidade de ativá-lo manualmente.

⚠️ **Performance:** O intervalo de 10 segundos foi escolhido para balancear:

- Rapidez na detecção de novos pedidos
- Não sobrecarregar o servidor
- Consumo razoável de dados

⚠️ **Navegador em Segundo Plano:** Alguns navegadores podem reduzir a frequência de timers quando a aba está inativa para economizar bateria.

---

**Data de Implementação:** Outubro 2025
**Versão:** 1.0
**Intervalo de Atualização:** 10 segundos
**Som de Notificação:** bell-notification-337658.mp3












