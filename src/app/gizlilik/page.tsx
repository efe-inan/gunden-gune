import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                            Gizlilik Politikası
                        </h1>
                        <p className="text-text-secondary">
                            Son güncelleme: Ocak 2024
                        </p>
                    </div>

                    <div className="bg-surface-light rounded-2xl p-8 md:p-12 border border-border-color shadow-sm fade-in-up">
                        <div className="prose prose-lg max-w-none">
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Giriş
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Günden Güne olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını en üst düzeyde önemsiyoruz.
                                    Bu gizlilik politikası, hizmetlerimizi kullanırken toplanan, işlenen ve saklanan kişisel veriler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">database</span>
                                    Toplanan Veriler
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    Hizmetlerimizi kullanırken aşağıdaki veriler toplanabilir:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>E-posta adresi ve şifre (hesap oluşturma için)</li>
                                    <li>İsim ve profil bilgileri (isteğe bağlı)</li>
                                    <li>İlgi alanları ve hedefler (kişiselleştirme için)</li>
                                    <li>Program ilerleme verileri</li>
                                    <li>Cihaz ve tarayıcı bilgileri</li>
                                    <li>IP adresi ve konum bilgisi</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">target</span>
                                    Verilerin Kullanım Amaçları
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>Hesap oluşturma ve kimlik doğrulama</li>
                                    <li>Kişiselleştirilmiş içerik ve öneriler sunma</li>
                                    <li>Hizmet kalitesini artırma ve geliştirme</li>
                                    <li>Teknik destek sağlama</li>
                                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">security</span>
                                    Veri Güvenliği
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Verilerinizi korumak için endüstri standardı güvenlik önlemleri uygulamaktayız.
                                    Tüm veriler şifreli olarak aktarılır ve güvenli sunucularda saklanır.
                                    Ancak, internet üzerinden yapılan hiçbir veri aktarımının %100 güvenli olmadığını hatırlatmak isteriz.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">cookie</span>
                                    Çerezler
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                                    Çerezler, tercihlerinizi hatırlamak, oturum bilgilerinizi saklamak ve site kullanımını analiz etmek için kullanılır.
                                    Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu bazı özelliklerin çalışmasını engelleyebilir.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">share</span>
                                    Veri Paylaşımı
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Kişisel verilerinizi üçüncü taraflarla satmıyor veya kiralamıyoruz.
                                    Verileriniz yalnızca aşağıdaki durumlarda paylaşılabilir:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4 mt-4">
                                    <li>Yasal zorunluluk durumlarında</li>
                                    <li>Hizmet sağlayıcılarımızla (veri işleme sözleşmesi kapsamında)</li>
                                    <li>Açık rızanızın bulunması halinde</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">gavel</span>
                                    Haklarınız
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    KVKK kapsamında aşağıdaki haklara sahipsiniz:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>Verilerinize erişim hakkı</li>
                                    <li>Verilerin düzeltilmesini talep hakkı</li>
                                    <li>Verilerin silinmesini talep hakkı</li>
                                    <li>Veri işlemeye itiraz hakkı</li>
                                    <li>Veri taşınabilirliği hakkı</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">update</span>
                                    Politika Güncellemeleri
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Bu gizlilik politikası zaman zaman güncellenebilir.
                                    Önemli değişiklikler olması durumunda sizi e-posta yoluyla veya web sitemizdeki bir bildirim aracılığıyla bilgilendireceğiz.
                                    Bu sayfayı düzenli olarak kontrol etmenizi öneririz.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">contact_support</span>
                                    İletişim
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Gizlilik politikamız hakkında sorularınız varsa veya haklarınızı kullanmak istiyorsanız,
                                    lütfen <a href="/iletisim" className="text-primary hover:underline">iletişim sayfamız</a> üzerinden
                                    veya <span className="text-primary">destek@21gun.com</span> adresinden bize ulaşın.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
