'use client';

import type { ComponentType } from 'react';
import { CorporateTaxCalculator } from './CorporateTaxCalculator';
import { CurrencyConverter } from './CurrencyConverter';
import { IncomeTaxCalculator } from './IncomeTaxCalculator';
import { InflationCalculator } from './InflationCalculator';
import { PayrollCostCalculator } from './PayrollCostCalculator';
import { RentExpenseCalculator } from './RentExpenseCalculator';
import { SeveranceCalculator } from './SeveranceCalculator';
import { VatCalculator } from './VatCalculator';
import { VehicleExpenseCalculator } from './VehicleExpenseCalculator';

/**
 * Slug → hesaplayıcı bileşeni eşlemesi. `/araclar/[slug]` sunucu sayfası bu
 * istemci sınırını render eder; hangi hesaplayıcının geleceği slug'a bağlıdır.
 */
const MAP: Record<string, ComponentType> = {
  kdv: VatCalculator,
  'gelir-vergisi': IncomeTaxCalculator,
  'kurumlar-vergisi': CorporateTaxCalculator,
  'binek-arac-gider-kisiti': VehicleExpenseCalculator,
  'binek-arac-kira-siniri': RentExpenseCalculator,
  'sgk-isveren-maliyeti': PayrollCostCalculator,
  'kidem-tazminati': SeveranceCalculator,
  'tufe-guncelleme': InflationCalculator,
  'kur-cevirici': CurrencyConverter,
};

export function ToolCalculator({ slug }: { slug: string }) {
  const Calculator = MAP[slug];
  if (!Calculator) return null;
  return <Calculator />;
}
