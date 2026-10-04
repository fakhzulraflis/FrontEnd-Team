/* ==========================================================
   Kopi Nusantara - Script (Pertemuan 6, Bootstrap)

   Yang kini DITANGANI BOOTSTRAP (tanpa JavaScript tulisan sendiri):
   - Toggle menu navbar di mobile  -> data-bs-toggle="collapse"
   - Accordion FAQ                 -> komponen accordion Bootstrap
     (menggantikan slideToggle() jQuery dari Pertemuan 5)
   - Scroll halus antarsection     -> sudah bawaan CSS Bootstrap
     (scroll-behavior: smooth), jadi animate() jQuery tidak dipakai lagi

   Fitur jQuery dari Pertemuan 5 yang DIPERTAHANKAN
   (belum ada padanannya di Bootstrap):
   1. Filter menu per kategori  -> fadeIn() / fadeOut()
   2. Tombol suka (like)        -> manipulasi DOM: .find(), .text()
   3. Tombol kembali ke atas    -> event scroll, fadeIn/fadeOut
   4. Validasi formulir kontak  -> event submit & keyup, alert Bootstrap
   5. Menutup menu navbar mobile setelah link diklik (API Bootstrap)
   ========================================================== */

/* Seluruh kode dijalankan setelah DOM siap dimanipulasi */
$(document).ready(function () {

  /* Durasi animasi dipusatkan di satu variabel agar mudah diubah */
  var DURASI = 300;

  /* ==========================================================
     1. FILTER MENU BERDASARKAN KATEGORI
     Yang disembunyikan adalah kolom grid (.menu-item), bukan
     card-nya, agar kolom kosong tidak menyisakan ruang di .row.
     ========================================================== */
  $(".filter-btn").on("click", function () {
    var kategori = $(this).data("filter");

    /* Class .active bawaan Bootstrap menandai tombol yang dipilih */
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    /* Menu panas berada di kolom kanan, jadi saat difilter kartunya
       tetap muncul di kanan lewat utility class justify-content-end */
    $("#menuGrid").toggleClass("justify-content-end", kategori === "panas");

    $(".menu-item").each(function () {
      var cocok = kategori === "semua" || $(this).data("kategori") === kategori;

      if (cocok) {
        $(this).stop(true, true).fadeIn(DURASI);
      } else {
        $(this).stop(true, true).fadeOut(DURASI);
      }
    });
  });

  /* ==========================================================
     2. TOMBOL SUKA PADA KARTU MENU
     Menambah/mengurangi jumlah suka serta mengubah ikon hati.
     ========================================================== */
  $(".like-btn").on("click", function () {
    var $tombol = $(this);
    var $jumlah = $tombol.find(".like-count");
    var $hati = $tombol.find(".heart");
    var jumlahSekarang = parseInt($jumlah.text(), 10);

    if ($tombol.hasClass("liked")) {
      /* Batal menyukai: kembalikan hati kosong dan kurangi angka */
      $tombol.removeClass("liked");
      $hati.text("♡");
      $jumlah.text(jumlahSekarang - 1);
    } else {
      /* Menyukai: hati penuh dan angka bertambah */
      $tombol.addClass("liked");
      $hati.text("♥");
      $jumlah.text(jumlahSekarang + 1);
    }
  });

  /* ==========================================================
     3. TOMBOL KEMBALI KE ATAS
     Muncul setelah halaman di-scroll lebih dari 300px.
     ========================================================== */
  var $tombolAtas = $("#backToTop");

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $tombolAtas.stop(true, true).fadeIn(DURASI);
    } else {
      $tombolAtas.stop(true, true).fadeOut(DURASI);
    }
  });

  /* scrollTo() dipakai (bukan animate()) karena Bootstrap sudah
     mengaktifkan scroll halus; keduanya bila digabung saling bertabrakan */
  $tombolAtas.on("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ==========================================================
     4. FORMULIR KONTAK
     a) Penghitung karakter dengan event keyup.
     b) Validasi sederhana saat formulir dikirim; hasilnya
        ditampilkan pada komponen alert Bootstrap.
     ========================================================== */

  /* a) Jumlah karakter pesan diperbarui setiap tombol dilepas */
  $("#pesan").on("keyup", function () {
    $("#charCount").text($(this).val().length + " karakter");
  });

  /* Fungsi bantu: berhasil -> alert-success (hijau), gagal -> alert-danger (merah) */
  function tampilkanPesan(teks, berhasil) {
    $("#formFeedback")
      .stop(true, true)
      .hide()
      .text(teks)
      .toggleClass("alert-success", berhasil)
      .toggleClass("alert-danger", !berhasil)
      .fadeIn(DURASI);
  }

  /* b) Validasi formulir: semua kolom terisi dan format email benar */
  $("#contactForm").on("submit", function (event) {
    event.preventDefault(); /* cegah halaman memuat ulang */

    var nama = $("#nama").val().trim();
    var email = $("#email").val().trim();
    var pesan = $("#pesan").val().trim();
    var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nama === "" || email === "" || pesan === "") {
      tampilkanPesan("Mohon lengkapi semua kolom terlebih dahulu.", false);
      return;
    }

    if (!polaEmail.test(email)) {
      tampilkanPesan("Format email belum benar, contoh: nama@email.com", false);
      return;
    }

    tampilkanPesan("Terima kasih, " + nama + "! Pesan Anda sudah kami terima.", true);

    /* Kosongkan formulir dan penghitung karakter setelah berhasil */
    this.reset();
    $("#charCount").text("0 karakter");
  });

  /* ==========================================================
     5. TUTUP MENU NAVBAR SETELAH LINK DIKLIK (MODE MOBILE)
     Bootstrap tidak menutup menu collapse secara otomatis, jadi
     dipanggil method hide() dari API Collapse milik Bootstrap.
     getInstance() bernilai null bila menu belum pernah dibuka
     (mis. di desktop), sehingga tidak ada yang dijalankan.
     ========================================================== */
  $("#navMenu .nav-link").on("click", function () {
    var menu = bootstrap.Collapse.getInstance(document.getElementById("navMenu"));
    if (menu) {
      menu.hide();
    }
  });

});
