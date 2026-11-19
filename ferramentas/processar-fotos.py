#!/usr/bin/env python3
"""Gera as imagens da máquina usadas no site a partir das fotos originais.

O que faz, para cada foto configurada em FOTOS:
  1. recorta a máquina do fundo (usa a máscara de materiais/recortes/);
  2. tira o cabo de energia e o que sobrou do fundo (áreas em "excluir");
  3. apaga a etiqueta "CAIXA 2" e os dois furinhos ao lado dela ("retoques");
  4. monta a tela real do sistema no visor, em perspectiva ("tela");
  5. põe uma sombra suave embaixo;
  6. grava em WebP com fundo transparente, em mais de uma largura.

Uso:
    pip install pillow numpy opencv-python-headless
    python3 ferramentas/processar-fotos.py

As máscaras foram geradas uma vez com o rembg (modelo birefnet-general-lite):
    pip install rembg onnxruntime
    rembg i -m birefnet-general-lite -om foto.jpg foto-mascara.png
"""
from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGINAIS = RAIZ / "materiais" / "fotos-originais"
MASCARAS = RAIZ / "materiais" / "recortes"
TELAS = RAIZ / "materiais" / "telas-do-sistema"
SAIDA = RAIZ / "site" / "img" / "maquina"

TELA_VENDA = "13-venda-1024x600.png"

# quad = cantos do vidro do visor na foto original: sup-esq, sup-dir, inf-dir, inf-esq
FOTOS = {
    "maquina-frente": {
        "foto": "foto-06.jpg",
        "excluir": [[(1332, 530), (1600, 530), (1600, 720), (1296, 720)]],
        "retoques": {
            "ref": (1040, 296, 1104, 340),
            "poligonos": [[(912, 300), (930, 271), (1031, 298), (1014, 342), (990, 346), (925, 346)]],
            "circulos": [(892, 289, 7), (1121, 347, 6), (1137, 372, 9)],
        },
        "tela": {"quad": [(772, 311), (1139, 459), (962, 785), (654, 549)], "vidro": 0.34, "reflexo": 0.30},
        "larguras": [1200, 800, 520],
    },
    "maquina-cima": {
        "foto": "foto-02.jpg",
        "excluir": [[(455, 90), (585, 90), (585, 153), (455, 153)]],
        "retoques": {
            "ref": (1120, 262, 1200, 312),
            "poligonos": [[(998, 272), (1107, 267), (1107, 302), (999, 307)]],
            "circulos": [(965, 299, 8), (1222, 292, 8)],
        },
        "tela": {"quad": [(812, 351), (1251, 340), (1215, 590), (816, 604)], "vidro": 0.22, "reflexo": 0.10},
        "larguras": [1200, 800, 520],
    },
    "maquina-impressora": {
        "foto": "foto-09.jpg",
        "excluir": [[(1215, 180), (1600, 180), (1600, 440), (1358, 440)]],
        "retoques": {
            "ref": (1078, 212, 1124, 256),
            "poligonos": [[(992, 269), (1060, 226), (1073, 251), (1005, 296)]],
            "circulos": [(977, 307, 7), (1140, 206, 7)],
        },
        "tela": {"quad": [(885, 421), (1161, 240), (1245, 461), (996, 659)], "vidro": 0.10, "reflexo": 0.07},
        "larguras": [1100, 760, 480],
    },
}

SUPER = 4  # superamostragem da montagem (bordas lisas)


def carregar(nome_foto: str) -> tuple[np.ndarray, np.ndarray]:
    foto = np.asarray(Image.open(ORIGINAIS / nome_foto).convert("RGB"), dtype=np.float32) / 255.0
    masc = np.asarray(
        Image.open(MASCARAS / nome_foto.replace(".jpg", "-mascara.png")).convert("L"), dtype=np.float32
    ) / 255.0
    return foto, masc


