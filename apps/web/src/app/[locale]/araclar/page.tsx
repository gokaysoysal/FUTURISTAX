import type { Metadata } from 'next';
import { VehicleExpenseCalculator } from '@/components/calculators/VehicleExpenseCalculator';

export const metadata: Metadata = {
  title: 'Hesaplama araçları',
  description:
    'Binek araç gider kısıtı, KDV, kurumlar vergisi ve kıdem tazminatı hesaplayıcıları. ' +
    'Yıl bazlı oranlar ve adım adım hesap dökümü.',
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="ledger-rule pb-4">
        <p className="basis-ref uppercase">Araçlar</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Hesaplama araçları</h1>
      </div>

      <p className="mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        Her araç yalnızca sonucu değil, hesabın nasıl çıktığını da gösterir. Kalemlerin
        dayandığı kanun maddeleri satır satır belirtilir.
      </p>

      <section aria-labelledby="vehicle-heading" className="mt-12">
        <h2 id="vehicle-heading" className="text-[length:var(--text-xl)]">
          Binek araç gider kısıtı
        </h2>
        <p className="mt-2 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
          GVK Md. 40/5 uyarınca binek otomobil giderlerinin yalnızca bir kısmı indirilebilir;
          kalan tutar ve ona isabet eden KDV kanunen kabul edilmeyen giderdir.
        </p>
        <div className="mt-6">
          <VehicleExpenseCalculator />
        </div>
      </section>

      {/*
        TODO(faz-3): Diğer sekiz hesaplayıcı aynı desende eklenecek.
        Motor tarafı hazır ve testli: calculateVat, calculateCorporateTax,
        calculateIncomeTax, calculateRentExpense, calculatePayrollCost,
        calculateSeverance, calculateInflationAdjustment, convertCurrency.
        Her biri kendi sayfasına (/araclar/[slug]) taşınacak.
      */}
    </div>
  );
}
