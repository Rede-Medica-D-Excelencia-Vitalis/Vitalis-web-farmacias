# 📸 Guia - Imagem de Perfil da Farmácia

## ✅ Implementação Completa

Sistema de upload de imagem de perfil com conversão automática para Base64 implementado com sucesso!

## 🎯 Onde a Imagem Aparece

A imagem de perfil da farmácia aparece em **2 lugares**:

### 1. **Sidebar (Menu Lateral)** 🗂️

- Ícone circular no rodapé do menu
- Substitui o ícone padrão de usuário
- Tamanho: 32x32px (w-8 h-8)
- Borda azul
- Fallback: Ícone de usuário se não houver imagem

### 2. **Página de Configurações** ⚙️

- Card "Imagem de Perfil"
- Preview grande (160x160px / w-40 h-40)
- Botões de upload e remoção
- Informações de tamanho

## 🚀 Como Usar

### **Passo 1: Acessar Configurações**

1. Faça login no sistema da farmácia
2. Clique em "Configurações" no menu lateral

### **Passo 2: Fazer Upload**

1. No card "Imagem de Perfil", clique em **"Fazer Upload"**
2. Selecione uma imagem do seu computador:

   - Formatos aceitos: JPG, PNG, WebP
   - Tamanho máximo: 5MB
   - Recomendado: Imagem quadrada (512x512px ou 1024x1024px)

3. A imagem será:

   - ✅ Validada automaticamente
   - ✅ Convertida para Base64
   - ✅ Mostrada no preview
   - ✅ Enviada para o backend
   - ✅ Salva no banco de dados

4. **Sucesso!** 🎉
   - Mensagem verde de confirmação
   - A página recarrega automaticamente
   - A imagem aparece no **Sidebar** imediatamente

### **Passo 3: Ver a Imagem**

Após o upload, a imagem aparece:

- ✅ No rodapé do Sidebar (substituindo o ícone de usuário)
- ✅ Na página de Configurações
- ✅ Persiste após logout/login

### **Passo 4: Alterar ou Remover**

- **Alterar:** Clique em "Alterar Imagem" e selecione nova foto
- **Remover:** Clique no **X vermelho** no canto da imagem → Confirme

## 💻 Fluxo Técnico

```
1. Usuário seleciona arquivo (JPG/PNG/WebP)
   ↓
2. Frontend valida tipo e tamanho (< 5MB)
   ↓
3. FileReader converte para Base64
   ↓
4. Preview mostra imagem
   ↓
5. POST /api/farmacias/:id/foto com { foto_base64: "data:image/..." }
   ↓
6. Backend valida e salva em usuarios.profile_image_url
   ↓
7. LocalStorage atualizado com nova imagem
   ↓
8. Página recarrega
   ↓
9. Imagem aparece no Sidebar! ✅
```

## 📡 Endpoints

### Upload

```http
POST /api/farmacias/:id/foto
Body: { "foto_base64": "data:image/png;base64,..." }
```

### Obter

```http
GET /api/farmacias/:id/foto
Response: { "sucesso": true, "foto_base64": "..." }
```

### Remover

```http
DELETE /api/farmacias/:id/foto
Response: { "sucesso": true }
```

## 🎨 Características Visuais

### Sidebar

- Formato: Circular (rounded-full)
- Tamanho: 32x32px (w-8 h-8)
- Borda: Azul (border-2 border-blue-200)
- Object-fit: Cover (mantém proporção)

### Configurações

- Formato: Circular (rounded-full)
- Tamanho: 160x160px (w-40 h-40)
- Borda: Cinza (border-4 border-gray-200)
- Sombra: shadow-lg

## ⚡ Atualizações em Tempo Real

**Quando a imagem é alterada:**

1. ✅ LocalStorage atualizado
2. ✅ Página recarrega (após 1 segundo)
3. ✅ Sidebar atualizado automaticamente
4. ✅ Preview atualizado
5. ✅ Sem necessidade de logout/login

## 🔄 Fallback

Se a imagem:

- **Não existir:** Mostra ícone de usuário padrão
- **Falhar ao carregar:** Volta para ícone padrão (onError)
- **For removida:** Ícone padrão reaparece

## 📊 Validações

### Frontend

- ✅ Tipo: JPG, PNG, WebP
- ✅ Tamanho: Máx 5MB
- ✅ Preview antes de enviar
- ✅ Mensagens de erro descritivas

### Backend

- ✅ Formato Base64 válido
- ✅ Tamanho: Máx 10MB (Base64)
- ✅ Autenticação obrigatória
- ✅ Permissões verificadas

## 🧪 Teste Rápido

1. **Login** como farmácia
2. **Veja** o ícone de usuário padrão no Sidebar
3. **Acesse** Configurações
4. **Faça upload** de uma logo
5. **Aguarde** a mensagem de sucesso
6. **Observe** a imagem aparecer no Sidebar automaticamente!

## 🎉 Pronto!

Agora a logo da sua farmácia aparece no Sidebar, dando uma identidade visual única ao sistema! 📸✨

**Arquivos modificados:**

- ✅ `Sidebar.tsx` - Mostra imagem de perfil
- ✅ `AuthContext.tsx` - Interface atualizada
- ✅ `ProfileImageUpload.tsx` - Atualiza localStorage
- ✅ `Settings.tsx` - Callback de atualização
- ✅ Backend com endpoints completos
