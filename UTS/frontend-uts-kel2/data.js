// file ini dipakai index.html, admin-login.html sama admin-dashboard.html
// isinya data awal website + fungsi buat simpan/ambil data dari localStorage

// data awal, dipakai kalau localStorage masih kosong
const DEFAULT_DATA = {
  // tentang sagu
  aboutCards: [
    {
      id: "ab1",
      title: "Apa itu Sagu?",
      image: "assets/images/tentang-apa-itu-sagu.jpg",
      description:
        "Sagu adalah tepung pati yang diekstrak dari batang pohon rumbia (Metroxylon sagu). Satu pohon sagu dapat menghasilkan ratusan kilogram tepung yang menjadi sumber karbohidrat utama bagi masyarakat di kawasan timur Indonesia."
    },
    {
      id: "ab2",
      title: "Sejarah Sagu",
      image: "assets/images/tentang-sejarah-sagu.jpg",
      description:
        "Jauh sebelum beras masuk sebagai makanan pokok, masyarakat Papua, Maluku, dan pesisir Sulawesi telah mengandalkan sagu selama ratusan tahun. Sagu tercatat dalam catatan pelaut Eropa abad ke-16 sebagai \"roti pohon\" khas Nusantara."
    },
    {
      id: "ab3",
      title: "Mengapa Sagu itu Penting?",
      image: "assets/images/tentang-mengapa-penting.jpg",
      description:
        "Pohon sagu tumbuh subur di lahan basah tanpa perlu pupuk kimia, menjadikannya sumber pangan yang ramah lingkungan dan berkelanjutan, sekaligus penjaga ekosistem rawa gambut di Indonesia timur."
    },
    {
      id: "ab4",
      title: "Manfaat Sagu",
      image: "assets/images/tentang-manfaat-sagu.jpg",
      description:
        "Bebas gluten, rendah lemak, dan mudah dicerna. Sagu juga menjadi sumber energi tahan lama karena kandungan karbohidrat kompleksnya, serta bahan baku ramah penderita intoleransi gluten."
    }
  ],

  // proses pengolahan
  processingSteps: [
    {
      id: "st1",
      title: "Pohon Sagu",
      icon: "assets/icons/ikon-pohon-sagu.svg",
      image: "assets/images/proses-pohon-sagu.jpg",
      description:
        "Pohon sagu (Metroxylon sagu) umumnya dipilih pada usia 8–12 tahun, ketika kandungan pati di dalam batang telah mencapai titik maksimal. Salah satu tanda bahwa pohon telah memasuki masa siap panen adalah munculnya kuncup bunga pada bagian pucuk. Pada tahap ini, batang sagu memiliki cadangan pati yang cukup tinggi sehingga lebih optimal untuk diolah menjadi tepung sagu. Setelah pohon yang sesuai dipilih, batang kemudian ditebang dan dipersiapkan untuk memasuki tahap pengolahan berikutnya, yaitu pengupasan dan pengambilan empulur."
    },
    {
      id: "st2",
      title: "Penebangan",
      icon: "assets/icons/ikon-penebangan.svg",
      image: "assets/images/proses-penebangan.jpg",
      description:
        "Pohon sagu yang telah siap panen ditebang menggunakan kapak atau gergaji pada bagian pangkal batang, dekat permukaan tanah. Setelah rebah, pelepah dan daunnya dibersihkan, lalu batang dipotong menjadi beberapa gelondong sepanjang 1–2 meter agar mudah diangkut. Gelondong ini biasanya dihanyutkan melalui sungai atau kanal menuju tempat pengolahan. Penebangan dilakukan secara selektif sehingga anakan sagu di sekitarnya tetap tumbuh dan hutan sagu dapat terus lestari."
    },
    {
      id: "st3",
      title: "Pengambilan Empulur",
      icon: "assets/icons/ikon-empulur.svg",
      image: "assets/images/proses-empulur.jpg",
      description:
        "Gelondong batang sagu dibelah memanjang untuk membuka bagian dalamnya. Empulur, yaitu jaringan lunak berwarna putih kekuningan yang menyimpan pati, kemudian dipangkur atau diparut menggunakan alat tradisional dari kayu atau bambu hingga menjadi serpihan halus. Di beberapa daerah, proses ini kini dibantu mesin parut agar lebih cepat. Serpihan empulur yang dihasilkan ditampung dan siap dibawa ke tahap penyaringan untuk memisahkan pati dari seratnya."
    },
    {
      id: "st4",
      title: "Penyaringan",
      icon: "assets/icons/ikon-penyaringan.svg",
      image: "assets/images/proses-penyaringan.jpg",
      description:
        "Serpihan empulur dicampur dengan air, lalu diremas dan diinjak di atas saringan kain yang dipasang pada wadah dari pelepah sagu. Air yang membawa butiran pati mengalir dan tertampung di bak pengendapan, sedangkan ampas serat tertinggal di atas saringan. Proses ini diulang beberapa kali hingga pati benar-benar terpisah. Setelah didiamkan, pati akan mengendap di dasar wadah dan air di atasnya dibuang secara perlahan."
    },
    {
      id: "st5",
      title: "Pengeringan",
      icon: "assets/icons/ikon-pengeringan.svg",
      image: "assets/images/proses-pengeringan.jpg",
      description:
        "Endapan pati sagu yang masih basah diambil dan dijemur di bawah sinar matahari di atas tikar atau nampan lebar. Selama pengeringan, pati diratakan dan dibalik secara berkala agar kering merata dan tidak berjamur. Proses ini dapat berlangsung satu hingga beberapa hari tergantung cuaca. Kadar air yang rendah membuat tepung sagu lebih awet disimpan, meskipun sebagian masyarakat juga menyimpan sagu basah yang dibungkus daun dalam wadah tumang."
    },
    {
      id: "st6",
      title: "Tepung Sagu",
      icon: "assets/icons/ikon-tepung-sagu.svg",
      image: "assets/images/proses-tepung-sagu.jpg",
      description:
        "Pati yang telah kering kemudian ditumbuk atau digiling hingga halus, lalu diayak untuk menghasilkan tepung sagu yang putih dan lembut. Tepung ini dikemas dalam karung atau wadah tertutup agar terhindar dari kelembapan. Tepung sagu kaya karbohidrat, bebas gluten, dan dapat disimpan dalam waktu lama. Selain untuk konsumsi rumah tangga, tepung sagu juga dijual ke pasar dan menjadi bahan baku berbagai industri pangan."
    },
    {
      id: "st7",
      title: "Penyajian",
      icon: "assets/icons/ikon-penyajian.svg",
      image: "assets/images/proses-penyajian.jpg",
      description:
        "Tepung sagu siap diolah menjadi beragam hidangan khas Nusantara. Di Papua dan Maluku, sagu diseduh dengan air panas menjadi papeda yang kental dan disantap bersama ikan kuah kuning. Sagu juga dipanggang menjadi sagu lempeng, dibuat bagea yang renyah, hingga diolah menjadi kapurung khas Sulawesi. Keragaman olahan ini menunjukkan bahwa sagu bukan sekadar bahan pangan, melainkan bagian penting dari budaya masyarakat Indonesia timur."
    }
  ],

  // kuliner sagu
  foods: [
    {
      id: "fd1",
      name: "Papeda",
      region: "Papua",
      category: "Makanan Utama",
      servingType: "Basah",
      image: "assets/images/kuliner-papeda.jpg",
      description:
        "Bubur sagu bening bertekstur kenyal yang menjadi makanan pokok masyarakat Papua dan Maluku, disantap bersama ikan kuah kuning.",
      ingredients: ["Air", "Tepung Sagu", "Garam"],
      preparation:
        "Tepung sagu diseduh dengan air mendidih sambil diaduk cepat hingga membentuk bubur kental dan bening.",
      story:
        "Papeda adalah makanan pokok masyarakat Papua dan Maluku, biasa disantap bersama ikan kuah kuning dan menjadi simbol kebersamaan dalam acara adat.",
      fact:
        "Tekstur papeda yang kenyal membuatnya disantap dengan cara digulung menggunakan sepasang sumpit kayu khusus (gata-gata), lalu diseruput, bukan disendok."
    },
    {
      id: "fd2",
      name: "Sagu Lempeng",
      region: "Riau",
      category: "Makanan Utama",
      servingType: "Kering",
      image: "assets/images/kuliner-sagu-lempeng.jpg",
      description:
        "Lempengan sagu yang dipanggang dalam cetakan hingga keras, awet disimpan, dan biasa dicelup ke kuah atau teh sebelum dimakan.",
      ingredients: ["Tepung Sagu", "Air", "Garam"],
      preparation:
        "Tepung sagu yang sedikit lembap dimasukkan ke cetakan tanah liat atau besi panas, lalu dipanggang hingga padat dan kering.",
      story:
        "Sagu lempeng dikenal sebagai bekal perjalanan masyarakat pesisir karena tahan lama dan tidak mudah basi.",
      fact:
        "Karena sangat keras, sagu lempeng biasanya dicelupkan ke kopi, teh, atau kuah ikan agar lunak sebelum disantap."
    },
    {
      id: "fd3",
      name: "Kue Sagu",
      region: "Papua",
      category: "Kue",
      servingType: "Kering",
      image: "assets/images/kuliner-kue-sagu.jpg",
      description:
        "Kue kering bertekstur rapuh yang langsung lumer di mulut, dibuat dari tepung sagu dan santan.",
      ingredients: ["Tepung Sagu", "Santan", "Gula", "Telur", "Daun Pandan"],
      preparation:
        "Tepung sagu disangrai bersama daun pandan, dicampur santan, gula, dan telur, lalu dicetak dan dipanggang.",
      story:
        "Kue sagu kerap hadir di meja tamu saat hari raya dan acara keluarga di berbagai daerah Indonesia timur.",
      fact:
        "Tepung sagu disangrai lebih dulu agar kue bertekstur ringan dan lumer ketika digigit."
    },
    {
      id: "fd4",
      name: "Bagea",
      region: "Maluku",
      category: "Kue",
      servingType: "Kering",
      image: "assets/images/kuliner-bagea.jpg",
      description:
        "Kue kering keras beraroma rempah dari sagu dan kenari, khas Maluku dan Sulawesi Utara.",
      ingredients: ["Tepung Sagu", "Kenari", "Gula", "Cengkih", "Kayu Manis"],
      preparation:
        "Tepung sagu dicampur kenari cincang, gula, dan rempah, dibentuk lonjong, dibungkus daun sagu, lalu dipanggang.",
      story:
        "Bagea mencerminkan kekayaan rempah Maluku dan sering dijadikan oleh-oleh khas dari Ambon dan Ternate.",
      fact:
        "Bagea sangat keras, sehingga lazim dicelup ke teh atau kopi terlebih dahulu sebelum dimakan."
    },
    {
      id: "fd5",
      name: "Kapurung",
      region: "Sulawesi",
      category: "Makanan Utama",
      servingType: "Basah",
      image: "assets/images/kuliner-kapurung.jpg",
      description:
        "Bulatan sagu kenyal dalam kuah ikan dan sayuran yang segar, khas Tana Luwu, Sulawesi Selatan.",
      ingredients: ["Tepung Sagu", "Ikan", "Sayuran", "Kacang Panjang", "Jeruk Nipis"],
      preparation:
        "Sagu diseduh air panas hingga kental, dibentuk bulatan kecil, lalu dimasukkan ke kuah ikan berisi sayuran.",
      story:
        "Kapurung adalah hidangan kebersamaan masyarakat Luwu yang disantap ramai-ramai dalam satu wadah besar.",
      fact:
        "Nama kapurung berasal dari bahasa setempat yang merujuk pada cara menggulung sagu menjadi bulatan kecil."
    },
    {
      id: "fd6",
      name: "Sinoli",
      region: "Sulawesi",
      category: "Camilan",
      servingType: "Kering",
      image: "assets/images/kuliner-sinoli.jpg",
      description:
        "Butiran sagu sangrai bercampur kelapa parut, gurih dan sedikit manis, cocok untuk teman minum teh.",
      ingredients: ["Tepung Sagu", "Kelapa Parut", "Gula Merah", "Garam"],
      preparation:
        "Tepung sagu diaduk bersama kelapa parut lalu disangrai di atas wajan tanah hingga matang dan berbutir.",
      story:
        "Sinoli biasa disajikan pada pagi hari sebagai sarapan sederhana masyarakat pedesaan.",
      fact:
        "Proses sangrai tanpa minyak membuat sinoli bisa bertahan beberapa hari tanpa bahan pengawet."
    },
    {
      id: "fd7",
      name: "Dange",
      region: "Sulawesi",
      category: "Makanan Utama",
      servingType: "Kering",
      image: "assets/images/kuliner-dange.jpg",
      description:
        "Roti sagu pipih yang dipanggang dalam cetakan tanah liat, khas Pangkep, Sulawesi Selatan.",
      ingredients: ["Tepung Sagu", "Kelapa Parut", "Gula Merah"],
      preparation:
        "Adonan sagu dimasukkan ke cetakan tanah liat panas, diberi isian kelapa dan gula merah, lalu dipanggang.",
      story:
        "Dange menjadi kuliner khas yang banyak dijual di sepanjang jalan poros Pangkep dan disantap bersama ikan bakar.",
      fact:
        "Cetakan tanah liatnya dipanaskan di atas bara hingga membara sebelum adonan dimasukkan."
    },
    {
      id: "fd8",
      name: "Sagu Bakar",
      region: "Papua",
      category: "Camilan",
      servingType: "Kering",
      image: "assets/images/kuliner-sagu-bakar.jpg",
      description:
        "Sagu yang dibakar dalam bungkus daun atau bambu hingga kulitnya garing dan bagian dalam tetap lembut.",
      ingredients: ["Tepung Sagu", "Kelapa Parut", "Gula"],
      preparation:
        "Sagu dicampur kelapa parut, dibungkus daun atau dimasukkan ke bambu, lalu dibakar di atas bara api.",
      story:
        "Sagu bakar menjadi bekal utama masyarakat Papua saat berburu atau berkebun di hutan.",
      fact:
        "Sagu bakar bisa bertahan berhari-hari sehingga ideal sebagai bekal perjalanan jauh."
    }
  ],

  // pilihan dropdown di form kuliner, admin bisa nambah sendiri
  // (wilayah di sini cuma tambahan, wilayah utama ambil dari menu persebaran)
  foodOptions: {
    wilayah: [],
    kategori: ["Makanan Utama", "Kue", "Camilan"],
    penyajian: ["Basah", "Kering"]
  },

  // persebaran
  regions: [
    {
      id: "rg1",
      name: "Papua",
      mapIcon: "assets/icons/peta-papua.png",
      image: "assets/images/wilayah-papua.jpg",
      description:
        "Papua adalah wilayah dengan hutan sagu alami terluas di Indonesia, menjadikan sagu sebagai makanan pokok utama masyarakat asli Papua selama ratusan tahun.",
      foods: ["Papeda", "Sagu Bakar"],
      facts:
        "Satu rumpun pohon sagu di Papua bisa menghidupi satu keluarga besar selama berbulan-bulan."
    },
    {
      id: "rg2",
      name: "Maluku",
      mapIcon: "assets/icons/peta-maluku.png",
      image: "assets/images/wilayah-maluku.jpg",
      description:
        "Sagu merupakan bagian penting dari sejarah pangan masyarakat Maluku. Daerah yang diketahui menjadikan sagu sebagai salah satu pangan pokok antara lain Maluku Tengah, Seram Bagian Barat, Seram Bagian Timur, Buru, dan Buru Selatan.",
      foods: ["Sagu Tumbu", "Sagu Gula"],
      facts:
        "Pada 2022, Pemerintah Provinsi Maluku mengadakan sajian 521 jenis olahan makanan berbahan dasar sagu dalam sebuah kegiatan yang tercatat sebagai pemecahan rekor MURI. Ini menunjukkan betapa beragamnya pemanfaatan sagu dalam kuliner Maluku."
    },
    {
      id: "rg3",
      name: "Sulawesi",
      mapIcon: "assets/icons/peta-sulawesi.png",
      image: "assets/images/wilayah-sulawesi.jpg",
      description:
        "Di Sulawesi, sagu tumbuh di kawasan pesisir dan rawa seperti Tana Luwu di Sulawesi Selatan serta Sulawesi Tenggara. Sagu diolah menjadi hidangan berkuah yang disantap bersama ikan dan sayuran.",
      foods: ["Kapurung", "Dange", "Sinoli"],
      facts:
        "Kapurung dari Luwu dan sinonggi dari Sulawesi Tenggara sama-sama berbahan sagu kental seperti papeda, tetapi disajikan dengan kuah ikan dan sayuran yang khas masing-masing daerah."
    },
    {
      id: "rg4",
      name: "Riau",
      mapIcon: "assets/icons/peta-riau.png",
      image: "assets/images/wilayah-riau.jpg",
      description:
        "Sagu banyak dibudidayakan di wilayah pesisir Riau, terutama Kabupaten Kepulauan Meranti dan Indragiri Hilir. Kepulauan Meranti merupakan salah satu sentra produksi sagu utama di Riau, dengan sagu yang telah menjadi bagian dari kehidupan ekonomi dan pangan masyarakat setempat.",
      foods: ["Mie Sagu", "Lempeng Sagu"],
      facts:
        "Sagu di Riau tidak hanya dikonsumsi sebagai pangan, tetapi juga dikembangkan menjadi beragam produk olahan. Kajian Pemerintah Provinsi Riau mencatat 369 produk makanan berbahan sagu, menunjukkan luasnya inovasi kuliner berbasis sagu di daerah tersebut."
    }
  ],

  // fakta menarik, likes & dislikes = jumlah awal reaksinya
  facts: [
    {
      id: "fc1",
      text: "Satu batang pohon sagu yang siap panen dapat menghasilkan ratusan kilogram pati sagu.",
      image: "assets/images/fkm-1.png",
      likes: 9,
      dislikes: 2
    },
    {
      id: "fc2",
      text: "Indonesia memiliki hamparan hutan sagu terluas di dunia, dan sebagian besarnya berada di Papua.",
      image: "assets/images/fkm-2.png",
      likes: 8,
      dislikes: 1
    },
    {
      id: "fc3",
      text: "Pohon sagu hanya berbunga satu kali seumur hidupnya. Setelah berbunga dan berbuah, batang pohon itu akan mati.",
      image: "assets/images/fkm-3.png",
      likes: 7,
      dislikes: 3
    },
    {
      id: "fc4",
      text: "Sagu tumbuh berumpun dan terus memunculkan tunas anakan, sehingga satu rumpun bisa dipanen turun-temurun tanpa ditanam ulang.",
      image: "assets/images/fkm-4.png",
      likes: 6,
      dislikes: 2
    },
    {
      id: "fc5",
      text: "Pohon sagu mampu tumbuh di rawa dan lahan gambut, tempat yang sulit ditanami padi maupun jagung.",
      image: "assets/images/fkm-5.png",
      likes: 8,
      dislikes: 4
    },
    {
      id: "fc6",
      text: "Tepung sagu secara alami bebas gluten, sehingga aman bagi penderita intoleransi gluten.",
      image: "assets/images/fkm-6.png",
      likes: 10,
      dislikes: 1
    },
    {
      id: "fc7",
      text: "Ulat sagu yang hidup di batang sagu yang membusuk dikonsumsi masyarakat Papua sebagai sumber protein.",
      image: "assets/images/fkm-7.png",
      likes: 5,
      dislikes: 6
    },
    {
      id: "fc8",
      text: "Daun sagu dianyam menjadi atap rumbia, sedangkan pelepahnya (gaba-gaba) dipakai sebagai dinding rumah di Maluku.",
      image: "assets/images/fkm-8.png",
      likes: 7,
      dislikes: 2
    },
    {
      id: "fc9",
      text: "Pada 2022, Maluku menyajikan 521 jenis olahan sagu dan tercatat sebagai pemecahan rekor MURI.",
      image: "assets/images/fkm-9.png",
      likes: 9,
      dislikes: 3
    },
    {
      id: "fc10",
      text: "Pemerintah Provinsi Riau mencatat 369 produk makanan olahan berbahan dasar sagu.",
      image: "assets/images/fkm-10.png",
      likes: 6,
      dislikes: 3
    },
    {
      id: "fc11",
      text: "Papeda disantap dengan cara digulung menggunakan sepasang sumpit kayu yang disebut gata-gata.",
      image: "assets/images/fkm-11.png",
      likes: 10,
      dislikes: 2
    },
    {
      id: "fc12",
      text: "Selain pangan, pati sagu juga dimanfaatkan industri sebagai bahan perekat, kertas, dan plastik ramah lingkungan.",
      image: "assets/images/fkm-12.png",
      likes: 8,
      dislikes: 5
    }
  ],

  // quiz
  quizzes: [
    {
      id: "qz1",
      question: "Daerah manakah yang merupakan salah satu wilayah dengan persebaran sagu yang paling luas di Indonesia?",
      optionA: "Jawa", optionB: "Bali", optionC: "Papua", optionD: "Aceh",
      correct: "C"
    },
    {
      id: "qz2",
      question: "Bagian dari batang pohon sagu yang diambil dan diolah untuk menghasilkan tepung sagu adalah…",
      optionA: "Kulit Batang", optionB: "Daun Sagu", optionC: "Empulur Batang", optionD: "Akar Sagu",
      correct: "C"
    },
    {
      id: "qz3",
      question: "Apa nama ilmiah dari pohon sagu?",
      optionA: "Cocos nucifera", optionB: "Metroxylon sagu", optionC: "Arenga pinnata", optionD: "Oryza sativa",
      correct: "B"
    },
    {
      id: "qz4",
      question: "Kapurung adalah kuliner sagu berkuah yang berasal dari daerah…",
      optionA: "Riau", optionB: "Papua", optionC: "Maluku", optionD: "Sulawesi Selatan",
      correct: "D"
    },
    {
      id: "qz5",
      question: "Mengapa sagu cocok dikonsumsi oleh penderita intoleransi gluten?",
      optionA: "Karena sagu bebas gluten", optionB: "Karena sagu tinggi protein", optionC: "Karena sagu mengandung gula", optionD: "Karena sagu berasal dari biji-bijian",
      correct: "A"
    },
    {
      id: "qz6",
      question: "Berapa kali pohon sagu berbunga sepanjang hidupnya?",
      optionA: "Setiap tahun", optionB: "Dua kali", optionC: "Satu kali", optionD: "Tidak pernah berbunga",
      correct: "C"
    },
    {
      id: "qz7",
      question: "Sepasang sumpit kayu yang dipakai untuk menggulung papeda disebut…",
      optionA: "Gaba-gaba", optionB: "Gata-gata", optionC: "Tumbu", optionD: "Lempeng",
      correct: "B"
    },
    {
      id: "qz8",
      question: "Pada tahun 2022, Maluku memecahkan rekor MURI dengan menyajikan berapa jenis olahan sagu?",
      optionA: "125 jenis", optionB: "369 jenis", optionC: "521 jenis", optionD: "1.000 jenis",
      correct: "C"
    },
    {
      id: "qz9",
      question: "Pohon sagu mampu tumbuh dengan baik di lahan jenis apa?",
      optionA: "Gurun pasir", optionB: "Rawa dan lahan gambut", optionC: "Pegunungan bersalju", optionD: "Tanah kapur kering",
      correct: "B"
    },
    {
      id: "qz10",
      question: "Daun pohon sagu biasanya dimanfaatkan masyarakat sebagai…",
      optionA: "Atap rumbia", optionB: "Bahan bakar kendaraan", optionC: "Pewarna kain", optionD: "Pupuk kimia",
      correct: "A"
    }
  ],

  // pengaturan website
  settings: {
    siteName: "Sagu Nusantara",
    heroEyebrow: "Pangan Pusaka Indonesia Timur",
    tagline: "Mengenal Kembali Pangan Warisan Indonesia",
    heroDescription:
      "Sagu merupakan salah satu sumber pangan tradisional Indonesia yang telah menjadi makanan pokok masyarakat selama ratusan tahun, khususnya di wilayah timur Indonesia. Website ini mengajak pengguna untuk mengenal sejarah, budaya, dan ragam kuliner berbahan dasar sagu.",
    footerText:
      "Sagu Nusantara dibuat untuk mengedukasi masyarakat mengenai sagu sebagai makanan pokok tradisional Indonesia yang mulai terlupakan, serta memperkenalkan ragam kuliner nusantara berbahan dasar sagu kepada generasi muda.",
    copyright: "© Sagu Nusantara. Front-End UTS Project - Kelompok 02.",
    heroImage: "assets/images/hero-hutan-sagu.jpg",
    footerImageLeft: "assets/images/footer-kiri.jpg",
    footerImageRight: "assets/images/footer-kanan.jpg"
  }
};


