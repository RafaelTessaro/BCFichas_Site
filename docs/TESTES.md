# Testes

Refeitos em 23/11/2026, depois da segunda avaliação (prévia das fichas fiel à impressão, escolha de modelo e personalização no orçamento) e dos pedidos seguintes do responsável (campo "Tipo de evento" e WhatsApp repetido retirados, "locação" nos títulos, tira de fichas do passo 3 inteira e preparo para a indexação). Todas as verificações abaixo foram executadas de verdade; o que não pôde ser testado está na última seção.

**Como foi testado:** navegador Chromium controlado por roteiro (Playwright), abrindo a pasta `site/` num servidor local. Celulares e tablets foram simulados (tamanho de tela, toque e proporção). Não é o mesmo que um aparelho real.

## Critérios de aceite da avaliação de 22/11

| Critério | Situação | Como foi conferido |
|---|---|---|
| Os sete modelos acessíveis por toque, mouse e teclado | Atende | Setas, deslizar e setas do teclado rolam o carrossel; o botão "Escolher", ao lado do nome de cada modelo, funciona por toque e por Enter/Espaço. |
| Nome e rodapé não perdem conteúdo em silêncio; a prévia corresponde ao impresso | Atende, com uma ressalva | A prévia usa as medidas, os tamanhos de letra e as regras de quebra e corte do sistema 3.11.7. Onde a impressão corta, a prévia mostra o corte com "…" e avisa. Ressalva: não foi comparada com uma ficha impressa de verdade (ver "Não verificado"). |
| Limites, contadores e avisos claros e ligados aos campos | Atende | "até 40 caracteres" / "até 80 caracteres"; o aviso de corte fica junto dos campos, ligado a eles e anunciado por leitores de tela. |
| Diferenças de logotipo e forma de pagamento descritas corretamente | Atende | Cada modelo traz a sua descrição; logotipo só nos modelos 1 a 5; forma de pagamento em todos menos o 6, como no sistema. |
| A escolha de modelo chega ao resumo e à mensagem | Atende | O modelo escolhido aparece no bloco "Personalização das fichas" e na mensagem ("Modelo de ficha: Modelo 5"). |
| Editar ou limpar a personalização atualiza a mensagem sem apagar outros dados | Atende | Testado nos dois sentidos (teste das fichas ⇄ formulário) e com "Limpar personalização". |
| Produtos e textos de exemplo não são enviados | Atende | "Pastel", "Pão de mel", preços e os exemplos "FESTA JUNINA" / "OBRIGADO E VOLTE SEMPRE!" nunca entram na mensagem. |
| "Solicitar orçamento" leva ao formulário e "Falar no WhatsApp" ao contato direto | Atende | Conferido em todos os lugares em que aparecem. |
| A mensagem copiada é igual à do link | Atende | Comparação exata do texto copiado com o do link. |
| Campos opcionais continuam opcionais; período de mais de um dia aceito | Atende | Nenhum campo é obrigatório; "13 a 15 de junho" entra como foi escrito. |
| A ampliação abre, fecha com Esc e devolve o foco | Atende | Testado no comprovante e na tela de venda. |
| Navegação disponível em celular, tablet e computador | Atende | 20 larguras de tela, de 320 a 1440 px, em pé e deitado. |
| O carrossel rola por dentro, sem rolagem horizontal da página | Atende | Conferido em todas as larguras, com textos curtos e longos. |
| A barra fixa não cobre conteúdo nem o formulário com o teclado aberto | Atende em simulação | A barra sai quando um campo recebe foco e na seção de orçamento. O teclado virtual de um celular real não foi testado. |
| Condições comerciais correspondem ao serviço | Parcial | O que foi confirmado pelo responsável está no site. Instalação e atendimento fora do horário aguardam resposta (`docs/PENDENCIAS.md`). |
| Domínio, canonical e prévia de compartilhamento correspondem à produção | Não atende ainda | `bcfichas.balancass.com` não existe no DNS: falta criar o CNAME (ver "Publicação"). |
| Sem regressão relevante de carregamento | Atende | Ver "Carregamento e estabilidade". |

