/**
 * V11 sahne shader kaynağı — docs/V11-SAHNE-PROMPT.md Bölüm 1-2.
 *
 * Ayrı dosyada: SiteBackdropScene.tsx 300 satır sınırını aşmasın diye
 * (CLAUDE.md kural 6). Yalnızca GLSL kaynak dizeleri; mantık yok.
 */

export const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Kuantize yükseklik alanı — BÖLÜM 2. Şerit indeksi x'te kuantize (strip
// merkezinden örneklenir), küre yüksekliği y'de sürekli → komşu şeritler
// arasında basamak oluşur (hilal/mercek biçimleri, testere dişi gölge
// buradan emergent, elle çizilmedi). Raymarching YOK.
export const FRAG = /* glsl */ `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float uStripStepPx;
  uniform float uPanelEdgeFrac;
  uniform vec3 uSmall; // x (genişlik oranı), y, r (yükseklik oranı)
  uniform vec3 uBig;
  uniform float uLight;
  uniform vec2 uMouseFocus;
  uniform vec3 uGroundDark;
  uniform vec3 uGroundBright;
  uniform vec3 uGrooveDark;
  uniform vec3 uEdgeLight;
  varying vec2 vUv;

  // V12 Bölüm 2.1: eski hash sin()-tabanlıydı — büyük gren koordinatlarında
  // (uv*iResolution) tek-duyarlıklı sin() hassasiyeti çöküyor, bu da rastgele
  // gren yerine bloklu/bantlı bir desen üretiyordu (referans karede görülen
  // "açık gri dikdörtgen bloklar" ve "soluk yatay bantlar" artefaktının kök
  // nedeni). fract-tabanlı hash büyük girişte de kararlı.
  float hash2(vec2 p) {
    p = fract(p * vec2(443.8975, 397.2973));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * p.x);
  }

  // Küre yükseklik alanı: dünya uzayında (uv birimi = ekran yüksekliği oranı)
  // p noktasındaki küre yüzeyinin yerelden yüksekliği. r > mesafe değilse 0.
  float domeHeight(vec2 p, vec2 c, float r) {
    float d = length(p - c);
    float h2 = r * r - d * d;
    return h2 > 0.0 ? sqrt(h2) : 0.0;
  }

  // Duvar üzerindeki düz (kuantize olmayan) küre — silüet kenarında
  // turkuaz Fresnel kenar ışığı + tek yönlü sahte Lambert gölgeleme.
  // V12 Bölüm 2.2: silüet artık ANALİTİK yumuşatılıyor — sabit "d>=r" ikili
  // kesme yerine sabit bir ekran-piksel besleme genişliğinde smoothstep
  // (min. ~2-3px). fwidth() DENENDİ — bu ortamın SwiftShader/ANGLE
  // derlemesinde GL_OES_standard_derivatives desteklenmiyor (shader derleme
  // hatası), o yüzden pikseli doğrudan iResolution'dan (uv birimi = ekran
  // yüksekliği oranı, bkz. main()) hesaplıyoruz — GPU'dan bağımsız, taşınabilir.
  // Bölüm 2.3: kenar ışığı genişletildi (Fresnel üssü 3.2→2.2, dar
  // parlamadan geniş haleye) ve şiddeti ~%25 kısıldı (0.95→0.71).
  vec3 drawSmoothSphere(vec3 base, vec2 uv, vec2 c, float r, vec3 rim, vec3 darkBase, float light, float pxUv) {
    float d = length(uv - c);
    float aa = max(pxUv * 2.5, 0.0015);
    float inside = 1.0 - smoothstep(r - aa, r + aa, d);
    if (inside <= 0.001) return base;
    float dc = min(d, r);
    float nz = sqrt(max(0.0, r * r - dc * dc)) / r; // 0 silüette .. 1 tepede
    vec2 dir = (uv - c) / max(d, 1e-4);
    vec3 normal = vec3(dir * (dc / r), nz);
    vec3 lightDir = normalize(vec3(-0.45, -0.65, 0.6));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - nz, 2.2);
    vec3 sphereBase = mix(darkBase * 0.55, mix(darkBase, base, 0.45), light);
    vec3 col = sphereBase * (0.35 + 0.75 * diffuse);
    col += rim * fresnel * 0.71;
    return mix(base, col, inside);
  }

  void main() {
    float aspect = iResolution.x / iResolution.y;
    // vUv orijini sol-ALT (ogl Triangle); sahnede y aşağı artsın istiyoruz.
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y) * vec2(aspect, 1.0);

    vec3 groundBase = mix(uGroundDark, uGroundBright, uLight);

    vec2 smallC = vec2(uSmall.x * aspect, uSmall.y);
    float smallR = uSmall.z;
    vec2 bigC = vec2(uBig.x * aspect, uBig.y);
    float bigR = uBig.z;

    float stripStepUv = max(uStripStepPx / iResolution.y, 0.006);
    float pxUv = 1.0 / iResolution.y; // 1 ekran pikseli, uv birimiyle aynı ölçek

    // Panel kenarı — çoğunlukla sabit, sürekli (bloksuz) çift-frekans dalgalanma
    // (referans karelerde kenar mükemmel düz DEĞİL, hafif pürüzlü — ama BASAMAKSIZ).
    float edgeWobble = (sin(uv.y * 23.0) * 0.35 + sin(uv.y * 7.0 + 1.7) * 0.65) * stripStepUv * 0.4;
    float panelEdge = uPanelEdgeFrac * aspect + edgeWobble;

    vec3 col;
    if (uv.x < panelEdge) {
      float i = floor(uv.x / stripStepUv);
      float cx = (i + 0.5) * stripStepUv;

      float hC = domeHeight(vec2(cx, uv.y), smallC, smallR) + domeHeight(vec2(cx, uv.y), bigC, bigR) * 0.35;
      float hL = domeHeight(vec2(cx - stripStepUv, uv.y), smallC, smallR) + domeHeight(vec2(cx - stripStepUv, uv.y), bigC, bigR) * 0.35;
      float hR = domeHeight(vec2(cx + stripStepUv, uv.y), smallC, smallR) + domeHeight(vec2(cx + stripStepUv, uv.y), bigC, bigR) * 0.35;

      // Taban oluk: her şeridin kendi cross-section'ı (küreden bağımsız,
      // referansta HER YERDE görünen sürekli korugasyon).
      float within = fract(uv.x / stripStepUv) - 0.5;
      float baseSlope = within * 2.0;
      float domeSlope = (hR - hL) / (2.0 * stripStepUv);
      float slope = baseSlope * 0.35 + domeSlope * 1.6;
      float ndotl = clamp(0.55 - slope * 0.28, 0.0, 1.0);

      float edgeDist = min(fract(uv.x / stripStepUv), 1.0 - fract(uv.x / stripStepUv));
      float grooveW = 0.07 + clamp(abs(hR - hC) + abs(hL - hC), 0.0, 0.3) * 0.15;
      float groove = 1.0 - smoothstep(0.0, grooveW, edgeDist);

      col = groundBase * mix(0.55, 1.15, ndotl);
      col = mix(col, uGrooveDark, groove * 0.85);

      // Kenar/hilal ışığı: dik basamak (dome silüeti) + gerçekten yükseklik var.
      // Geniş smoothstep aralığı + düşük yoğunluk: referans karelerdeki İNCE
      // turkuaz çizgi, düz beyazımsı blok DEĞİL (dar aralık düz bir blok gibi
      // okunuyordu — özellikle kürenin ekran kenarında kesildiği yerlerde).
      float sil = smoothstep(0.6, 3.0, abs(domeSlope)) * step(0.004, hC);
      col += uEdgeLight * sil * 0.375;

      // 1. karedeki çapraz ışık huzmesi — yalnızca koyu evrede belirgin.
      float beam = sin((uv.x * 3.1 - uv.y * 2.2) * 3.0) * 0.5 + 0.5;
      col *= mix(1.0, mix(0.85, 1.12, beam), (1.0 - uLight) * 0.5);
    } else {
      col = groundBase;
      // Fare ışık odağı — hafif "el feneri" sıcak noktası, duvar zemininde.
      vec2 focus = vec2(aspect * 0.5 + uMouseFocus.x * aspect * 0.32, 0.46 + uMouseFocus.y * 0.28);
      float focusGlow = smoothstep(0.9, 0.0, length(uv - focus));
      col += uEdgeLight * focusGlow * 0.05;

      col = drawSmoothSphere(col, uv, bigC, bigR, uEdgeLight, uGroundDark, uLight, pxUv);
      col = drawSmoothSphere(col, uv, smallC, smallR, uEdgeLight, uGroundDark, uLight, pxUv);
    }

    // Küçük küre panel içindeyken bile duvar tarafına taşan kısmı olabilir —
    // (ör. geçiş anları) aynı düz küre çizimini panel tarafında da uygula ki
    // silüet kesilmesin.
    if (uv.x >= panelEdge - smallR * 0.02) {
      col = drawSmoothSphere(col, uv, smallC, smallR, uEdgeLight, uGroundDark, uLight, pxUv);
    }

    // Işık süzmesi (Bölüm 2.5) — 3 yumuşak, çapraz (~-25°) huzme, opaklık
    // bütçesi <= 0.10 toplam, bulanık (gaussian) kenarlı. Fare + scroll'la
    // ÇOK yavaş sürüklenir (uMouseFocus zaten sönümlü; iTime çok küçük
    // katsayıyla). reduced-motion'da iTime hep 0'da kaldığı için (tek kare)
    // sürüklenme otomatik durur — ekstra bayrağa gerek yok.
    float beamAngle = radians(-25.0);
    vec2 beamDir = vec2(cos(beamAngle), sin(beamAngle));
    vec2 beamNormal = vec2(-beamDir.y, beamDir.x);
    float beamDrift = iTime * 0.006 + uMouseFocus.x * 0.05;
    vec2 beamOrigin = uv - vec2(aspect * 0.5, 0.5);
    float beamAxis = dot(beamOrigin, beamDir);
    float beamCross = dot(beamOrigin, beamNormal);
    float lengthFade = smoothstep(1.35, 0.15, abs(beamAxis));
    // Tam olarak 3 SABİT huzme (tekrarlayan bir tarak DEĞİL — fract() tabanlı
    // bir yaklaşım yanlışlıkla ekranı dolduran sonsuz paralel çizgi üretiyordu).
    {
      float s = (beamCross - (-0.55 + beamDrift)) * 5.5;
      col += vec3(1.0) * exp(-(s * s)) * lengthFade * 0.032;
    }
    {
      float s = (beamCross - (0.05 + beamDrift)) * 5.5;
      col += vec3(1.0) * exp(-(s * s)) * lengthFade * 0.032;
    }
    {
      float s = (beamCross - (0.65 + beamDrift)) * 5.5;
      col += vec3(1.0) * exp(-(s * s)) * lengthFade * 0.032;
    }

    // Film greni — düşük efektif fps (~12), SVG feTurbulence yerine ucuz hash.
    float grainTime = floor(iTime * 12.0);
    float grain = hash2(uv * iResolution.xy * 0.5 + grainTime * 13.37) - 0.5;
    col += grain * 0.035;

    // Vinyet.
    vec2 vc = uv - vec2(aspect * 0.5, 0.5);
    float vig = smoothstep(1.05, 0.25, length(vc * vec2(1.0 / aspect, 1.0)) * 1.15);
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;
