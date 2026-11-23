using BCFichas.Core;
using BCFichas.Core.Impressao;
using Xunit;

namespace BCFichas.Tests.Core;

/// <summary>
/// Os 7 modelos de ficha desenhados pelo próprio programa, com os mesmos textos da prévia do site do BC Fichas,
/// para pôr lado a lado com a prévia e conferir medidas, quebras de linha e cortes.
/// </summary>
public class ModelosDoSiteTests
{
    [Fact]
    public void Gera_os_sete_modelos_para_comparar_com_a_previa_do_site()
    {
        var logoPng = Environment.GetEnvironmentVariable("LOGO_DO_SITE");
        Assert.True(File.Exists(logoPng), "Defina LOGO_DO_SITE com o caminho do logotipo de exemplo (PNG).");
        var pasta = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "saida", "modelos"));
        Directory.CreateDirectory(pasta);

        using var t = new SistemaTemporario();
        var config = t.Sistema.Config.Atual.Clonar();
        config.Logo = logoPng;
        using var logo = new LogoFicha(ImagemUtil.Carregar(logoPng!)!);
        var data = new DateTime(2026, 6, 13, 19, 30, 12);

        // (modelo, número no site, forma, caixa) — como nos exemplos da prévia do site
        (ModeloFicha Modelo, int N, FormaPagamento Forma, int Caixa)[] modelos =
        [
            (ModeloFicha.Classico1, 1, FormaPagamento.Dinheiro, 1),
            (ModeloFicha.Classico2, 2, FormaPagamento.Pix, 1),
            (ModeloFicha.Classico3, 3, FormaPagamento.Debito, 2),
            (ModeloFicha.Classico4, 4, FormaPagamento.Dinheiro, 1),
            (ModeloFicha.Completa, 5, FormaPagamento.Credito, 2),
            (ModeloFicha.Compacta, 6, FormaPagamento.Dinheiro, 1),
            (ModeloFicha.Destaque, 7, FormaPagamento.Pix, 1),
        ];
        (string Nome, string Evento, string Rodape, string Produto, long Preco)[] estados =
        [
            ("exemplo", "FESTA JUNINA", "OBRIGADO E VOLTE SEMPRE!", "PASTEL", 1000),
            ("longo", "FESTA BENEFICENTE SÃO JOÃO DA COMUNIDADE",
                "Obrigado pela presença! Sua participação ajuda os projetos da nossa comunidade.", "PASTEL", 1000),
            ("produto", "FESTA SÃO JOÃO 2027", "Deus abençoe! Até o ano que vem", "PÃO DE MEL", 800),
            ("refri", "QUERMESSE", "Volte sempre!", "REFRIGERANTE", 600),
        ];

        foreach (var (modelo, n, forma, caixa) in modelos)
        foreach (var (nome, evento, rodape, produto, preco) in estados)
        {
            config.Modelo = modelo;
            config.NomeEvento = evento;
            config.Rodape = rodape;
            config.NumeroCaixa = caixa;
            var ficha = new Ficha
            {
                NomeEvento = evento, Produto = produto, PrecoCentavos = preco, NumeroPedido = 9, Caixa = caixa,
                Data = data, Sequencia = 1, TotalFichas = 1, Rodape = rodape, Forma = forma,
            };
            using var desenho = RenderizadorFicha.Renderizar(ficha, config, logo);
            using var mono = ImagemUtil.Monocromatico(desenho);
            ImagemUtil.SalvarPng(mono, Path.Combine(pasta, $"m{n}-{nome}.png"));
        }
    }
}
