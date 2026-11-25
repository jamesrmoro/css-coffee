# Relatório — CSS Coffee 2.0 (25/11/2026)

## Resumo

O jogo foi reescrito do zero mantendo a ideia, o visual (toalha xadrez, xícaras e pires, painel marrom) e o conteúdo dos 24 níveis. Ficou sem framework, carrega em ~1 s, funciona offline, está em português e inglês e pronto para virar TWA no Google Play.

| | Antes | Depois |
|---|---|---|
| Requisições ao abrir | 55+ (49 fragmentos HTML via `fetch`, Alpine, 3 fontes do Google, CSS) | 4 (HTML com CSS/JS embutidos, 1 fonte, 1 imagem, ícone) |
| JavaScript | Alpine.js 40 KB + script | 32 KB, sem dependências |
| CSS | Tailwind 26 KB (gerado de arquivos errados) | 11 KB |
| Peso para abrir o jogo | ~470 KB + 3 fontes externas | ~100 KB (49 KB de HTML+CSS+JS) |
| Offline / instalável | não | sim (service worker + manifest) |
| Lighthouse (mobile) | — | Performance 97–100 · Acessibilidade 100 · Boas práticas 100 · SEO 100 |

## Erros encontrados no código antigo (todos corrigidos)

1. **Dava para pular nível com resposta pela metade**: nos níveis 17, 19 e 23 o botão "Next" verificava só a primeira propriedade; em 10, 12, 13, 21 e 24 o botão acendia com só uma correta.
2. **Respostas certas eram recusadas**: espaço duplo, letra maiúscula, linha em branco extra no fim, ordem diferente das linhas ou respostas equivalentes (`flex-flow` × `flex-direction` + `flex-wrap`) não passavam.
3. **Pires no lugar errado**: nível 10 tinha a classe digitada errada (`ow-reverse`), o 11 não tinha `items-start` e o 19/20 não tinham `flex-col` — o desenho não batia com a resposta.
4. **Resultado mudava com o tamanho da tela**: a mesa usava `100vh`; em telas largas o nível 18 já começava "resolvido" e em telas pequenas as xícaras saíam da mesa.
5. **Nível 19** pedia `justify-content` e `align-items`, mas a resposta era `flex-direction` + `flex-wrap`.
6. **HTML quebrado**: `<<div` repetido em vários níveis (aparecia um `<` solto).
7. **CSS do Tailwind gerado de arquivos errados**: a config lia `*.php`, mas os arquivos eram `.html`; também apontava para imagens inexistentes.
8. **Seletor de nível frágil** (`levelClick.event`) e variáveis globais vazando (`levelcurrent`, `level_current`).
9. **"Reset" não fazia nada**; o progresso se perdia ao fechar a página; nada acontecia ao terminar o nível 24.
10. **CSS do jogador injetado sem filtro** no `style` da mesa: `display:none`, `position` etc. quebravam o tabuleiro.
11. **Animação do vapor** mexia em `width/height/top/left` (recalcula layout 60×/s em 15 xícaras).
12. Elementos clicáveis eram `<span>` (sem teclado/leitor de tela), sem `lang`, contraste baixo.
13. Fontes do Google carregadas de fora (não funciona offline e envia dados ao Google).
14. Ícone de grão de café com cara de banco de ícones (risco de licença na loja) → criado ícone original.

## O que foi feito

