# Pendências

Situação em 23/11/2026, depois da segunda avaliação do site (`BC_Fichas_Reavaliacao_e_Guia_2026-11-22.md`). O briefing usado foi o texto do pedido; além dele chegaram as fotos e as duas avaliações.

## 1. Para responder

Perguntas que a avaliação levantou e que só a empresa pode responder. Sem resposta, o site não diz nada sobre o assunto.

| # | Assunto | Como está no site | O que preciso saber |
|---|---|---|---|
| 1 | **Instalação no local** | Não aparece. | O que o local precisa oferecer: tomada (110 ou 220 V?), bancada, proteção contra chuva e sol? Com a resposta entra uma dúvida "O que preciso ter no local?". |
| 2 | **Evento fora do horário de suporte** | As dúvidas informam o horário de atendimento (segunda a sexta, 8h às 11h e 13h às 18h; sábado, 8h às 12h). | Como fica um evento à noite ou no domingo? Há algum combinado prévio, um contato de plantão? O site não promete atendimento fora do horário. |
| 3 | **Quantidade de máquinas** | "Verificamos a disponibilidade e ajudamos a definir a quantidade de máquinas para o evento." (texto sugerido pelas avaliações) | É assim que funciona? Existe uma regra prática? |
| 4 | **Painel no celular e maquininha integrada** | Ficaram de fora (versões "Rede" e "Cartão" do sistema). | Já são oferecidos no aluguel? Se sim, entram no site. |
| 5 | **Frase de apoio da abertura** | "Organize as vendas do evento com fichas impressas na hora e relatórios por caixa." (sugestão da avaliação de 22/11) | Em 20/11 o responsável pediu para tirar a frase que havia nesse lugar. Esta é outra frase, mais curta; se preferir a abertura sem frase, é só avisar. |
| 6 | **Imagens nos botões dos produtos** | O site diz que cada botão pode mostrar a imagem do produto e mostra uma tela real do sistema (pedido de 23/11). | Quem fornece as imagens: o cliente envia junto com o cardápio, ou a BC Fichas já tem as figuras? Com a resposta, isso entra em "Como alugar" e nas dúvidas. A tela usada é a do cardápio padrão do sistema e mostra nomes de marcas de cerveja (Heineken, Original, Brahma, Império); se preferir, dá para trocar por outra captura. |

A avaliação também pediu respostas sobre **retirada, entrega e devolução** e sobre **como o período do aluguel é calculado**. O responsável já decidiu, em 19/11, não publicar isso ("depende do lugar; na dúvida não precisa pôr"), então o site continua só com "consulte a disponibilidade". Se mudar de ideia, cabem em duas dúvidas curtas.

## 2. Publicação

- [ ] **Criar o CNAME de `bcfichas.balancass.com`.** Conferido em 22/11: o nome não existe no DNS (NXDOMAIN). A zona `balancass.com` está na HostGator, então o registro é criado no cPanel de lá (Editor de Zona), com o valor que a Vercel mostra em Settings → Domains. Passo a passo: `docs/PUBLICAR-NA-VERCEL.md`, item 2. Enquanto isso o site funciona em `bcfichas.vercel.app`, mas a imagem de compartilhamento e o endereço indicado ao Google apontam para o oficial.
- [ ] **Imprimir uma ficha de teste** com um nome de 40 caracteres e um rodapé de duas linhas e comparar com a prévia do site (a prévia segue o código do sistema, mas não foi comparada com o papel).
- [ ] Testar num celular real: carrossel das fichas, escolha do modelo, formulário e abertura do WhatsApp.
- [ ] **Indexação no Google**, depois que o endereço oficial abrir: redirecionar o endereço provisório para o oficial, verificar o site no Google Search Console, enviar o `sitemap.xml` e pedir a indexação. Passo a passo: `docs/PUBLICAR-NA-VERCEL.md`, item 4. O que dependia do site já está feito (título, descrição, dados da empresa, sitemap com imagens).
- [ ] Com o endereço oficial no ar, enviar o link numa conversa de WhatsApp e ver se a imagem aparece.
- [ ] **Site da Balanças.com:** a seção do BC Fichas ainda diz "Locação por diária" e "Manual e bobinas inclusos", e os links apontam para `bcfichas.com.br` (fora do ar). Trocar o link para `https://bcfichas.balancass.com/` é o que mais ajuda o Google a achar o site novo; vale também alinhar os textos com o que foi confirmado aqui.

## 3. Depende de material novo

Itens da avaliação de 22/11 que não foram feitos porque precisam de material real. Nada disso foi simulado.

| Item | O que é preciso |
|---|---|
| **Fotos melhores da máquina** | Uma sessão simples com a máquina limpa e **ligada**, luz difusa e o mesmo enquadramento: três quartos com a tela legível e uma ficha ao lado; detalhe da impressão e das fichas. |
| **Vídeo curto de uma venda** | 15 a 25 segundos: tocar nos produtos, registrar o pagamento, retirar as fichas. Entra com imagem de capa, botão "Ver a máquina funcionando" e carregamento só quando a pessoa tocar. |
| **Uso em eventos** | Fotos de eventos atendidos (com autorização de imagem) e depoimentos reais, com nome e tipo de evento. |
| **Logotipo do próprio visitante na prévia** | A avaliação cita como opcional deixar o visitante pôr o próprio logotipo na prévia. Não foi feito; hoje a prévia mostra um logotipo de exemplo ("SEU LOGO"). |

## 4. Confirmado pelo responsável (já está no site)

