# AURORA_WORKFLOW

## Objetivo
Manter o dashboard Aurora com uma única fonte visual no GitHub, evitando quebra de integração com o Home Assistant.

## Fonte de verdade
- Fonte visual única: `public/dashboard/`
- Deploy publicado: `www/aurora-command-center/`
- `www/aurora-command-center/` nunca é fonte. É somente artefato publicado.

## Donos de responsabilidade
### Lovable
O Lovable é dono de:
- layout
- componentes
- CSS
- responsividade
- copy visual
- organização visual de páginas

### Codex
O Codex é dono de:
- integração Home Assistant
- WebSocket
- autenticação/token
- WebRTC / go2rtc
- preservação dos contratos HTML (`id` e `data-*`)
- publicação segura no deploy

## Regras obrigatórias
1. Nunca sobrescrever a Aurora publicada cegamente.
2. Sempre aplicar apenas o delta visual vindo de `public/dashboard/`.
3. Nunca mudar sem instrução explícita:
   - integração HA
   - fluxo de auth
   - WebSocket
   - WebRTC / go2rtc
   - `ENTITY_MAP`
   - contratos HTML e `data-*`
4. Se o markup mudar, `public/dashboard/app.js` deve mudar no mesmo lote.
5. Babytracker é sensível. Não alterar comportamento funcional sem pedido explícito.
6. O deploy publicado pode conter overrides locais de integração. Eles devem ser preservados.

## Contratos que não podem quebrar
Exemplos mínimos:
- `#view`
- `#pageTitle`
- `#pageSub`
- `#wxTemp`
- `#wxLocation`
- `#wxIcon`
- `#searchInput`
- `data-route`
- `data-route-go`
- `data-home-camera`
- `data-camera-feed`
- `data-toggle`
- `data-entity`
- `data-script`
- `data-media-playpause`
- `data-refresh-camera`

## Fluxo correto
1. Você altera o visual no Lovable.
2. O Lovable grava no repositório GitHub da Aurora.
3. O Codex puxa a versão nova do GitHub.
4. O Codex compara com a versão publicada.
5. O Codex aplica apenas o delta visual.
6. O Codex preserva as integrações locais.
7. O Codex publica em `www/aurora-command-center/`.

## O que não fazer
- Não editar manualmente `www/aurora-command-center/` como fonte visual.
- Não tratar export solto como fonte principal se o repo Git já existe.
- Não refatorar visual direto no deploy publicado.
- Não deixar auto-sync cego sobrescrever integrações locais.

## Estado atual do ambiente
Atualmente esta máquina não tem `git` instalado.
Por isso o fluxo de sincronização está usando pull do GitHub raw + merge/publicação local.
Quando `git` estiver disponível, o fluxo pode migrar para checkout local do mesmo repositório.

## Próximo passo para sincronização real de Git
Para conectar o repositório diretamente nesta máquina, é necessário:
- instalar `git`
- clonar o repo localmente
- usar esse checkout como base de comparação/publicação

Enquanto isso não existir, o fluxo oficial continua sendo:
- GitHub como fonte visual
- merge seletivo local
- publicação controlada
