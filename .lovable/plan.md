## Objetivo

Como o Codex faz ajustes do outro lado entre as nossas viradas, o `codebase-context` que recebo no início de cada mensagem pode estar desatualizado. Vou gravar uma regra Core que me obriga a reler os arquivos do dashboard **na mesma virada da edição**, antes de qualquer alteração.

## Por que Core (e não memória detalhada)

Regras Core ficam sempre ativas, em toda mensagem, sem precisar eu "lembrar de consultar". É exatamente o que precisamos: uma trava automática.

## Mudanças

### 1. `mem://index.md` — adicionar 2 linhas no Core

Acrescentar ao bloco Core existente:

> Codex edita `public/dashboard/` em paralelo. Antes de editar QUALQUER arquivo em `public/dashboard/`, é obrigatório `code--view` no arquivo alvo na MESMA virada — nunca confiar no codebase-context pré-carregado nem em memória de viradas anteriores.
>
> Antes de bumpar `?v=` no `index.html` ou `CACHE` no `sw.js`, ler ambos para pegar a versão atual e incrementar a partir dela — nunca chutar valor.

Mantenho todo o resto do índice intacto (escrita do `index.md` é overwrite, então preservo Core atual + lista de Memories).

### 2. Sem novos arquivos de memória

A regra é curta e universal — não precisa de arquivo detalhado separado.

## Escopo da releitura obrigatória

- **Sempre relê**: tudo em `public/dashboard/` (`app.js`, `styles.css`, `index.html`, `sw.js`, `baby-cinema.css`, `demo-mode.js`, `v3.css` e qualquer outro que entre depois).
- **Não obriga releitura**: `src/routes/`, `src/components/` etc — esses só o Lovable mexe, conflito com Codex é improvável. Se quiser estender depois, é um ajuste de uma linha.

## Como isso muda meu comportamento

Toda vez que você pedir mudança no dashboard, minha primeira ação visível será um `code--view` (em paralelo nos arquivos relevantes — não fica lento). Só depois aplico o `code--line_replace`. Se eu pular, você pode me cobrar citando esta regra.

## Aprovação

Aprova que eu já gravo? É 1 edição em `mem://index.md`, sem tocar em código.