# Tasarım kararları — V12 premium geçişi

`docs/V12-PREMIUM-PROMPT.md` Bölüm 1 gereği: dört skill'in `SKILL.md`
(ve gerekli referans) dosyaları okundu, aşağıda 3-4 cümlelik özetleri ve bu
işte nasıl kullanıldıkları var. Skill'ler ÜÇÜNCÜ TARAF — yalnızca talimat
metinleri okundu, hiçbir script (`measure-colors.mjs`, `kie.mjs`, `doctor.mjs`
vb.) çalıştırılmadı (ağa çıkıyor, paket kuruyor veya ücretli API çağırıyor).
Bu promptla çelişen her yerde BU PROMPT kazandı (palet, sayfa yapısı,
erişilebilirlik, performans, uydurma içerik yasağı — V12 Bölüm 1 kuralı).

## design-dna

Referans tasarımları üç eksende (design_system/tokens, design_style/his,
visual_effects/WebGL-canvas-parçacık) yapılandırılmış bir JSON'a çıkarıp
sonra o JSON'dan üretim yapan 3 fazlı bir skill. Renk ölçümü için bir script
çalıştırıyor (`npm install` + `measure-colors.mjs`) — bu iş için
ÇALIŞTIRILMADI (paket kurma yasağı); bunun yerine `futureoffinance.
peachweb.io` WebFetch ile elle incelendi (aşağıda). Kullanım: yalnızca
tipografi/boşluk/yüzey İLKELERİ referans alındı — kod, görsel veya metin
kopyalanmadı.

## frontend-design

Şablon gibi durmayan, brief'e özgü tasarım kararları için genel bir rehber:
tipografi kişiliği taşır, "tek kelimeyi vurgulama" / "her şeyi BÜYÜK HARF
etiketle" gibi klişe kalıplardan kaçın, hareketi tek bir orkestre edilmiş an
için sakla, renk/tip/düzeni brief'e göre bilinçli seç. Kullanım: display
ağırlığını hafifletme, tek vurgulanan an (arka plan sahnesi zaten var, ikinci
bir "imza" eklenmedi) ve klişe kalıp taraması (BÜYÜK HARF etiket sıklığı,
kart ızgarası) için referans alındı.

## design-taste-frontend

"Anti-slop" bir kontrol listesi: üç kadran (DESIGN_VARIANCE/MOTION_INTENSITY/
VISUAL_DENSITY), tipografi/renk/kart/buton/kontrast zorunlu kuralları, ve
Bölüm 11 "hedefli evrim" (targeted evolution) süreci — IA/içerik sağlamsa
Kaldıraç 1-4'ü (tipografi → ritim → renk → hareket) uygula, tam yeniden
tasarıma gitme. Bu prompt tam olarak bu senaryo. Kullanım: kadranlar
DESIGN_VARIANCE=4/MOTION_INTENSITY=6/VISUAL_DENSITY=3 olarak sabitlendi
(prompt'un kendi talimatı); buton kontrastı, tek köşe-yarıçapı kilidi, kart
gölgesi zemin tonuna göre, alıntı ≤3 satır kuralları uygulandı.

## scrollcraft (nateherk-design:scroll-craft)

Sıfırdan, üretilmiş (kie.ai) görsel/video varlıklarla sinematik scroll
sayfaları inşa etmek için bir skill (brief → gramer seçimi → parmak izi
kapısı → sahne üretimi). Bu makine tamamen greenfield inşa için — mevcut
sayfa yapısını/bölüm sırasını KORUMAMIZ gerektiği için (Bölüm 4, açık
talimat) gramer seçimi, imza hareket icadı ve varlık üretimi adımları
ATLANDI; röportaj soruları bu promptun kendisine bakılarak kendi kendine
yanıtlandı (aşağıda). Kullanım: yalnızca `references/taste.md` ("tasarım
tabanı") ilkeleri alındı — 4px taban aralık ölçeği, iki aile azami
tipografi, tek vurgu rengi kilidi, köşede/bantta scrim (tam kare kaplama
DEĞİL), 5 derinlik aracı (offset+blur gölge, kenar ışığı, ölçek/blur
mesafesi, örtüşme, gren), `transform`/`opacity` dışında animasyon yasağı,
`ease-in` yasağı.

### scrollcraft röportaj soruları — kendi kendine yanıt (Bölüm 4 talimatı)

1. **Vibe:** sakin, güvenilir, "kurumsal ama donuk değil" — referans:
   futureoffinance.peachweb.io (zaten V4-AKIS'ın referansı).
2. **Scroll yolculuğu:** DEĞİŞMEZ — mevcut sıra (Hero → Çözümler →
   Yetenekler [pinlenmiş] → Rakamlar → Referanslar → Kapanış).
3. **Enerji eğrisi:** DEĞİŞMEZ — imza an zaten pinlenmiş "Temel yetenekler"
   bölümü; bu işte YENİ bir tepe noktası İCAT EDİLMEDİ, sadece mevcutlar
   inceltildi (gölge/kenar ışığı/gren, Bölüm 2).
4. **His eğrisi / tek an:** aynı (pinlenmiş bölüm) — bu işin hedefi anı
   DEĞİŞTİRMEK değil, SUNUMU (tipografi, cam, gölge) yükseltmek.
5. **Bespoke hareket:** yok — "yeni imza icat etme, mevcut olanı incelt"
   (Bölüm 4, açık talimat). Yeni bir bespoke etkileşim eklenmedi.
6. **Premium-minimal'den uzaklık:** premium-minimal (VISUAL_DENSITY=3 ile
   tutarlı) — maksimalist/brutalist/retro değil.
7. **Tek dünya mı, ayrı sahneler mi:** ayrı sahneler zaten mevcut (sayfa
   bölümleri) — DEĞİŞMEDİ.
8. **Var olan varlıklar:** marka paleti + tipografi zaten `tokens.css`'te
   kilitli (CLAUDE.md); yeni görsel/video ÜRETİLMEDİ (kie.ai kullanılmadı,
   Bölüm 4 zaten "yeni imza icat etme" diyor).

## futureoffinance.peachweb.io — elle analiz (Playwright MCP yok)

WebFetch ile içerik/yapı incelendi (design-dna Faz 2, script'siz elle
uygulama — HTML→markdown dönüşümü tam CSS ayrıntısını vermiyor, o yüzden
sonuçlar genel çizgide kaldı). Teyit edilen: koyu zemin + beyaz/nötr metin,
bölümler arası GENİŞ dikey boşluk (Çözümler/Özellikler/Fiyatlandırma/
Referanslar arasında), kartlar DÜZ (ağır gölge/glassmorphism yok), özellik
numaraları (01/02/03) büyük rakamla görsel çapa, ince yatay ayraçlar ritim
kuruyor. Bu ilkeler zaten sitenin V4-AKIS referansıydı (CLAUDE.md) — V12'de
yeniden teyit edildi, kod/metin/görsel kopyalanmadı. Sonuç: kart gölgesini
AZALTMA (zaten düz), boşluğu ARTIRMA ve ince ayraç kullanımı bu incelemeyle
uyumlu — BÖLÜM 4'teki cam sistemi seçici kullanılacak (her yüzeye değil).
