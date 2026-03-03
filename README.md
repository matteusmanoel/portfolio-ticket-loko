# Catálogo Ticket Loko

Catálogo digital para vendedores enviarem ao cliente. O cliente navega pelos itens, monta um orçamento (lista de interesse) e pode **Solicitar Orçamento** pelo WhatsApp do vendedor que enviou o link.

## Como rodar

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Link do vendedor

Cada vendedor usa um link com o WhatsApp dele:

```
https://seu-dominio.com/?v=slug&wpp=5545999999999
```

- `v`: identificador do vendedor (ex.: nome)
- `wpp`: número em formato E.164 (ex.: 5545999999999 para Brasil)

Ao abrir esse link, o app guarda o vendedor na sessão. Ao clicar em **Solicitar Orçamento**, o WhatsApp abre para esse número com a mensagem formatada (itens + composição do grupo).

## Catálogo e Admin (Firestore + Storage)

Os itens vêm da coleção `attractions_v1`. Cada item pode ter várias fotos (`images[]`), guardadas no Firebase Storage.

- **Admin**: acesse [http://localhost:5173/admin](http://localhost:5173/admin) (ou o link “Admin” no header do catálogo). Login com **Google**. Apenas usuários com documento em `admins/{uid}` no Firestore podem criar/editar itens e fazer upload de fotos.
- **Em desenvolvimento**: para testar o admin sem login, use [http://localhost:5173/admin?devAdmin=1](http://localhost:5173/admin?devAdmin=1). O bypass só funciona em `npm run dev` e é ignorado em produção.
- Regras: `firebase/firestore.rules` e `firebase/storage.rules`. Ver [docs/DEPLOY.md](docs/DEPLOY.md) e [docs/FIREBASE_NEW_PROJECT.md](docs/FIREBASE_NEW_PROJECT.md).

## Deploy

Build estático: `npm run build` → saída em `dist/`.  
Instruções e checklist: [docs/DEPLOY.md](docs/DEPLOY.md).

## Protótipo original

O HTML monolítico original foi preservado em `index.legacy.html`.
