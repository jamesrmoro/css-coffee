/*
 * CSS Coffee — lógica do jogo.
 *
 * Como funciona a validação:
 *   - A mesa tem duas camadas idênticas: "saucers" (pires) e "cups" (xícaras).
 *   - Nos pires aplicamos a solução de referência do nível.
 *   - Nas xícaras aplicamos o CSS digitado pelo jogador (só propriedades permitidas).
 *   - O nível é resolvido quando cada tipo de café ocupa exatamente as mesmas
 *     posições dos pires daquele tipo. Assim qualquer resposta equivalente vale
 *     (ex.: "flex-flow: column wrap" ou "flex-direction + flex-wrap").
 */
(function () {
  'use strict';

  var VERSION = '__VERSION__';
  var LEVELS = window.CC_LEVELS;
  var VALUES = window.CC_VALUES;
  var I18N = window.CC_I18N;
  var TOTAL = LEVELS.length;
  var STORE_KEY = 'cssCoffee.v2';
  var BOARD_W = 500, BOARD_H = 520;
  var TYPES = { s: 'strong', m: 'medium', w: 'weak' };

  var TABLE_PROPS = ['justify-content', 'align-items', 'align-content', 'flex-direction', 'flex-wrap', 'flex-flow', 'place-content'];
  var ITEM_PROPS = ['order', 'align-self'];

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    app: $('app'), instructions: $('instructions'), instrWrap: $('instrWrap'), instrToggle: $('instrToggle'), code: $('code'), codeBox: $('codeBox'),
    before: $('codeBefore'), after: $('codeAfter'), gutter: $('gutter'), chips: $('chips'),
    feedback: $('feedback'), nextBtn: $('nextBtn'), prevBtn: $('prevBtn'), nextArrow: $('nextArrow'),
    levelBtn: $('levelBtn'), levelNum: $('levelNum'), levelTotal: $('levelTotal'), progressBar: $('progressBar'),
    stage: $('stage'), boardWrap: $('boardWrap'), board: $('board'), cups: $('cups'), saucers: $('saucers'),
    legend: $('legend'), langBtn: $('langBtn'), aboutBtn: $('aboutBtn'),
    levelsDlg: $('levelsDlg'), levelGrid: $('levelGrid'), resetBtn: $('resetBtn'), resetDlg: $('resetDlg'),
    aboutDlg: $('aboutDlg'), winDlg: $('winDlg'), winText: $('winText'), winLevelsBtn: $('winLevelsBtn')
  };

  var desktopMQ = window.matchMedia('(min-width: 900px) and (min-height: 520px)');
  var coarseMQ = window.matchMedia('(pointer: coarse)');

  /* ---------------- Estado e armazenamento ---------------- */
  var state = load();
  var current = null;     // definição do nível atual
  var solvedNow = false;  // nível atual resolvido com o texto atual
  var errorTimer = 0;

  function defaultLang() {
    var langs = navigator.languages || [navigator.language || 'en'];
    return String(langs[0] || 'en').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = {};
    var level = parseInt(s.level, 10);
    return {
      level: level >= 1 && level <= TOTAL ? level : 1,
      lang: s.lang === 'pt' || s.lang === 'en' ? s.lang : defaultLang(),
      solved: Array.isArray(s.solved) ? s.solved.filter(function (n) { return n >= 1 && n <= TOTAL; }) : [],
      answers: s.answers && typeof s.answers === 'object' ? s.answers : {},
      collapsed: s.collapsed === true
    };
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* modo privado/sem espaço */ }
  }

  /* ---------------- i18n ---------------- */
  function t(key, vars) {
    var s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function applyLang() {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (n) { n.innerHTML = t(n.getAttribute('data-i18n-html'), { version: VERSION }); });
    el.langBtn.textContent = t('langShort');
    el.langBtn.setAttribute('aria-label', t('langLabel'));
    el.stage.setAttribute('aria-label', t('table'));
    applyCollapsed();
    el.legend.innerHTML = ['s', 'm', 'w'].map(function (k) {
      return '<li><i style="background:var(--' + TYPES[k] + ')"></i>' + t(TYPES[k]) + '</li>';
    }).join('');
  }

  // Instruções recolhidas (preferência salva; só tem efeito no celular)
  function applyCollapsed() {
    el.instrWrap.classList.toggle('collapsed', state.collapsed);
    el.instrToggle.textContent = t(state.collapsed ? 'showInstr' : 'hideInstr');
    el.instrToggle.setAttribute('aria-expanded', String(!state.collapsed));
  }
  function toggleCollapsed(value) {
    state.collapsed = typeof value === 'boolean' ? value : !state.collapsed;
    save();
    applyCollapsed();
  }

  /* ---------------- Montagem do nível ---------------- */
  function cssLines(obj) {
    return Object.keys(obj || {}).map(function (k) { return '  ' + k + ': ' + obj[k] + ';'; });
  }

  function renderLevel(n, opts) {
    opts = opts || {};
    state.level = n;
    current = LEVELS[n - 1];
    current.n = n;
    current.target = current.target || '.table';
    save();

    // Cabeçalho
    el.levelNum.textContent = n;
    el.levelNum.classList.toggle('solved', isSolved(n));
    el.levelTotal.textContent = TOTAL;
    el.prevBtn.disabled = n <= 1;
    el.nextArrow.disabled = n >= TOTAL;
    el.progressBar.style.width = (state.solved.length / TOTAL * 100) + '%';

    // Instruções
    el.instructions.innerHTML = current.text[state.lang] || current.text.en;

    // Código fixo antes/depois do editor
    var base = cssLines(current.base);
    var before, after;
    if (current.target === '.table') {
      before = ['.table {', '  display: flex;'].concat(base);
      after = ['}'];
    } else {
      before = ['.table {', '  display: flex;'].concat(base, ['}', '', current.target + ' {']);
      after = ['}'];
    }
    el.before.textContent = before.join('\n');
    el.after.textContent = after.join('\n');
    el.before.dataset.lines = before.length;
    el.after.dataset.lines = after.length;

    // Mesa
    buildBoard();

    // Resposta salva
    el.code.value = state.answers[n] || '';
    sizeEditor();
    update({ animate: false });
    if (!opts.keepFocus && !coarseMQ.matches && desktopMQ.matches) {
      try { el.code.focus({ preventScroll: true }); } catch (e) { el.code.focus(); }
      el.code.setSelectionRange(el.code.value.length, el.code.value.length);
    }
    if (opts.scrollTop) window.scrollTo(0, 0);
  }

  function buildBoard() {
    var cupsHtml = '', saucersHtml = '';
    current.cups.split('').forEach(function (k, i) {
      var name = t(TYPES[k]);
      var delay = ((i * 0.37) % 3).toFixed(2);
      cupsHtml += '<div class="item ' + k + ' ' + TYPES[k] + '"><div class="cup"><span class="handle"></span>' +
        '<span class="steam" style="animation-delay:-' + delay + 's"></span><span class="name">' + name + '</span></div></div>';
      saucersHtml += '<div class="item ' + k + ' ' + TYPES[k] + '"><div class="saucer"><span class="tag">' + name + '</span></div></div>';
    });
    el.cups.innerHTML = cupsHtml;
    el.saucers.innerHTML = saucersHtml;

    // Pires = base + solução
    el.saucers.style.cssText = '';
    applyDecls(el.saucers, toPairs(current.base));
    if (current.target === '.table') {
      applyDecls(el.saucers, toPairs(current.solution));
    } else {
      targetItems(el.saucers).forEach(function (it) { applyDecls(it, toPairs(current.solution)); });
    }
  }

  function toPairs(obj) { return Object.keys(obj || {}).map(function (k) { return [k, obj[k]]; }); }
  function applyDecls(node, pairs) { pairs.forEach(function (d) { node.style.setProperty(d[0], d[1]); }); }
  function targetItems(layer) {
    var cls = current.target.replace('.', '');
    return Array.prototype.slice.call(layer.querySelectorAll('.item.' + cls));
  }

  /* ---------------- Editor ---------------- */
  function sizeEditor() {
    var lines = el.code.value.split('\n').length;
    var rows = Math.max(lines, Object.keys(current.solution).length);
    el.code.style.height = (rows * 24) + 'px';
    // linhas longas quebram em telas estreitas: ajusta à altura real do conteúdo
    if (el.code.scrollHeight > el.code.clientHeight + 2) el.code.style.height = el.code.scrollHeight + 'px';
    var bodyLines = Math.round((el.before.offsetHeight + el.code.offsetHeight + el.after.offsetHeight) / 24);
    var g = '';
    for (var i = 1; i <= Math.max(bodyLines, 8); i++) g += '<span>' + i + '</span>';
    el.gutter.innerHTML = g;
  }

  // Lê o texto digitado e devolve declarações válidas + erros
  function parse(text) {
    var allowed = current.target === '.table' ? TABLE_PROPS : ITEM_PROPS;
    var decls = [], errors = [];
    text.split('\n').forEach(function (line, i) {
      line.split(';').forEach(function (seg) {
        var s = seg.replace(/\/\*.*?\*\//g, '').trim();
        if (!s) return;
        var idx = s.indexOf(':');
        if (idx === -1) {
          // ainda digitando a propriedade? só reclama se já parece completa
          var maybe = s.toLowerCase();
          var partial = TABLE_PROPS.concat(ITEM_PROPS).some(function (p) { return p.indexOf(maybe) === 0; });
          if (!partial) errors.push(t('missingColon', { n: i + 1, ex: '<code>justify-content: center;</code>' }));
          return;
        }
        var prop = s.slice(0, idx).trim().toLowerCase();
        var value = s.slice(idx + 1).replace(/!important/i, '').trim().toLowerCase();
        if (!prop) return;
        if (prop === 'display' && value === 'flex') return; // já está aplicado
        if (allowed.indexOf(prop) === -1) {
          errors.push(t('wrongProp', { n: i + 1, p: '<code>' + esc(prop) + '</code>' }));
          return;
        }
        if (!value) return;
        if (!supports(prop, value)) {
          errors.push(t('badValue', { n: i + 1, p: '<code>' + esc(prop) + '</code>', v: esc(value) }));
          return;
        }
        decls.push([prop, value]);
      });
    });
    return { decls: decls, errors: errors };
  }
  function supports(prop, value) {
    try { return window.CSS && CSS.supports ? CSS.supports(prop, value) : true; } catch (e) { return false; }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  /* ---------------- Aplicar CSS e validar ---------------- */
  function update(opts) {
    opts = opts || {};
    var text = el.code.value;
    state.answers[current.n] = text;
    save();

    var res = parse(text);
    var items = Array.prototype.slice.call(el.cups.children);
    var before = opts.animate === false ? null : items.map(function (it) { return [it.offsetLeft, it.offsetTop]; });

    // Reaplica tudo do zero
    el.cups.style.cssText = '';
    items.forEach(function (it) { it.style.cssText = ''; });
    applyDecls(el.cups, toPairs(current.base));
    if (current.target === '.table') applyDecls(el.cups, res.decls);
    else targetItems(el.cups).forEach(function (it) { applyDecls(it, res.decls); });

    // Animação FLIP: a xícara "desliza" até a nova posição
    if (before) {
      items.forEach(function (it, i) {
        var dx = before[i][0] - it.offsetLeft, dy = before[i][1] - it.offsetTop;
        if (dx || dy) {
          it.style.transition = 'none';
          it.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        }
      });
      void el.cups.offsetWidth; // força reflow
      items.forEach(function (it) {
        if (it.style.transform) { it.style.transition = ''; it.style.transform = ''; }
      });
    }

    var ok = res.decls.length > 0 && isMatch();
    setSolved(ok);

    clearTimeout(errorTimer);
    if (ok) {
      showFeedback(desktopMQ.matches && !coarseMQ.matches ? t('solvedDesktop') : t('solved'), true);
    } else {
      showFeedback('', false);
      if (res.errors.length) {
        errorTimer = setTimeout(function () { showFeedback(res.errors[0], false); }, opts.animate === false ? 0 : 900);
      }
    }
    renderChips();
  }

  // Compara posições das xícaras com as dos pires (por tipo de café)
  function isMatch() {
    var cupItems = el.cups.children, sItems = el.saucers.children;
    var groups = {};
    function add(list, key) {
      for (var i = 0; i < list.length; i++) {
        var it = list[i], k = it.classList[1];
        groups[k] = groups[k] || { c: [], s: [] };
        groups[k][key].push([it.offsetLeft + it.offsetWidth / 2, it.offsetTop + it.offsetHeight / 2, it.offsetWidth, it.offsetHeight]);
      }
    }
    add(cupItems, 'c'); add(sItems, 's');
    var sort = function (a, b) { return a[0] - b[0] || a[1] - b[1]; };
    return Object.keys(groups).every(function (k) {
      var c = groups[k].c.sort(sort), s = groups[k].s.sort(sort);
      if (c.length !== s.length) return false;
      return c.every(function (p, i) {
        var q = s[i];
        return Math.abs(p[0] - q[0]) < 2 && Math.abs(p[1] - q[1]) < 2 && Math.abs(p[2] - q[2]) < 2 && Math.abs(p[3] - q[3]) < 2;
      });
    });
  }

  function isSolved(n) { return state.solved.indexOf(n) !== -1; }

  function setSolved(ok) {
    var wasSolved = solvedNow;
    solvedNow = ok;
    el.nextBtn.disabled = !ok;
    el.nextBtn.classList.toggle('ready', ok);
    el.board.classList.toggle('solved', ok);
    if (ok && !isSolved(current.n)) {
      state.solved.push(current.n);
      save();
      el.progressBar.style.width = (state.solved.length / TOTAL * 100) + '%';
      el.levelNum.classList.add('solved');
    }
    if (ok && !wasSolved && navigator.vibrate && coarseMQ.matches) {
      try { navigator.vibrate(30); } catch (e) { /* ignorado */ }
    }
  }

  function showFeedback(html, good) {
    el.feedback.innerHTML = html;
    el.feedback.classList.toggle('ok', !!good);
  }

  /* ---------------- Atalhos (chips) ---------------- */
  function activeLineIndex() {
    var v = el.code.value, pos = el.code.selectionStart;
    if (pos == null) pos = v.length;
    return v.slice(0, pos).split('\n').length - 1;
  }
  function lineProp(line) {
    var m = /^\s*([a-z-]+)\s*:/i.exec(line || '');
    return m ? m[1].toLowerCase() : null;
  }
  function renderChips() {
    var props = current.props || [];
    var lines = el.code.value.split('\n');
    var active = lineProp(lines[activeLineIndex()]);
    if (!active || props.indexOf(active) === -1) {
      // usa a última linha com propriedade conhecida
      for (var i = lines.length - 1; i >= 0; i--) {
        var lp = lineProp(lines[i]);
        if (lp && props.indexOf(lp) !== -1) { active = lp; break; }
      }
    }
    var html = props.map(function (p) {
      return '<button type="button" class="chip prop" data-prop="' + p + '">' + p + '</button>';
    }).join('');
    if (active && VALUES[active] && props.indexOf(active) !== -1) {
      html += '<span class="sep"></span>' + VALUES[active].map(function (v) {
        return '<button type="button" class="chip" data-prop="' + active + '" data-value="' + v + '">' + v + '</button>';
      }).join('');
    }
    if (el.code.value.trim()) html += '<button type="button" class="chip ghost" data-clear="1">⌫ ' + t('clear') + '</button>';
    el.chips.innerHTML = html;
  }

  function setCode(lines, caretLine) {
    var value = lines.join('\n');
    el.code.value = value;
    var pos = 0;
    for (var i = 0; i <= caretLine && i < lines.length; i++) pos += lines[i].length + (i < caretLine ? 1 : 0);
    sizeEditor();
    if (!coarseMQ.matches) el.code.focus({ preventScroll: true });
    try { el.code.setSelectionRange(pos, pos); } catch (e) { /* ignorado */ }
    update();
  }

  function onChip(e) {
    var b = e.target.closest('button.chip');
    if (!b) return;
    var lines = el.code.value.split('\n');
    if (b.dataset.clear) { setCode([''], 0); return; }
    var prop = b.dataset.prop, value = b.dataset.value;
    // linha que já tem essa propriedade?
    var idx = -1;
    for (var i = 0; i < lines.length; i++) if (lineProp(lines[i]) === prop) { idx = i; break; }
    if (value == null) {
      if (idx === -1) {
        var a = activeLineIndex();
        if (lines[a] != null && !lines[a].trim()) idx = a;
        else { lines = lines.filter(function (l, j) { return l.trim() || j < lines.length - 1; }); lines.push(''); idx = lines.length - 1; }
        lines[idx] = prop + ': ';
      }
    } else {
      if (idx === -1) {
        var b2 = activeLineIndex();
        idx = lines[b2] != null && !lines[b2].trim() ? b2 : lines.length;
      }
      lines[idx] = prop + ': ' + value + ';';
    }
    setCode(lines, idx);
  }

  /* ---------------- Escala da mesa ---------------- */
  function fitBoard() {
    var w = el.boardWrap.clientWidth;
    var s;
    if (desktopMQ.matches) {
      var h = el.boardWrap.clientHeight;
      s = Math.min(w / BOARD_W, h / BOARD_H, 1.35);
    } else {
      s = Math.min(w / BOARD_W, 1.3);
    }
    s = Math.max(0.4, Math.floor(s * 1000) / 1000);
    document.documentElement.style.setProperty('--scale', s);
    updateSticky(s);
    if (current) sizeEditor();
  }

  // No celular, a mesa fica fixa no topo enquanto o jogador rola as instruções,
  // desde que sobre espaço suficiente para ler e digitar (e o teclado não esteja aberto).
  var editing = false;
  function updateSticky(s) {
    if (s == null) s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 1;
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var free = vh - (BOARD_H * s + 20);
    el.stage.classList.toggle('sticky', !desktopMQ.matches && !editing && free >= 330);
  }
  el.code.addEventListener('focus', function () { editing = true; updateSticky(); });
  el.code.addEventListener('blur', function () { editing = false; updateSticky(); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { updateSticky(); });

  /* ---------------- Diálogos (com suporte ao botão "voltar" do Android) ---------------- */
  var openDialogs = [];
  function openDialog(d) {
    if (d.open) return;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    openDialogs.push(d);
    try { history.pushState({ ccDialog: d.id }, ''); } catch (e) { /* ignorado */ }
  }
  function onDialogClose(e) {
    var d = e.target;
    var i = openDialogs.indexOf(d);
    if (i !== -1) {
      openDialogs.splice(i, 1);
      if (history.state && history.state.ccDialog === d.id) {
        ignorePop = true;
        history.back();
      }
    }
  }
  var ignorePop = false;
  window.addEventListener('popstate', function () {
    if (ignorePop) { ignorePop = false; return; }
    var d = openDialogs.pop();
    if (d && d.open) { d.close(); }
  });
  [el.levelsDlg, el.resetDlg, el.aboutDlg, el.winDlg].forEach(function (d) {
    d.addEventListener('close', onDialogClose);
    // fechar tocando fora da caixa
    d.addEventListener('click', function (e) { if (e.target === d) d.close('backdrop'); });
  });

  function openLevels() {
    var html = '';
    for (var i = 1; i <= TOTAL; i++) {
      var cls = (i === current.n ? 'current ' : '') + (isSolved(i) ? 'solved' : '');
      html += '<button type="button" class="' + cls + '" data-level="' + i + '" aria-label="' + t('level') + ' ' + i + (isSolved(i) ? ' ✓' : '') + '">' + i + '</button>';
    }
    el.levelGrid.innerHTML = html;
    openDialog(el.levelsDlg);
  }

  function openWin() {
    var s = state.solved.length;
    el.winText.textContent = t(s >= TOTAL ? 'winText' : 'winTextPartial', { s: s, t: TOTAL });
    $('winTitle').textContent = t(s >= TOTAL ? 'winTitle' : 'winTitlePartial');
    openDialog(el.winDlg);
  }

  function go(n) {
    if (n < 1 || n > TOTAL) return;
    showFeedback('', false);
    renderLevel(n, { scrollTop: !desktopMQ.matches });
  }
  function next() {
    if (current.n < TOTAL) go(current.n + 1);
    else openWin();
  }

  /* ---------------- Eventos ---------------- */
  el.code.addEventListener('input', function () { sizeEditor(); update(); });
  el.code.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && solvedNow && !e.isComposing) {
      e.preventDefault();
      next();
    } else if (e.key === 'Tab' && !e.shiftKey && el.code.value.slice(el.code.selectionStart).indexOf('\n') !== -1) {
      // Tab pula para a próxima linha em vez de sair do editor
      e.preventDefault();
      var nl = el.code.value.indexOf('\n', el.code.selectionStart);
      el.code.setSelectionRange(nl + 1, nl + 1);
    }
  });
  ['keyup', 'click', 'select'].forEach(function (ev) { el.code.addEventListener(ev, renderChips); });
  el.chips.addEventListener('click', onChip);
  el.instrToggle.addEventListener('click', function () { toggleCollapsed(); });
  el.instructions.addEventListener('click', function (e) {
    if (state.collapsed && !desktopMQ.matches && !e.target.closest('a')) toggleCollapsed(false);
  });
  el.nextBtn.addEventListener('click', function () { if (solvedNow) next(); });
  el.prevBtn.addEventListener('click', function () { go(current.n - 1); });
  el.nextArrow.addEventListener('click', function () { go(current.n + 1); });
  el.levelBtn.addEventListener('click', openLevels);
  el.levelGrid.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-level]');
    if (!b) return;
    el.levelsDlg.close();
    go(+b.dataset.level);
  });
  el.resetBtn.addEventListener('click', function () { openDialog(el.resetDlg); });
  el.resetDlg.addEventListener('close', function () {
    if (el.resetDlg.returnValue === 'confirm') {
      state.solved = []; state.answers = {};
      save();
      if (el.levelsDlg.open) el.levelsDlg.close();
      go(1);
    }
    el.resetDlg.returnValue = '';
  });
  el.aboutBtn.addEventListener('click', function () { openDialog(el.aboutDlg); });
  el.winLevelsBtn.addEventListener('click', function () { el.winDlg.close(); setTimeout(openLevels, 50); });
  el.langBtn.addEventListener('click', function () {
    state.lang = state.lang === 'pt' ? 'en' : 'pt';
    save();
    applyLang();
    renderLevel(current.n, { keepFocus: true });
  });

  // Atalhos de teclado globais (desktop)
  document.addEventListener('keydown', function (e) {
    if (openDialogs.length || e.target === el.code) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight' && !el.nextArrow.disabled) go(current.n + 1);
    else if (e.key === 'ArrowLeft' && !el.prevBtn.disabled) go(current.n - 1);
  });

  if (window.ResizeObserver) new ResizeObserver(fitBoard).observe(el.boardWrap);
  window.addEventListener('resize', fitBoard);
  var mqHandler = function () { fitBoard(); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', mqHandler); else if (desktopMQ.addListener) desktopMQ.addListener(mqHandler);

  /* ---------------- Início ---------------- */
  applyLang();
  fitBoard();
  renderLevel(state.level);
  document.documentElement.classList.add('ready');
  if (/[?&]levels=1/.test(location.search)) setTimeout(openLevels, 0);

  // Service worker (offline / TWA)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sem SW: o jogo funciona igual online */ });
    });
  }

  // Exposto só para testes automatizados
  window.__cssCoffee = { go: go, isMatch: function () { return isMatch(); }, levels: LEVELS, state: state };
})();
