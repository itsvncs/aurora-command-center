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
7. Todo arquivo de `public/dashboard/` deve permanecer em `UTF-8` limpo. Se aparecer mojibake (`Ã`, `Â`, `â`, `�`, `??` em lugar de acentos ou símbolos), a mudança deve ser bloqueada antes do publish.

## Regra de encoding
- Fonte visual obrigatória em `UTF-8`.
- Não salvar em ANSI / Latin-1 / Windows-1252.
- Antes de publicar, validar visualmente e por diff se textos como estes continuam corretos:
  - `Serviços`
  - `Mídia`
  - `Segurança`
  - `Berço`
  - `Ruído branco`
  - `Em execução`
  - `°`
  - `·`
  - `◀`, `▶`, `❚❚`, `🎤`
- Nunca tratar correção de encoding apenas no deploy como solução final. A correção precisa existir primeiro no repositório.

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
4. O Codex valida encoding e bloqueia o publish se houver mojibake.
5. O Codex compara com a versão publicada.
6. O Codex aplica apenas o delta visual.
7. O Codex preserva as integrações locais.
8. O Codex publica em `www/aurora-command-center/`.

## O que não fazer
- Não editar manualmente `www/aurora-command-center/` como fonte visual.
- Não tratar export solto como fonte principal se o repo Git já existe.
- Não refatorar visual direto no deploy publicado.
- Não deixar auto-sync cego sobrescrever integrações locais.

## Estado atual do ambiente
- `git` está instalado nesta máquina.
- O repositório local usado para sync fica em `repos/aurora-command-center`.
- O publish continua seletivo e controlado, nunca overwrite cego.