## Matriz

| Teste | Resultado | O que foi verificado |
|---|---|---|
| 360, 390 e 430 px | Passou | Sem rolagem horizontal; título com 37 a 41 px, textos com 16 px ou mais e campos com 17 px; a máquina ocupa mais de 90% da largura. A frase da abertura ocupa 3 linhas em 360 px e 2 em 390 e 430 px. |
| 799 a 1440 px (12 larguras) | Passou | Em todas existe menu de seções, nada se sobrepõe no cabeçalho e o símbolo da marca mantém 34 px. Nesta rodada foi corrigido um defeito: entre 1240 e 1440 px o símbolo encolhia (chegava a sumir em 1240 px). |
| Tablet e orientação horizontal | Passou | 768×1024, 1024×768, 844×390 e 740×360: sem rolagem lateral, navegação disponível, carrossel rolando por dentro, barra fixa sem cobrir o campo em foco. |
| 1280 e 1440 px | Passou | As 6 imagens carregam com resolução igual ou maior que o tamanho exibido; todas as seções alinham na mesma margem; parágrafos de apoio com cerca de 76 letras por linha. |
| Menu compacto | Passou | Abre e fecha por toque e por teclado (Enter, Esc com retorno do foco); escolher uma seção fecha o menu e leva até ela. |
| Barra móvel e teclado virtual | Passou em parte | A barra some enquanto um campo está em foco e na seção de orçamento, e não cobre o fim do rodapé. O teclado virtual de um celular real não foi testado. |
| Fichas | Passou | Prévia com as regras do sistema nos 7 modelos: textos curtos, com acentos e no limite (40 e 79 caracteres do teste da avaliação); cortes mostrados e avisados; nada passa da margem. Os campos "Nome do evento" e "Frase do rodapé" ficam um em cima do outro em todas as larguras (360 a 1440 px). Nos modelos 1 a 5 o logotipo de exemplo (símbolo em preto com "SEU LOGO") cabe no espaço que o sistema reserva. |
| Escolha do modelo | Passou | Um modelo por vez, por toque e por teclado; acionar de novo desfaz. O botão "Escolher" fica na linha do nome de cada modelo: os sete ficam alinhados entre si, e o alto das sete fichas também, em 360, 390, 768, 1280 e 1440 px (antes os botões ficavam embaixo das fichas, cada um numa altura). |
| Orçamento | Passou | Personalização levada ao formulário e à mensagem; edição nos dois sentidos; "Limpar personalização"; cópia igual ao link; nenhum aviso de envio. |
| Dúvidas e imagens ampliadas | Passou | Perguntas abrem e fecham pelo teclado com foco visível; as 4 imagens ampliáveis abrem com botão "Fechar", fecham com Esc e devolvem o foco. |
| Movimento e zoom | Passou | Com movimento reduzido não há animação nem rolagem suave; com zoom de 200% (640 e 320 px úteis) não há rolagem lateral nem texto cortado. |
| Acessibilidade automática | Passou | axe: 0 problemas no celular e no computador. |
| HTML | Passou | Sem erros de estrutura no `index.html` e no `404.html` (foi corrigida uma marcação sobrando na página 404). Continuam os mesmos 16 avisos de estilo da versão anterior, que são escolhas do projeto (lista marcada como lista, telefone sem espaço especial e formulário que envia por link). |
| Como usar no evento | Passou | O passo "As fichas saem na hora" mostra duas fichas do mesmo modelo e com o mesmo tamanho de letra (Pastel e Caldo, o pedido da tela do passo 1), inteiras e retas dentro do quadro, em 360, 390, 700, 1280 e 1440 px. Antes a tira saía cortada; depois, inclinada, ficava com as linhas internas irregulares e misturava tamanhos de letra. As linhas das fichas têm agora pelo menos 1 pixel. Abaixo dos quatro passos entrou o destaque "Botões com a imagem do produto", com uma tela gerada pelo próprio sistema (12 produtos genéricos, sem marcas), ampliável; a mesma tela aparece no visor das fotos da máquina. |
| Textos | Passou | "Locação" na abertura, nas dúvidas e no rodapé; o verbo "alugar" continua nas frases; nenhuma ocorrência de "alocação". |
| Indexação | Passou no que depende do site | Título (63 caracteres) e descrição (161) com "locação" e "aluguel"; endereço oficial indicado ao Google; um único título principal; todas as imagens com descrição; dados estruturados de site, página, serviço, empresa (telefone, endereço, horário) e dúvidas, estas iguais às respostas visíveis; sitemap com imagens; `robots.txt` liberando tudo; Lighthouse SEO 100. O que depende do endereço oficial e das contas do Google está em `docs/PUBLICAR-NA-VERCEL.md`, item 4. |
| Publicação | Em parte | Ver "Publicação" abaixo. |

