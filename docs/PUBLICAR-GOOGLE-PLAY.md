# Publicar o CSS Coffee no Google Play (TWA)

O app Android é uma **Trusted Web Activity**: um "invólucro" que abre o site em tela cheia no Chrome. Por isso o site precisa estar publicado em HTTPS no **seu próprio domínio** antes de gerar o app.

## 1. Hospedagem — atenção

Hoje o jogo está em `storage.googleapis.com/my-bucket-28399d3/`. **Esse endereço não serve para TWA**, porque o Android verifica o arquivo `https://css-coffee.sprintcodes.com.br/.well-known/assetlinks.json` na **raiz do domínio**, e na raiz de `storage.googleapis.com` você não pode colocar arquivos.

Opções (qualquer uma funciona):

- Subdomínio seu, ex.: `https://css-coffee.sprintcodes.com.br/` ← **domínio escolhido**
- Firebase Hosting, Netlify, Cloudflare Pages ou Vercel (grátis, HTTPS automático, aceitam domínio próprio)
- Google Cloud Storage **com** domínio próprio + Load Balancer (mais complexo)

Envie **o conteúdo da pasta `dist/`** para a raiz do site, incluindo a pasta oculta `.well-known/`.
Se o jogo ficar numa subpasta (ex.: `seusite.com/csscoffee/`), o `assetlinks.json` ainda precisa estar em `seusite.com/.well-known/assetlinks.json`.

### Deploy pelo Git do cPanel

Funciona de dois jeitos (os dois já estão prontos no repositório):

**A) Repositório clonado direto na pasta do subdomínio** (`~/css-coffee.sprintcodes.com.br`)
- O `.htaccess` da **raiz do repositório** serve o conteúdo de `dist/` como se estivesse na raiz: `/` → `dist/index.html`, `/.well-known/assetlinks.json` → `dist/.well-known/assetlinks.json`.
- `src/`, `docs/`, `store-assets/`, `.git`, `package.json` etc. ficam bloqueados (403/404).
- Para atualizar: cPanel → **Git™ Version Control** → **Manage** → **Pull or Deploy** → **Update from Remote**. Pronto.

**B) Repositório clonado em outra pasta** (ex.: `~/repositories/css-coffee`)
- Clique em **Deploy HEAD Commit**: o `.cpanel.yml` copia o conteúdo de `dist/` para `~/css-coffee.sprintcodes.com.br/`.

Em ambos os casos, o fluxo de atualização é: editar `src/` → `npm run build` → commit → push → **Update from Remote** (e **Deploy HEAD Commit** no caso B).

O `dist/.htaccess` (servidor Apache/cPanel) já vem pronto:
- força **HTTPS** e remove `www`;
- libera `/.well-known/` e serve o `assetlinks.json` como `application/json` (com CORS);
- tipos corretos para `.webmanifest`, `.webp`, `.woff2`;
- compressão gzip/brotli; cache de 30 dias para imagens/fontes e `no-cache` para HTML, `sw.js` e manifest (atualizações chegam na hora);
- bloqueia listagem de pastas e arquivos ocultos (`.git`, `.env`);
- cabeçalhos de segurança (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS).

> Se o servidor responder **erro 500** depois de subir o `.htaccess`, a hospedagem não permite a linha `Options -Indexes`: apague essa linha.
> Ao enviar por FTP, ative "mostrar arquivos ocultos" para subir o `.htaccess` e a pasta `.well-known`.

Checklist do servidor:
- [ ] HTTPS ativo
- [ ] `https://css-coffee.sprintcodes.com.br/.well-known/assetlinks.json` abre e responde com `Content-Type: application/json`
- [ ] `https://css-coffee.sprintcodes.com.br/manifest.webmanifest` abre
- [ ] `https://css-coffee.sprintcodes.com.br/privacy.html` abre (URL vai no Play Console)

## 2. Conferir o manifest (PWABuilder)

O `manifest.webmanifest` já está completo para ferramentas como o **PWABuilder** (pwabuilder.com) e o Bubblewrap:

