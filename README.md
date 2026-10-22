# 14-haftal-k-web-projesi
🎲 Ne Yapalım?

Arkadaş ortamında "Ne yapalım, ne oynayalım?" sorusuna adil ve hızlı bir cevap bulan, tek telefondan çalışan oylama uygulaması.

⚠️ Önemli: Bu uygulamada sunucu (backend) yoktur. Tüm veriler yalnızca oylamanın yapıldığı telefonun tarayıcısında, localStorage içinde tutulur. Oylama tek bir cihazdan yapılır ve telefon elden ele dolaşır.

📌 Problem

Arkadaş toplantılarında ne yapılacağı ya da hangi oyunun oynanacağı konusunda karar verilemiyor. Herkes farklı bir şey öneriyor, tartışma uzuyor ve sonunda çoğu zaman hiçbir şey yapılmıyor.

💡 Çözüm

Uygulama süreci dört adıma indirir:

Katılımcılar ve seçenekler eklenir.
İstenirse oyun önerilerinden seçeneklere ekleme yapılır.
Katılımcılar telefonu sırayla alıp gizli şekilde oy kullanır.
Sonuç ekranında kazanan açıklanır. Beraberlik varsa rastgele kura çekilir.
✨ Özellikler
Seçenek ve katılımcı yönetimi: İsim ve seçenek ekleme, silme.
Oyun önerileri: Hazır oyun listesi, "Kaç kişiyiz?" bilgisine göre filtrelenir ve tek tıkla seçeneklere eklenir.
Gizli oylama: Kişi oy verdikten sonra ekranda yalnızca "Oy kullanıldı" yazar, telefon sıradakine verilir.
Tek kişi, tek oy: Her katılımcı yalnızca bir kez oy kullanabilir.
Beraberlikte kura: Eşitlik varsa kura yalnızca bir kez, en son aşamada çekilir ve sonuç kaydedilir.
Kaldığı yerden devam: Sayfa yenilense veya kapansa bile uygulama son durumuna döner.
🧭 Ekranlar
Ekran	Açıklama
Kurulum	Katılımcı ve seçenek ekleme/silme. En az 2 katılımcı ve 2 seçenek olunca "Oylamayı başlat" aktif olur.
Oyun önerileri	Kişi sayısına uygun oyunlar listelenir, "Seçeneklere ekle" butonu bulunur.
Oylama	Sırası gelen katılımcı oy verir, ardından "Oy kullanıldı" ekranı gösterilir.
Sonuç	Kazanan gösterilir. Beraberlik varsa tek seferlik kura çekilir. "Yeni oylama" butonu bulunur.
🔒 Gizlilik ve Adillik
Kimin hangi seçeneğe oy verdiği hiçbir yerde saklanmaz. Sadece "bu kişi oy kullandı" bilgisi ve seçeneklerin toplam oy sayıları tutulur.
Oylama başladıktan sonra katılımcı ve seçenek listesi kilitlenir, böylece oylar karışmaz.
Kura sonucu bir kez kaydedilir, sayfa yenilense de değişmez.
⚙️ Teknik Detaylar
Kullanılan teknolojiler: HTML, CSS, JavaScript
Veri saklama: Tarayıcının localStorage özelliği
Sunucu: Yok
Yayın: GitHub Pages
Tasarım yaklaşımı: Mobil öncelikli (telefonda kullanım için büyük ve kolay dokunulur butonlar)
Dayanıklılık için alınan önlemler
Tüm localStorage okuma ve yazma işlemleri try/catch içindedir.
Kayıtlı veri bozulursa uygulama çökmez, temiz bir başlangıç durumuna döner.
Kullanıcının girdiği metinler textContent ile ekrana basılır, böylece kod enjeksiyonu engellenir.
Boş isim ve boş seçenek eklenemez.
Oyun listesi games.js içindedir. Bu sayede dosya index.html çift tıklanarak açıldığında da çalışır.
Oyun listesi yapısı
⚠️ Kısıtlar

Bu kısıtlar bilinçli tasarım kararlarıdır.

Oylama tek cihazda yapılır. Uzaktan veya birden fazla telefondan oylama desteklenmez.
Veriler yalnızca o telefonun o tarayıcısında saklanır. Tarayıcı verisi silinirse veya gizli sekme kapatılırsa kayıtlar kaybolur.
Her katılımcı tek oy kullanır. Çoklu seçim ve sıralamalı oylama yoktur.
Aynı isimle birden fazla katılımcı eklenebilir, isim tekrarı kontrol edilmez.
🚫 Kapsam Dışı

Proje kapsamını küçük ve bitirilebilir tutmak için şunlar eklenmeyecektir:

Oyun kategori filtresi
Sonucu kopyalama / paylaşma butonu
Geçmiş oylamalar
Ana ekrana ekleme (PWA)
Kura sonucunu yeniden çekme