// simpan & ambil data dari localStorage
const SaguStore = (() => {
  // nama key dibedain dari UTS-Trial biar datanya ga ketuker kalau dibuka di browser yg sama
  const DB_KEY = "webSagu_db";
  const VERSION_KEY = "webSagu_dbVersion";
  // versi 2: nambah soal quiz qz6 - qz10
  const DB_VERSION = 2;
  const COLLECTIONS = ["aboutCards", "processingSteps", "foods", "regions", "facts", "quizzes"];

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // angka 1-10 dari id, jadi hasilnya selalu sama tiap halaman dibuka
  function angkaAwal(teks) {
    let total = 0;
    for (const huruf of String(teks)) total += huruf.charCodeAt(0);
    return (total % 10) + 1;
  }

  function load() {
    try {
      const storedVersion = Number(localStorage.getItem(VERSION_KEY));
      const raw = localStorage.getItem(DB_KEY);
      // data versi 1 masih dipakai (biar editan admin ga hilang), cuma ditambahin soal quiz baru
      const upgradeDariV1 = storedVersion === 1;
      if (!raw || (storedVersion !== DB_VERSION && !upgradeDariV1)) return reset(false);
      const db = JSON.parse(raw);
      // kalau ada bagian yang hilang (misal habis import json), isi pake data awal
      COLLECTIONS.forEach((key) => { if (!Array.isArray(db[key])) db[key] = clone(DEFAULT_DATA[key]); });
      db.settings = { ...clone(DEFAULT_DATA.settings), ...(db.settings || {}) };

      // fakta yang kesimpen sebelum ada gambar & like/dislike dilengkapin dulu
      db.facts.forEach((f) => {
        const asal = DEFAULT_DATA.facts.find((d) => d.id === f.id);
        if (!f.image && asal) f.image = asal.image;
        if (typeof f.likes !== "number") f.likes = asal ? asal.likes : angkaAwal(f.id + "suka");
        if (typeof f.dislikes !== "number") f.dislikes = asal ? asal.dislikes : angkaAwal(f.id + "ga");
      });

      const opt = db.foodOptions || {};
      db.foodOptions = {};
      Object.keys(DEFAULT_DATA.foodOptions).forEach((key) => {
        db.foodOptions[key] = Array.isArray(opt[key]) ? opt[key] : clone(DEFAULT_DATA.foodOptions[key]);
      });

      if (upgradeDariV1) {
        const baru = ["qz6", "qz7", "qz8", "qz9", "qz10"];
        DEFAULT_DATA.quizzes
          .filter((q) => baru.includes(q.id) && !db.quizzes.some((x) => x.id === q.id))
          .forEach((q) => db.quizzes.push(clone(q)));
        save(db);
      }
      return db;
    } catch (err) {
      console.error("data di localStorage rusak, balik ke data awal", err);
      return reset(false);
    }
  }

  // balikin true kalau berhasil, false kalau localStorage udah penuh
  function save(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      localStorage.setItem(VERSION_KEY, String(DB_VERSION));
      return true;
    } catch (err) {
      console.error("gagal simpan ke localStorage", err);
      return false;
    }
  }

  function reset(log = true) {
    const db = clone(DEFAULT_DATA);
    save(db);
    if (log) SaguLog.add("Reset", "Database", "Data dikembalikan ke kondisi awal");
    return db;
  }

  // dipakai pas import file json dari dashboard
  function importData(obj) {
    if (!obj || typeof obj !== "object") throw new Error("Format JSON tidak valid.");
    const missing = COLLECTIONS.filter((k) => !Array.isArray(obj[k]));
    if (missing.length === COLLECTIONS.length) {
      throw new Error("File tidak berisi data Sagu Nusantara (aboutCards, foods, dst).");
    }
    if (!save(obj)) throw new Error("penyimpanan browser penuh.");
    return load();
  }

  return { load, save, reset, importData, COLLECTIONS, DB_KEY };
})();