## Prévia das fichas: o que significa "fiel"

A prévia foi refeita a partir do código do sistema que imprime (BC Fichas 3.11.7, arquivos `Layout.cs` e `RenderizadorFicha.cs`): ficha de 576 pontos de largura com 14 de margem, letra Arial, os mesmos tamanhos de letra e as mesmas regras de quebra de linha e de corte com "…".

Com os textos usados na avaliação:

| Texto | Resultado na prévia (e na impressão) |
|---|---|
| Nome "Festa Beneficente São João da Comunidade" (40 caracteres) | Sai inteiro nos modelos 5 e 7, que usam duas linhas. É cortado com "…" nos modelos 1, 2, 3, 4 e 6, que dão uma linha ao nome. O site avisa em cada modelo e junto dos campos. |
| Rodapé "Obrigado pela presença! Sua participação ajuda os projetos da nossa comunidade." (79 caracteres) | Sai inteiro, em duas linhas, nos 7 modelos. Antes a prévia cortava esse texto sem necessidade. |
| Rodapé de 80 caracteres todo em maiúsculas | Passa de duas linhas e é cortado; o site pede para encurtar a frase. |

Outras diferenças corrigidas: o rodapé sai como foi digitado (a prévia antiga passava tudo para maiúsculas; o sistema só faz isso com o nome do evento) e os contadores falam em "caracteres".

Onde não há Arial (celulares Android, por exemplo) o site usa a letra Arimo, que tem as mesmas larguras. Ela é baixada só depois que a página termina de carregar.

## Carregamento e estabilidade

Lighthouse 13.6, modo celular, servidor local sem compressão. As duas versões foram medidas na mesma máquina, uma depois da outra, três vezes cada (valores medianos).

**Rede e processador estimados** (padrão do Lighthouse: 150 ms de latência, 1,6 Mbps, processador 4 vezes mais lento):

| Medida | Versão anterior | Esta versão |
|---|---|---|
| Desempenho | 96 de 100 | 95 de 100 |
| Acessibilidade | 100 de 100 | 100 de 100 |
| Boas práticas | 100 de 100 | 100 de 100 |
| SEO | 100 de 100 | 100 de 100 |
| Primeira imagem na tela (FCP) | 1,2 s | 1,2 s |
| Maior elemento na tela (LCP) | 2,6 s | 2,9 s |
| Tempo de bloqueio (TBT) | 65 ms | 48 ms |
| Deslocamento de layout (CLS) | 0 | 0 |
| Peso da primeira carga | 321 KB | 365 KB |

**Rede e processador limitados de verdade** (mesmos limites, aplicados no navegador):

