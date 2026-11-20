# Testes

Refeitos em 20/11/2026, depois dos últimos ajustes (fotos limpas, textos retirados e a opção de falar direto no WhatsApp). Todas as verificações abaixo foram executadas de verdade; o que não pôde ser testado está na última seção.

**Como foi testado:** navegador Chromium controlado por roteiro (Playwright), abrindo a pasta `site/` num servidor local. O celular foi simulado (tamanho de tela, toque e proporção de um iPhone 13 e larguras de 360, 390 e 430 px). Não é o mesmo que um aparelho real.

## Matriz

| Teste | Resultado | O que foi verificado |
|---|---|---|
| 360, 390 e 430 px | Passou | Sem rolagem horizontal; título com 37 a 41 px, textos com 16 px ou mais e campos com 17 px; a máquina ocupa mais de 90% da largura. |
| 799, 800, 960, 1024, 1039 e 1040 px | Passou | Em todas existe menu de seções e nada se sobrepõe no cabeçalho, agora com os botões de orçamento e de WhatsApp. Também conferido em 1239, 1240 e 1280 px, onde a navegação completa entra. |
| 1280 e 1440 px | Passou | As 8 imagens carregam com resolução igual ou maior que o tamanho exibido; todas as seções alinham na mesma margem; parágrafos de apoio com cerca de 76 letras por linha. |
| Menu compacto | Passou | Abre e fecha por toque e por teclado (Enter, Esc com retorno do foco); escolher uma seção fecha o menu e leva até ela. |
| Barra móvel e teclado virtual | Passou em parte | A barra mostra "Solicitar orçamento" e "WhatsApp", cabe em 320 px, some enquanto um campo está em foco e na seção de orçamento, e não cobre o fim do rodapé. O teclado virtual de um celular real não foi testado. |
| Fichas | Passou | 7 modelos; nome com acentos e limite de 40 letras com contador; rodapé; troca de produto; setas, teclado e fim do carrossel; aviso de exemplo mantido. |
| Orçamento | Passou | "Solicitar orçamento" leva ao formulário; há caminho direto para o WhatsApp no cabeçalho, no menu, na abertura, na barra, na seção de orçamento e nos contatos; a mensagem leva só o que foi preenchido; número (19) 3023-9050; "Copiar a mensagem" funciona; nenhum aviso de envio. |
| Dúvidas e imagens ampliadas | Passou | Perguntas abrem e fecham pelo teclado com foco visível; as 6 imagens ampliáveis abrem com botão "Fechar", fecham com Esc e devolvem o foco. |
| Movimento e zoom | Passou | Com movimento reduzido não há animação nem rolagem suave; com zoom de 200% (640 e 320 px úteis) não há rolagem lateral nem texto cortado. |
| Publicação | Em parte | Ver "Publicação" abaixo. |

## Carregamento e estabilidade

Lighthouse 13.6, modo celular, rede lenta simulada (150 ms de latência, 1,6 Mbps, processador 4 vezes mais lento), servidor local sem compressão.

| Medida | Resultado |
|---|---|
| Desempenho | 93 de 100 |
| Acessibilidade | 100 de 100 |
| Boas práticas | 100 de 100 |
| SEO | 100 de 100 |
| Primeira imagem na tela (FCP) | 1,2 s |
| Maior elemento na tela (LCP) | 2,9 s |
| Tempo de bloqueio (TBT) | 160 ms |
| Deslocamento de layout (CLS) | 0 |

São números de laboratório, não de visitantes reais. Na Vercel há compressão e rede de distribuição, então o resultado tende a ser igual ou melhor.

## Publicação

Conferido em `bcfichas.vercel.app` logo depois do envio de 20/11/2026:

- a página no ar já é esta versão (botão de WhatsApp no cabeçalho, "Prefere conversar?" na seção de orçamento, textos retirados ausentes);
- as fotos limpas são as servidas, com endereço novo (`?v=2`) para o navegador não mostrar as antigas guardadas;
- um endereço que não existe devolve a página 404 do site.

`bcfichas.balancass.com` ainda não responde: falta criar o registro CNAME.

## Detalhe do que passou (83 verificações)

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

### Cabeçalho nas larguras de transição

- 799px: menu compacto, sem sobreposição
- 799px: sem rolagem horizontal
- 800px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 800px: sem rolagem horizontal
- 960px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 960px: sem rolagem horizontal
- 1024px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 1024px: sem rolagem horizontal
- 1039px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 1039px: sem rolagem horizontal
- 1040px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 1040px: sem rolagem horizontal
- 1239px: menu compacto + orçamento + WhatsApp, sem sobreposição
- 1239px: sem rolagem horizontal
- 1240px: navegação completa + orçamento + WhatsApp, sem sobreposição
- 1240px: sem rolagem horizontal
- 1280px: navegação completa + orçamento + WhatsApp, sem sobreposição
- 1280px: sem rolagem horizontal

