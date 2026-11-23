# Como colocar o site no ar (cPanel da HostGator)

O site fica hospedado na própria HostGator, no endereço **https://bcfichas.balancass.com**. Tudo o que vai para o servidor está num arquivo só, o **`site.zip`**: a página, as imagens, as letras e o arquivo de configuração (`.htaccess`).

Para gerar o `site.zip` de novo a qualquer momento:

```bash
python3 ferramentas/conferir.py --zip
```

## 1. Criar o subdomínio

1. Entre no **cPanel** da conta do `balancass.com`.
2. Na seção **Domínios**, abra **Domínios** e clique em **Criar um novo domínio**.
3. Em **Domínio**, escreva `bcfichas.balancass.com`.
4. **Desmarque** a caixa **"Compartilhar a raiz do documento (/home/…/public_html) com balancass.com"**. Com ela marcada, o endereço novo abriria o site da Balanças.
5. Deixe a **Raiz do documento** como o cPanel sugerir (normalmente `bcfichas.balancass.com`) e anote o nome dessa pasta.
6. Clique em **Enviar**.

> **Painel antigo, com o item "Subdomínios":** em **Subdomínio** escreva `bcfichas`, em **Domínio** escolha `balancass.com`, deixe a raiz do documento sugerida e clique em **Criar**.

Como o DNS do `balancass.com` já fica na HostGator, o cPanel cria sozinho o registro do endereço. Não é preciso mexer no Editor de Zona.

## 2. Esperar o cadeado (HTTPS)

1. No cPanel, seção **Segurança**, abra **Status de SSL/TLS**.
2. Procure `bcfichas.balancass.com` na lista. Cadeado verde: está pronto.
3. Se estiver vermelho ou sem cadeado, marque a caixinha dele e clique em **Executar AutoSSL**. Costuma levar de alguns minutos a uma ou duas horas.
4. Para conferir, abra `https://bcfichas.balancass.com` no navegador: deve aparecer o cadeado, mesmo com a página vazia.

Em 23/11/2026 o cadeado já estava valendo assim que o subdomínio foi criado: o servidor usa um certificado de `*.balancass.com`, que cobre o `bcfichas`. O aviso ⚠ na coluna "Forçar redirecionamento HTTPS" da lista de domínios pode ser ignorado, e a chave pode ficar desligada: o redirecionamento é feito pelo `.htaccess` do site.

**Só passe para o item 3 com o cadeado ativo.** O site manda todo mundo para o endereço com `https`; sem cadeado, ele não abre.

## 3. Enviar o site

1. No cPanel, seção **Arquivos**, abra o **Gerenciador de arquivos**.
2. Entre na pasta do subdomínio (a raiz do documento anotada no item 1).
3. Clique em **Configurações**, no canto de cima à direita, marque **Mostrar arquivos ocultos (dotfiles)** e salve. Sem isso o arquivo `.htaccess` não aparece.
4. Clique em **Carregar**, escolha o `site.zip` e espere chegar a 100%. Volte para a pasta.
5. Clique no `site.zip` com o botão direito e escolha **Extrair** (*Extract*). Confirme a pasta e clique em **Extrair arquivos**.
6. Confira se ficaram **direto na pasta do subdomínio**: `index.html`, `404.html`, `.htaccess`, `robots.txt`, `sitemap.xml` e as pastas `css`, `js`, `img` e `fonts`. Se tudo tiver ido parar dentro de uma subpasta, mova para a pasta do subdomínio.
7. Apague o `site.zip` do servidor.

## 4. Testar

- [ ] `https://bcfichas.balancass.com` abre com cadeado.
- [ ] `http://bcfichas.balancass.com` (sem o "s") vai sozinho para o endereço com cadeado.
- [ ] No **celular**: **Solicitar orçamento** leva ao formulário e **Falar no WhatsApp** abre a conversa com a mensagem pronta.
- [ ] No formulário, preencha e toque em **Enviar pelo WhatsApp**: a mensagem chega com os campos.
- [ ] Na seção das fichas, escreva o nome de um evento e escolha um modelo: as fichas mudam.
- [ ] Toque no endereço: abre o Google Maps no lugar certo.
- [ ] Um endereço que não existe (ex.: `/teste`) mostra a página **"Esta página não existe"**.
- [ ] Mande o link do site para alguém no WhatsApp: aparece a imagem com a máquina.