| Assunto | Resposta | Onde aparece |
|---|---|---|
| Nome do serviço | "Locação" nos títulos, sem dizer "por diária" (decisão de 23/11; antes era "aluguel"). O verbo "alugar" continua nas frases ("Como alugar", "quem aluga") e "aluguel" aparece na descrição que o Google lê, para o site ser achado nas duas buscas. "Alocação" não foi usada: quer dizer outra coisa. | Título da página, abertura, dúvidas, rodapé e imagem de compartilhamento |
| Entrega e retirada | Depende do lugar; não entra no site | Só "consulte a disponibilidade", nas dúvidas |
| Bobinas | Consignadas: o cliente só paga as que usar | Abertura ("você paga só as que usar") e "O que está incluído?" |
| Treinamento | Há treinamento, e ele está incluído. O site não diz onde é dado (pedido de 23/11; antes dizia "na nossa empresa"). | Abertura ("Treinamento") e dúvidas "O que está incluído?" e "Quem opera as máquinas na festa?" |
| Quem opera | A equipe de quem aluga | Dúvidas |
| Suporte | No horário de funcionamento, pelo mesmo número | Dúvidas e contatos |
| Antecedência | Cardápio, preços, logotipo e rodapé com pelo menos uma semana | "Como alugar" e dúvidas |
| Internet | Só a maquininha de cartão depende de conexão | Seção da máquina e dúvidas |
| Endereço oficial | `bcfichas.balancass.com` | Endereço indicado ao Google, compartilhamento e sitemap |
| WhatsApp dos orçamentos | (19) 3023-9050 | Formulário e botões "Falar no WhatsApp" |
| Versão do sistema | As máquinas alugadas saem com a 3.11.7 | Textos sobre PIX, modelos de ficha, senha, estoque e devolução; regras da prévia das fichas |
| Maquininha de cartão | Por conta do cliente | "Como usar no evento" e dúvidas |
| Programação | O cliente envia e a máquina já vai pronta | "Como alugar", seção da máquina e dúvidas |
| Rodapé das fichas | É personalizável | Seção das fichas, orçamento e dúvidas |
| Textos retirados em 20/11 | Frase de apoio da abertura (ver item 5 acima), estimativa de público, "o teclado aparece na tela", aviso sobre as fotos e a dúvida sobre devolução de fichas | Não aparecem mais |
| Fotos retiradas em 20/11 | Impressora aberta e saída das fichas | Não aparecem mais |
| Contato direto | Falar no WhatsApp sem passar pelo formulário | Cabeçalho, abertura, barra do celular, menu e seção de orçamento |
| Imagens nos botões | A tela de venda aceita a imagem de cada produto, o que ajuda o operador a localizar o item (pedido de 23/11) | "Como usar no evento" (destaque abaixo dos passos e passo 1), seção da máquina e dúvidas |
| Botões de escolha do modelo | Alinhados (pedido de 23/11): foram para a linha do nome de cada modelo | Seção das fichas |
| Campos do teste das fichas | "Nome do evento" em cima e "Frase do rodapé" embaixo, como na ficha (sugestão do responsável, 23/11) | Seção das fichas |
| Tira de fichas do passo 3 | Mostrar inteira, sem corte, com as linhas retas e sem parecer dois modelos (pedidos de 23/11) | "Como usar no evento", passo "As fichas saem na hora": duas fichas iguais, sem inclinação |
| Retirado em 22/11 | Campo "Tipo de evento" do formulário e a linha de WhatsApp da lista de contatos (ficava repetida: já existe o botão "Falar no WhatsApp" logo acima; embaixo fica só o telefone) | Não aparecem mais |
| Logotipo | Manter o símbolo da ficha com o nome | Cabeçalho, rodapé e ícones |
| Horário e endereço | Os da Balanças.com valem | Seção de orçamento |

## 5. Tirado do código do sistema (não foi suposição)

A segunda avaliação pediu que a prévia das fichas fosse conferida com o sistema que imprime. As regras abaixo vieram do código do BC Fichas 3.11.7 (`Layout.cs`, `RenderizadorFicha.cs` e `Configuracao.cs`):

- nome do evento com até 40 caracteres, gravado em maiúsculas; rodapé com até 80, impresso como foi digitado, em até duas linhas;
- o nome ocupa uma linha nos modelos 1, 2, 3, 4 e 6 (o que não cabe é cortado com "…") e duas linhas nos modelos 5 e 7;
- logotipo nos modelos 1 a 5; o modelo 6 (compacto) não mostra a forma de pagamento;
- a linha "BC-FICHAS FONE: (19) 3023-9050" sai em todas as fichas.

## 6. Imagens

- **Tela montada nas fotos.** O visor estava desligado; a tela do sistema foi aplicada sobre a foto. O aviso que o site trazia sobre isso foi retirado a pedido do responsável. O ideal continua sendo fotografar a máquina **ligada**.
- **Limpeza das fotos.** A poeira e os risquinhos das chapas foram retirados no tratamento das imagens.
- **Fichas de exemplo:** os 7 modelos são desenhados com as medidas do sistema. No lugar do logotipo aparece o símbolo da BC Fichas em preto e branco, com "SEU LOGO" escrito, para dar uma ideia de como a ficha fica (pedido de 23/11). O espaço real do logotipo depende do formato da imagem enviada.

## 7. Ficou de fora de propósito

Sem informação confirmada, não entraram: preços, depoimentos, quantidade de clientes ou de eventos atendidos, fotos de eventos, prazos de reserva, entrega gratuita, operador incluso e atendimento 24 horas. Também não foram criados login, painel, pagamento on-line nem novas funções.

O site não conta visitas nem cliques (sem cookies e sem rastreadores) e não guarda o que é escrito no formulário: os dados só entram na mensagem que a própria pessoa envia. Se um dia houver contagem, vale separar "clicou no WhatsApp" de "mensagem enviada".
