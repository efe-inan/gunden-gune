import Link from 'next/link'

const FOOTER_LINKS = {
    kurumsal: [
        { href: '/hakkimizda', label: 'Hakkımızda' },
        { href: '/iletisim', label: 'İletişim' },
        { href: '/gizlilik', label: 'Gizlilik Politikası' },
    ],
    destek: [
        { href: '/program', label: '21 Günlük Program' },
        { href: '/blog', label: 'Blog' },
        { href: '/sss', label: 'SSS' },
    ],
}

const SOCIAL_LINKS = [
    { href: 'https://instagram.com', icon: 'photo_camera', label: 'Instagram' },
    { href: 'https://twitter.com', icon: 'alternate_email', label: 'Twitter' },
    { href: 'https://youtube.com', icon: 'play_arrow', label: 'YouTube' },
]

export default function Footer() {
    return (
        <footer className="border-t border-border-color bg-background-alt pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-center md:items-start gap-4 max-w-sm text-center md:text-left">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white group-hover:bg-primary-dark transition-colors duration-300">
                                <span className="material-symbols-outlined !text-[20px]">spa</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-text-main transition-colors duration-300 group-hover:text-primary">Günden Güne</h2>
                        </Link>
                        <p className="text-sm text-text-secondary">
                            Hayatını değiştirmek için ihtiyacın olan tek şey, kararlılıkla atılmış küçük bir adım. Bize katıl.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <h4 className="font-bold text-text-main">Kurumsal</h4>
                            {FOOTER_LINKS.kurumsal.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <h4 className="font-bold text-text-main">Destek</h4>
                            {FOOTER_LINKS.destek.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light border border-border-color text-text-secondary shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all hover-lift"
                                aria-label={social.label}
                            >
                                <span className="material-symbols-outlined">{social.icon}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border-color pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-text-secondary">
                        © {new Date().getFullYear()} Günden Güne. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/gizlilik" className="text-sm text-text-secondary hover:text-primary transition-colors">
                            Gizlilik
                        </Link>
                        <Link href="/sss" className="text-sm text-text-secondary hover:text-primary transition-colors">
                            SSS
                        </Link>
                        <Link href="/iletisim" className="text-sm text-text-secondary hover:text-primary transition-colors">
                            İletişim
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