| Medida | Versão anterior | Esta versão |
|---|---|---|
| Desempenho | 96 de 100 | 96 de 100 |
| Primeira imagem na tela (FCP) | 2,2 s | 2,3 s |
| Maior elemento na tela (LCP) | 2,2 s | 2,3 s |
| Tempo de bloqueio (TBT) | 10 ms | 57 ms |
| Deslocamento de layout (CLS) | 0 | 0 |

Leitura: a página ficou 44 KB mais pesada (23 KB são a letra das fichas, que só é baixada onde não há Arial, e o restante é HTML, CSS e JavaScript novos). No teste com limite real a diferença é de cerca de 0,1 s; a estimativa do Lighthouse mostra 0,3 s a mais no maior elemento porque conta a letra das fichas como se disputasse a rede com a foto da abertura, o que não acontece (ela começa depois). Na medição anterior registrada neste arquivo (20/11) a nota era 93; a diferença para os 96 de agora vem da máquina de teste, por isso a comparação válida é a desta tabela.

São números de laboratório, não de visitantes reais. Na Vercel há compressão e rede de distribuição, então o resultado tende a ser igual ou melhor.

## Publicação

- **`bcfichas.vercel.app`:** publica sozinho cada envio desta branch. Conferido em 22/11/2026, logo depois do envio: a página, o `site.css`, o `site.js`, a letra das fichas e a página 404 servidos são idênticos, byte a byte, aos arquivos testados aqui; um endereço que não existe devolve a página 404 do site; as letras são servidas com cache de um ano.
- **`bcfichas.balancass.com`:** conferido em 23/11/2026 no DNS público: o nome **ainda não existe** (resposta NXDOMAIN). A zona `balancass.com` é atendida pela HostGator (`ns998.hostgator.com.br`). O responsável decidiu hospedar o site lá: ao criar o subdomínio no cPanel, o registro é criado sozinho. O endereço indicado ao Google (canonical), a imagem de compartilhamento e o sitemap já apontam para o endereço oficial.

## Pacote para a HostGator (cPanel)

Em 23/11/2026 o `site.zip` foi extraído num servidor Apache 2.4 de teste, com o `.htaccess` valendo como na hospedagem. O teste achou e corrigiu duas falhas do `.htaccess`: o JavaScript não saía comprimido nem ficava guardado por um dia (o Apache o serve como `text/javascript`, tipo que faltava nas regras).

| Verificação | Resultado |
|---|---|
| `http://` e outros nomes de servidor vão para `https://bcfichas.balancass.com` | Passou |
| A validação do cadeado (`.well-known`) não é redirecionada | Passou |
| Página, CSS, JavaScript, sitemap e ícones comprimidos (página de 58 KB para 13 KB) | Passou |
| Endereço que não existe devolve a página 404 do site, com o código 404 | Passou |
| Cache: página sem guardar; CSS e JavaScript, 1 dia; fotos, 1 mês; letras, 1 ano | Passou |
| `.htaccess` inacessível de fora e pastas sem listagem de arquivos | Passou |
| Arquivos servidos idênticos aos do projeto | Passou |
| Navegador (celular simulado): letras, 7 imagens visíveis, fichas e formulário funcionando; página 404 | Passou |

Não foi testado na HostGator de verdade: depende de criar o subdomínio (`docs/PUBLICAR-NO-CPANEL.md`).

## Evidências

Imagens em `docs/previa/`:

- `estado-1-normal.jpg`, `estado-2-texto-longo.jpg`, `estado-3-modelo-escolhido.jpg`, `estado-4-orcamento.jpg` (computador, 1280 px);
- `estados-celular.jpg` (os mesmos quatro estados no celular);
- `previa-computador.jpg` e `previa-celular.jpg` (página inteira).

## Detalhe do que passou (161 verificações)

### Celular (360, 390 e 430 px)

