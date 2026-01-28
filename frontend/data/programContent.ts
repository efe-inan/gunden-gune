export interface Task {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
}

export interface DailyContent {
    day: number;
    theme: string;
    motivationMessage: string;
    tasks: Task[];
}

export const programContent: DailyContent[] = [
    // WEEK 1: FOUNDATION (TEMELLER)
    {
        day: 1,
        theme: 'Başlangıç ve Farkındalık',
        motivationMessage: 'Her büyük yolculuk küçük bir adımla başlar. Bugün senin günün.',
        tasks: [
            { id: 'd1-t1', title: 'Niyet Belirleme', description: 'Bu 21 günlük yolculuktan beklentilerini ve niyetini bir kağıda yaz.', duration: 10 },
            { id: 'd1-t2', title: 'Su Tüketimi Başlangıcı', description: 'Bugün en az 2 litre su içmeyi hedefle.', duration: 5 },
            { id: 'd1-t3', title: '5 Dakika Sessizlik', description: 'Gözlerini kapat ve sadece nefesine odaklan.', duration: 5 },
        ]
    },
    {
        day: 2,
        theme: 'Düzen ve Rutin',
        motivationMessage: 'Düzen, zihnin sakinleştiği yerdir.',
        tasks: [
            { id: 'd2-t1', title: 'Yatak Toplama', description: 'Güne ilk görevini tamamlayarak başla.', duration: 5 },
            { id: 'd2-t2', title: 'Ekran Süresi Kontrolü', description: 'Bugün sosyal medyada geçirdiğin süreyi 15 dakika azalt.', duration: 0 },
            { id: 'd2-t3', title: 'Yürüyüş', description: 'Temiz havada kısa bir yürüyüş yap.', duration: 20 },
        ]
    },
    {
        day: 3,
        theme: 'Beslenme Farkındalığı',
        motivationMessage: 'Bedenin senin tapınağındır, ona iyi bak.',
        tasks: [
            { id: 'd3-t1', title: 'Şekersiz Gün', description: 'Bugün işlenmiş şeker tüketmemeye çalış.', duration: 0 },
            { id: 'd3-t2', title: 'Yeşil Öğün', description: 'Öğünlerinden birine bol yeşillik ekle.', duration: 15 },
            { id: 'd3-t3', title: 'Akşam Esnemesi', description: 'Uyumadan önce hafif esneme hareketleri yap.', duration: 10 },
        ]
    },
    {
        day: 4,
        theme: 'Dijital Detoks',
        motivationMessage: 'Bağlantıyı koparmak, kendine bağlanmaktır.',
        tasks: [
            { id: 'd4-t1', title: 'Bildirimleri Kapat', description: 'Gereksiz uygulama bildirimlerini gün boyu sessize al.', duration: 5 },
            { id: 'd4-t2', title: 'Kitap Okuma', description: 'Telefona bakmak yerine 20 dakika kitap oku.', duration: 20 },
            { id: 'd4-t3', title: 'Erken Uyku', description: 'Yatağa normalden 30 dakika erken git.', duration: 0 },
        ]
    },
    {
        day: 5,
        theme: 'Minnettarlık',
        motivationMessage: 'Şükretmek, sahip olduklarını çoğaltır.',
        tasks: [
            { id: 'd5-t1', title: 'Şükür Günlüğü', description: 'Hayatında minnettar olduğun 3 şeyi yaz.', duration: 10 },
            { id: 'd5-t2', title: 'Teşekkür Mesajı', description: 'Sevdiğin birine sebepsizce teşekkür et.', duration: 5 },
            { id: 'd5-t3', title: 'Doğada Zaman', description: 'Bir parka git veya gökyüzünü izle.', duration: 15 },
        ]
    },
    {
        day: 6,
        theme: 'Öz Bakım',
        motivationMessage: 'Kendine zaman ayırmak lüks değil, ihtiyaçtır.',
        tasks: [
            { id: 'd6-t1', title: 'Cilt Bakımı / Duş', description: 'Kendine uzun ve özenli bir bakım rutini uygula.', duration: 20 },
            { id: 'd6-t2', title: 'Hobine Vakit Ayır', description: 'Seni mutlu eden bir aktiviteyle ilgilen.', duration: 30 },
            { id: 'd6-t3', title: 'Haftalık Değerlendirme', description: 'İlk haftan nasıl geçti? Düşüncelerini not al.', duration: 10 },
        ]
    },
    {
        day: 7,
        theme: 'Dinlenme ve Yenilenme',
        motivationMessage: 'Durmak, ilerlemenin bir parçasıdır.',
        tasks: [
            { id: 'd7-t1', title: 'Hiçbir Şey Yapmama Sanatı', description: '15 dakika boyunca suçluluk duymadan dinlen.', duration: 15 },
            { id: 'd7-t2', title: 'Gelecek Hafta Planı', description: 'Gelecek hafta için hedeflerini gözden geçir.', duration: 15 },
            { id: 'd7-t3', title: 'Meditasyon', description: 'Haftayı huzurla kapatmak için meditasyon yap.', duration: 10 },
        ]
    },

    // WEEK 2: ACCELERATION (HIZLANMA)
    {
        day: 8,
        theme: 'Odaklanma',
        motivationMessage: 'Enerjini nereye akıtırsan, orası büyür.',
        tasks: [
            { id: 'd8-t1', title: 'Pomodoro Tekniği', description: 'Bir işi 25 dakika odaklanarak yap.', duration: 25 },
            { id: 'd8-t2', title: 'Masa Düzeni', description: 'Çalışma alanını veya odanı düzenle.', duration: 15 },
        ]
    },
    {
        day: 9,
        theme: 'Hareket',
        motivationMessage: 'Harekete geçmek, duygu durumunu değiştirir.',
        tasks: [
            { id: 'd9-t1', title: 'Egzersiz', description: '30 dakikalık orta tempo egzersiz yap.', duration: 30 },
            { id: 'd9-t2', title: 'Merdiven Kullan', description: 'Bugün asansör yerine merdivenleri tercih et.', duration: 0 },
        ]
    },
    {
        day: 10,
        theme: 'Öğrenme',
        motivationMessage: 'Her gün yeni bir şey öğrenen zihin asla yaşlanmaz.',
        tasks: [
            { id: 'd10-t1', title: 'TED Konuşması / Podcast', description: 'İlham verici bir konuşma veya podcast dinle.', duration: 20 },
            { id: 'd10-t2', title: 'Yeni Kelime/Kavram', description: 'Yabancı bir dilde veya alanında yeni bir terim öğren.', duration: 5 },
        ]
    },
    {
        day: 11,
        theme: 'Sınırları Zorlama',
        motivationMessage: 'Konfor alanının dışında büyüme başlar.',
        tasks: [
            { id: 'd11-t1', title: 'Soğuk Duş', description: 'Duşunun son 30 saniyesini soğuk suyla bitir.', duration: 5 },
            { id: 'd11-t2', title: 'Ertelediğin İş', description: 'Uzun süredir ertelediğin o zor işi yap.', duration: 30 },
        ]
    },
    {
        day: 12,
        theme: 'Yaratıcılık',
        motivationMessage: 'İçindeki yaratıcı gücü serbest bırak.',
        tasks: [
            { id: 'd12-t1', title: 'Yazı / Çizim', description: 'Serbest akış yazı yaz veya bir şeyler çiz.', duration: 20 },
            { id: 'd12-t2', title: 'Müzik Keşfi', description: 'Daha önce hiç dinlemediğin bir türde müzik dinle.', duration: 15 },
        ]
    },
    {
        day: 13,
        theme: 'Sosyal Bağlar',
        motivationMessage: 'İnsan insana şifadır.',
        tasks: [
            { id: 'd13-t1', title: 'Eski Bir Dost', description: 'Uzun süredir görüşmediğin bir arkadaşını ara.', duration: 15 },
            { id: 'd13-t2', title: 'Aktif Dinleme', description: 'Bugün konuştuğun birini gerçekten can kulağıyla dinle.', duration: 0 },
        ]
    },
    {
        day: 14,
        theme: 'Hafta Sonu Değerlendirmesi',
        motivationMessage: 'Yolun yarısındasın, gurur duy.',
        tasks: [
            { id: 'd14-t1', title: 'Yarı Yol Kutlaması', description: 'Kendine küçük bir ödül ver (sağlıklı bir atıştırmalık, film vb.).', duration: 0 },
            { id: 'd14-t2', title: 'Yansıtma Yazısı', description: 'İlk 14 günde nelerin değiştiğini yaz.', duration: 15 },
        ]
    },

    // WEEK 3: TRANSFORMATION (DÖNÜŞÜM)
    {
        day: 15,
        theme: 'Vizyon',
        motivationMessage: 'Geleceği tahmin etmenin en iyi yolu, onu yaratmaktır.',
        tasks: [
            { id: 'd15-t1', title: 'Vizyon Panosu', description: 'Hayallerini temsil eden görsellere bak veya çiz.', duration: 15 },
            { id: 'd15-t2', title: 'Hedef Güncellemesi', description: 'Uzun vadeli hedeflerini gözden geçir.', duration: 10 },
        ]
    },
    {
        day: 16,
        theme: 'Cömertlik',
        motivationMessage: 'Veren el, alan elden üstündür.',
        tasks: [
            { id: 'd16-t1', title: 'Yardım Et', description: 'Birine karşılık beklemeden yardım et.', duration: 10 },
            { id: 'd16-t2', title: 'Fazlalıklardan Arın', description: 'Kullanmadığın 3 eşyayı ayır/bağışla.', duration: 20 },
        ]
    },
    {
        day: 17,
        theme: 'Doğruluk',
        motivationMessage: 'Kendine dürüst ol.',
        tasks: [
            { id: 'd17-t1', title: 'Ayna Çalışması', description: 'Aynada kendine bak ve olumlu onaylamalar söyle.', duration: 5 },
            { id: 'd17-t2', title: 'Sözünü Tut', description: 'Kendine verdiğin küçük bir sözü yerine getir.', duration: 0 },
        ]
    },
    {
        day: 18,
        theme: 'Sabır',
        motivationMessage: 'Sabır, bekleme becerisi değil, beklerkenki tavrındır.',
        tasks: [
            { id: 'd18-t1', title: 'Trafik / Sıra Sabrı', description: 'Bugün beklemek zorunda kaldığında sinirlenme, nefesine odaklan.', duration: 0 },
            { id: 'd18-t2', title: 'Uzun Okuma', description: 'Derinlemesine bir makale veya kitap bölümü oku.', duration: 25 },
        ]
    },
    {
        day: 19,
        theme: 'Cesaret',
        motivationMessage: 'Korku bir tepkidir, cesaret bir karardır.',
        tasks: [
            { id: 'd19-t1', title: 'Hayır De', description: 'İstemediğin bir şeye nazikçe "Hayır" de.', duration: 0 },
            { id: 'd19-t2', title: 'Yeni Rota', description: 'Eve veya işe giderken farklı bir yol kullan.', duration: 15 },
        ]
    },
    {
        day: 20,
        theme: 'Bütünlük',
        motivationMessage: 'Parçalar birleşiyor, resim netleşiyor.',
        tasks: [
            { id: 'd20-t1', title: 'Bütünsel Bakış', description: 'Vücut, zihin ve ruh dengeni kontrol et.', duration: 10 },
            { id: 'd20-t2', title: 'Mektup', description: '21. günün sonundaki kendine bir mektup yaz.', duration: 15 },
        ]
    },
    {
        day: 21,
        theme: 'Kutlama ve Devamlılık',
        motivationMessage: 'Bu bir son değil, yeni bir başlangıç.',
        tasks: [
            { id: 'd21-t1', title: 'Mezuniyet Yürüyüşü', description: 'Kendinle gurur duyarak uzun bir yürüyüş yap.', duration: 45 },
            { id: 'd21-t2', title: 'Yeni Sözleşme', description: 'Bu serüvenden edindiğin hangi alışkanlığı sürdüreceğine karar ver.', duration: 10 },
            { id: 'd21-t3', title: 'Kutlama', description: 'Başarını sevdiğin bir şekilde kutla!', duration: 0 },
        ]
    }
];
