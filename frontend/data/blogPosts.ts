export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // Added content field
    category: string;
    author: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: '21 Günde Alışkanlık Oluşturmanın Bilimi',
        slug: '21-gunde-aliskanlik-olusturma-bilimi',
        excerpt: 'Neden 21 günün kalıcı alışkanlıklar oluşturmak için sihirli bir sayı olduğunu ve alışkanlık oluşumunun arkasındaki psikolojiyi keşfedin.',
        content: `
      <p>Yeni bir alışkanlık kazanmak veya eskisini bırakmak zaman ve sabır gerektirir. "21 Gün Kuralı", 1960'larda plastik cerrah Dr. Maxwell Maltz tarafından ortaya atılmıştır. Hastalarının yeni yüzlerine alışmasının yaklaşık 21 gün sürdüğünü fark etmiştir.</p>
      <h2>Beyin Nasıl Değişir?</h2>
      <p>Nöroplastisite sayesinde beynimiz, tekrarlanan davranışlarla yeni nöral yollar oluşturur. İlk günlerde bu yollar zayıftır, ancak tekrar ettikçe güçlenir ve davranış otomatikleşir.</p>
      <h3>Başarı İçin İpuçları</h3>
      <ul>
        <li><strong>Küçük Başlayın:</strong> Devasa değişiklikler yerine sürdürülebilir küçük adımlar atın.</li>
        <li><strong>Tutarlı Olun:</strong> Her gün aynı saatte yapmaya çalışın.</li>
        <li><strong>Kendinizi Ödüllendirin:</strong> Küçük zaferleri kutlamak motivasyonu artırır.</li>
      </ul>
    `,
        category: 'Kişisel Gelişim',
        author: 'Dr. Sarah Johnson',
        publishedAt: '2024-01-15',
        image: '/images/blog/habit-formation.png',
        tags: ['alışkanlıklar', 'psikoloji', 'bilim'],
    },
    {
        id: '2',
        title: 'Hayatınızı Değiştirecek 10 Sabah Rutini',
        slug: 'hayatinizi-degistirecek-sabah-rutinleri',
        excerpt: 'Güne dünya çapındaki başarılı insanların kullandığı bu kanıtlanmış sabah rutinleriyle doğru bir başlangıç yapın.',
        content: `
      <p>Sabahları nasıl başladığınız, günün geri kalanını belirler. İşte güne enerjik ve odaklanmış başlamanız için öneriler:</p>
      <h2>1. Erken Uyanın</h2>
      <p>Güneşten önce uyanmak, size günün en sessiz ve verimli saatlerini hediye eder.</p>
      <h2>2. Su İçin</h2>
      <p>Uyandığınızda vücudunuzu hidrate etmek metabolizmanızı canlandırır.</p>
      <h2>3. Hareket Edin</h2>
      <p>Hafif bir yürüyüş veya esneme hareketleri kan dolaşımını hızlandırır.</p>
    `,
        category: 'Üretkenlik',
        author: 'Michael Chen',
        publishedAt: '2024-01-12',
        image: '/images/blog/morning-routine.png',
        tags: ['sabah', 'üretkenlik', 'rutinler'],
    },
    {
        id: '3',
        title: 'Günlük Hayatta Farkındalığın (Mindfulness) Gücü',
        slug: 'gunluk-hayatta-farkindaligin-gucu',
        excerpt: 'Farkındalığı günlük rutininize dahil etmenin stresi nasıl azaltabileceğini ve mutluluğu nasıl artırabileceğini keşfedin.',
        content: `
      <p>Mindfulness, şimdiki anda, yargısızca kalabilme becerisidir. Geçmişin pişmanlıkları veya geleceğin kaygıları yerine, şu ana odaklanmaktır.</p>
      <h2>Nasıl Uygulanır?</h2>
      <p>Yemek yerken sadece yemeğin tadına odaklanın. Yürürken ayaklarınızın yere değdiğini hissedin. Zihniniz dağıldığında, nazikçe nefesinize geri dönün.</p>
    `,
        category: 'Sağlık',
        author: 'Dr. James Wilson',
        publishedAt: '2024-01-08',
        image: '/images/blog/mindfulness.png',
        tags: ['farkındalık', 'meditasyon', 'esenlik'],
    }
];
