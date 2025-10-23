# 🧪 Teste - Imagem de Perfil no Sidebar

## ⚠️ IMPORTANTE - Faça Isso Primeiro!

### 1. Reinicie o Backend

```bash
cd backend
# Pressione Ctrl+C para parar
npm start
```

### 2. Faça Logout e Login Novamente

**Por quê?** O backend agora retorna o campo `profile_image_url` no login, mas seu token atual não tem essa informação.

**Como fazer:**

1. No sistema da farmácia, clique em "Sair" no menu
2. Faça login novamente com suas credenciais
3. Agora o `user.profile_image_url` estará disponível!

## 🧪 Passo a Passo do Teste

### Teste 1: Upload de Imagem

1. **Faça login** no sistema da farmácia
2. **Vá em Configurações** (ícone de engrenagem no menu)
3. **Veja o card "Imagem de Perfil"**
4. **Clique em "Fazer Upload"**
5. **Selecione uma imagem:**

   - JPG, PNG ou WebP
   - Máximo 5MB
   - Preferencialmente quadrada (512x512px)

6. **Aguarde:**

   - Preview aparece
   - Upload é feito
   - Mensagem verde de sucesso
   - Página recarrega automaticamente

7. **Verifique:**
   - ✅ Imagem aparece no card de configurações
   - ✅ **Imagem aparece no Sidebar** (rodapé do menu) 🎉

### Teste 2: Verificar se Persiste

1. **Recarregue a página** (F5)
2. **Verifique:**
   - ✅ Imagem continua no Sidebar
   - ✅ Imagem continua nas Configurações

### Teste 3: Remover Imagem

1. **Vá em Configurações**
2. **Clique no X vermelho** no canto da imagem
3. **Confirme** a remoção
4. **Verifique:**
   - ✅ Imagem some
   - ✅ Ícone padrão de usuário volta a aparecer no Sidebar

## 🔍 Debug - Se a Imagem NÃO Aparecer

### Passo 1: Verificar se está no localStorage

Abra o Console do navegador (F12) e execute:

```javascript
const user = JSON.parse(localStorage.getItem("user"));
console.log("Profile Image:", user?.profile_image_url);
```

**Resultado esperado:**

- Se retornar `null` ou `undefined` → Faça logout e login novamente
- Se retornar Base64 (`data:image/...`) → A imagem existe!

### Passo 2: Verificar no Banco de Dados

Execute no DBeaver:

```sql
SELECT
  u.id,
  u.nome,
  u.email,
  SUBSTRING(u.profile_image_url, 1, 50) as imagem_preview,
  LENGTH(u.profile_image_url) as tamanho_bytes
FROM usuarios u
JOIN farmacias f ON u.id = f.usuario_id
WHERE u.email = 'SEU_EMAIL_AQUI';
```

**Resultado esperado:**

- `tamanho_bytes` > 0 → Imagem salva com sucesso
- `imagem_preview` começa com `data:image/` → Formato correto

### Passo 3: Verificar Logs do Backend

```
backend/logs/combined.log
```

Procure por:

```
🏥 Upload de foto para farmácia ID: X
✅ Foto Base64 recebida
🔍 Tamanho: X.XXMB
✅ Foto atualizada: Nome da Farmácia
```

## ✅ Checklist de Verificação

Antes de testar, certifique-se:

- [ ] Backend foi reiniciado
- [ ] Fez logout do sistema
- [ ] Fez login novamente
- [ ] Tem uma imagem de teste pronta (< 5MB, JPG/PNG)

## 🎯 Resultado Esperado

Após fazer upload:

- ✅ Imagem aparece no Sidebar (circular, 32x32px)
- ✅ Substitui o ícone azul de usuário
- ✅ Borda azul ao redor da imagem
- ✅ Persiste após recarregar a página
- ✅ Persiste após logout/login

## 📞 Se Ainda Não Funcionar

Execute este teste no Console do navegador:

```javascript
// 1. Verificar se o AuthContext tem a imagem
const user = JSON.parse(localStorage.getItem("user"));
console.log("User:", user);
console.log("Profile Image URL:", user?.profile_image_url);

// 2. Se não tiver, força um novo login
localStorage.removeItem("authToken");
localStorage.removeItem("user");
window.location.href = "/login";
```

## 🎉 Sucesso!

Se tudo funcionar, você verá:

- Logo da farmácia no Sidebar
- Imagem de perfil nas Configurações
- Sistema visualmente personalizado

A imagem fica salva como Base64 no banco e aparece automaticamente em todos os lugares! 📸✨
