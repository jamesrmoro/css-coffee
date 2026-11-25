/*
 * CSS Coffee — definição dos níveis.
 *
 * Cada nível descreve:
 *   cups     → string com o tipo de cada xícara, na ordem do HTML:
 *              s = forte (strong), m = médio (medium), w = fraco (weak)
 *   base     → CSS já aplicado à mesa (aparece no editor como código fixo)
 *   target   → seletor que o jogador edita (".table" ou ".medium"/".weak")
 *   solution → resposta de referência. Ela é aplicada aos PIRES; o jogo
 *              compara a posição real de cada xícara com a de cada pires, então
 *              qualquer resposta equivalente também é aceita.
 *   props    → propriedades sugeridas nos atalhos (chips) do editor.
 *   text     → instruções em inglês (en) e português (pt).
 */
(function () {
  'use strict';

  var c = function (s) { return '<code>' + s + '</code>'; };

  // Listas de valores reaproveitadas em vários níveis
  var V = {
    jc: {
      en: [['flex-start', 'Items align to the left side of the container.'],
           ['flex-end', 'Items align to the right side of the container.'],
           ['center', 'Items align at the center of the container.'],
           ['space-between', 'Items display with equal spacing between them.'],
           ['space-around', 'Items display with equal spacing around them.']],
      pt: [['flex-start', 'Os itens se alinham à esquerda do contêiner.'],
           ['flex-end', 'Os itens se alinham à direita do contêiner.'],
           ['center', 'Os itens se alinham ao centro do contêiner.'],
           ['space-between', 'Os itens ficam com espaços iguais entre eles.'],
           ['space-around', 'Os itens ficam com espaços iguais ao redor deles.']]
    },
    ai: {
      en: [['flex-start', 'Items align to the top of the container.'],
           ['flex-end', 'Items align to the bottom of the container.'],
           ['center', 'Items align at the vertical center of the container.'],
           ['baseline', 'Items display at the baseline of the container.'],
           ['stretch', 'Items are stretched to fit the container.']],
      pt: [['flex-start', 'Os itens se alinham ao topo do contêiner.'],
           ['flex-end', 'Os itens se alinham à base do contêiner.'],
           ['center', 'Os itens se alinham ao centro vertical do contêiner.'],
           ['baseline', 'Os itens se alinham pela linha de base do contêiner.'],
           ['stretch', 'Os itens se esticam para preencher o contêiner.']]
    },
    fd: {
      en: [['row', 'Items are placed the same as the text direction.'],
           ['row-reverse', 'Items are placed opposite to the text direction.'],
           ['column', 'Items are placed top to bottom.'],
           ['column-reverse', 'Items are placed bottom to top.']],
      pt: [['row', 'Os itens seguem a mesma direção do texto.'],
           ['row-reverse', 'Os itens seguem a direção oposta à do texto.'],
           ['column', 'Os itens são posicionados de cima para baixo.'],
           ['column-reverse', 'Os itens são posicionados de baixo para cima.']]
    },
    fw: {
      en: [['nowrap', 'Every item is squeezed onto a single line.'],
           ['wrap', 'Items wrap onto additional lines.'],
           ['wrap-reverse', 'Items wrap onto additional lines in reverse.']],
      pt: [['nowrap', 'Todos os itens são espremidos em uma única linha.'],
           ['wrap', 'Os itens quebram para linhas adicionais.'],
           ['wrap-reverse', 'Os itens quebram para linhas adicionais, em ordem inversa.']]
    },
    ac: {
      en: [['flex-start', 'Lines are packed at the top of the container.'],
           ['flex-end', 'Lines are packed at the bottom of the container.'],
           ['center', 'Lines are packed at the vertical center of the container.'],
           ['space-between', 'Lines display with equal spacing between them.'],
           ['space-around', 'Lines display with equal spacing around them.'],
           ['stretch', 'Lines are stretched to fit the container.']],
      pt: [['flex-start', 'As linhas se agrupam no topo do contêiner.'],
           ['flex-end', 'As linhas se agrupam na base do contêiner.'],
           ['center', 'As linhas se agrupam no centro vertical do contêiner.'],
           ['space-between', 'As linhas ficam com espaços iguais entre elas.'],
           ['space-around', 'As linhas ficam com espaços iguais ao redor delas.'],
           ['stretch', 'As linhas se esticam para preencher o contêiner.']]
    }
  };

  function list(key, lang) {
    return '<ul>' + V[key][lang].map(function (v) {
      return '<li>' + c(v[0]) + ': ' + v[1] + '</li>';
    }).join('') + '</ul>';
  }
  function p(s) { return '<p>' + s + '</p>'; }

  var LEVELS = [
    { // 1
      cups: 's', solution: { 'justify-content': 'flex-end' }, props: ['justify-content'],
      text: {
        en: p('Welcome to <strong>CSS Coffee</strong>, a game where you help the waiter serve coffee by writing CSS! Guide the cup to its saucer using the ' + c('justify-content') + ' property, which aligns items horizontally and accepts the following values:') + list('jc', 'en') + p('For example, ' + c('justify-content: flex-end;') + ' will move the cup to the right.'),
        pt: p('Bem-vindo ao <strong>CSS Coffee</strong>, o jogo em que você ajuda o garçom a servir o café escrevendo CSS! Leve a xícara até o pires usando a propriedade ' + c('justify-content') + ', que alinha os itens na horizontal e aceita os valores:') + list('jc', 'pt') + p('Por exemplo, ' + c('justify-content: flex-end;') + ' move a xícara para a direita.')
      }
    },
    { // 2
      cups: 'ss', solution: { 'justify-content': 'center' }, props: ['justify-content'],
      text: {
        en: p('Use ' + c('justify-content') + ' again to move the cups onto their saucers. Remember, this property aligns items horizontally:') + list('jc', 'en'),
        pt: p('Use ' + c('justify-content') + ' de novo para levar as xícaras até os pires. Lembre-se: essa propriedade alinha os itens na horizontal:') + list('jc', 'pt')
      }
    },
    { // 3
      cups: 'sss', solution: { 'justify-content': 'space-around' }, props: ['justify-content'],
      text: {
        en: p('Help the waiter serve the three cups with ' + c('justify-content') + '. This time the saucers have plenty of space <em>around</em> them.') + p('Tip: tap a property chip below the editor to insert it, then tap a value.'),
        pt: p('Ajude o garçom a servir as três xícaras com ' + c('justify-content') + '. Desta vez os pires têm bastante espaço <em>ao redor</em> deles.') + p('Dica: toque em uma propriedade abaixo do editor para inseri-la e depois toque em um valor.')
      }
    },
    { // 4
      cups: 'sss', solution: { 'justify-content': 'space-between' }, props: ['justify-content'],
      text: {
        en: p('Now the saucers at the edges moved to the corners of the table. Use ' + c('justify-content') + ' — this time the saucers have equal space <em>between</em> them.'),
        pt: p('Agora os pires das pontas foram para os cantos da mesa. Use ' + c('justify-content') + ' — desta vez os pires têm o mesmo espaço <em>entre</em> eles.')
      }
    },
    { // 5
      cups: 'sss', solution: { 'align-items': 'flex-end' }, props: ['align-items'],
      text: {
        en: p('Now use ' + c('align-items') + ' to move the cups to the bottom of the table. This property aligns items vertically and accepts the following values:') + list('ai', 'en'),
        pt: p('Agora use ' + c('align-items') + ' para levar as xícaras até a parte de baixo da mesa. Essa propriedade alinha os itens na vertical e aceita os valores:') + list('ai', 'pt')
      }
    },
    { // 6
      cups: 's', solution: { 'justify-content': 'center', 'align-items': 'center' }, props: ['justify-content', 'align-items'],
      text: {
        en: p('Move the cup to the very center of the table using ' + c('justify-content') + ' and ' + c('align-items') + ' together.'),
        pt: p('Leve a xícara para o centro exato da mesa usando ' + c('justify-content') + ' e ' + c('align-items') + ' juntos.')
      }
    },
    { // 7
      cups: 'sss', solution: { 'justify-content': 'space-around', 'align-items': 'flex-end' }, props: ['justify-content', 'align-items'],
      text: {
        en: p('The cups need to be served again. This time the saucers have plenty of space around them and are at the bottom. Combine ' + c('justify-content') + ' and ' + c('align-items') + '.'),
        pt: p('As xícaras precisam ser servidas de novo. Agora os pires têm bastante espaço ao redor e estão embaixo. Combine ' + c('justify-content') + ' e ' + c('align-items') + '.')
      }
    },
    { // 8
      cups: 'wms', solution: { 'flex-direction': 'row-reverse' }, props: ['flex-direction'],
      text: {
        en: p('Each cup must land on the saucer of the same coffee. Use ' + c('flex-direction') + ', which defines the direction items are placed in the container:') + list('fd', 'en'),
        pt: p('Cada xícara precisa ir para o pires do mesmo café. Use ' + c('flex-direction') + ', que define a direção em que os itens são posicionados no contêiner:') + list('fd', 'pt')
      }
    },
    { // 9
      cups: 'smw', solution: { 'flex-direction': 'column' }, props: ['flex-direction'],
      text: {
        en: p('Place the cups on their saucers using ' + c('flex-direction') + ':') + list('fd', 'en'),
        pt: p('Coloque as xícaras nos pires usando ' + c('flex-direction') + ':') + list('fd', 'pt')
      }
    },
    { // 10
      cups: 'smw', solution: { 'flex-direction': 'row-reverse', 'justify-content': 'flex-end' }, props: ['flex-direction', 'justify-content'],
      text: {
        en: p('The saucers look close, but you will need both ' + c('flex-direction') + ' and ' + c('justify-content') + ' to get every cup to the right place.') + p('Notice that when the direction is reversed, <em>start</em> and <em>end</em> are reversed too.'),
        pt: p('Os pires parecem perto, mas você vai precisar de ' + c('flex-direction') + ' e ' + c('justify-content') + ' para levar cada xícara ao lugar certo.') + p('Repare: quando a direção é invertida, o <em>início</em> e o <em>fim</em> também se invertem.')
      }
    },
    { // 11
      cups: 'smw', solution: { 'flex-direction': 'column', 'justify-content': 'flex-end' }, props: ['flex-direction', 'justify-content', 'align-items'],
      text: {
        en: p('Help place the cups using ' + c('flex-direction') + ' and ' + c('justify-content') + '.') + p('Notice that when the direction is a column, ' + c('justify-content') + ' becomes vertical and ' + c('align-items') + ' becomes horizontal.'),
        pt: p('Ajude a posicionar as xícaras usando ' + c('flex-direction') + ' e ' + c('justify-content') + '.') + p('Repare: quando a direção é coluna, ' + c('justify-content') + ' passa a agir na vertical e ' + c('align-items') + ' na horizontal.')
      }
    },
    { // 12
      cups: 'smw', solution: { 'flex-direction': 'column-reverse', 'justify-content': 'space-between' }, props: ['flex-direction', 'justify-content'],
      text: {
        en: p('Serve the cups onto their saucers using ' + c('flex-direction') + ' and ' + c('justify-content') + '.'),
        pt: p('Sirva as xícaras nos pires usando ' + c('flex-direction') + ' e ' + c('justify-content') + '.')
      }
    },
    { // 13
      cups: 'smw', solution: { 'flex-direction': 'row-reverse', 'justify-content': 'center', 'align-items': 'flex-end' }, props: ['flex-direction', 'justify-content', 'align-items'],
      text: {
        en: p('Serve the coffee before it gets cold! Use ' + c('flex-direction') + ', ' + c('justify-content') + ' and ' + c('align-items') + '.'),
        pt: p('Sirva o café antes que esfrie! Use ' + c('flex-direction') + ', ' + c('justify-content') + ' e ' + c('align-items') + '.')
      }
    },
    { // 14
      cups: 'smw', target: '.medium', solution: { 'order': '1' }, props: ['order'],
      text: {
        en: p('Sometimes reversing the whole container is not enough. Then you can use the ' + c('order') + ' property on individual items. By default every item has an order of 0, but you can set it to any positive or negative whole number.') + p('Use ' + c('order') + ' on the medium coffee to match the saucers.'),
        pt: p('Às vezes inverter o contêiner inteiro não basta. Nesses casos, use a propriedade ' + c('order') + ' em itens individuais. Por padrão, todo item tem ordem 0, mas você pode usar qualquer número inteiro, positivo ou negativo.') + p('Use ' + c('order') + ' no café médio para combinar com os pires.')
      }
    },
    { // 15
      cups: 'sssws', base: { 'justify-content': 'space-between' }, target: '.weak', solution: { 'order': '-1' }, props: ['order'],
      text: {
        en: p('Use ' + c('order') + ' to send the weak coffee to its saucer.'),
        pt: p('Use ' + c('order') + ' para mandar o café fraco para o pires dele.')
      }
    },
    { // 16
      cups: 'ssmss', base: { 'align-items': 'flex-start', 'justify-content': 'space-between' }, target: '.medium', solution: { 'align-self': 'flex-end' }, props: ['align-self'],
      text: {
        en: p('Another property you can apply to individual items is ' + c('align-self') + '. It accepts the same values as ' + c('align-items') + ', but only affects the selected item.'),
        pt: p('Outra propriedade que você pode aplicar a itens individuais é ' + c('align-self') + '. Ela aceita os mesmos valores de ' + c('align-items') + ', mas afeta só o item selecionado.')
      }
    },
    { // 17
      cups: 'msmss', base: { 'align-items': 'flex-start', 'justify-content': 'space-between' }, target: '.medium', solution: { 'align-self': 'flex-end', 'order': '1' }, props: ['align-self', 'order'],
      text: {
        en: p('Combine ' + c('order') + ' and ' + c('align-self') + ' to move the medium coffees onto their saucers.'),
        pt: p('Combine ' + c('order') + ' e ' + c('align-self') + ' para levar os cafés médios até os pires.')
      }
    },
    { // 18
      cups: 'msssssw', solution: { 'flex-wrap': 'wrap' }, props: ['flex-wrap'],
      text: {
        en: p('Oh no! The cups are all squeezed onto a single line. Spread them out with ' + c('flex-wrap') + ', which accepts the following values:') + list('fw', 'en'),
        pt: p('Ah, não! As xícaras estão todas espremidas em uma única linha. Espalhe-as com ' + c('flex-wrap') + ', que aceita os valores:') + list('fw', 'pt')
      }
    },
    { // 19
      cups: 'ssssswwwwwmmmmm', solution: { 'flex-direction': 'column', 'flex-wrap': 'wrap' }, props: ['flex-direction', 'flex-wrap'],
      text: {
        en: p('Help the waiter organize the cups into three columns, one for each coffee, using a combination of ' + c('flex-direction') + ' and ' + c('flex-wrap') + '.'),
        pt: p('Ajude o garçom a organizar as xícaras em três colunas, uma para cada café, combinando ' + c('flex-direction') + ' e ' + c('flex-wrap') + '.')
      }
    },
    { // 20
      cups: 'ssssswwwwwmmmmm', solution: { 'flex-flow': 'column wrap' }, props: ['flex-flow'],
      text: {
        en: p(c('flex-direction') + ' and ' + c('flex-wrap') + ' are used together so often that the shorthand ' + c('flex-flow') + ' was created. It accepts the value of both properties separated by a space.') + p('For example, ' + c('flex-flow: row wrap') + ' sets rows and wraps them. Use ' + c('flex-flow') + ' to repeat the previous level.'),
        pt: p(c('flex-direction') + ' e ' + c('flex-wrap') + ' são usadas juntas com tanta frequência que foi criado o atalho ' + c('flex-flow') + '. Ele aceita os valores das duas propriedades separados por um espaço.') + p('Por exemplo, ' + c('flex-flow: row wrap') + ' define linhas e permite a quebra. Use ' + c('flex-flow') + ' para repetir o nível anterior.')
      }
    },
    { // 21
      cups: 'sssssssssssssss', base: { 'flex-wrap': 'wrap', 'justify-content': 'space-between' }, solution: { 'align-content': 'flex-start' }, props: ['align-content'],
      text: {
        en: p('The cups are spread across the table, but the saucers are grouped at the top. Use ' + c('align-content') + ' to set how multiple lines are spaced from each other:') + list('ac', 'en') + p('It can be confusing: ' + c('align-content') + ' sets the spacing <em>between lines</em>, while ' + c('align-items') + ' sets how items are aligned <em>within</em> each line. With a single line, ' + c('align-content') + ' has no effect.'),
        pt: p('As xícaras estão espalhadas pela mesa, mas os pires estão agrupados no topo. Use ' + c('align-content') + ' para definir o espaçamento entre várias linhas:') + list('ac', 'pt') + p('Pode confundir: ' + c('align-content') + ' define o espaço <em>entre as linhas</em>, enquanto ' + c('align-items') + ' define o alinhamento dos itens <em>dentro</em> de cada linha. Com uma linha só, ' + c('align-content') + ' não tem efeito.')
      }
    },
    { // 22
      cups: 'sssssssssssssss', base: { 'flex-wrap': 'wrap', 'justify-content': 'space-between' }, solution: { 'align-content': 'flex-end' }, props: ['align-content'],
      text: {
        en: p('Now the waiter placed every saucer at the bottom of the table. Use ' + c('align-content') + ' to move the cups onto them.'),
        pt: p('Agora o garçom colocou todos os pires na parte de baixo da mesa. Use ' + c('align-content') + ' para levar as xícaras até eles.')
      }
    },
    { // 23
      cups: 'wsssmwsssmwsssm', base: { 'flex-wrap': 'wrap', 'justify-content': 'space-between' }, solution: { 'flex-direction': 'column-reverse', 'align-content': 'center' }, props: ['flex-direction', 'align-content'],
      text: {
        en: p('The guests had a party and now it is time to tidy up. Combine ' + c('flex-direction') + ' and ' + c('align-content') + ' to organize all the cups.'),
        pt: p('Os clientes fizeram festa e agora é hora de arrumar tudo. Combine ' + c('flex-direction') + ' e ' + c('align-content') + ' para organizar todas as xícaras.')
      }
    },
    { // 24
      cups: 'wssssmm', solution: { 'flex-direction': 'column-reverse', 'flex-wrap': 'wrap-reverse', 'align-content': 'space-between', 'justify-content': 'center' }, props: ['flex-direction', 'flex-wrap', 'align-content', 'justify-content'],
      text: {
        en: p('Final challenge! Organize every cup at once using what you have learned:') + '<ul><li>' + [c('justify-content'), c('align-items'), c('flex-direction'), c('flex-wrap'), c('align-content')].join('</li><li>') + '</li></ul>',
        pt: p('Desafio final! Organize todas as xícaras de uma vez usando o que você aprendeu:') + '<ul><li>' + [c('justify-content'), c('align-items'), c('flex-direction'), c('flex-wrap'), c('align-content')].join('</li><li>') + '</li></ul>'
      }
    }
  ];

  // Valores sugeridos (chips) para cada propriedade
  var VALUES = {
    'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    'align-items': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    'align-self': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    'align-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
    'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
    'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
    'flex-flow': ['row wrap', 'column wrap', 'row nowrap', 'column-reverse wrap'],
    'order': ['-1', '0', '1', '2']
  };

  window.CC_LEVELS = LEVELS;
  window.CC_VALUES = VALUES;
})();
