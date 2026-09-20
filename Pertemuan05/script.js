/* ==========================================================
   Kopi Nusantara - Interaktivitas jQuery (Pertemuan 5)

   Fitur yang diterapkan:
   1. Accordion FAQ            -> slideToggle(), .next(), toggleClass()
   2. Filter menu per kategori -> fadeIn() / fadeOut(), addClass/removeClass
   3. Tombol suka (like)       -> manipulasi DOM: .find(), .text(), hasClass()
   4. Tombol kembali ke atas   -> event scroll, fadeIn/fadeOut, animate()
   5. Scroll halus antarsection-> animate({ scrollTop })
   6. Validasi formulir kontak -> event submit & keyup, .val(), fadeIn()
   ========================================================== */

/* Seluruh kode dijalankan setelah DOM siap dimanipulasi */
$(document).ready(function () {

  /* Durasi animasi dipusatkan di satu variabel agar mudah diubah */
  var DURASI = 300;

  /* ==========================================================
     1. ACCORDION FAQ
     Klik pertanyaan -> jawaban di bawahnya dibuka/ditutup
     dengan slideToggle(). Hanya satu jawaban boleh terbuka.
     ========================================================== */
  $(".faq-question").on("click", function () {
    /* Status pertanyaan yang sedang diklik sebelum diubah */
    var sedangTerbuka = $(this).hasClass("open");

    /* .next() memilih elemen jawaban tepat setelah pertanyaan ini */
    var $jawaban = $(this).next(".faq-answer");

    /* Tutup semua pertanyaan lain: hapus penanda class & status aria */
    $(".faq-question")
      .not(this)
      .removeClass("open")
      .attr("aria-expanded", "false");

    /* Tutup seluruh jawaban lain agar hanya satu yang terbuka */
    $(".faq-answer")
      .not($jawaban)
      .stop(true, true)
      .slideUp(DURASI);

    /* Buka atau tutup jawaban yang diklik.
       stop(true, true) mencegah animasi menumpuk saat diklik cepat. */
    $jawaban.stop(true, true).slideToggle(DURASI);

    /* toggleClass('open') dipakai CSS untuk memutar ikon panah */
    $(this)
      .toggleClass("open")
      .attr("aria-expanded", !sedangTerbuka);
  });

  /* ==========================================================
     2. FILTER MENU BERDASARKAN KATEGORI
     Tombol filter menyaring kartu menu memakai atribut
     data-kategori, dengan efek fadeIn() / fadeOut().
     ========================================================== */
  $(".filter-btn").on("click", function () {
    var kategori = $(this).data("filter");

    /* Tandai tombol yang sedang aktif lewat class, bukan .css() */
    $(".filter-btn").removeClass("aktif");
    $(this).addClass("aktif");

    /* Periksa tiap kartu: tampilkan bila cocok, sembunyikan bila tidak */
    $(".menu-card").each(function () {
      var cocok = kategori === "semua" || $(this).data("kategori") === kategori;

      if (cocok) {
        $(this).stop(true, true).fadeIn(DURASI);
      } else {
        $(this).stop(true, true).fadeOut(DURASI);
      }
    });
  });

  /* ==========================================================
     3. TOMBOL SUKA PADA KARTU MENU
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
     4. TOMBOL KEMBALI KE ATAS
     Muncul setelah halaman di-scroll, lalu menggulung halaman
     ke atas dengan animasi halus.
     ========================================================== */
  var $tombolAtas = $("#backToTop");

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $tombolAtas.stop(true, true).fadeIn(DURASI);
    } else {
      $tombolAtas.stop(true, true).fadeOut(DURASI);
    }
  });

  $tombolAtas.on("click", function () {
    $("html, body").stop(true).animate({ scrollTop: 0 }, 600);
  });

  /* ==========================================================
     5. SCROLL HALUS UNTUK TAUTAN DALAM HALAMAN
     Berlaku untuk menu navigasi, tombol hero, dan logo.
     ========================================================== */
  $(".nav-menu a, .hero-buttons a, .logo").on("click", function (event) {
    var tujuan = $(this).attr("href");
    var $bagian = $(tujuan);

    /* Hanya tangani tautan yang benar-benar menuju section di halaman ini */
    if ($bagian.length) {
      event.preventDefault();
      $("html, body").stop(true).animate({ scrollTop: $bagian.offset().top - 10 }, 600);
    }
  });

  /* ==========================================================
     6. FORMULIR KONTAK
     a) Penghitung karakter dengan event keyup.
     b) Validasi sederhana saat formulir dikirim.
     ========================================================== */

  /* a) Jumlah karakter pesan diperbarui setiap tombol dilepas */
  $("#pesan").on("keyup", function () {
    $("#charCount").text($(this).val().length + " karakter");
  });

  /* Fungsi bantu agar pesan validasi ditampilkan dengan cara yang sama */
  function tampilkanPesan(teks, berhasil) {
    $("#formFeedback")
      .stop(true, true)
      .hide()
      .text(teks)
      .toggleClass("success", berhasil)
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

});
