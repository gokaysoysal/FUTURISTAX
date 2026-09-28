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

  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
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
  vec3 drawSmoothSphere(vec3 base, vec2 uv, vec2 c, float r, vec3 rim, vec3 darkBase, float light) {
    float d = length(uv - c);
    if (d >= r) return base;
    float nz = sqrt(max(0.0, r * r - d * d)) / r; // 0 silüette .. 1 tepede
    vec2 dir = (uv - c) / max(d, 1e-4);
    vec3 normal = vec3(dir * (d / r), nz);
    vec3 lightDir = normalize(vec3(-0.45, -0.65, 0.6));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - nz, 3.2);
    vec3 sphereBase = mix(darkBase * 0.55, mix(darkBase, base, 0.45), light);
    vec3 col = sphereBase * (0.35 + 0.75 * diffuse);
    col += rim * fresnel * 0.95;
    return col;
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

    // Panel kenarı — çoğunlukla sabit, satır başına hafif organik dalgalanma
    // (referans karelerde kenar mükemmel düz DEĞİL, hafif pürüzlü).
    float edgeWobble = (hash2(vec2(floor(uv.y * 40.0), 0.0)) - 0.5) * stripStepUv * 0.6;
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
      float sil = smoothstep(0.35, 1.1, abs(domeSlope)) * step(0.004, hC);
      col += uEdgeLight * sil * 0.85;

      // 1. karedeki çapraz ışık huzmesi — yalnızca koyu evrede belirgin.
      float beam = sin((uv.x * 3.1 - uv.y * 2.2) * 3.0) * 0.5 + 0.5;
      col *= mix(1.0, mix(0.85, 1.12, beam), (1.0 - uLight) * 0.5);
    } else {
      col = groundBase;
      // Fare ışık odağı — hafif "el feneri" sıcak noktası, duvar zemininde.
      vec2 focus = vec2(aspect * 0.5 + uMouseFocus.x * aspect * 0.32, 0.46 + uMouseFocus.y * 0.28);
      float focusGlow = smoothstep(0.9, 0.0, length(uv - focus));
      col += uEdgeLight * focusGlow * 0.05;

      col = drawSmoothSphere(col, uv, bigC, bigR, uEdgeLight, uGroundDark, uLight);
      col = drawSmoothSphere(col, uv, smallC, smallR, uEdgeLight, uGroundDark, uLight);
    }

    // Küçük küre panel içindeyken bile duvar tarafına taşan kısmı olabilir —
    // (ör. geçiş anları) aynı düz küre çizimini panel tarafında da uygula ki
    // silüet kesilmesin.
    if (uv.x >= panelEdge - smallR * 0.02) {
      col = drawSmoothSphere(col, uv, smallC, smallR, uEdgeLight, uGroundDark, uLight);
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
