16 EKİM ÖDEVİ



BEN: merhaba ben githuptan  bir uygulama geliştireceğim. Ön lisans öğrencisiyim ve temel html ve css dillerini biliyorum. Uygulamam; bir etkinlik oyun,  ve oylama sayfası olacak. problemim: Arkadaş ortamında,  ne yapalım, ne oynayalım kararı hiç verilemiyor. Çözümüm de ;seçenek ekleme, oyun önerileri ve , oylama ekranı ve sonuç ekranı . Benim fikrim bu ancak " Backend olmayacak sadece LocalStorage"  Ve bu oylama benim telefonumdan olucak sadece projemde bunu açıkca belirticem.  Sitenin içeriği ve tasarımı olucak ve yazdığımız kodun her daim çalışabilirliği çok önemli . eksikliklerim neler fikrim nasıl?.

YAPAY ZEKA:Uygulamadaki olası sorunlar ve iyileştirmeler listeleniyor
Kararların tutarlı ve uygulanabilir. Şimdi eksik kalan noktalara bakalım.

Uygulamandaki olası sorunlar
1. Sayfa yenilenirse akış bozulabilir. Telefonda yanlışlıkla yenileme veya sekme kapanması çok olur. Sadece oyları değil, uygulamanın hangi aşamada olduğunu da (kurulum, oylama, sonuç) ve kimin oy kullandığını localStoragea kaydet. Sayfa açılınca kaldığı yerden devam etsin.

2. Geri tuşu gizliliği bozabilir. Biri oy verip telefonu uzattığında, sıradaki kişi geri tuşuyla önceki ekrana dönebilir. Oy verildiği anda ekranı tamamen temizle ve sadece “Oy kullanıldı” göster. Ayrıca kimin neye oy verdiğini hiç saklama. Sadece “bu kişi oy kullandı” bilgisini ve seçeneklerin sayaçlarını tut.

3. Kura sonucu kaydedilmeli. Beraberlikte kurayı her sayfa açılışında yeniden çekersen sonuç değişir ve “tekrar çekeyim” hilesi mümkün olur. Kura bir kez çekilsin, sonuç kaydedilsin. İstersen “kurayı yeniden çek” butonunu bilinçli olarak ekleyebilirsin.

4. Oylama başladıktan sonra liste kilitlenmeli. Seçenek veya katılımcı eklenirse, silinirse oylar karışır. “Oylamayı başlat” butonuna basınca liste kilitlensin.

5. Aynı isim iki kez girilebilir. “Ali” ve “ali” gibi tekrarları küçük harfe çevirip karşılaştırarak engelle.

6. En az sayılar kontrol edilmeli. En az 2 seçenek ve 2 katılımcı olmadan oylama başlamasın. Bu yüzden “başlat” butonu o zamana kadar pasif kalsın.

7. Oyun listesini nasıl tutacağın önemli. Listeyi games.json olarak tutup fetch ile okursan, dosyayı bilgisayarında çift tıklayıp açtığında çalışmaz. Sadece sunucuda çalışır. “Her daim çalışsın” hedefin için listeyi games.js içinde bir dizi olarak yaz ve HTML’e <script> ile ekle. Her şekilde çalışır.

Ek fikirler (önem sırasıyla)
Oyun önerisinden tek tıkla seçeneklere ekleme. Önerilen oyun listede çıkar, “Seçeneklere ekle” butonuna basılır. İki bölümü birbirine bağlayan en güçlü özellik bu.
“Kaç kişiyiz?” filtresi. Oyunlarda min/maks kişi sayısı olsun, katılımcı sayına göre otomatik filtrelensin.
Kategori filtresi. Örneğin kart oyunu, hareketli, sakin, ekipman gerektirmeyen.
Sonucu kopyala. “Kazanan: Tabu, 4 oy” gibi bir metni WhatsApp grubuna atmak için kopyalama butonu.
Geçmiş oylamalar. Son 5 sonucu saklayıp göstermek, aynı şeyin sürekli çıkmasını fark ettirir.
Ana ekrana ekleme (PWA). Telefonda uygulama gibi açılır. İleride, temel iş bittikten sonra ekle.
İlk sürüme sadece 1, 2 ve 4'ü eklemeni öneririm. Geri kalanı sonra ekleyebilirsin, yoksa proje büyür ve bitmez.

