using Avalonia.Headless.XUnit;
using BCFichas.Core;
using Xunit;

namespace BCFichas.Tests.Ui;

/// <summary>
/// Tela de venda para o site: cardápio genérico de 12 produtos (sem marcas), cada botão com a sua imagem.
/// Usa o mesmo caminho do teste "Catalogo_padrao_com_fotos_em_tela_de_960x600": o programa de verdade desenha a tela.
/// </summary>
public class TelasDoSiteTests
{
    private static readonly (string Antigo, string Nome, long Preco, string Cor, string Emoji)[] Itens =
    [
        ("PASTEL", "SALGADOS", 1000, "#E8590C", "🥟"),
        ("MASSINHA", "MASSAS", 1000, "#C92A2A", "🍝"),
        ("BATATA PORÇÃO", "BATATA FRITA", 2000, "#F08C00", "🍟"),
        ("ENROLADINHO PORÇÃO", "CACHORRO-QUENTE", 1000, "#D9480F", "🌭"),
        ("PÃO DE MEL", "ESPETINHO", 1200, "#A0522D", "🍢"),
        ("HEINEKEN", "PIZZA", 800, "#A61E4D", "🍕"),
        ("ORIGINAL", "PIPOCA", 800, "#E8B200", "🍿"),
        ("BRAHMA", "DOCES", 800, "#C2255C", "🍬"),
        ("IMPÉRIO", "CERVEJA", 1000, "#2B8A3E", "🍺"),
        ("REFRIGERANTE", "REFRIGERANTE", 600, "#1971C2", "🥤"),
        ("ÁGUA", "ÁGUA", 400, "#1098AD", "💧"),
        ("SUCO", "SUCO", 600, "#7C3AED", "🧃"),
    ];

    [AvaloniaTheory]
    [InlineData(1024, 600)]
    [InlineData(960, 600)]
    public void Venda_com_imagens_e_produtos_genericos(int largura, int altura)
    {
        using var t = new TelaDeTeste(largura, altura, catalogoPadrao: true);
        foreach (var produto in t.Sistema.Catalogo.Produtos())
        {
            var item = Itens.First(i => i.Antigo == produto.Nome);
            var origem = Path.Combine(t.Sistema.PastaDados, produto.Id + "-origem.png");
            using (var bmp = new SkiaSharp.SKBitmap(256, 256))
            using (var c = new SkiaSharp.SKCanvas(bmp))
            using (var p = new SkiaSharp.SKPaint
                   {
                       Typeface = SkiaSharp.SKTypeface.FromFamilyName("Noto Color Emoji"), TextSize = 190,
                       IsAntialias = true,
                   })
            {
                c.Clear(SkiaSharp.SKColors.Transparent);
                c.DrawText(item.Emoji, 18, 205, p);
                BCFichas.Core.Impressao.ImagemUtil.SalvarPng(bmp, origem);
            }
            var arquivo = BCFichas.Core.Impressao.ImagemUtil.Importar(origem,
                Path.Combine(t.Sistema.PastaImagens, "produtos"), "", 256);
            produto.Nome = item.Nome;
            produto.PrecoCentavos = item.Preco;
            produto.Cor = item.Cor;
            produto.Imagem = Path.Combine("imagens", "produtos", arquivo);
            t.Sistema.Catalogo.SalvarProduto(produto, 12);
        }
        TelaDeTeste.Atualizar();
        t.AbrirCaixa();

        Assert.Equal(12, t.Venda.Botoes.Count(b => !b.Vazio));
        Assert.All(t.Venda.Botoes, b => Assert.True(b.TemImagem));
        Assert.Equal(Itens.Select(i => i.Nome), t.Venda.Botoes.Where(b => !b.Vazio).Select(b => b.Nome));
        t.Tocar("SALGADOS");
        t.Tocar("REFRIGERANTE");
        t.Tocar("REFRIGERANTE");
        t.Foto($"site-venda-imagens-{largura}x{altura}");
    }
}