## 5. Apagar o projeto na Vercel

Só depois de o item 4 estar todo conferido. Enquanto o endereço oficial não abrir, `bcfichas.vercel.app` é o único lugar onde o site está no ar.

## 6. Aparecer no Google (indexação)

**Já está pronto nos dois sites:** `sitemap.xml`, `robots.txt` liberando as páginas, título e descrição, endereço oficial indicado ao Google e, no BC Fichas, os dados da empresa (telefone, endereço, mapa e horário). Falta só **avisar o Google que os sites são seus**. Isso se faz uma vez, no **Google Search Console**, e serve para o `balancass.com` e para o `bcfichas.balancass.com` ao mesmo tempo.

### 6.1. Criar a propriedade no Search Console

1. Abra `search.google.com/search-console` e entre com uma conta do Google da empresa (a mesma do Perfil da Empresa, se houver).
2. Clique em **Adicionar propriedade**. Aparecem dois quadros: escolha o da esquerda, **Domínio**.
3. Escreva `balancass.com` (sem `https://` e sem `www`) e clique em **Continuar**.
4. O Google mostra um **registro TXT**, um texto que começa com `google-site-verification=`. Clique em **Copiar** e deixe essa tela aberta.

### 6.2. Colar o registro no cPanel

1. No cPanel, seção **Domínios**, abra **Zone Editor** (Editor de Zona).
2. Na linha do `balancass.com`, clique em **Gerenciar**.
3. Clique na seta ao lado de **Adicionar registro** e escolha **Adicionar registro "TXT"**.
4. Preencha:
   - **Nome:** `balancass.com.` (com o ponto no fim; se o cPanel completar sozinho, deixe)
   - **TTL:** deixe o que vier
   - **Tipo:** TXT
   - **Registro:** cole o texto copiado do Google
5. Clique em **Salvar registro**.

> **Atenção:** é para **adicionar** um registro novo. Já existe um registro TXT no domínio que começa com `v=spf1`: ele cuida do e-mail da empresa. **Não edite nem apague esse.**

### 6.3. Verificar

1. Volte à tela do Search Console e clique em **Verificar**.
2. Se aparecer que não encontrou o registro, espere de 10 minutos a algumas horas e clique de novo. O registro pode demorar para se espalhar.

Com a propriedade de domínio verificada, o Google passa a mostrar os dados do `balancass.com`, do `bcfichas.balancass.com` e de qualquer outro endereço do domínio.

### 6.4. Enviar os sitemaps

1. No menu da esquerda do Search Console, abra **Sitemaps**.
2. Em **Adicionar um novo sitemap**, escreva o endereço inteiro e clique em **Enviar**, um de cada vez:
   - `https://balancass.com/sitemap.xml`
   - `https://bcfichas.balancass.com/sitemap.xml`
3. Na lista abaixo, a situação deve passar para **Processado** (pode levar algumas horas).

### 6.5. Pedir a indexação

1. Na barra de cima do Search Console (**Inspecionar qualquer URL**), cole `https://bcfichas.balancass.com/` e aperte Enter.
2. Clique em **Solicitar indexação** e espere a confirmação (um ou dois minutos).
3. Repita com `https://balancass.com/`. Se o Google disser que a página já está indexada, não precisa pedir de novo.

### 6.6. O que mais ajuda

1. **Link no site da Balanças.com.** O Google já conhece o `balancass.com`, e um link de lá leva o robô até o site novo. A troca está preparada no projeto da Balanças (`atualizacao.zip`): a seção BC Fichas passa a apontar para `https://bcfichas.balancass.com/`.
2. **Perfil da Empresa no Google** (o cartão da Balanças.com no Google Maps), se houver: acrescente "Locação de máquinas de fichas" nos serviços, com o link do site.
3. (Opcional) **Bing Webmaster Tools** (`bing.com/webmasters`): dá para importar tudo do Search Console em um clique.

### 6.7. Acompanhar

- Alguns dias depois, pesquise `site:bcfichas.balancass.com` no Google: a página deve aparecer.
- No Search Console, o relatório **Páginas** (em Indexação) mostra o que entrou e o que ficou de fora, com o motivo.
- Em `search.google.com/test/rich-results`, cole o endereço do BC Fichas: os dados da empresa e do serviço devem aparecer sem erro.

