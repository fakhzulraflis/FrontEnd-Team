# IPv4 Subnet Calculator & IP Analyzer (Front End Team Project 1)

## Deskripsi Project

IPv4 Subnet Calculator & IP Analyzer adalah aplikasi web sederhana berbasis HTML, CSS, dan JavaScript yang membantu pengguna memahami konsep dasar IPv4 Addressing dan Subnetting.

Website ini menyediakan dua fitur utama:

1. **IP Analyzer**
   - Menganalisis alamat IPv4 yang dimasukkan pengguna.
   - Menampilkan informasi kelas IP, range IP, subnet mask default, network address, dan representasi biner.

2. **IPv4 Subnet Calculator**
   - Menghitung informasi subnet berdasarkan IPv4 Address dan Prefix (/24 - /31).
   - Menampilkan network address, broadcast address, host range, jumlah host, subnet mask, dan informasi CIDR.

Project ini dibuat sebagai mini project berbasis STEM pada mata kuliah front end programming.

## Aktivitas Formatif
### 1. Kapan memilih const dibanding let?
Gampangnya, kita menggunakan const ketika variabel yang ingin di assigned tidak akan berubah setelah di initialized. Kebalikannya, let digunakan ketika variabel tersebut perlu diubah / re-assign nantinya.

### 2. Apa perbedaan == dan ===?
== (Loose Equality) digunakan hanya ketika kita ingin membandingkan nilai bagian kiri dan kanan saja dengan mengabaikan perbedaan tipe data.
sedangkan, === (Strict Equality) ini digunakan untuk membandingkan nilai sekaligus tipe data secara ketat tanpa konversi.

### 3. Bagaimana mengambil elemen dengan id 'total'?​
Untuk mengambil elemen dengan id 'total' kita dapat menggunakan 
1. document.getElementById('total'); 
2. document.querySelector('#total');

### 4. Apa fungsi addEventListener()?
Fungsinya adalah menangkap dan merespons aksi pengguna pada elemen web, seperti klik tombol, ketikan keyboard, dll.

### 5. Bagaimana mengubah teks sebuah elemen secara aman?
Adalah dengan cara menggunakan properti atau syntax seperti textContent atau innerText.