- 360px: sem rolagem horizontal
- 360px: título 37.64px, texto 16px, campos 17px, contatos 20px
- 360px: máquina ocupa 327 de 360px
- 390px: sem rolagem horizontal
- 390px: título 39.11px, texto 16px, campos 17px, contatos 20px
- 390px: máquina ocupa 354 de 390px
- 430px: sem rolagem horizontal
- 430px: título 41.07px, texto 16px, campos 17px, contatos 20px
- 430px: máquina ocupa 390 de 430px

### Cabeçalho, de 799 a 1440 px

- 799px: menu compacto, sem sobreposição, símbolo da marca com 30px
- 799px: sem rolagem horizontal
- 800px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 800px: sem rolagem horizontal
- 960px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 960px: sem rolagem horizontal
- 1024px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1024px: sem rolagem horizontal
- 1039px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1039px: sem rolagem horizontal
- 1040px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1040px: sem rolagem horizontal
- 1239px: menu compacto + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1239px: sem rolagem horizontal
- 1240px: navegação completa + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1240px: sem rolagem horizontal
- 1280px: navegação completa + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1280px: sem rolagem horizontal
- 1359px: navegação completa + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1359px: sem rolagem horizontal
- 1360px: navegação completa + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1360px: sem rolagem horizontal
- 1440px: navegação completa + orçamento + WhatsApp, sem sobreposição, símbolo da marca com 34px
- 1440px: sem rolagem horizontal

### Tablet e orientação horizontal

- 768×1024 (tablet em pé): sem rolagem lateral, navegação disponível, carrossel rolando por dentro, barra fixa presente
- 768×1024 (tablet em pé): a barra fixa não cobre o campo em foco no formulário
- 1024×768 (tablet deitado): sem rolagem lateral, navegação disponível, carrossel rolando por dentro
- 1024×768 (tablet deitado): a barra fixa não cobre o campo em foco no formulário
- 844×390 (celular deitado): sem rolagem lateral, navegação disponível, carrossel rolando por dentro
- 844×390 (celular deitado): a barra fixa não cobre o campo em foco no formulário
- 844×390: com o menu aberto, todos os itens ficam alcançáveis na tela baixa
- 740×360 (celular pequeno deitado): sem rolagem lateral, navegação disponível, carrossel rolando por dentro, barra fixa presente
- 740×360 (celular pequeno deitado): a barra fixa não cobre o campo em foco no formulário

### Menu compacto

- 960px: menu compacto abre com clique
- 960px: escolher "As fichas" fecha o menu e leva à seção (topo em 76px)
- celular: menu abre com toque
- celular: menu fecha com toque no botão
- teclado: Enter abre o menu
- teclado: Esc fecha o menu e devolve o foco ao botão
- teclado: Tab + Enter escolhe "Como alugar" e leva à seção (topo em 70px)

### Computador (1280 e 1440 px)

- 1280px: todas as 7 imagens têm resolução igual ou maior que o tamanho exibido
- 1280px: sem rolagem horizontal
- 1280px: todas as seções alinham na mesma margem (48px)
- 1280px: parágrafos de apoio com cerca de 76 letras por linha, no máximo
- 1440px: todas as 7 imagens têm resolução igual ou maior que o tamanho exibido
- 1440px: sem rolagem horizontal
- 1440px: todas as seções alinham na mesma margem (120px)
- 1440px: parágrafos de apoio com cerca de 76 letras por linha, no máximo

### Barra fixa do celular

- visível ao abrir a página
- some enquanto a pessoa digita num campo (não cobre o campo nem disputa com o teclado)
- no fim da página não cobre o último texto do rodapé
- some na seção de orçamento (não cobre o formulário)
- com um campo do formulário em foco (teclado aberto), a barra fixa fica fora

### Fichas: prévia com as regras da impressão

