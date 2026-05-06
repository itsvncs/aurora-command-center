# Aurora Dashboard Rules

Este documento define regras para alterar a dashboard sem quebrar a integração com o Home Assistant.

## Fonte de Verdade
- O deploy publicado fica em `www/aurora-command-center/`.
- O visual vindo do GitHub/Lovable deve sair de `public/dashboard`.
- O fluxo local de publicação usa `www/aurora-command-center/update/` como staging.
- Nunca trate o deploy publicado como fonte visual principal.

## Regra Principal
- Não sobrescrever a dashboard inteira sem comparar.
- Sempre identificar o que mudou e aplicar apenas o delta visual quando houver integração local já ajustada.

## Regra de Encoding
- Todos os arquivos de `public/dashboard/` devem permanecer em `UTF-8` limpo.
- Não salvar arquivos em ANSI, Latin-1, Windows-1252 ou com recodificação ambígua.
- Antes de publicar qualquer mudança visual, validar que não foram introduzidos sinais de mojibake como:
  - `Ã`
  - `Â`
  - `â`
  - `�`
  - `??` no lugar de acentos, símbolos ou ícones
- Se aparecer qualquer um desses padrões, a mudança deve ser tratada como quebrada e não deve ser publicada.
- Caracteres críticos que precisam permanecer corretos:
  - `ç`, `ã`, `á`, `é`, `í`, `ó`, `ú`, `ê`, `ô`
  - `°`
  - `·`
  - ícones/texto simbólico como `◀`, `▶`, `❚❚`, `🎤`
- Nunca corrigir encoding diretamente no deploy publicado como solução definitiva. A correção deve acontecer primeiro na fonte visual do repositório.

## Contratos Obrigatórios do HTML
Estes ids e atributos não podem ser removidos ou renomeados sem ajuste correspondente no `app.js`:
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

## Babytracker
Preservar estes pontos, salvo mudança técnica explícita:
- stream principal do berço em WebRTC
- botão `Reconectar`
- talk-back visual
- câmera como elemento dominante da tela
- sem reintroduzir blocos legados de:
  - mamada
  - troca
  - sono
  - timeline/log dentro do card de controles
- controles visuais limitados a:
  - `Teto`
  - `Led Esther`
  - `Aquecedor`

## Não Reintroduzir
Não voltar com estes padrões sem necessidade explícita:
- snapshot no lugar do WebRTC no Babytracker
- botões `Ligar/Parar` separados para ruído branco quando já existir toggle
- cards gigantes de cabeçalho em `Lights`
- quebra de tabs da hero em duas linhas
- topbar que esconde botões no tablet
- injeções tardias que adicionam UI extra fora do `renderBaby()`

## Integração com Home Assistant
Qualquer mudança visual deve respeitar:
- autenticação/token
- WebSocket
- chamadas de serviço
- mapeamento de entidades
- go2rtc/Frigate
- estados locais e patches de UI

Se o markup mudar, o `app.js` precisa ser ajustado no mesmo lote.

## Fluxo Recomendado
1. Atualizar o visual no GitHub em `public/dashboard`.
2. Rodar `._tools/aurora-gitupdate.ps1 -DryRun`.
3. Validar encoding e rejeitar a mudança se houver mojibake.
4. Comparar o resultado com a versão publicada.
5. Preservar integrações locais críticas.
6. Publicar.

## Comandos Locais
Atualizar do GitHub e publicar:
```powershell
.\_tools\aurora-gitupdate.ps1
```

Só validar sem publicar:
```powershell
.\_tools\aurora-gitupdate.ps1 -DryRun
```

Forçar publicação mesmo se o hash não tiver mudado:
```powershell
.\_tools\aurora-gitupdate.ps1 -Force
```

## Regra Editorial para Lovable
O Lovable pode alterar:
- layout
- componentes
- CSS
- responsividade
- copy visual

O Lovable não deve alterar sozinho:
- integração HA
- WebSocket
- fluxo de auth
- WebRTC/go2rtc
- contratos de ids e `data-*`

Se precisar mudar isso, a mudança deve vir explicitamente documentada.
