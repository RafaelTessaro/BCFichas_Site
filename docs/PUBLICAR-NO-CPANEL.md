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

**Já está pronto no site:** título e descrição com "locação" e "aluguel", o endereço oficial indicado ao Google, os dados da empresa (telefone, endereço, mapa e horário), o `sitemap.xml` com a página e as imagens principais, o `robots.txt` liberando tudo, imagens com descrição e página leve no celular.

**Depois que o endereço abrir:**

1. **Google Search Console** (`search.google.com/search-console`):
   - se o `balancass.com` já está lá como propriedade de **domínio**, o `bcfichas.balancass.com` já está incluído; pule para o envio do sitemap;
   - se não, **Adicionar propriedade → Prefixo do URL →** `https://bcfichas.balancass.com/`. Na verificação, o jeito mais simples com cPanel é **Arquivo HTML**: baixe o arquivo que o Google oferece, envie para a pasta do subdomínio pelo Gerenciador de arquivos e clique em **Verificar**. Não apague esse arquivo depois;
   - em **Sitemaps**, envie `sitemap.xml`;
   - em **Inspeção de URL**, cole `https://bcfichas.balancass.com/` e clique em **Solicitar indexação**.
2. **Link no site da Balanças.com.** É o que mais acelera: o Google já conhece o `balancass.com`, e um link de lá leva o robô até o site novo. Hoje a seção do BC Fichas de lá aponta para `bcfichas.com.br`, que está fora do ar; troque para `https://bcfichas.balancass.com/`.
3. **Perfil da Empresa no Google** (o cartão da Balanças.com no Google Maps), se houver: acrescente "Locação de máquinas de fichas" nos serviços, com o link do site.
4. (Opcional) **Bing Webmaster Tools** (`bing.com/webmasters`): dá para importar tudo do Search Console em um clique.

**Para conferir depois:**

- alguns dias depois, pesquise `site:bcfichas.balancass.com` no Google: a página deve aparecer;
- em `search.google.com/test/rich-results`, cole o endereço: os dados da empresa e do serviço devem aparecer sem erro.

A entrada no Google costuma levar de alguns dias a algumas semanas. A posição nas buscas depende da concorrência e do tempo de vida do site; não há como garantir primeiro lugar.

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