### Jogo
- **Validação por posição** (como um navegador de verdade): qualquer resposta correta vale; só propriedades flexbox são aplicadas; valor inválido gera dica ("Linha 2: “centre” não é um valor válido…").
- **Mesa com tamanho lógico fixo** (500×520) escalada para a tela → os níveis são idênticos no celular, tablet e desktop.
- Xícaras **deslizam** até a posição nova enquanto você digita (animação FLIP, só `transform`).
- **Atalhos de toque (chips)**: toque na propriedade e depois no valor — dá para jogar no celular sem abrir o teclado.
- **Progresso salvo** (nível atual, níveis resolvidos, respostas, idioma). Seletor de níveis com ✓, barra de progresso e "Zerar progresso" com confirmação.
- **Tela de vitória** ao terminar o nível 24.
- **Português e inglês**: detecta o idioma do aparelho; botão PT/EN. Todas as 24 instruções traduzidas e revisadas.
- Desktop: **Enter** avança quando o nível está certo; setas ← → trocam de nível; Tab pula linha no editor.
- Celular: botão **“Ocultar instruções”** recolhe o texto para 2 linhas e aproxima o editor da mesa; a escolha fica salva (toque no texto ou em “Mostrar instruções” para abrir de novo).
- Celular: a mesa fica **fixa no topo** enquanto você rola as instruções (quando a tela tem altura suficiente; solta quando o teclado abre). Vibração curta ao acertar.
- **Botão voltar do Android** fecha os diálogos em vez de sair do app.
- Acessibilidade: botões reais, rótulos, `aria-live` no feedback, foco visível, respeita "reduzir movimento".
- Tela "Sobre": créditos ao Flexbox Froggy (só o nome, sem link) e link para o YouTube **@sprintcodes**.

### Desempenho
- Tudo em um `index.html` de 49 KB (CSS e JS minificados e embutidos) → primeira tela em ~1 s.
- Fonte DynaPuff hospedada localmente (22 KB, só o necessário), demais textos com fonte do sistema.
- Toalha convertida para WebP (45 → 24 KB); ícones otimizados (108 → 19 KB).
- Sem Alpine, sem Tailwind, sem Google Fonts.

### PWA / TWA
- `manifest.webmanifest` completo: ícones 192/512 + *maskable*, cores, categorias, `display_override`, `launch_handler`, atalho “Levels” e **screenshots de instalação** (6 *narrow* de celular + 4 *wide* de desktop, com legenda) para o preview do PWABuilder/Chrome. Validado no Chrome sem erros de manifest.
- `sw.js`: pré-carrega todos os arquivos, funciona 100% offline, atualiza sozinho a cada build.
- `.well-known/assetlinks.json` (modelo — preencher package e SHA-256 do Play).
- `.htaccess` para Apache (HTTPS, `.well-known` liberado, MIME, cache, compressão, segurança) — testado em Apache 2.4.
- `privacy.html` bilíngue (exigida pelo Google Play).
- Guia passo a passo: `docs/PUBLICAR-GOOGLE-PLAY.md` (Bubblewrap, assetlinks, ficha da loja, textos prontos PT/EN, formulários).

### Artes do Google Play (`store-assets/`)
- `play-icon-512.png` — ícone 512×512.
- `pt-BR/` e `en-US/`: `feature-graphic.png` (1024×500) e `screenshot-1…8.png` (1080×1920, 9:16, sem transparência), feitas com capturas reais do jogo.
- `og-image` (1200×630) para compartilhamento em redes sociais.

## Testes realizados
- Os 24 níveis resolvidos automaticamente em 4 telas (1366×768, 1920×1080, celular 360×740, tablet 800×1280): nenhum nível começa resolvido, todos aceitam a solução, respostas alternativas são aceitas (ex.: `flex-flow` no 19, `flex-direction`+`flex-wrap` no 20) e respostas erradas são recusadas.
- Zero erros no console; progresso salvo corretamente.
- Offline: com a rede desligada o jogo, a fonte, a toalha e a política de privacidade carregam do cache.
- Botão voltar fecha diálogos; troca de idioma; tela de vitória.
- Lighthouse mobile: 97–100 / 100 / 100 / 100.

## Pendências que dependem de você
1. Publicar `dist/` em https://css-coffee.sprintcodes.com.br/ (incluindo `.htaccess` e `.well-known`).
2. Preencher o SHA-256 do Play Console em `src/.well-known/assetlinks.json` (o package `br.com.sprintcodes.csscoffee.app` já está lá).
3. Gerar o `.aab` com Bubblewrap e enviar ao Play Console.

## Arquivos antigos
Os arquivos da versão anterior (Alpine/Tailwind: `content/`, `build/`, `css/`, `js/`, `images/`, `favicon/`, `index.html`, `tailwind.config.js`, `postcss.config.js`, `src/style.css`) foram substituídos. Eles continuam no histórico do Git (`git show 59a703d`) caso precise consultar.