### Menu compacto

- 960px: menu compacto abre com clique
- 960px: escolher "As fichas" fecha o menu e leva à seção (topo em 76px)
- celular: menu abre com toque
- celular: menu fecha com toque no botão
- teclado: Enter abre o menu
- teclado: Esc fecha o menu e devolve o foco ao botão
- teclado: Tab + Enter escolhe "Como alugar" e leva à seção (topo em 70px)

### Computador (1280 e 1440 px)

- 1280px: todas as 8 imagens têm resolução igual ou maior que o tamanho exibido
- 1280px: sem rolagem horizontal
- 1280px: todas as seções alinham na mesma margem (48px)
- 1280px: parágrafos de apoio com cerca de 76 letras por linha, no máximo
- 1440px: todas as 8 imagens têm resolução igual ou maior que o tamanho exibido
- 1440px: sem rolagem horizontal
- 1440px: todas as seções alinham na mesma margem (120px)
- 1440px: parágrafos de apoio com cerca de 76 letras por linha, no máximo

### Barra fixa do celular

- visível ao abrir a página
- some enquanto a pessoa digita num campo (não cobre o campo nem disputa com o teclado)
- no fim da página não cobre o último texto do rodapé
- some na seção de orçamento (não cobre o formulário)

### Fichas

- o nome do evento para em 40 letras, o limite do sistema (digitado: 40)
- o contador mostra "40 de 40 letras"
- aparecem os 7 modelos
- nome e rodapé com acentos aparecem nos 7 modelos
- trocar o produto muda nome e preço nos 7 modelos
- nenhum texto estoura a largura das fichas
- nome com 40 letras ocupa no máximo 2 linhas em cada modelo e não cria rolagem lateral
- no começo, a seta "anteriores" fica desativada
- a seta "próximos" avança o carrossel (0 → 310px)
- com o foco no carrossel, a seta do teclado rola os modelos (310 → 620px)
- deslizando até o fim, o modelo 7 aparece inteiro e a seta "próximos" desativa
- o aviso de exemplo continua embaixo das fichas

### Orçamento

- "Solicitar orçamento" leva ao formulário nos 4 lugares em que aparece
- "Falar no WhatsApp" abre a conversa com o número certo nos 5 lugares
- há um caminho direto para o WhatsApp, sem formulário, no cabeçalho, no menu, na abertura, na barra do celular, na seção de orçamento e nos contatos
- o botão da barra leva ao formulário e o cabeçalho fixo não cobre o título (título em 181px, cabeçalho termina em 59px)
- sem preencher nada, a mensagem é só a saudação
- a mensagem leva só os campos preenchidos (nome, período e cidade), com acentos e quebras de linha
- o link usa o número (19) 3023-9050
- campo "Quantidade de máquinas" com a opção "Ainda não sei"
- Enter num campo leva o foco ao botão de enviar (não abre o WhatsApp sozinho)
- "Copiar a mensagem" copia o mesmo texto e avisa "Mensagem copiada"
- em nenhum momento a página diz que o orçamento foi enviado

### Dúvidas

- teclado: Enter abre a resposta
- teclado: Enter fecha e o foco continua na pergunta
- foco visível na pergunta: contorno solid 3px (com :focus-visible no teclado)

### Imagens ampliadas

- comprovante abre ampliado pelo teclado, com legenda, descrição e o foco no botão "Fechar" (6 imagens ampliáveis na página)
- Esc fecha e o foco volta para a imagem que abriu
- toque abre e o botão "Fechar" fecha

### Movimento reduzido

- movimento reduzido: rolagem auto, ficha do início sem animação e visível

### Zoom de 200%

- zoom de 200% em janela de 1280px (640px úteis): sem rolagem lateral, menu disponível, nenhum texto cortado
- zoom de 200%: o menu aberto rola por dentro quando não cabe na altura
- zoom de 200% em janela de 640px (320px úteis): sem rolagem lateral, menu disponível, nenhum texto cortado

### Acessibilidade (axe)

- axe no celular: 0 problemas
- axe no computador: 0 problemas

### Geral

- sem erros no console durante todos os testes do celular
- sem JavaScript: links do WhatsApp e do formulário funcionam e o botão de copiar fica escondido

## Não verificado

- **Celular de verdade:** deslizar o carrossel com o dedo, o teclado virtual e a abertura do aplicativo do WhatsApp.
- **Envio de mensagem:** o link foi conferido, mas nenhuma mensagem foi enviada.
- **`bcfichas.balancass.com`:** o registro CNAME ainda não foi criado, então o endereço oficial não pôde ser testado.
- **Imagem de compartilhamento** numa conversa real de WhatsApp ou Facebook (ela aponta para o endereço oficial, que precisa estar no ar).
- **Google Search Console e indexação.**
- **Leitor de tela real** (VoiceOver, TalkBack). A checagem automática do axe não encontrou problemas, mas não substitui esse teste.