- nome, descrição, `id`, `start_url`, `scope`, `display` + `display_override`, cores, idioma, categorias
- ícones 192/512 normais e *maskable* + SVG
- **screenshots**: 6 de celular (`form_factor: "narrow"`, 720×1599) e 4 de desktop (`form_factor: "wide"`, 1920×1080), com legenda — aparecem na janela de instalação do Chrome e no preview do PWABuilder
- `shortcuts` (atalho "Levels" → `?levels=1` abre o seletor de níveis)
- `launch_handler`, `prefer_related_applications: false`

Depois de publicar o site, cole a URL no PWABuilder: ele lê o manifest e mostra o preview com essas imagens. Pelo PWABuilder também dá para gerar o pacote Android (ele usa o Bubblewrap por baixo); o passo a passo abaixo vale para os dois.

## 3. Gerar o app com Bubblewrap

Você já tem o Bubblewrap configurado (pasta `~/.bubblewrap`). Em uma pasta vazia, fora do projeto:

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://css-coffee.sprintcodes.com.br/manifest.webmanifest
```

Respostas recomendadas:

| Pergunta | Valor |
|---|---|
| Application ID (package) | `br.com.sprintcodes.css_coffee.app` (definitivo — nunca mude) |
| App name / Launcher name | `CSS Coffee` |
| Display mode | `standalone` |
| Orientation | `default` (ou `portrait` se preferir só retrato) |
| Theme color / Background / Nav bar | `#4e372f` |
| Start URL | `/?source=twa` |
| Icon / Maskable icon | `app-icons/icon-512.png` / `app-icons/icon-maskable-512.png` (já no manifest) |
| Splash screen fade out | 300 |
| Fallback | `customtabs` |
| Play Billing / Location delegation | não |
| Signing key | crie uma nova e **guarde a senha e o arquivo .keystore com backup** |

Depois:

```bash
bubblewrap build
```

Gera `app-release-bundle.aab` (para enviar ao Play) e `app-release-signed.apk` (para testar no celular).

## 4. Digital Asset Links (remove a barra de endereço)

1. No Play Console, crie o app e envie o `.aab` para **Teste interno**.
2. Em **Configuração → Integridade do app → Assinatura de apps**, copie a **impressão digital SHA-256 do certificado de assinatura do app** (é a chave do Google, não a sua de upload).
3. Edite `src/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "br.com.sprintcodes.css_coffee.app",
    "sha256_cert_fingerprints": [
      "AA:BB:...:SHA256_DO_GOOGLE_PLAY",
      "CC:DD:...:SHA256_DA_SUA_CHAVE_DE_UPLOAD (opcional, para testar o APK local)"
    ]
  }
}]
```

Dica: `bubblewrap fingerprint add <SHA256>` e `bubblewrap fingerprint generateAssetLinks` geram esse arquivo.

4. `npm run build` e publique o `dist/` de novo.
5. Teste: instale o app do teste interno. **Se aparecer uma barra de endereço no topo, o assetlinks está errado** (package ou SHA-256 diferente, ou arquivo inacessível). Valide em: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://css-coffee.sprintcodes.com.br&relation=delegate_permission/common.handle_all_urls`

## 5. Ficha da loja (Play Console)

Arquivos em `store-assets/`:

| Item | Exigência do Google | Arquivo |
|---|---|---|
| Ícone do app | 512×512 PNG, até 1 MB | `play-icon-512.png` |
| Gráfico de recursos | 1024×500, JPG ou PNG 24-bit sem transparência | `pt-BR/feature-graphic.png` · `en-US/feature-graphic.png` |
| Capturas de tela do celular | 2 a 8, PNG/JPG, proporção 9:16, lado mínimo 320 px (1080 px recomendados) | `pt-BR/screenshot-1..8.png` · `en-US/screenshot-1..8.png` (1080×1920) |

Para a versão em inglês, adicione uma **tradução da ficha** (en-US) no Play Console e use a pasta `en-US`.

