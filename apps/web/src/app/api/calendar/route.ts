import { type TaxpayerType, buildIcsFeed, getUpcomingDeadlines } from '@futuristax/tax-engine';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Vergi takvimini iCalendar (.ics) olarak sunar.
 * Kullanıcı kendi takvimine abone olabilir — imza bileşeninin ayırt edici parçası.
 */
const VALID_TYPES: TaxpayerType[] = ['corporate', 'soleTrader', 'employer', 'all'];

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('taxpayerType') ?? 'all';
  const taxpayerType = (VALID_TYPES as string[]).includes(raw) ? (raw as TaxpayerType) : 'all';

  const referenceDate = new Date().toISOString().slice(0, 10);
  const deadlines = getUpcomingDeadlines({ referenceDate, horizonDays: 365, taxpayerType });
  const ics = buildIcsFeed(deadlines, 'FuturistaX Vergi Takvimi');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="futuristax-vergi-takvimi.ics"',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
