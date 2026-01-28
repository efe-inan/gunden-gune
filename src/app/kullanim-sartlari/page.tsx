'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                            Kullanım Şartları
                        </h1>
                        <p className="text-text-secondary">
                            Son güncelleme: Ocak 2024
                        </p>
                    </div>

                    <div className="bg-surface-light rounded-2xl p-8 md:p-12 border border-border-color shadow-sm fade-in-up">
                        <div className="prose prose-lg max-w-none">
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">gavel</span>
                                    Genel Koşullar
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Günden Güne platformunu kullanarak, bu kullanım şartlarını kabul etmiş sayılırsınız.
                                    Bu şartlar, platform ile kullanıcı arasındaki ilişkiyi düzenler ve her iki tarafın
                                    hak ve yükümlülüklerini belirler.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Hesap Kullanımı
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    Platformu kullanmak için geçerli bir hesap oluşturmanız gerekmektedir.
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>Hesap bilgilerinizin doğruluğundan siz sorumlusunuz</li>
                                    <li>Şifrenizi gizli tutmalı ve üçüncü kişilerle paylaşmamalısınız</li>
                                    <li>Hesabınızda gerçekleşen tüm işlemlerden siz sorumlusunuz</li>
                                    <li>18 yaşından küçükler veli/vasi onayı ile kayıt olabilir</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    Kabul Edilebilir Kullanım
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    Platformu kullanırken aşağıdaki kurallara uymanız beklenmektedir:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>Yasalara ve düzenlemelere uymak</li>
                                    <li>Diğer kullanıcılara saygılı davranmak</li>
                                    <li>Yanıltıcı veya zararlı içerik paylaşmamak</li>
                                    <li>Platformun güvenliğini tehlikeye atmamak</li>
                                    <li>Spam veya istenmeyen içerik göndermemek</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">block</span>
                                    Yasaklanan Davranışlar
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    Aşağıdaki davranışlar kesinlikle yasaktır:
                                </p>
                                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                                    <li>Başkalarının hesaplarına izinsiz erişim</li>
                                    <li>Zararlı yazılım veya virüs yaymak</li>
                                    <li>Platformu kötüye kullanmak veya manipüle etmek</li>
                                    <li>Telif hakkı ihlali içeren içerik paylaşmak</li>
                                    <li>Taciz, tehdit veya nefret söylemi</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">copyright</span>
                                    Fikri Mülkiyet
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Platform üzerindeki tüm içerik, tasarım, logo ve materyaller Günden Güne&apos;ye aittir
                                    veya lisanslıdır. Bu içeriklerin izinsiz kopyalanması, dağıtılması veya kullanılması yasaktır.
                                    Kullanıcılar tarafından oluşturulan içerikler için gerekli lisanslar kullanıcıdan alınmış kabul edilir.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">warning</span>
                                    Sorumluluk Sınırları
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Platform &quot;olduğu gibi&quot; sunulmaktadır. Kesintisiz veya hatasız çalışma garantisi verilmez.
                                    Platformun kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamayız.
                                    Üçüncü taraf hizmetleri veya bağlantılardan kaynaklanan sorunlardan sorumlu değiliz.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">cancel</span>
                                    Hesap İptali
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Kullanıcılar istedikleri zaman hesaplarını silebilir. Kullanım şartlarının ihlali durumunda,
                                    hesabınızı önceden haber vermeksizin askıya alma veya silme hakkını saklı tutarız.
                                    Hesap iptali durumunda verileriniz gizlilik politikamıza uygun şekilde işlenir.
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">update</span>
                                    Şartların Güncellenmesi
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Bu kullanım şartları zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda
                                    sizi e-posta yoluyla veya platform üzerinden bilgilendireceğiz. Güncellemelerden sonra
                                    platformu kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">contact_support</span>
                                    İletişim
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Kullanım şartları hakkında sorularınız varsa,
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