- aparecem os 7 modelos
- estado inicial: exemplos nos 7 modelos, sem nenhum aviso
- como no sistema: logotipo nos modelos 1 a 5; forma de pagamento em todos menos o 6
- cada modelo diz se tem logotipo; o 6 avisa que não mostra a forma de pagamento
- o texto da seção não promete os mesmos campos em todos os modelos
- contadores e aviso de corte ligados aos campos (aria-describedby) e anunciados (role=status)
- o nome do evento para em 40 caracteres, o limite do sistema (ficou com 40)
- os contadores falam em "caracteres": "40 de 40 caracteres" e "até 80 caracteres"
- trocar o produto de exemplo muda nome e preço nos 7 modelos
- nome com acentos sai em maiúsculas nos 7 modelos, como o sistema grava
- rodapé sai como foi digitado nos 7 modelos (o sistema não muda para maiúsculas)
- texto curto: nenhum corte, e o aviso confirma "cabe inteiro"
- nenhum texto passa da margem das fichas [true,true,true,true,true,true,true]
- rodapé de 79 caracteres aparece inteiro, em até 2 linhas, nos 7 modelos
- nome de 40 caracteres: onde a impressão corta, a prévia mostra o corte com "…" e o modelo avisa; nada some em silêncio
- o aviso junto aos campos diz onde corta (modelos 1,2,3,4,6) e onde sai inteiro
- com os textos longos, nada passa da margem das fichas e a página não ganha rolagem lateral
- rodapé que passa de 2 linhas: a prévia corta como a impressora e o aviso pede para encurtar a frase
- no começo, a seta "anteriores" fica desativada
- a seta "próximos" avança o carrossel (0 → 310px)
- com o foco no carrossel, a seta do teclado rola os modelos (310 → 620px)
- deslizando até o fim, o modelo 7 aparece inteiro e a seta "próximos" desativa
- o carrossel rola por dentro, sem criar rolagem lateral na página
- o aviso de exemplo continua embaixo das fichas
- 360px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 327px de largura
- 390px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 354px de largura
- 768px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 520px de largura
- 1024px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 480px de largura e o produto de exemplo ao lado
- 1280px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 480px de largura e o produto de exemplo ao lado
- 1440px: "Nome do evento" e "Frase do rodapé" um em cima do outro, na ordem da ficha, com 480px de largura e o produto de exemplo ao lado
- 390px: exemplo de logotipo nos modelos 1 a 5: símbolo da BC Fichas em preto com "SEU LOGO", dentro do espaço que o sistema reserva (170x110, 150x96, 170x110, 170x110, 300x150 pontos)
- 1280px: exemplo de logotipo nos modelos 1 a 5: símbolo da BC Fichas em preto com "SEU LOGO", dentro do espaço que o sistema reserva (170x110, 150x96, 170x110, 170x110, 300x150 pontos)

### Escolha do modelo

- toque em "Escolher", ao lado do nome do modelo 3, marca o modelo (botão "Escolhido", contorno na ficha) e leva a escolha ao formulário
- pelo teclado (Enter) a escolha passa para o modelo 5: só um modelo fica escolhido por vez
- acionar de novo o botão desfaz a escolha
- 360px: botões de escolha alinhados entre si, na linha do nome de cada modelo, com 44px de altura e nome completo para leitores de tela ("Escolher Modelo 1"…); o alto das 7 fichas também fica alinhado
- 390px: botões de escolha alinhados entre si, na linha do nome de cada modelo, com 44px de altura e nome completo para leitores de tela ("Escolher Modelo 1"…); o alto das 7 fichas também fica alinhado
- 768px: botões de escolha alinhados entre si, na linha do nome de cada modelo, com 44px de altura e nome completo para leitores de tela ("Escolher Modelo 1"…); o alto das 7 fichas também fica alinhado
- 1280px: botões de escolha alinhados entre si, na linha do nome de cada modelo, com 44px de altura e nome completo para leitores de tela ("Escolher Modelo 1"…); o alto das 7 fichas também fica alinhado
- 1440px: botões de escolha alinhados entre si, na linha do nome de cada modelo, com 44px de altura e nome completo para leitores de tela ("Escolher Modelo 1"…); o alto das 7 fichas também fica alinhado