def limpar_mascara(masc: np.ndarray, excluir: list) -> np.ndarray:
    """Tira as áreas marcadas, fica só com o maior bloco e alisa a borda."""
    m = masc.copy()
    for poligono in excluir:
        cv2.fillPoly(m, [np.array(poligono, dtype=np.int32)], 0.0)
    binaria = (m > 0.5).astype(np.uint8)
    n, rotulos, estat, _ = cv2.connectedComponentsWithStats(binaria, connectivity=8)
    if n > 2:
        maior = 1 + int(np.argmax(estat[1:, cv2.CC_STAT_AREA]))
        m = np.where(rotulos == maior, m, 0.0)
    # fecha os furos internos (visor, etiquetas): preenche a partir do contorno externo
    binaria = (m > 0.5).astype(np.uint8)
    contornos, _ = cv2.findContours(binaria, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cheio = np.zeros_like(binaria)
    cv2.drawContours(cheio, contornos, -1, 1, thickness=cv2.FILLED)
    m = np.maximum(m, cheio.astype(np.float32) * (m > 0.02))
    m = np.where(cheio > 0, np.maximum(m, cv2.erode(cheio, np.ones((5, 5), np.uint8)).astype(np.float32)), m)
    # encolhe 1 px e suaviza: tira o halo claro da mesa na borda
    m = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    m = cv2.GaussianBlur(m, (0, 0), 0.7)
    return np.clip(m, 0.0, 1.0)


def retocar(foto: np.ndarray, cfg: dict) -> np.ndarray:
    """Apaga etiquetas e furinhos: preenche com o tom em volta e devolve a textura da pintura."""
    h, w = foto.shape[:2]
    m = np.zeros((h, w), np.uint8)
    for poligono in cfg.get("poligonos", []):
        cv2.fillPoly(m, [np.array(poligono, dtype=np.int32)], 255)
    for x, y, r in cfg.get("circulos", []):
        cv2.circle(m, (x, y), r, 255, -1)
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))

    # tom médio da chapa em volta (média só do que está fora da área apagada), do perto para o longe
    fora = 1.0 - m.astype(np.float32) / 255.0
    liso = foto.copy()
    falta = m > 0
    for sigma in (7, 14, 28, 56):
        peso = cv2.GaussianBlur(fora, (0, 0), sigma)
        media = cv2.GaussianBlur(foto * fora[..., None], (0, 0), sigma) / np.maximum(peso, 1e-4)[..., None]
        usar = falta & (peso > 0.10)
        liso[usar] = media[usar]
        falta &= ~usar
    liso = np.where(m[..., None] > 0, cv2.GaussianBlur(liso, (0, 0), 3.0), liso)

    # textura: o que sobra de um pedaço limpo da mesma chapa quando se tira o tom médio
    x0, y0, x1, y1 = cfg["ref"]
    ref = foto[y0:y1, x0:x1]
    grao = ref - cv2.GaussianBlur(ref, (0, 0), 2.2)
    bloco = np.vstack([np.hstack([grao, grao[:, ::-1]]), np.hstack([grao[::-1], grao[::-1, ::-1]])])
    ys, xs = np.where(m > 0)
    by0, by1, bx0, bx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rep_y = (by1 - by0) // bloco.shape[0] + 1
    rep_x = (bx1 - bx0) // bloco.shape[1] + 1
    textura = np.tile(bloco, (rep_y, rep_x, 1))[: by1 - by0, : bx1 - bx0]

    suave = cv2.GaussianBlur(m.astype(np.float32) / 255.0, (0, 0), 1.6)[..., None]
    novo = liso.copy()
    novo[by0:by1, bx0:bx1] += textura * cfg.get("grao", 1.0)
    return np.clip(foto * (1 - suave) + novo * suave, 0.0, 1.0)


