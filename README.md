# Site do BC Fichas

Site de uma página do **BC Fichas**: aluguel de máquinas de fichas para festas juninas, quermesses e eventos.
O objetivo é o organizador entender o serviço e pedir o orçamento pelo WhatsApp.

Endereço previsto: **https://bcfichas.balancass.com**

| | |
|---|---|
| **Publicar** | [`docs/PUBLICAR-NA-VERCEL.md`](docs/PUBLICAR-NA-VERCEL.md) |
| **O que falta confirmar** | [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md) |
| **O que foi testado** | [`docs/TESTES.md`](docs/TESTES.md) |
| **Mudar textos, número e fotos** | mais abaixo, em "Como mudar" |

## O que tem

```
site/                       O SITE (é esta pasta que vai para o ar)
  index.html                a página
  404.html                  página de endereço não encontrado
  css/site.css  js/site.js
  fonts/                    letras Mona Sans (textos do site) e Arimo (fichas, onde não há Arial);
                            licença livre, arquivos próprios: nada vem do Google
  img/maquina/              fotos da máquina já tratadas
  img/sistema/              telas reais do sistema e o comprovante de fechamento
  img/                      ícones e a imagem de compartilhamento (WhatsApp, Facebook)
  robots.txt  sitemap.xml  site.webmanifest  favicon.ico
vercel.json                 configuração da Vercel (pasta do site, cache, cabeçalhos de segurança)
materiais/
  fotos-originais/          as 10 fotos da máquina como foram enviadas
  recortes/                 máscaras do recorte de cada foto
  telas-do-sistema/         capturas do sistema (vieram do projeto BC-Fichas-Pagamentos)
ferramentas/
  conferir.py               confere links, arquivos e o número do WhatsApp antes de publicar
  processar-fotos.py        refaz as fotos do site a partir das originais
hospedagem/cpanel/.htaccess só se um dia o site for para o cPanel (plano B)
docs/                       guias
```

O site é estático: HTML, CSS e JavaScript puros, sem banco de dados, sem bibliotecas de fora, sem cookies e sem rastreadores.

## Ver no computador

```bash
cd site
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Como mudar

**Número do WhatsApp ou telefone.** O número está em dois lugares:

1. `site/js/site.js`, no começo, em `CONTATO.whatsapp` (só números: 55 + DDD + número);
2. `site/index.html` e `site/404.html`: troque todas as ocorrências de `551930239050`, de `+551930239050` e do texto `(19) 3023-9050`.

Rode `python3 ferramentas/conferir.py`: ele avisa se sobrou algum link com o número antigo.

**Botões.** "Solicitar orçamento" leva sempre ao formulário do fim da página (`#orcamento`); "Falar no WhatsApp" (ou só "WhatsApp", onde o espaço é curto) abre a conversa direta. As duas opções aparecem juntas no cabeçalho, na abertura, na barra do celular e na seção de orçamento. Mantenha essa regra ao criar botões novos.

**Textos.** Estão todos em `site/index.html`, em português, na ordem em que aparecem na página.
As perguntas e respostas também estão repetidas no bloco `application/ld+json` do começo do arquivo (é o que o Google lê): se mudar uma, mude a outra.

**Produtos e preços das fichas de exemplo.** Em `site/index.html`, procure por `name="produto"`. Cada opção é `NOME|PREÇO`. São só demonstração: nunca entram na mensagem do orçamento.

**Fichas de exemplo (os 7 modelos).** A prévia segue as regras do sistema que imprime (BC Fichas 3.11.7): a ficha é desenhada em "pontos" de impressão (576 de largura, 14 de margem) e o `site/js/site.js`, na parte 2, repete as regras de quebra de linha e de corte do sistema (`Layout.cs` e `RenderizadorFicha.cs` do projeto BC-Fichas-Pagamentos). Se o sistema mudar um modelo, um tamanho de letra ou um limite, mude três lugares: o desenho do modelo no `index.html` (procure por `data-modelo`), os tamanhos no `site.css` (bloco "Ficha") e, se a regra de corte mudar, o `site.js`. Cada modelo diz no HTML qual é a sua regra para o nome do evento: `data-linhas` (quantas linhas), `data-coluna` (nome ao lado do logotipo) ou `data-par` (nome ao lado do número do caixa).

**Personalização no orçamento.** O nome do evento, o rodapé e o modelo escolhido no teste das fichas aparecem no bloco "Personalização das fichas" do formulário e entram na mensagem. Os dois lugares mostram sempre a mesma coisa; "Limpar personalização" esvazia os três sem mexer nos outros campos.

**Fotos da máquina.** Ponha a foto nova em `materiais/fotos-originais/`, ajuste a lista `FOTOS` em `ferramentas/processar-fotos.py` e rode o script. Ele recorta o fundo, apaga etiquetas marcadas, limpa poeira e riscos, monta a tela do sistema no visor e grava os arquivos em `site/img/maquina/`. As instruções estão no começo do script.

**Depois de mudar o CSS ou o JavaScript**, aumente o número que vem depois de `?v=` (hoje `site.css?v=7` e `site.js?v=6`) nas linhas de `site.css` e `site.js` do `index.html` e do `404.html`, para o navegador de quem já visitou buscar a versão nova.

## Como as imagens foram feitas

- **Fotos da máquina:** são as fotos reais enviadas, tratadas por `ferramentas/processar-fotos.py`: o fundo (mesa) foi recortado; a etiqueta "CAIXA 2" e os dois furinhos ao lado dela foram apagados; a poeira e os risquinhos das chapas pretas foram limpos, com o preto mais fundo e neutro; e a tela do sistema foi aplicada sobre o visor, que estava desligado nas fotos. A pedido do responsável, o site não traz aviso sobre a montagem.
- **Telas do sistema e comprovante de fechamento:** capturas reais do BC Fichas 3.11.7, com dados de teste.
- **Fichas de exemplo:** os sete modelos reais do sistema, desenhados em HTML com as medidas e os tamanhos de letra da impressão. O nome do evento (até 40 caracteres, em maiúsculas) e a frase do rodapé (até 80, como foi digitada) mudam quando o visitante escreve; onde a impressão cortaria o texto, a prévia mostra o corte e avisa. No lugar do logotipo aparece "SEU LOGO". A prévia ainda não foi comparada com uma ficha impressa.

## De onde vieram as informações

Só entrou no site o que está confirmado nos materiais do projeto:

- textos do BC Fichas já publicados no site da Balanças.com (fichas com logo, combos, relatórios e sangrias). O que lá aparece como "locação por diária" e "bobinas inclusas" foi corrigido pelo responsável: o site fala em aluguel e em bobinas consignadas;
- o README do sistema BC Fichas 3.11.7 (formas de pagamento, modelos de ficha, controle de caixa, senha, estoque, devolução) e o código (funciona sem internet);
- os dados da empresa do site da Balanças.com (telefone, endereço, horário, razão social e CNPJ).
- as respostas do responsável em 19 e 20/11/2026 (lista completa em `docs/PENDENCIAS.md`, item 4);
- o código do sistema que imprime as fichas, para as regras da prévia (`docs/PENDENCIAS.md`, item 5).

Não há preços, depoimentos nem números de clientes. O que precisa de confirmação está em [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).
