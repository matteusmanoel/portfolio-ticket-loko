# Novo projeto Firebase (setup completo)

Use estes passos quando quiser criar um **novo** projeto Firebase e configurar o app para usá-lo (Auth Google + Firestore + Storage).

## 1. Criar o projeto

```bash
firebase projects:create
```

Siga o assistente (nome do projeto, etc.). Anote o **Project ID**.

## 2. Associar o projeto ao código

```bash
firebase use --add
```

Selecione o projeto recém-criado e, se pedido, dê um alias (ex.: `default`).

## 3. Habilitar serviços no Console

1. Abra [Firebase Console](https://console.firebase.google.com/) e selecione o projeto.
2. **Firestore**: Build → Firestore → Criar banco (modo produção).
3. **Authentication**: Build → Authentication → Começar → Provedor **Google** (ativar, salvar).
4. **Storage**: Build → Storage → Começar (modo produção).

## 4. Registrar o app Web e obter credenciais

1. No Console: Visão geral do projeto → ícone Web `</>` → Registrar app (apelido opcional).
2. Copie o objeto `firebaseConfig` e use os valores nas variáveis abaixo.

## 5. Configurar `.env.local`

Na raiz do repositório, crie `.env.local` (não commitar):

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

O app usa esses valores em tempo de build (Vite). Em produção, configure as mesmas variáveis no painel do seu provedor (Vercel, Netlify, etc.).

## 6. Publicar regras

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

- Firestore: leitura pública; escrita apenas para usuários que tenham documento em `admins/{uid}`.
- Storage: leitura pública em `items/**`; escrita/delete apenas para admins (consulta `admins` no Firestore). **Requer plano Blaze** para a regra que usa `firestore.get()` no Storage.

## 7. Definir administradores

No Firebase Console → Firestore → Iniciar coleção:

- ID da coleção: `admins`
- Document ID: **UID do usuário** (ex.: o UID da conta Google que deve ser admin)
- Campos: pode deixar um campo dummy, ex.: `role: "admin"`

Assim que existir o documento `admins/{uid}`, esse usuário poderá fazer login no `/admin` e criar/editar itens e fazer upload de fotos.

## Node

Se a CLI do Firebase acusar versão de Node não suportada, use **Node 22 LTS** (ex.: `nvm use 22`).