// catatan aktivitas admin (buat bagian "aktivitas terbaru" di dashboard)
const SaguLog = (() => {
  const KEY = "webSagu_activity";
  const MAX = 30;

  function all() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function add(action, module, detail) {
    const list = all();
    list.unshift({ action, module, detail, time: new Date().toISOString() });
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); }
    catch { /* kalau penuh ya udah, log nya ga kesimpen */ }
  }

  function clear() { localStorage.removeItem(KEY); }

  return { all, add, clear };
})();


// login admin (cuma simulasi di browser aja buat tugas, bukan login beneran)
const SaguAuth = (() => {
  const KEY = "webSagu_session";
  const CREDENTIALS = { username: "admin", password: "sagu123" };
  const SESSION_HOURS = 8;

  function login(username, password) {
    const ok = username === CREDENTIALS.username && password === CREDENTIALS.password;
    if (ok) {
      const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
      localStorage.setItem(KEY, JSON.stringify({ user: username, expiresAt }));
      SaguLog.add("Login", "Auth", `${username} masuk ke dashboard`);
    }
    return ok;
  }

  function session() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s || Date.now() > s.expiresAt) { localStorage.removeItem(KEY); return null; }
      return s;
    } catch { return null; }
  }

  function logout() {
    localStorage.removeItem(KEY);
  }

  // kalau belum login langsung dilempar ke halaman login
  function guard(redirectTo = "admin-login.html") {
    if (!session()) window.location.replace(redirectTo);
  }

  return { login, logout, session, guard };
})();


// fungsi kecil yang dipakai di mana-mana
const SaguUtil = (() => {
  // biar teks dari admin ga kebaca sebagai html
  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function uid(prefix = "id") {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  }

  // 1 jadi "01"
  const pad = (n) => String(n).padStart(2, "0");

  // kalau gambar gagal dimuat, kotak .media nya dikasih tulisan nama file
  function enableAssetPlaceholders() {
    document.addEventListener("error", (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const box = img.closest(".media");
      if (!box) return;
      const src = img.getAttribute("src") || "";
      const file = src.startsWith("data:") ? "gambar upload" : src.split("/").pop();
      box.classList.add("is-missing");
      box.setAttribute("data-missing", file || "gambar");
    }, true);

    document.addEventListener("load", (e) => {
      const img = e.target;
      if (img instanceof HTMLImageElement) img.closest(".media")?.classList.remove("is-missing");
    }, true);
  }

  return { esc, uid, pad, enableAssetPlaceholders };
})();

SaguUtil.enableAssetPlaceholders();