Projene yazabileceğin kısıtlar
Oylama tek cihazda, localStorage ile yapılır. Veriler cihaza özeldir ve tarayıcı verisi silinirse kaybolur. Sunucu yoktur, bu yüzden uzaktan oylama desteklenmez. Bu tasarım bilinçli bir tercihtir ve uygulamanın çevrimdışı çalışmasını sağlar.

Bir sonraki adım olarak, önce üç ekranın (Kurulum, Oylama, Sonuç) HTML/CSS iskeletini birlikte yazabiliriz. Başlayalım mı?

BEN: Aynı isim iki kez girilebilir. “Ali” ve “ali” gibi tekrarları küçük harfe çevirip karşılaştırarak engelle.buna gerek yok ve 3. Kura sonucu kaydedilmeli. Beraberlikte kurayı her sayfa açılışında yeniden çekersen sonuç değişir ve “tekrar çekeyim” hilesi mümkün olur. Kura bir kez çekilsin, sonuç kaydedilsin. İstersen “kurayı yeniden çek” butonunu bilinçli olarak ekleyebilirsin. buradad kura 1 kez ve en son beraberlikte çekliecek Kategori filtresi. Örneğin kart oyunu, hareketli, sakin, ekipman gerektirmeyen. Sonucu kopyala. “Kazanan: Tabu, 4 oy” gibi bir metni WhatsApp grubuna atmak için kopyalama butonu. Geçmiş oylamalar. Son 5 sonucu saklayıp göstermek, aynı şeyin sürekli çıkmasını fark ettirir. Ana ekrana ekleme (PWA). Telefonda uygulama gibi açılır. İleride, temel iş bittikten sonra ekle. bunlarıda uygulamamda istemiyorum


YAPAY ZEKA:Tamam, bunları çıkarıyorum. Kapsam daha küçük ve bitirilebilir oldu.

Kura hakkında
Kura yine de sonucu kaydetmeli. Bunun “tekrar çekme” ile ilgisi yok, sayfa yenilenince sonucun değişmemesi için gerekli. Mantık şöyle:

Kura sadece oylar bitince ve beraberlik varsa çekilir.
Sonuç bir kez kaydedilir, sayfa yenilense de aynı kalır.
“Tekrar çek” butonu yoktur.
İsim tekrarı
Aynı isim girilebilir, kontrol yazmayacağız. Tek şart boş isim girilmemesi.

Son kapsam
Ekranlar

Kurulum: Katılımcı isimleri ve seçenekler eklenir, silinebilir. En az 2 katılımcı ve 2 seçenek olunca “Oylamayı başlat” aktif olur.
Oyun önerileri: “Kaç kişiyiz?” filtresi uygulanır, “Seçeneklere ekle” butonu bulunur.
Oylama: Sırayla bir kişi oy verir, ardından ekranda sadece “Oy kullanıldı” yazar ve telefon sıradakine verilir.
Sonuç: Kazanan gösterilir, beraberlik varsa tek seferlik kura çekilir, “Yeni oylama” butonu bulunur.
Güvenlik ve çalışabilirlik

Uygulama kaldığı yerden devam eder (aşama, oy kullananlar, sayaçlar, kura sonucu).
Kimin neye oy verdiği saklanmaz.
localStorage işlemleri try/catch içinde yapılır.
Oylama başlayınca liste kilitlenir.
Oyun listesi games.js içinde durur, böylece her ortamda çalışır.
Eklenmeyenler: kategori filtresi, sonucu kopyalama, geçmiş oylamalar, PWA.

Oyun listesi için veri yapısı
Kategori olmadığı için her oyun bu kadar basit olabilir:



BEN:bu dediklerin uygundur şimdi projemi readmeye uygun tanıt açıkla

Bir dosya oluşturuldu, paylaşılan dosyalar
README.md hazır. Tüm kararlarını içeriyor: tek cihaz ve localStorage kısıtı, gizli oylama, tek seferlik kura, kapsam dışı bırakılanlar ve proje yapısı.



KULLANICI_ADIN ve Adın Soyadın kısımlarını kendi bilgilerinle doldurmalısın.
“Geliştirme Durumu” bölümündeki kutucuklar boş. Her adımı bitirdikçe [ ] yerine [x] yazarak işaretle, böylece hocan ilerlemeni görebilir.

Sıradaki adım olarak dört ekranın HTML/CSS iskeletini yazmaya başlayalım mı?

Readme
Belge
·MD



