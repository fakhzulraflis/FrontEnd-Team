# Sagu Nusantara

Proyek ini adalah sebuah website edukasi tentang sagu sebagai pangan warisan Nusantara yang dinamis dan interaktif, lengkap dengan dashboard admin untuk mengelola isinya. Dibuat untuk memenuhi tugas Ujian Tengah Semester mata kuliah Front End Programming.

## Tim Pengembang

Proyek ini disusun oleh kelompok 02, dengan anggota:

-   **Adrian Rizki Bintang** 535250060
-   **Luthfi Rahman** 535250063
-   **Lucio Aurey Feliciano** 535250085
-   **Neizar Apriansyah** 535250101
-   **FAKHZUL RAFLI S** 535250102

  
---
## Deskripsi

Aplikasi ini bertujuan untuk menyajikan informasi mengenai sagu, mulai dari sejarah, proses pengolahan, ragam kuliner, hingga daerah persebarannya di Indonesia, dengan cara yang modern dan mudah diakses. Pengguna dapat menjelajahi kuliner sagu, mengenal daerah penghasil sagu, memberi reaksi pada fakta menarik, dan menguji pengetahuan mereka lewat quiz. Admin dapat menambah, mengubah, dan menghapus seluruh konten website melalui dashboard tanpa perlu menyentuh kode.

---

## Cara Kerja Aplikasi

-   Seluruh konten website (kartu tentang sagu, tahapan proses, kuliner, wilayah, fakta, quiz, dan pengaturan website) disimpan sebagai "database" di `localStorage` browser. Data awal diambil dari `data.js` saat website pertama kali dibuka.
-   Halaman utama (`index.html`) membaca data tersebut lalu menampilkannya secara dinamis melalui `script.js`, sehingga tidak ada konten yang ditulis langsung (*hardcode*) di HTML.
-   Admin masuk lewat ikon pengaturan (⚙) di navbar menuju halaman login, lalu mengelola konten di `admin-dashboard.html`. Setiap perubahan yang disimpan di dashboard langsung tersimpan ke `localStorage`.
-   Jika website dan dashboard dibuka di tab yang berbeda, halaman website akan ikut diperbarui secara otomatis tanpa perlu dimuat ulang.
-   Gambar yang diunggah admin dari laptop otomatis dikecilkan terlebih dahulu, lalu disimpan bersama data lainnya, sehingga tidak perlu memasukkan file ke folder `assets` secara manual.

---

## Fitur Utama

### Halaman Website

-   **Konten Dinamis**: Hero, Tentang Sagu, Proses Pengolahan, Kuliner, Persebaran, Fakta Menarik, Quiz, dan footer ditampilkan dari data yang dapat diatur lewat dashboard.
-   **Proses Pengolahan Interaktif**: Klik setiap tahap pada timeline untuk melihat foto dan penjelasan lengkapnya.
-   **Pencarian & Filter**: Cari kuliner sagu berdasarkan nama, daerah, atau bahan, serta filter berdasarkan wilayah, jenis, dan cara penyajian.
-   **Tampilan Detail**: Klik "Lihat Detail" pada kartu kuliner untuk melihat cerita budaya, bahan utama, cara pembuatan, dan fakta unik melalui jendela modal.
-   **Daerah Persebaran**: Pilih wilayah untuk melihat deskripsi, makanan khas sagu, dan fakta unik dari daerah tersebut.
-   **Fakta Menarik + Like & Dislike**: Fakta tentang sagu ditampilkan bersama gambar ilustrasinya. Pengguna dapat memberi reaksi *like* atau *dislike*, dan pilihan tersebut disimpan secara lokal di browser.
-   **Quiz Interaktif**: Jawaban benar ditandai hijau dan salah ditandai merah. Pengguna dapat mencoba lagi, tetapi poin hanya diberikan jika benar pada percobaan pertama, lalu skor akhir ditampilkan di akhir quiz.
-   **Navbar Scroll-Spy**: Menu navbar otomatis menandai bagian halaman yang sedang dilihat.

### Dashboard Admin

-   **Login Admin**: Halaman dashboard dilindungi dengan login sederhana (simulasi di sisi browser).
-   **CRUD Lokal**: Admin dapat **Menambah** (`Create`), **Membaca** (`Read`), **Mengubah** (`Update`), dan **Menghapus** (`Delete`) data Tentang Sagu, Proses Pengolahan, Kuliner, Persebaran, Fakta Menarik, dan Quiz menggunakan `localStorage`.
-   **Upload Gambar**: Gambar dipilih langsung dari laptop, lalu dikecilkan otomatis sebelum disimpan.
-   **Tambah Opsi Dropdown**: Saat menambah atau mengubah kuliner, admin dapat menambahkan wilayah, kategori, atau jenis penyajian baru langsung dari dropdown.
-   **Urutan Tahapan**: Urutan tahap proses pengolahan dapat dinaikkan atau diturunkan sesuai urutan tampil di website.
-   **Pengaturan Website**: Nama website, tagline, teks hero, dan teks footer dapat diubah dari dashboard.
-   **Ringkasan & Aktivitas**: Dashboard menampilkan jumlah konten, grafik kuliner per wilayah, dan riwayat aktivitas terbaru.
-   **Export, Import & Reset**: Seluruh konten dapat dicadangkan ke file JSON, dipulihkan kembali, atau dikembalikan ke data awal.

-   **Desain Responsif**: Tampilan optimal di berbagai perangkat, mulai dari desktop, tablet, hingga smartphone, baik di halaman website maupun dashboard.

---

## Teknologi yang Digunakan

-   **HTML5** (dengan elemen semantik dan `<dialog>`)
-   **CSS3** (Flexbox, Grid Layout, CSS Variables, Media Queries)
-   **JavaScript (ES6+)** (DOM Manipulation, Web Storage API, FileReader & Canvas untuk upload gambar)
-   **Google Fonts** (DM Serif Display untuk judul, Plus Jakarta Sans untuk teks)

---

## Cara Menjalankan

Proyek ini adalah aplikasi *front-end* murni dan tidak memerlukan proses instalasi atau *build*.

1.  *Clone* repositori ini:
    ```
    git clone https://github.com/upiman25-ctrl/web-sagu-uts.git
    ```
2.  Buka folder proyek.
3.  Buka file `index.html` di browser pilihan Anda.
4.  Untuk masuk ke dashboard admin, klik ikon pengaturan (⚙) di navbar, lalu login dengan:
    -   **Username**: `admin`
    -   **Password**: `sagu123`
