import { NextResponse } from 'next/server';
import { RateFetchError, fetchTcmbRates } from '@/lib/fetchers/tcmb';

/**
 * Resmî döviz kurları (TCMB).
 *
 * Kaynak erişilemezse uydurma değer döndürülmez; istemci "güncellenemiyor"
 * durumunu gösterir. Bu, "uydurma resmî içerik üretme" kuralının API karşılığıdır.
 */
export const revalidate = 3600;

export async function GET() {
  try {
    const table = await fetchTcmbRates();
    return NextResponse.json(
      { ok: true, data: table },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch (error) {
    const message =
      error instanceof RateFetchError
        ? 'Kur verisi şu an güncellenemiyor.'
        : 'Beklenmeyen bir hata oluştu.';
    console.error('[rates] TCMB alınamadı', error);
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
