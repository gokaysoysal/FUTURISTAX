import { LEGAL_TEXTS_APPROVED } from '@/lib/legal/versions';

/**
 * Yasal metin taslak uyarısı.
 *
 * Şablon hukuk metnini nihaiymiş gibi yayınlamak, uydurma resmî içerik
 * yayınlamaya benzer bir risktir. Metinler hukukçu onayından geçene kadar
 * bu bant görünür kalır ve sayfa arama motorlarına kapatılır.
 */
export function LegalDraftNotice({ version }: { version: string }) {
  if (LEGAL_TEXTS_APPROVED) return null;

  return (
    <div
      role="note"
      className="mb-8 border-l-2 border-[var(--color-stamp)] bg-[var(--color-stamp-soft)] px-5 py-4"
    >
      <p className="text-[length:var(--text-sm)] text-[var(--color-text)]">
        <strong className="text-[var(--color-stamp)]">Bu metin taslaktır.</strong> Hukuk danışmanı
        onayından geçmemiştir ve bağlayıcı değildir. Yayına almadan önce gözden geçirilmesi gerekir.
      </p>
      <p className="basis-ref mt-2">Sürüm: {version}</p>
    </div>
  );
}