### Orçamento

- "Solicitar orçamento" leva ao formulário nos 4 lugares em que aparece
- "Falar no WhatsApp" abre a conversa com o número certo nos 5 lugares
- há um caminho direto para o WhatsApp, sem formulário, no cabeçalho, no menu, na abertura, na barra do celular e na seção de orçamento
- na lista de contatos o WhatsApp não se repete: fica o botão "Falar no WhatsApp" em cima e, embaixo, só o telefone, o endereço e o horário
- o botão da barra leva ao formulário e o cabeçalho fixo não cobre o título (título em 181px, cabeçalho termina em 59px)
- sem preencher nada, a mensagem é só a saudação
- o produto e os textos de exemplo não entram na mensagem nem no formulário
- "Quero fichas para o meu evento" leva ao formulário com nome do evento, rodapé e modelo já no bloco "Personalização das fichas"
- "Seu nome" e "Nome do evento" são campos separados
- a mensagem leva só o que foi preenchido, com a personalização (nome nas fichas, rodapé e modelo), acentos e quebras de linha
- produto de exemplo, preço e "Ainda não sei" ficam fora da mensagem; o campo "Tipo de evento" não existe mais
- o link usa o número (19) 3023-9050
- "Ainda não sei" continua valendo para a quantidade de máquinas e nenhum campo é obrigatório
- mudar nome e modelo no formulário atualiza o teste das fichas (os dois lados mostram a mesma coisa)
- voltar por "Ver os modelos" e trocar para o modelo 7 preserva os outros campos e não duplica nada na mensagem
- Enter num campo leva o foco ao botão de enviar (não abre o WhatsApp sozinho)
- "Copiar a mensagem" copia exatamente o texto do link do WhatsApp e avisa "Mensagem copiada"
- "Limpar personalização" aparece quando há personalização
- "Limpar personalização" esvazia nome do evento, rodapé e modelo, nos dois lugares, e as fichas voltam ao exemplo
- limpar a personalização não apaga os outros dados, e a mensagem volta a ter só nome, período e cidade
- em nenhum momento a página diz que o orçamento foi enviado
- 390px: tocar no endereço abre o Google Maps na Rua 13, 650, Boa Morte, Rio Claro-SP (CEP 13500-120), em outra aba; área de toque com 78px de altura
- 1280px: tocar no endereço abre o Google Maps na Rua 13, 650, Boa Morte, Rio Claro-SP (CEP 13500-120), em outra aba; área de toque com 78px de altura

### Dúvidas

- teclado: Enter abre a resposta
- teclado: Enter fecha e o foco continua na pergunta
- foco visível na pergunta: contorno solid 3px (com :focus-visible no teclado)

### Imagens ampliadas

- comprovante abre ampliado pelo teclado, com legenda, descrição e o foco no botão "Fechar" (5 imagens ampliáveis na página)
- Esc fecha e o foco volta para a imagem que abriu
- a tela de venda abre ampliada, fecha com Esc e devolve o foco ao link que abriu
- toque abre e o botão "Fechar" fecha
- a tela com imagens nos botões abre ampliada (1024 px), com legenda, fecha com Esc e devolve o foco

### Movimento reduzido

- movimento reduzido: rolagem auto, ficha do início sem animação e visível

### Zoom de 200%

- zoom de 200% em janela de 1280px (640px úteis): sem rolagem lateral, menu disponível, nenhum texto cortado
- zoom de 200%: o menu aberto rola por dentro quando não cabe na altura
- zoom de 200% em janela de 640px (320px úteis): sem rolagem lateral, menu disponível, nenhum texto cortado

### Acessibilidade (axe)

- axe no celular: 0 problemas
- axe no computador: 0 problemas

### Como usar no evento

