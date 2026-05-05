# Salvar Aurora Dashboard Rules como memória persistente

Transformar o `AURORA_DASH_RULES.md` em memórias estruturadas do projeto (`mem://`) para que as regras sejam aplicadas automaticamente em **todas as sessões futuras**, sem precisar relembrar.

## Estratégia

A memória do projeto tem dois níveis:
- **Core** (`mem://index.md`) — regras curtas aplicadas a TODA ação automaticamente
- **Memórias detalhadas** — arquivos referenciados, lidos sob demanda quando o tópico é relevante

As regras do Aurora são críticas e específicas da dashboard, então vou usar **ambos**: regras universais no Core + arquivos detalhados por tema.

## Arquivos a criar

### 1. `mem://index.md` (índice + regras Core)
Regras universais sempre ativas:
- Fonte de verdade visual: `public/dashboard/` (nunca tratar deploy publicado como fonte)
- Não sobrescrever dashboard inteira — aplicar apenas o delta
- Lovable PODE alterar: layout, componentes, CSS, responsividade, copy
- Lovable NÃO PODE alterar sozinho: integração HA, WebSocket, auth, WebRTC/go2rtc, contratos de id/data-*
- Se markup mudar, `app.js` deve ser ajustado no mesmo lote

### 2. `mem://features/dashboard-html-contracts` (constraint)
Lista completa dos IDs e `data-*` intocáveis:
`#view`, `#pageTitle`, `#pageSub`, `#wxTemp`, `#wxLocation`, `#wxIcon`, `#searchInput`, `data-route`, `data-route-go`, `data-home-camera`, `data-camera-feed`, `data-toggle`, `data-entity`

### 3. `mem://features/babytracker` (feature)
Regras do Babytracker:
- Preservar: WebRTC do berço, botão Reconectar, talk-back, câmera dominante
- Apenas 3 controles: Teto, Led Esther, Aquecedor
- NÃO reintroduzir: mamada, troca, sono, timeline/log no card de controles
- NÃO voltar pra snapshot no lugar de WebRTC

### 4. `mem://constraints/dashboard-anti-patterns` (constraint)
Padrões proibidos sem ordem explícita:
- Botões Ligar/Parar separados pra ruído branco quando já existe toggle
- Cards gigantes de cabeçalho em Lights
- Quebra de tabs da hero em duas linhas
- Topbar que esconde botões no tablet
- Injeções tardias fora do `renderBaby()`

### 5. `mem://features/publish-flow` (feature)
Fluxo de publicação local (referência):
- Visual no GitHub → `public/dashboard/`
- Staging local: `www/aurora-command-center/update/`
- Deploy: `www/aurora-command-center/`
- Comando: `.\_tools\aurora-gitupdate.ps1` (com `-DryRun` ou `-Force`)

## Resultado esperado

Depois de aprovado, em qualquer sessão futura, ao tocar na dashboard eu vou:
1. Já saber automaticamente as regras Core (sem precisar ler nada)
2. Consultar os arquivos detalhados quando o tópico bater (ex: mexer no Babytracker → leio `mem://features/babytracker`)
3. Nunca quebrar contratos de HTML nem reintroduzir padrões proibidos

O arquivo original `AURORA_DASH_RULES.md` continua no repo como documentação humana — a memória é o espelho operacional pra mim.

Aprova pra eu executar?