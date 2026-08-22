import { site } from '@futuristax/config';
import type { Metadata } from 'next';
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice';
import { LEGAL_TEXTS_APPROVED, LEGAL_VERSIONS } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'KVKK aydınlatma metni',
  description: 'Kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  // Taslak metin indekslenmez.
  robots: LEGAL_TEXTS_APPROVED ? { index: true } : { index: false, follow: false },
};

export default function KvkkPage() {
  const { address } = site.contact;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <div className="ledger-rule pb-4">
        <p className="basis-ref uppercase">Yasal</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">KVKK aydınlatma metni</h1>
      </div>

      <div className="mt-8">
        <LegalDraftNotice version={LEGAL_VERSIONS.kvkkNotice} />
      </div>

      <div className="space-y-8 text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
        <section>
          <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
            Veri sorumlusu
          </h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca veri sorumlusu{' '}
            <strong className="text-[var(--color-text)]">{site.brand.name}</strong>'dir.
          </p>
          <address className="mt-3 not-italic">
            {address.street}, {address.district} / {address.city}
            <br />
            {site.contact.email} · {site.contact.phoneDisplay}
          </address>
        </section>

        <section>
          <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
            İşlenen veriler ve amaçları
          </h2>
          <p>
            İletişim formu üzerinden ilettiğiniz ad soyad, e-posta adresi, telefon numarası,
            şirket adı ve mesaj içeriği yalnızca talebinizi değerlendirmek ve size geri dönüş
            yapmak amacıyla işlenir. Formu gönderdiğiniz an, IP adresiniz ve tarayıcı bilginiz
            güvenlik ve kötüye kullanım önleme amacıyla kaydedilir.
          </p>
          <p className="mt-3">
            Verileriniz pazarlama amacıyla kullanılmaz ve üçüncü taraflara satılmaz.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
            Hukuki sebep ve toplama yöntemi
          </h2>
          <p>
            Veriler, siteye ilettiğiniz form aracılığıyla elektronik ortamda toplanır. İşleme
            faaliyetinin hukuki sebebi, KVKK Md. 5/2-c uyarınca sözleşmenin kurulması veya
            ifasıyla doğrudan ilgili olması ve Md. 5/1 uyarınca açık rızanızdır.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
            Aktarım
          </h2>
          <p>
            Verileriniz, hizmetin sunulabilmesi için kullanılan barındırma, e-posta ve
            veritabanı hizmet sağlayıcılarına aktarılabilir.
          </p>
          {/*
            TODO(hukuk): Kullanılan sağlayıcılar (Vercel, Resend, Neon, Cloudflare, Upstash)
            ve yurt dışı aktarım durumu, KVKK Md. 9 kapsamında açıkça listelenmelidir.
            Sağlayıcı seçimi kesinleştiğinde bu bölüm doldurulacak.
          */}
          <p className="basis-ref mt-3">
            Sağlayıcı listesi ve yurt dışı aktarım beyanı hukukçu onayıyla eklenecektir.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
            Haklarınız
          </h2>
          <p>KVKK Md. 11 uyarınca şu haklara sahipsiniz:</p>
          <ul className="mt-3 space-y-2 pl-5">
            {[
              'Kişisel verinizin işlenip işlenmediğini öğrenme',
              'İşlenmişse buna ilişkin bilgi talep etme',
              'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
              'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
              'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
              'Silinmesini veya yok edilmesini isteme',
              'Düzeltme, silme ve yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme',
              'Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç doğmasına itiraz etme',
              'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
            ].map((right) => (
              <li key={right} className="list-disc">
                {right}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Taleplerinizi{' '}
            <a href={`mailto:${site.contact.email}`} className="text-[var(--color-ink)] underline underline-offset-2">
              {site.contact.email}
            </a>{' '}
            adresine iletebilirsiniz. Başvurular en geç 30 gün içinde sonuçlandırılır.
          </p>
        </section>
      </div>
    </article>
  );
}
