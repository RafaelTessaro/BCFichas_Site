# Site do BC Fichas

Site de uma página do **BC Fichas**: locação de máquinas de fichas para festas juninas, quermesses e eventos.
O objetivo é o organizador entender o serviço e pedir o orçamento pelo WhatsApp.

Endereço previsto: **https://bcfichas.balancass.com**

| | |
|---|---|
| **Publicar** | [`docs/PUBLICAR-NA-VERCEL.md`](docs/PUBLICAR-NA-VERCEL.md) |
| **O que falta confirmar** | [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md) |
| **Mudar textos, número e fotos** | mais abaixo, em "Como mudar" |

## O que tem

```
site/                       O SITE (é esta pasta que vai para o ar)
  index.html                a página
  404.html                  página de endereço não encontrado
  css/site.css  js/site.js
  fonts/                    letra Mona Sans (licença livre, arquivo próprio: nada vem do Google)
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

**Textos.** Estão todos em `site/index.html`, em português, na ordem em que aparecem na página.
As perguntas e respostas também estão repetidas no bloco `application/ld+json` do começo do arquivo (é o que o Google lê): se mudar uma, mude a outra.

**Produtos e preços das fichas de exemplo.** Em `site/index.html`, procure por `name="produto"`. Cada opção é `NOME|PREÇO`.

**Fotos da máquina.** Ponha a foto nova em `materiais/fotos-originais/`, ajuste a lista `FOTOS` em `ferramentas/processar-fotos.py` e rode o script. Ele recorta o fundo, apaga etiquetas marcadas, monta a tela do sistema no visor e grava os arquivos em `site/img/maquina/`. As instruções estão no começo do script.

**Depois de mudar o CSS ou o JavaScript**, troque `?v=1` por `?v=2` nas linhas de `site.css` e `site.js` do `index.html` e do `404.html`, para o navegador de quem já visitou buscar a versão nova.

## Como as imagens foram feitas

- **Fotos da máquina:** são as fotos reais enviadas. O fundo (mesa) foi recortado, a etiqueta "CAIXA 2" e os dois furinhos ao lado dela foram apagados, e a tela do sistema foi aplicada sobre o visor, que estava desligado nas fotos. O site avisa isso na seção da máquina.
- **Telas do sistema e comprovante de fechamento:** capturas reais do BC Fichas 3.11.7, com dados de teste.
- **Fichas de exemplo:** desenhadas em HTML seguindo quatro dos sete modelos reais do sistema. O nome do evento muda quando o visitante digita. No lugar do logotipo aparece "SEU LOGO".

## De onde vieram as informações

Só entrou no site o que está confirmado nos materiais do projeto:

- textos do BC Fichas já publicados no site da Balanças.com (locação por diária, manual e bobinas, treinamento, fichas com logo, combos, relatórios e sangrias);
- o README do sistema BC Fichas 3.11.7 (formas de pagamento, modelos de ficha, controle de caixa, senha, estoque, devolução) e o código (funciona sem internet);
- os dados da empresa do site da Balanças.com (telefone, endereço, horário, razão social e CNPJ).

Não há preços, depoimentos nem números de clientes. O que precisa de confirmação está em [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).