- 360px: passo "As fichas saem na hora" com 2 fichas (PASTEL + CALDO) inteiras, retas e do mesmo modelo e tamanho de letra (folga de 23px em cima e 23px embaixo)
- 390px: passo "As fichas saem na hora" com 2 fichas (PASTEL + CALDO) inteiras, retas e do mesmo modelo e tamanho de letra (folga de 25px em cima e 25px embaixo)
- 700px: passo "As fichas saem na hora" com 2 fichas (PASTEL + CALDO) inteiras, retas e do mesmo modelo e tamanho de letra (folga de 21px em cima e 21px embaixo)
- 1280px: passo "As fichas saem na hora" com 2 fichas (PASTEL + CALDO) inteiras, retas e do mesmo modelo e tamanho de letra (folga de 20px em cima e 20px embaixo)
- 1440px: passo "As fichas saem na hora" com 2 fichas (PASTEL + CALDO) inteiras, retas e do mesmo modelo e tamanho de letra (folga de 20px em cima e 20px embaixo)
- 390px: imagem do produto em destaque logo abaixo dos quatro passos (tela real com imagens nos botões), citada também no passo 1, na seção da máquina e nas dúvidas
- 390px: a tela em destaque é a de 12 produtos genéricos, sem marcas, e as fotos da máquina carregam a versão nova (?v=3), com a mesma tela no visor
- 1280px: imagem do produto em destaque logo abaixo dos quatro passos (tela real com imagens nos botões), citada também no passo 1, na seção da máquina e nas dúvidas
- 1280px: a tela em destaque é a de 12 produtos genéricos, sem marcas, e as fotos da máquina carregam a versão nova (?v=3), com a mesma tela no visor

### Textos

- "Locação" nos títulos (abertura, dúvidas e rodapé); o verbo "alugar" continua nas frases; nenhuma "alocação"
- treinamento sem dizer onde é dado: na abertura só "Treinamento"; nas dúvidas "O que está incluído?" e "Quem opera as máquinas na festa?" continuam dizendo que há treinamento

### Indexação (o que o Google lê)

- título com a busca principal na frente e 63 caracteres: "Locação de máquinas de fichas para festas e eventos | BC Fichas"
- descrição com "locação" e "aluguel", 161 caracteres
- endereço oficial indicado ao Google (canonical), página liberada para indexação e idioma pt-BR
- um único título principal ("Máquinas de fichas para o caixa do seu evento.") e todas as imagens com descrição
- dados estruturados: site, página, serviço ("locação", com "aluguel" como nome alternativo), empresa e dúvidas
- empresa com telefone, endereço em Rio Claro-SP e horário de atendimento
- as 8 perguntas dos dados estruturados são iguais, palavra por palavra, às respostas visíveis na página
- compartilhamento (WhatsApp, Facebook): título, descrição e imagem com "locação"
- sitemap com a página e as imagens principais; robots.txt libera tudo e aponta para o sitemap

### Geral

- sem erros no console durante todos os testes do celular
- sem JavaScript: links do WhatsApp e do formulário funcionam e o botão de copiar fica escondido

## Não verificado

- **Ficha impressa de verdade:** a prévia segue o código do sistema, mas não foi posta lado a lado com uma ficha saída da impressora. Vale imprimir uma ficha com o nome e o rodapé do teste e comparar.
- **Celular de verdade:** deslizar o carrossel com o dedo, o teclado virtual e a abertura do aplicativo do WhatsApp.
- **Envio de mensagem:** o link foi conferido, mas nenhuma mensagem foi enviada.
- **`bcfichas.balancass.com`:** o subdomínio ainda não foi criado, então o endereço oficial e o cadeado de lá não puderam ser testados. O pacote foi testado num Apache local (ver "Pacote para a HostGator").
- **Imagem de compartilhamento** numa conversa real de WhatsApp ou Facebook (ela aponta para o endereço oficial, que precisa estar no ar).
- **Google Search Console e indexação.**
- **Leitor de tela real** (VoiceOver, TalkBack). A checagem automática do axe não encontrou problemas, mas não substitui esse teste.