### Textos

**Nome (até 30):**
- pt-BR: `CSS Coffee: Aprenda Flexbox`
- en-US: `CSS Coffee: Learn Flexbox`

**Descrição curta (até 80):**
- pt-BR: `Aprenda CSS Flexbox jogando: escreva CSS e sirva o café! 24 níveis e offline.`
- en-US: `Learn CSS Flexbox by playing: write CSS to serve the coffee! 24 offline levels.`

**Descrição completa — pt-BR:**

```
☕ Aprenda CSS Flexbox de um jeito divertido!

No CSS Coffee você ajuda o garçom a servir o café escrevendo código CSS de verdade. Cada xícara precisa chegar ao pires do mesmo café — forte, médio ou fraco — e você só pode movê-las usando propriedades do Flexbox.

O QUE VOCÊ VAI APRENDER
• justify-content e align-items
• flex-direction (row, column e versões reverse)
• order e align-self em itens individuais
• flex-wrap e o atalho flex-flow
• align-content para várias linhas

POR QUE VOCÊ VAI GOSTAR
• 24 níveis, do básico ao avançado
• Veja o resultado na hora: as xícaras deslizam enquanto você digita
• Atalhos de toque para montar o código sem precisar digitar tudo
• Qualquer resposta correta vale, como em um navegador de verdade
• Progresso salvo automaticamente
• Funciona offline
• Em português e inglês
• Sem anúncios, sem cadastro e sem coleta de dados

Perfeito para quem está começando em desenvolvimento web, estudantes e professores, ou para quem quer revisar Flexbox antes de uma entrevista.

Inspirado no Flexbox Froggy. Acompanhe o canal @sprintcodes no YouTube.
```

**Full description — en-US:**

```
☕ Learn CSS Flexbox the fun way!

In CSS Coffee you help the waiter serve coffee by writing real CSS. Every cup must land on the saucer of the same coffee — strong, medium or weak — and the only way to move them is with Flexbox properties.

WHAT YOU'LL LEARN
• justify-content and align-items
• flex-direction (row, column and their reverse versions)
• order and align-self on single items
• flex-wrap and the flex-flow shorthand
• align-content for multiple lines

WHY YOU'LL LOVE IT
• 24 levels, from basic to advanced
• Instant feedback: the cups slide as you type
• Tap shortcuts to build code without typing everything
• Any correct answer works, just like in a real browser
• Progress saved automatically
• Works offline
• English and Portuguese
• No ads, no sign-up, no data collection

Great for web development beginners, students and teachers, or anyone who wants to review Flexbox before an interview.

Inspired by Flexbox Froggy. Follow @sprintcodes on YouTube.
```

### Demais formulários do Play Console

- **Categoria:** App → Educação (ou Jogo → Educativo)
- **Política de privacidade:** `https://css-coffee.sprintcodes.com.br/privacy.html` (contato: contato@sprintcodes.com.br)
- **Segurança dos dados:** "O app não coleta nem compartilha dados do usuário"
- **Anúncios:** não contém anúncios
- **Classificação de conteúdo (IARC):** responda "não" a violência, linguagem etc. → resultado Livre
- **Público-alvo:** 13+ (recomendado; incluir menores de 13 ativa as regras do programa Famílias)
- **Acesso ao app:** todo o app está disponível sem restrições

### Conta pessoal nova?

Contas pessoais criadas depois de nov/2023 precisam de **teste fechado com pelo menos 12 testadores por 14 dias** antes de liberar a produção. Comece o teste fechado assim que o assetlinks estiver funcionando.

## 6. Atualizações futuras

Mudanças no jogo (textos, níveis, estilos) **não exigem novo envio ao Play**: edite `src/`, rode `npm run build` e publique `dist/`. O service worker atualiza os jogadores automaticamente. Só gere um novo `.aab` (aumentando o `appVersionCode` em `twa-manifest.json`) se mudar nome, ícone, cores ou o domínio.
