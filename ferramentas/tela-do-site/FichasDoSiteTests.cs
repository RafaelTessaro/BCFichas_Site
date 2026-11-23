using BCFichas.Core;
using BCFichas.Core.Impressao;
using Xunit;

namespace BCFichas.Tests.Core;

/// <summary>
/// Fichas de amostra para os sites: o próprio programa desenha a ficha, do jeito que ela vai para a impressora
/// (mesmo caminho de "Gera_amostras_das_fichas_e_do_fechamento"). O logotipo vem do arquivo indicado em LOGO_DO_SITE.
/// </summary>
public class FichasDoSiteTests
{
    [Fact]
    public void Gera_fichas_para_o_site()
    {
        var logoPng = Environment.GetEnvironmentVariable("LOGO_DO_SITE");
        Assert.True(File.Exists(logoPng), "Defina LOGO_DO_SITE com o caminho do logotipo de exemplo (PNG).");
        var pasta = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "saida", "site"));
        Directory.CreateDirectory(pasta);

        using var t = new SistemaTemporario();
        var config = t.Sistema.Config.Atual.Clonar();
        config.NomeEvento = "FESTA JUNINA";
        config.Rodape = "OBRIGADO E VOLTE SEMPRE!";
        config.Modelo = ModeloFicha.Classico1;
        config.Logo = logoPng;
        using var logo = new LogoFicha(ImagemUtil.Carregar(logoPng!)!);

        void Salvar(Ficha f, string nome)
        {
            using var desenho = RenderizadorFicha.Renderizar(f, config, logo);
            using var mono = ImagemUtil.Monocromatico(desenho);
            ImagemUtil.SalvarPng(mono, Path.Combine(pasta, nome));
        }

        var data = new DateTime(2026, 6, 13, 19, 30, 12);
        Salvar(new Ficha
        {
            NomeEvento = config.NomeEvento, Produto = "PASTEL", PrecoCentavos = 1000, NumeroPedido = 9, Caixa = 1,
            Data = data, Sequencia = 1, TotalFichas = 2, Rodape = config.Rodape, Forma = FormaPagamento.Dinheiro,
        }, "ficha-pastel.png");
        Salvar(new Ficha
        {
            NomeEvento = config.NomeEvento, Produto = "REFRIGERANTE", PrecoCentavos = 600, NumeroPedido = 9, Caixa = 1,
            Data = data, Sequencia = 2, TotalFichas = 2, Rodape = config.Rodape, Forma = FormaPagamento.Dinheiro,
        }, "ficha-refrigerante.png");
    }
}