def montar_tela(foto: np.ndarray, cfg: dict) -> np.ndarray:
    """Põe a tela do sistema dentro do vidro do visor, em perspectiva."""
    quad = np.array(cfg["quad"], dtype=np.float32)
    recuo_x, recuo_y = cfg.get("recuo", (0.040, 0.055))
    tela = np.asarray(Image.open(TELAS / cfg.get("arquivo", TELA_VENDA)).convert("RGB"), dtype=np.float32) / 255.0
    th, tw = tela.shape[:2]

    x0, y0 = np.floor(quad.min(axis=0)).astype(int) - 8
    x1, y1 = np.ceil(quad.max(axis=0)).astype(int) + 8
    rw, rh = int(x1 - x0), int(y1 - y0)
    destino = (quad - np.array([x0, y0], dtype=np.float32)) * SUPER

    unidade = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], dtype=np.float32)
    h_vidro = cv2.getPerspectiveTransform(unidade, destino)
    interno = np.array(
        [[recuo_x, recuo_y], [1 - recuo_x, recuo_y], [1 - recuo_x, 1 - recuo_y], [recuo_x, 1 - recuo_y]],
        dtype=np.float32,
    )
    interno_dst = cv2.perspectiveTransform(interno[None], h_vidro)[0]
    origem = np.array([[0, 0], [tw, 0], [tw, th], [0, th]], dtype=np.float32)
    h_tela = cv2.getPerspectiveTransform(origem, interno_dst)

    tam = (rw * SUPER, rh * SUPER)
    conteudo = cv2.warpPerspective(tela, h_tela, tam, flags=cv2.INTER_LINEAR)
    alfa_c = cv2.warpPerspective(np.ones((th, tw), np.float32), h_tela, tam, flags=cv2.INTER_LINEAR)
    alfa_v = np.zeros((tam[1], tam[0]), np.float32)
    cv2.fillPoly(alfa_v, [destino.astype(np.int32)], 1.0, lineType=cv2.LINE_AA)

    reduzir = lambda a: cv2.resize(a, (rw, rh), interpolation=cv2.INTER_AREA)
    conteudo, alfa_c, alfa_v = reduzir(conteudo), reduzir(alfa_c)[..., None], reduzir(alfa_v)[..., None]

    saida = foto.copy()
    base = saida[y0:y1, x0:x1]
    # vidro: escurece o que estava refletido (fica só um resto do reflexo, como numa tela ligada)
    vidro = base * cfg.get("vidro", 0.3)
    base = base * (1 - alfa_v) + vidro * alfa_v
    # tela ligada: um pouco menos de contraste que a captura e o reflexo por cima
    lcd = conteudo * 0.90 + 0.035
    reflexo = saida[y0:y1, x0:x1] * cfg.get("reflexo", 0.2)
    lcd = 1.0 - (1.0 - lcd) * (1.0 - reflexo)
    base = base * (1 - alfa_c) + lcd * alfa_c
    saida[y0:y1, x0:x1] = base
    return saida


def com_sombra(rgb: np.ndarray, alfa: np.ndarray, margem: int = 90) -> np.ndarray:
    """Devolve RGBA (0..1) recortado, com uma sombra de contato embaixo da máquina."""
    ys, xs = np.where(alfa > 0.02)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb, alfa = rgb[y0:y1, x0:x1], alfa[y0:y1, x0:x1]
    h, w = alfa.shape
    tela_a = np.zeros((h + 2 * margem, w + 2 * margem), np.float32)
    tela_rgb = np.zeros((h + 2 * margem, w + 2 * margem, 3), np.float32)
    tela_a[margem : margem + h, margem : margem + w] = alfa
    tela_rgb[margem : margem + h, margem : margem + w] = rgb

    def deslocar(a: np.ndarray, dy: int) -> np.ndarray:
        b = np.zeros_like(a)
        b[dy:] = a[:-dy]
        return b

    ampla = cv2.GaussianBlur(deslocar(tela_a, 26), (0, 0), 30) * 0.42
    perto = cv2.GaussianBlur(deslocar(tela_a, 9), (0, 0), 9) * 0.40
    sombra = np.clip(ampla + perto, 0, 0.72)
    a_final = tela_a + sombra * (1 - tela_a)
    cor = np.where(a_final[..., None] > 1e-4, tela_rgb * tela_a[..., None] / np.maximum(a_final[..., None], 1e-4), 0)
    rgba = np.dstack([cor, a_final])
    ys, xs = np.where(a_final > 0.012)
    return rgba[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]


def gravar(rgba: np.ndarray, nome: str, larguras: list[int]) -> None:
    img = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")
    for largura in larguras:
        if largura >= img.width:
            saida, largura_real = img, img.width
        else:
            saida = img.resize((largura, round(img.height * largura / img.width)), Image.LANCZOS)
            largura_real = largura
        destino = SAIDA / f"{nome}-{largura}.webp"
        saida.save(destino, "WEBP", quality=84, alpha_quality=92, method=6)
        print(f"  {destino.relative_to(RAIZ)}  {largura_real}x{saida.height}  {destino.stat().st_size // 1024} KB")


def main() -> int:
    SAIDA.mkdir(parents=True, exist_ok=True)
    so = set(sys.argv[1:])
    for nome, cfg in FOTOS.items():
        if so and nome not in so:
            continue
        print(nome)
        foto, masc = carregar(cfg["foto"])
        alfa = limpar_mascara(masc, cfg.get("excluir", []))
        if "retoques" in cfg:
            foto = retocar(foto, cfg["retoques"])
        if "tela" in cfg:
            foto = montar_tela(foto, cfg["tela"])
        gravar(com_sombra(foto, alfa), nome, cfg["larguras"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
