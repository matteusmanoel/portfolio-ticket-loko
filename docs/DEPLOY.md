# Deploy e release

## Build local

```bash
npm ci
npm run build
```

A saída fica em `dist/` (site estático).

## Variáveis de ambiente (opcional)

O app funciona com a config do Firebase embutida. Para sobrescrever em produção, use:

| Variável | Uso |
|----------|-----|
| `VITE_FIREBASE_API_KEY` | API Key do projeto Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

Crie `.env.production` na raiz (não commitar chaves sensíveis se o repo for público; prefira variáveis no painel do provedor).

## Onde publicar

- **Vercel**: conectar o repo, build command `npm run build`, output directory `dist`, root `./`.
- **Netlify**: idem; publish directory `dist`, build command `npm run build`.
- **Cloudflare Pages**: build command `npm run build`, output directory `dist`.
- **Firebase Hosting**: `firebase init hosting` apontando para `dist`; depois `npm run build && firebase deploy`.

## Regras Firestore e Storage

Antes de ir ao ar, publique as regras:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

- **firebase/firestore.rules**: leitura pública para `attractions_v1`; escrita apenas para usuários com documento em `admins/{uid}`. Coleção `admins` editada pelo Console.
- **firebase/storage.rules**: leitura pública para `items/**`; escrita/delete apenas para admins (requer plano Blaze se usar `firestore.get` nas regras de Storage).

## Checklist de release

1. [ ] Regras Firestore e Storage publicadas (ver acima).
2. [ ] Coleção `attractions_v1` com dados de produção.
3. [ ] Documentos em `admins/{uid}` para cada administrador (UID do Google).
4. [ ] Build local sem erros (`npm run build`).
4. [ ] Testar link do vendedor: `https://seu-dominio.com/?v=joao&wpp=5545999999999` (número E.164).
5. [ ] Testar “Solicitar Orçamento”: adicionar itens, preencher grupo, clicar e conferir abertura do WhatsApp com a mensagem correta.
6. [ ] (Opcional) Configurar env vars no painel do provedor de deploy.
