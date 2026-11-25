<h1 align="center">☕<br>CSS Coffee — aprenda CSS Flexbox jogando</h1>

CSS Coffee é um jogo educativo: o jogador escreve CSS para levar cada xícara até o pires do mesmo café. São **24 níveis** cobrindo `justify-content`, `align-items`, `flex-direction`, `order`, `align-self`, `flex-wrap`, `flex-flow` e `align-content`.

Inspirado no Flexbox Froggy. Canal: **YouTube @sprintcodes**.

- 100% HTML, CSS e JavaScript puros (sem framework, sem dependências em produção)
- Funciona **offline** (service worker) e é instalável (PWA) — pronto para **TWA / Google Play**
- Português e inglês (detecta o idioma do aparelho; botão PT/EN no topo)
- Progresso salvo no aparelho (localStorage) · nenhum dado coletado
- Mobile e desktop · Lighthouse: Performance 97-100, Acessibilidade 100, Boas práticas 100, SEO 100

---

## Estrutura

```
css-coffee/
├── src/                    ← CÓDIGO-FONTE (edite aqui)
│   ├── index.html          estrutura da página (CSS/JS são embutidos no build)
│   ├── css/style.css       todos os estilos (mobile first)
│   ├── js/levels.js        os 24 níveis (instruções PT/EN, xícaras, solução)
│   ├── js/i18n.js          textos da interface PT/EN
│   ├── js/game.js          lógica do jogo
│   ├── sw.js               service worker (offline)
│   ├── manifest.webmanifest   (ícones, screenshots narrow/wide, atalhos — lido pelo PWABuilder/Bubblewrap)
│   ├── screenshots/        telas usadas no manifest (instalação PWA/TWA)
│   ├── privacy.html        política de privacidade (obrigatória no Google Play)
│   ├── .well-known/assetlinks.json   ← vínculo do domínio com o app Android (TWA)
│   ├── .htaccess           Apache: HTTPS, MIME, cache, compressão, segurança
│   ├── fonts/ images/ app-icons/ favicon.ico robots.txt
├── dist/                   ← PASTA PARA PUBLICAR (gerada pelo build, não edite)
├── store-assets/           artes do Google Play (pt-BR e en-US)
├── docs/
│   ├── PUBLICAR-GOOGLE-PLAY.md   passo a passo TWA + textos da loja
│   └── RELATORIO.md              relatório de tudo o que foi feito
├── build.mjs               script de build
└── package.json
```

Site: **https://css-coffee.sprintcodes.com.br/**

## Rodar e gerar o build

Requisitos: Node.js 18+.

```bash
npm install        # instala o esbuild (só para o build)
npm run build      # gera dist/ minificado
npm start          # serve dist/ em http://localhost:5173
```

No WAMP, abra `http://localhost/projetos/css-coffee/dist/`.

> O service worker só funciona em `https://` ou `localhost`. Ao mudar qualquer arquivo em `src/`, rode `npm run build` de novo: o nome do cache muda sozinho e os jogadores recebem a versão nova.

## Como a validação funciona

A mesa tem duas camadas idênticas: os **pires** recebem a solução de referência e as **xícaras** recebem o CSS digitado. O nível é resolvido quando cada tipo de café ocupa exatamente a mesma posição dos pires daquele tipo. Por isso qualquer resposta equivalente é aceita (ex.: `flex-flow: column wrap` ou `flex-direction` + `flex-wrap`), e a mesa tem tamanho lógico fixo (500×520, escalada para caber na tela) para o resultado ser igual em qualquer aparelho.

Só propriedades flexbox são aplicadas (lista branca); valores inválidos geram uma dica no editor.

## Adicionar ou editar um nível

Edite `src/js/levels.js`. Exemplo:

```js
{
  cups: 'smw',                         // s = forte, m = médio, w = fraco
  base: { 'flex-wrap': 'wrap' },       // CSS já presente na mesa (opcional)
  target: '.table',                    // ou '.strong' / '.medium' / '.weak'
  solution: { 'justify-content': 'center' },
  props: ['justify-content'],          // atalhos mostrados no editor
  text: { en: '<p>…</p>', pt: '<p>…</p>' }
}
```

O total de níveis é calculado automaticamente. Rode o build e teste.

## Publicar

Veja **[docs/PUBLICAR-GOOGLE-PLAY.md](docs/PUBLICAR-GOOGLE-PLAY.md)**.
