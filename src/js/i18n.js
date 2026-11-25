/* CSS Coffee — textos da interface (inglês e português). */
(function () {
  'use strict';
  window.CC_I18N = {
    en: {
      level: 'Level', of: 'of', levels: 'Levels', prev: 'Previous level', nextLevel: 'Next level',
      next: 'Next', close: 'Close', cancel: 'Cancel', about: 'About',
      reset: 'Reset progress', resetTitle: 'Reset progress?', resetText: 'All solved levels and answers will be erased.', resetConfirm: 'Reset',
      editorLabel: 'Type your CSS here',
      strong: 'Strong', medium: 'Medium', weak: 'Weak',
      table: 'Coffee table: move the cups onto the saucers with the same coffee',
      langLabel: 'Mudar idioma para português', langShort: 'PT',
      clear: 'Clear', showInstr: 'Show instructions', hideInstr: 'Hide instructions',
      solved: 'Perfect, coffee served! ☕ Tap “Next”.',
      solvedDesktop: 'Perfect, coffee served! ☕ Press Enter or click “Next”.',
      wrongProp: 'Line {n}: {p} is not used in this level.',
      badValue: 'Line {n}: “{v}” is not a valid value for {p}.',
      missingColon: 'Line {n}: separate property and value with a colon, like {ex}.',
      levelSolvedBefore: 'You already solved this level.',
      winTitle: 'You served every coffee!', winTitlePartial: 'Last level served!',
      winText: 'You solved {s} of {t} levels and now know the essentials of CSS Flexbox. ☕',
      winTextPartial: 'You reached the end! You solved {s} of {t} levels — open “Levels” to finish the rest.',
      keepPlaying: 'Keep playing',
      aboutTitle: 'About CSS Coffee',
      aboutHtml:
        '<p>CSS Coffee is a free game to learn <strong>CSS Flexbox</strong>: write CSS to help the waiter serve each cup on the saucer with the same coffee.</p>' +
        '<p>Inspired by Flexbox Froggy. Built with plain HTML, CSS and JavaScript — it works offline and your progress is saved only on this device.</p>' +
        '<p>Want to learn how this game was made? Follow me on YouTube:</p>' +
        '<p><a class="yt" href="https://www.youtube.com/@sprintcodes" target="_blank" rel="noopener">YouTube @sprintcodes</a></p>' +
        '<p><small><a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a> · v{version}</small></p>'
    },
    pt: {
      level: 'Nível', of: 'de', levels: 'Níveis', prev: 'Nível anterior', nextLevel: 'Próximo nível',
      next: 'Próximo', close: 'Fechar', cancel: 'Cancelar', about: 'Sobre',
      reset: 'Zerar progresso', resetTitle: 'Zerar progresso?', resetText: 'Todos os níveis resolvidos e respostas serão apagados.', resetConfirm: 'Zerar',
      editorLabel: 'Digite seu CSS aqui',
      strong: 'Forte', medium: 'Médio', weak: 'Fraco',
      table: 'Mesa de café: leve as xícaras até os pires do mesmo café',
      langLabel: 'Switch language to English', langShort: 'EN',
      clear: 'Limpar', showInstr: 'Mostrar instruções', hideInstr: 'Ocultar instruções',
      solved: 'Perfeito, café servido! ☕ Toque em “Próximo”.',
      solvedDesktop: 'Perfeito, café servido! ☕ Aperte Enter ou clique em “Próximo”.',
      wrongProp: 'Linha {n}: {p} não é usada neste nível.',
      badValue: 'Linha {n}: “{v}” não é um valor válido para {p}.',
      missingColon: 'Linha {n}: separe propriedade e valor com dois-pontos, como {ex}.',
      levelSolvedBefore: 'Você já resolveu este nível.',
      winTitle: 'Você serviu todos os cafés!', winTitlePartial: 'Último nível servido!',
      winText: 'Você resolveu {s} de {t} níveis e já domina o essencial de CSS Flexbox. ☕',
      winTextPartial: 'Você chegou ao fim! Resolveu {s} de {t} níveis — abra “Níveis” para terminar os outros.',
      keepPlaying: 'Continuar jogando',
      aboutTitle: 'Sobre o CSS Coffee',
      aboutHtml:
        '<p>CSS Coffee é um jogo gratuito para aprender <strong>CSS Flexbox</strong>: escreva CSS para ajudar o garçom a servir cada xícara no pires do mesmo café.</p>' +
        '<p>Inspirado no Flexbox Froggy. Feito com HTML, CSS e JavaScript puros — funciona offline e seu progresso fica salvo só neste aparelho.</p>' +
        '<p>Quer aprender como este jogo foi feito? Siga no YouTube:</p>' +
        '<p><a class="yt" href="https://www.youtube.com/@sprintcodes" target="_blank" rel="noopener">YouTube @sprintcodes</a></p>' +
        '<p><small><a href="privacy.html" target="_blank" rel="noopener">Política de privacidade</a> · v{version}</small></p>'
    }
  };
})();
