# Como colocar o site no ar (Vercel)

> **Alternativa.** Em 23/11/2026 o responsável decidiu hospedar o site na HostGator e apagar o projeto da Vercel. O guia em uso é o [`PUBLICAR-NO-CPANEL.md`](PUBLICAR-NO-CPANEL.md); este fica guardado para o caso de a Vercel voltar a ser usada.

O projeto já está preparado: o arquivo `vercel.json` diz à Vercel que o site é a pasta `site/`, sem etapa de montagem. Você só importa o repositório e aponta o endereço.

## 1. Publicar

1. Entre em **vercel.com** com a sua conta do GitHub.
2. **Add New… → Project**.
3. Em **Import Git Repository**, escolha **BCFichas_Site** (se não aparecer, clique em *Adjust GitHub App Permissions* e libere esse repositório).
4. Na tela de configuração **não mude nada**: o *Framework Preset* fica em **Other** e o *Root Directory* fica como está.
5. **Deploy**.

Em menos de um minuto a Vercel mostra um endereço provisório (`algum-nome.vercel.app`). Abra e confira o site.

> **Abriu "404: NOT_FOUND"?** Vá em **Settings → Build and Deployment → Root Directory**, escreva `site`, salve e faça **Redeploy** em *Deployments*.

**Qual versão vai para o ar.** A Vercel publica o ramo `main`; se ele não existir, o `master`; se não, o ramo padrão do repositório. Hoje o site está no ramo `claude/loving-feynman-pulfbk`. Para conferir ou trocar: **Settings → Environments → Production → Branch Tracking**.

## 2. Ligar o endereço bcfichas.balancass.com

1. Na Vercel: **Settings → Domains → Add Domain** → digite `bcfichas.balancass.com` → **Add**.
2. A Vercel mostra o registro a criar: tipo **CNAME**, nome `bcfichas` e um **valor próprio do seu projeto** (parecido com `abc123.vercel-dns-017.com`). Copie o valor de lá.
3. No **cPanel** da HostGator (é onde fica o DNS do `balancass.com`): **Zone Editor → balancass.com → Gerenciar → Adicionar registro**:
   - **Tipo:** CNAME
   - **Nome:** `bcfichas.balancass.com.` (o cPanel completa com o ponto no fim)
   - **Registro:** o valor copiado da Vercel
4. Volte à Vercel e espere o aviso **Valid Configuration**. Pode levar de minutos a algumas horas. O cadeado (HTTPS) é criado sozinho.

> **Já tinha criado o subdomínio no cPanel?** Então existe um registro tipo **A** com o nome `bcfichas`, e ele não pode conviver com o CNAME. Apague o subdomínio em **Domínios** (ou só o registro A no **Zone Editor**) e depois crie o CNAME. O site do `balancass.com` não é afetado.

Se o DNS do domínio não estiver na HostGator (Cloudflare, Registro.br), o registro CNAME é criado lá, com o mesmo nome e valor.

## 3. Testes depois de publicar

- [ ] `https://bcfichas.balancass.com` abre com cadeado.
- [ ] No **celular**: o botão **Solicitar orçamento** abre o WhatsApp com a mensagem pronta. Teste num aparelho que não tenha o número salvo.
- [ ] No formulário do fim da página, preencha e toque em **Enviar pelo WhatsApp**: a mensagem chega com os campos.
- [ ] Na seção das fichas, escreva o nome de um evento: as fichas mudam.
- [ ] Um endereço que não existe (ex.: `/teste`) mostra a página **"Esta página não existe"**.
- [ ] Mande o link do site para alguém no WhatsApp: aparece a imagem com a máquina e o título.
- [ ] Siga o item 4, abaixo, para o site aparecer no Google.

## 4. Aparecer no Google (indexação)

**O que já está pronto no site:** título e descrição com "locação" e "aluguel" (as duas buscas), o endereço oficial indicado ao Google, os dados da empresa (telefone, endereço e horário) em formato que o Google lê, o `sitemap.xml` com a página e as imagens principais, o `robots.txt` liberando tudo, imagens com descrição e página leve no celular.

**O que só dá para fazer depois que `bcfichas.balancass.com` abrir** (depende das suas contas):

1. **Mandar o endereço provisório para o oficial.** Enquanto os dois abrirem o mesmo site, o Google pode ficar em dúvida sobre qual mostrar. Com o oficial funcionando, `bcfichas.vercel.app` deve redirecionar para ele. Há dois jeitos: avisar para ativarmos o redirecionamento no `vercel.json`, ou, na Vercel, **Settings → Domains → Edit** em `bcfichas.vercel.app` → **Redirect to** `bcfichas.balancass.com`. Não faça isso antes de o oficial abrir, senão o site sai do ar.
2. **Google Search Console** (`search.google.com/search-console`):
   - se o `balancass.com` já está lá como propriedade de **domínio**, o `bcfichas.balancass.com` já está incluído; pule para o envio do sitemap;
   - se não, **Adicionar propriedade → Prefixo do URL →** `https://bcfichas.balancass.com/`. Na verificação, escolha **Tag HTML**: o Google mostra uma linha `<meta name="google-site-verification" ...>`. Envie essa linha para ser colocada no site (ou cole no `<head>` do `site/index.html`) e clique em **Verificar**;
   - em **Sitemaps**, envie `sitemap.xml`;
   - em **Inspeção de URL**, cole `https://bcfichas.balancass.com/` e clique em **Solicitar indexação**.
3. **Link no site da Balanças.com.** É o que mais acelera: o Google já conhece o `balancass.com`, e um link de lá leva o robô até o site novo. Hoje a seção do BC Fichas de lá aponta para `bcfichas.com.br`, que está fora do ar; troque para `https://bcfichas.balancass.com/`.
4. **Perfil da Empresa no Google** (o cartão da Balanças.com no Google Maps), se houver: acrescente "Locação de máquinas de fichas" nos serviços, com o link do site.
5. (Opcional) **Bing Webmaster Tools** (`bing.com/webmasters`): dá para importar tudo do Search Console em um clique.

**Para conferir depois:**

- alguns dias depois, pesquise `site:bcfichas.balancass.com` no Google: a página deve aparecer;
- em `search.google.com/test/rich-results`, cole o endereço: os dados da empresa e do serviço devem aparecer sem erro;
- mande o link numa conversa de WhatsApp: aparece a imagem com a máquina e "Locação para festas juninas, quermesses e eventos".

A entrada no Google costuma levar de alguns dias a algumas semanas. A posição nas buscas depende da concorrência e do tempo de vida do site; não há como garantir primeiro lugar.

## 5. Atualizar o site

Toda mudança enviada ao GitHub no ramo de produção vai para o ar sozinha, em cerca de um minuto. Mudanças em outros ramos ganham um endereço de prévia, sem mexer no site publicado.

Antes de enviar, rode:

```bash
python3 ferramentas/conferir.py
```

**Cache.** As fotos ficam guardadas no navegador do visitante por 30 dias. Se trocar uma foto mantendo o mesmo nome de arquivo, mude o nome (ou acrescente `?v=2` no `index.html`). O mesmo vale para `site.css` e `site.js`: aumente o número que vem depois de `?v=`.

## Plano B: cPanel

O site também funciona em hospedagem comum. Gere o pacote e envie para a pasta do subdomínio:

```bash
python3 ferramentas/conferir.py --zip
```

O `site.zip` sai com o `.htaccess` de `hospedagem/cpanel/` dentro. Extraia na pasta do subdomínio **depois** de o cadeado (AutoSSL) estar ativo, porque o `.htaccess` manda tudo para `https://bcfichas.balancass.com`.
