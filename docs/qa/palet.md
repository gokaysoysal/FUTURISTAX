# V11 sahne — palet örneklemesi

`docs/V11-SAHNE-PROMPT.md` Bölüm 0.4. Kaynak: `docs/referans/{1,3,5,6}.png`
(1920×988), Playwright + `canvas.getImageData` ile bölge taraması
(`apps/web/scripts/v11-sample-palette.mjs`, iş bitince silindi — sonuç
burada kalıcı). Yeni bağımlılık eklenmedi.

## Ölçüm

| Etiket | Kare / bölge | Mod | RGB | Hex |
|---|---|---|---|---|
| panel-en-koyu-oluk | 1.png, oluk gölgesi bandı | darkest | 2,4,16 | `#020410` |
| duz-duvar-koyu-evre | 1.png, düz duvar | average | 10,15,40 | `#0a0f28` |
| panel-yuzey-orta | 1.png, şerit yüzeyi | average | 11,14,40 | `#0b0e28` |
| rim-light-kucuk-kure | 3.png, küçük kürenin silüet kenarı | brightest | 161,195,206 | `#a1c3ce` |
| rim-light-buyuk-kure | 5.png, büyük kürenin silüet kenarı | brightest | 135,173,189 | `#87adbd` |
| zemin-en-acik-parlak-evre | 5.png, düz duvar | average | 90,120,155 | `#5a789b` |

Menekşe (violet/mor) tonu YOK — tüm örnekler lacivert→camgöbeği ailesinde.
CLAUDE.md kuralına uygun (`--color-accent-glow` sahnede kullanılmadı).

## `tokens.css`'e eklenen `--scene-*` tokenları

```
--scene-groove-dark:   #020410  /* oluk çizgisi gölgesi, en koyu nokta */
--scene-ground-dark:   #0a0e28  /* panel/duvar taban tonu — koyu ışık evresi (p≈0) */
--scene-ground-bright: #5a789b  /* panel/duvar taban tonu — parlak ışık evresi (p≈1) */
--scene-edge-light:    #a1c3ce  /* kürelerin turkuaz/camgöbeği rim ışığı */
```

Shader bu dört tonu `light` (0..1 ışık evresi) parametresiyle karıştırır;
sabit palet DEĞİL, `readColorToken` ile CSS'ten okunur (bkz.
`SiteBackdropScene.tsx`).

## DÜZELTME — ışık evresi doc varsayımından farklı çıktı

`V11-SAHNE-PROMPT.md` Bölüm 1, ışık evrelerini "1. koyu → 3-5. parlak → 6.
yeniden koyu" olarak tahmin ediyordu. Altı karenin tam-kare ortalama
parlaklığı ölçüldüğünde (`v11-avg-luma.mjs`, Rec.709 luma):

| Kare | Ort. RGB | Luma (0-255) | Normalize (0..1) |
|---|---|---|---|
| 1 | 17,24,50 | 24.4 | 0.04 |
| 2 | 15,20,45 | 20.7 | 0.00 |
| 3 | 30,43,71 | 42.3 | 0.25 |
| 4 | 55,75,105 | 72.9 | 0.60 |
| 5 | 78,99,127 | 96.6 | 0.87 |
| 6 | 91,110,135 | 107.8 | 1.00 |

Talimat Bölüm 0.3: "çelişki varsa karelere güven." Işık **döngüsel değil,
monoton artan** — 2. kare en koyu (1'den bile biraz daha koyu), 6. kare en
parlak. `backdrop-path.ts`'teki `light` anahtar değerleri buna göre
düzeltildi (doc'un 0.35/0.50/0.85/0.95/0.90/0.30 dizisi yerine
0.04/0.00/0.25/0.60/0.87/1.00 kullanıldı).
