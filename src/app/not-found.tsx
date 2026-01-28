import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
            <div className="text-center max-w-md fade-in-up">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-[150px] md:text-[200px] font-black text-border-color/30 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
                                explore_off
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl md:text-4xl font-black text-text-main mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-text-secondary text-lg mb-8">
                    Aradığın sayfa mevcut değil veya taşınmış olabilir.
                    Merak etme, yolculuğuna ana sayfadan devam edebilirsin.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover:-translate-y-0.5"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        href="/iletisim"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-border-color text-text-main font-bold rounded-xl hover:border-primary hover:text-primary transition-all"
                    >
                        <span className="material-symbols-outlined">help</span>
                        Yardım Al
                    </Link>
                </div>

                {/* Fun Suggestions */}
                <div className="mt-12 pt-8 border-t border-border-color">
                    <p className="text-sm text-text-secondary mb-4">Belki bunları arıyordun:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/program" className="px-4 py-2 bg-surface-light rounded-full text-sm font-medium text-text-main border border-border-color hover:border-primary/50 transition-all">
                            Program
                        </Link>
                        <Link href="/blog" className="px-4 py-2 bg-surface-light rounded-full text-sm font-medium text-text-main border border-border-color hover:border-primary/50 transition-all">
                            Blog
                        </Link>
                        <Link href="/topluluk" className="px-4 py-2 bg-surface-light rounded-full text-sm font-medium text-text-main border border-border-color hover:border-primary/50 transition-all">
                            Topluluk
                        </Link>
                        <Link href="/sss" className="px-4 py-2 bg-surface-light rounded-full text-sm font-medium text-text-main border border-border-color hover:border-primary/50 transition-all">
                            SSS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
