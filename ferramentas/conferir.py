#!/usr/bin/env python3
"""Confere a pasta site/ antes de publicar.

  python3 ferramentas/conferir.py          # só confere
  python3 ferramentas/conferir.py --zip    # confere e gera site.zip (para cPanel, plano B)

Verifica: arquivos citados no HTML e no CSS que não existem, o número do
WhatsApp igual em todos os lugares, o vercel.json válido e o peso da página.
Só usa a biblioteca padrão do Python 3.
"""
from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = RAIZ / "site"
problemas: list[str] = []


def local(ref: str) -> bool:
    return not re.match(r"^(https?:|mailto:|tel:|data:|#|//)", ref)


def conferir_html(arq: Path) -> None:
    texto = arq.read_text(encoding="utf-8")
    refs = set(re.findall(r'(?:href|src)="([^"]+)"', texto))
    for conjunto in re.findall(r'(?:srcset|imagesrcset)="([^"]+)"', texto):
        refs.update(parte.strip().split()[0] for parte in conjunto.split(",") if parte.strip())
    for ref in sorted(refs):
        if not local(ref):
            continue
        caminho = ref.split("?")[0].split("#")[0]
        if not caminho or caminho == "/":
            continue
        alvo = (SITE / caminho.lstrip("/")) if caminho.startswith("/") else (arq.parent / caminho)
        if not alvo.exists():
            problemas.append(f"{arq.name}: não existe o arquivo {ref}")
    ancoras = set(re.findall(r'href="#([^"]+)"', texto))
    ids = set(re.findall(r'\sid="([^"]+)"', texto))
    for a in sorted(ancoras - ids):
        problemas.append(f"{arq.name}: o link #{a} não leva a nenhuma seção")
    for rep in sorted({i for i in ids if len(re.findall(rf'\sid="{re.escape(i)}"', texto)) > 1}):
        problemas.append(f'{arq.name}: id="{rep}" aparece mais de uma vez')


def conferir_css(arq: Path) -> None:
    texto = arq.read_text(encoding="utf-8")
    for ref in set(re.findall(r'url\(["\']?([^"\')]+)["\']?\)', texto)):
        if local(ref) and not (arq.parent / ref.split("?")[0]).resolve().exists():
            problemas.append(f"{arq.name}: não existe o arquivo {ref}")


def conferir_whatsapp() -> None:
    js = (SITE / "js" / "site.js").read_text(encoding="utf-8")
    m = re.search(r'whatsapp:\s*"(\d+)"', js)
    if not m:
        problemas.append("site.js: não achei o número do WhatsApp em CONTATO")
        return
    numero = m.group(1)
    for arq in SITE.glob("*.html"):
        for outro in set(re.findall(r"wa\.me/(\d+)", arq.read_text(encoding="utf-8"))) - {numero}:
            problemas.append(f"{arq.name}: link do WhatsApp com {outro}, mas o site.js usa {numero}")
    print(f"WhatsApp: {numero} em todos os links")


def conferir_vercel() -> None:
    cfg = json.loads((RAIZ / "vercel.json").read_text(encoding="utf-8"))
    pasta = cfg.get("outputDirectory")
    if pasta != "site":
        problemas.append(f'vercel.json: outputDirectory é "{pasta}", devia ser "site"')
    print("vercel.json: válido")


def pesos() -> None:
    total = sum(f.stat().st_size for f in SITE.rglob("*") if f.is_file())
    primeira = sum(
        (SITE / p).stat().st_size
        for p in ("index.html", "css/site.css", "js/site.js", "fonts/mona-sans-latin.woff2", "img/maquina/maquina-frente-800.webp")
    )
    print(f"Pasta site/: {total / 1024:.0f} KB · primeira tela (HTML+CSS+JS+fonte+foto): {primeira / 1024:.0f} KB")


def main() -> int:
    for arq in sorted(SITE.glob("*.html")):
        conferir_html(arq)
    for arq in sorted((SITE / "css").glob("*.css")):
        conferir_css(arq)
    conferir_whatsapp()
    conferir_vercel()
    pesos()
    if problemas:
        print("\nPROBLEMAS:")
        for p in problemas:
            print("  -", p)
        return 1
    print("Tudo certo.")
    if "--zip" in sys.argv:
        destino = RAIZ / "site.zip"
        with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            for f in sorted(SITE.rglob("*")):
                if f.is_file():
                    z.write(f, f.relative_to(SITE).as_posix())
            z.write(RAIZ / "hospedagem" / "cpanel" / ".htaccess", ".htaccess")
        print(f"Gerado {destino.name} ({destino.stat().st_size / 1024:.0f} KB), com o .htaccess do cPanel")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
