# Migração de dados: projeto antigo → novo

Quando você cria um **novo** projeto Firebase e quer levar a coleção `attractions_v1` do projeto antigo para o novo.

## 1. Exportar do projeto antigo

No projeto antigo (ex.: `catalogoticketloko-3aa6d`):

```bash
firebase use catalogoticketloko-3aa6d   # ou o ID do projeto antigo
gcloud firestore export gs://BUCKET_DO_PROJETO_ANTIGO/exports
```

Ou use o **Firebase Console** do projeto antigo: Firestore → … → Exportar dados (requer Blaze).

## 2. Importar no projeto novo

No projeto novo:

```bash
firebase use SEU_NOVO_PROJECT_ID
gcloud firestore import gs://BUCKET_DO_NOVO_PROJETO/imports/...
```

Ou Console do projeto novo: Firestore → Importar.

## 3. (Opcional) Normalizar `images[]`

Se os documentos antigos têm só o campo `img` (string) e você quer passar a usar `images` (array) no app:

- No **Firebase Console** (projeto novo), edite cada documento de `attractions_v1` e adicione um campo `images` do tipo **array** com um único item: a URL que está em `img`.
- Ou use um script local (Node + Admin SDK) que percorre a coleção e faz `updateDoc` com `images: [doc.img]` quando `img` existir e `images` não existir.

Exemplo de estrutura após migração:

- Antes: `{ name, category, img: "https://..." }`
- Depois: `{ name, category, img: "https://...", images: ["https://..."] }`

O app já trata os dois formatos: usa `images[0]` ou `img` como capa e exibe carrossel quando `images.length > 1`.
