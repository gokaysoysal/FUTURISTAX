import type { RateProvenance } from '@futuristax/tax-engine';

/**
 * Doğrulanmamış oran uyarısı.
 *
 * Motor her sonuçla birlikte `provenance` döndürür. Bir yılın değerleri resmî
 * kaynaktan teyit edilmemişse kullanıcı bunu görür. Doğrulanmamış veri asla
 * doğruymuş gibi sunulmaz — şartnamenin 2. kuralının UI karşılığı.
 */
export function UnverifiedRatesNotice({ provenance }: { provenance: RateProvenance }) {
  if (provenance.verified) return null;

  return (
    <p
      role="note"
      className="border-l-2 border-[var(--color-stamp)] bg-[var(--color-stamp-soft)] px-4 py-3 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
    >
      <strong className="text-[var(--color-stamp)]">
        {provenance.year} oranları henüz doğrulanmadı.
      </strong>{' '}
      Bu yıla ait değerler resmî kaynaktan teyit edilmemiştir; sonuçları bağlayıcı kabul etmeyin.
      Kesin hesap için bizimle görüşün.
    </p>
  );
}