A entrada no Google costuma levar de alguns dias a algumas semanas. A posição nas buscas depende da concorrência e do tempo de vida do site; não há como garantir primeiro lugar.

> **Se não quiser mexer no DNS:** dá para verificar cada site separadamente. Em **Adicionar propriedade**, escolha **Prefixo do URL**, escreva o endereço completo (`https://bcfichas.balancass.com/`) e, na verificação, use **Arquivo HTML**: baixe o arquivo que o Google oferece e envie para a pasta do site pelo Gerenciador de arquivos. Repita para `https://balancass.com/`. Não apague esses arquivos depois.

## 7. Atualizar o site depois

Na HostGator a atualização é manual: a cada mudança, um `site.zip` novo.

1. Gere o `site.zip` (comando no começo deste guia).
2. No Gerenciador de arquivos, entre na pasta do subdomínio, **carregue** o `site.zip` novo e **extraia** por cima dos arquivos antigos.
3. Apague o `site.zip` do servidor.
4. Abra o site e recarregue a página (no computador, `Ctrl + F5`).

Se uma atualização **retirar** arquivos (uma foto que deixou de ser usada, por exemplo), eles continuam no servidor sem atrapalhar. Para limpar, apague as pastas `css`, `js`, `img` e `fonts` antes de extrair o pacote novo.

**Cache.** O navegador do visitante guarda as fotos por 30 dias e o CSS e o JavaScript por um dia. Por isso, ao trocar uma foto mantendo o mesmo nome de arquivo, aumente o número depois de `?v=` no `index.html`; o mesmo vale para `site.css` e `site.js`.

## Se algo der errado

| O que aparece | Causa provável | O que fazer |
|---|---|---|
| Erro "You must specify a subdomain" ao criar o domínio | A tela **Criar um novo domínio** não mostra o campo "Subdomain" depois de desmarcar a caixa (aconteceu em 23/11/2026) | Crie pela tela **Subdomínios** (subdomínio `bcfichas`, domínio `balancass.com`), ou peça ao suporte da HostGator. Não marque a caixa "Share document root" para contornar |
| O endereço abre o site da Balanças | A caixa "Compartilhar a raiz do documento" ficou marcada | Apague o subdomínio em **Domínios** e crie de novo, com a caixa desmarcada |
| "Sua conexão não é particular" ou o site não abre depois de extrair | O cadeado ainda não estava ativo | Rode o AutoSSL (item 2) e espere. Para ver o site enquanto isso, renomeie o `.htaccess` para `htaccess.txt` e volte ao nome original quando o cadeado ativar |
| Página sem cores, só texto | Os arquivos foram para dentro de uma subpasta | Mova tudo para a pasta do subdomínio (item 3, passo 6) |
| "500 Internal Server Error" | Alguma regra do `.htaccess` não é aceita pela hospedagem | Renomeie o `.htaccess` para `htaccess.txt` (o site volta a abrir) e avise, informando a mensagem de erro |
| Continua aparecendo a versão antiga | Cache do navegador | Recarregue com `Ctrl + F5` ou abra numa janela anônima |

## O que foi testado antes de enviar

O `site.zip` foi extraído num servidor Apache 2.4 de teste, com o `.htaccess` valendo como na hospedagem (23/11/2026):

- o endereço sem `https` e qualquer outro nome de servidor vão para `https://bcfichas.balancass.com`;
- a validação do cadeado (pasta `.well-known`) não é redirecionada;
- a página, o CSS, o JavaScript, o sitemap e os ícones saem comprimidos (a página cai de 58 KB para 13 KB);
- um endereço que não existe devolve a página "Esta página não existe", com o código 404;
- letras guardadas por um ano, fotos por um mês, CSS e JavaScript por um dia, e a página nunca fica guardada;
- o `.htaccess` não pode ser lido de fora e as pastas não mostram a lista de arquivos;
- os arquivos servidos são idênticos aos do projeto, e o site abriu num navegador com as letras, as 7 imagens visíveis, as fichas e o formulário funcionando.

Em 23/11/2026 o pacote foi enviado para a HostGator e o site passou a abrir em `https://bcfichas.balancass.com`; o que foi conferido no ar está em `docs/TESTES.md`, seção "Publicação".
