document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  function setActiveLink(id) {
    // section yang ga ada di navbar (misal fakta menarik) ga usah ganti garis bawahnya
    const ada = [...navLinks].some((link) => link.getAttribute("href") === `#${id}`);
    if (!ada) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
});

// isi teks hero + kartu tentang sagu dari data yang diatur di dashboard
document.addEventListener("DOMContentLoaded", () => {
  const { esc, pad } = SaguUtil;
  const grid = document.querySelector(".tentang-grid");

  function renderSettings(settings) {
    document.querySelectorAll("[data-setting]").forEach((el) => {
      const value = settings[el.dataset.setting];
      if (value) el.textContent = value;
    });
    // gambar hero & footer
    document.querySelectorAll("[data-setting-src]").forEach((img) => {
      const src = settings[img.dataset.settingSrc];
      if (src && img.getAttribute("src") !== src) img.src = src;
    });
    document.title = settings.siteName;
  }

  function renderTentang(cards) {
    if (!grid) return;
    grid.innerHTML = cards.map((card, i) => `
      <article class="tentang-card">
        <img class="tentang-card-image" src="${esc(card.image)}" alt="${esc(card.title)}">
        <div class="tentang-card-box">
          <p class="tentang-card-number">${pad(i + 1)} —</p>
          <h3 class="tentang-card-title">${esc(card.title)}</h3>
          <p class="tentang-card-desc">${esc(card.description)}</p>
        </div>
      </article>`).join("");
  }

  function renderAll() {
    const db = SaguStore.load();
    renderSettings(db.settings);
    renderTentang(db.aboutCards);
  }

  renderAll();

  // kalau admin nyimpen sesuatu di tab lain, halaman ini langsung ikut berubah
  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) renderAll();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const stepsBox = document.querySelector(".proses-steps");
  const detail = document.querySelector(".proses-detail");

  if (!stepsBox || !detail) return;

  const { esc } = SaguUtil;
  const image = detail.querySelector(".proses-detail-image");
  const badge = detail.querySelector(".proses-detail-badge");
  const number = detail.querySelector(".proses-detail-number");
  const title = detail.querySelector(".proses-detail-title");
  const desc = detail.querySelector(".proses-detail-desc");

  // data tahapnya sekarang diambil dari dashboard (processingSteps)
  let prosesData = [];
  let currentStep = 0;
  let changeTimer;

  function fillDetail(index) {
    const data = prosesData[index];
    const stepNumber = String(index + 1).padStart(2, "0");
    image.src = data.image;
    image.alt = data.title;
    badge.textContent = `Langkah ${index + 1} dari ${prosesData.length}`;
    number.textContent = `${stepNumber} — ${data.title}`;
    title.textContent = data.title;
    desc.textContent = data.description;
  }

  function renderSteps() {
    prosesData = SaguStore.load().processingSteps;
    if (currentStep >= prosesData.length) currentStep = 0;

    stepsBox.innerHTML = prosesData.map((step, i) => `
      <button class="proses-step ${i === currentStep ? "active" : ""}" type="button" data-step="${i}" aria-pressed="${i === currentStep}">
        <span class="proses-step-icon">
          <img src="${esc(step.icon)}" alt="">
        </span>
        <span class="proses-step-label">${esc(step.title)}</span>
      </button>`).join("");

    detail.hidden = !prosesData.length;
    if (!prosesData.length) return;

    // muat semua foto lebih dulu supaya pergantian foto tidak berkedip
    prosesData.forEach((item) => {
      new Image().src = item.image;
    });

    fillDetail(currentStep);
  }

  function showStep(index) {
    if (index === currentStep) return;
    currentStep = index;

    stepsBox.querySelectorAll(".proses-step").forEach((step, i) => {
      step.classList.toggle("active", i === index);
      step.setAttribute("aria-pressed", i === index);
    });

    detail.classList.add("is-changing");
    clearTimeout(changeTimer);

    changeTimer = setTimeout(() => {
      fillDetail(index);
      detail.classList.remove("is-changing");
    }, 200);
  }

  // tombolnya dibuat ulang tiap data berubah, jadi klik nya ditangkep dari kotak luarnya
  stepsBox.addEventListener("click", (e) => {
    const step = e.target.closest(".proses-step");
    if (step) showStep(Number(step.dataset.step));
  });

  renderSteps();

  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) renderSteps();
  });
});

// kuliner: kartu + cari + filter + popup detail
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("kulinerGrid");
  if (!grid) return;

  const { esc } = SaguUtil;
  const search = document.getElementById("kulinerSearch");
  const filterWilayah = document.getElementById("filterWilayah");
  const filterKategori = document.getElementById("filterKategori");
  const filterPenyajian = document.getElementById("filterPenyajian");
  const info = document.getElementById("kulinerInfo");
  const modal = document.getElementById("kulinerModal");
  const modalBody = document.getElementById("kulinerModalBody");

  const pinIcon = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M6 0a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z"/></svg>';

  let foods = [];

  const unik = (list) => [...new Set(list.filter(Boolean))];

  // isi pilihan dropdown, pilihan yang lagi dipilih tetep dipertahanin
  function isiDropdown(select, values) {
    const sekarang = select.value;
    select.innerHTML = `<option value="Semua">Semua</option>` +
      values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    select.value = values.includes(sekarang) ? sekarang : "Semua";
  }

  function loadData() {
    const db = SaguStore.load();
    foods = db.foods;

    isiDropdown(filterWilayah, unik([...db.regions.map((r) => r.name), ...foods.map((f) => f.region)]));
    isiDropdown(filterKategori, unik([...db.foodOptions.kategori, ...foods.map((f) => f.category)]));
    isiDropdown(filterPenyajian, unik([...db.foodOptions.penyajian, ...foods.map((f) => f.servingType)]));

    renderCards();
  }

  function getHasil() {
    const kata = search.value.trim().toLowerCase();

    return foods.filter((f) => {
      const teks = [f.name, f.region, f.category, f.servingType, f.description, (f.ingredients || []).join(" ")]
        .join(" ").toLowerCase();

      return (!kata || teks.includes(kata))
        && (filterWilayah.value === "Semua" || f.region === filterWilayah.value)
        && (filterKategori.value === "Semua" || f.category === filterKategori.value)
        && (filterPenyajian.value === "Semua" || f.servingType === filterPenyajian.value);
    });
  }

  function renderCards() {
    const hasil = getHasil();

    info.textContent = hasil.length === foods.length
      ? `Menampilkan ${foods.length} kuliner`
      : `Menampilkan ${hasil.length} dari ${foods.length} kuliner`;

    if (!hasil.length) {
      grid.innerHTML = `<p class="kuliner-empty">Kuliner yang kamu cari belum ada. Coba kata kunci lain atau ubah filternya.</p>`;
      return;
    }

    grid.innerHTML = hasil.map((f) => `
      <article class="kuliner-card">
        <img class="kuliner-card-image" src="${esc(f.image)}" alt="${esc(f.name)}" loading="lazy">
        <div class="kuliner-card-box">
          <p class="kuliner-card-region">${pinIcon}${esc(f.region)}</p>
          <h3 class="kuliner-card-title">${esc(f.name)}</h3>
          <p class="kuliner-card-desc">${esc(f.description)}</p>
          <div class="kuliner-card-tags">
            <span class="kuliner-tag">${esc(f.servingType)}</span>
            <span class="kuliner-tag">${esc(f.category)}</span>
          </div>
          <button type="button" class="kuliner-card-button" data-food="${esc(f.id)}">Lihat Detail →</button>
        </div>
      </article>`).join("");
  }

  function bukaDetail(id) {
    const f = foods.find((x) => x.id === id);
    if (!f) return;

    modalBody.innerHTML = `
      <img class="kuliner-modal-image" src="${esc(f.image)}" alt="${esc(f.name)}">
      <div class="kuliner-modal-content">
        <p class="kuliner-modal-region">${esc(f.region)} · ${esc(f.category)} · ${esc(f.servingType)}</p>
        <h3 class="kuliner-modal-title" id="kulinerModalTitle">${esc(f.name)}</h3>
        <p class="kuliner-modal-text">${esc(f.story)}</p>

        <h4 class="kuliner-modal-heading">Bahan Utama</h4>
        <div class="chip-list">${(f.ingredients || []).map((b) => `<span class="chip">${esc(b)}</span>`).join("")}</div>

        <h4 class="kuliner-modal-heading">Cara Pembuatan Singkat</h4>
        <p class="kuliner-modal-text">${esc(f.preparation)}</p>

        <h4 class="kuliner-modal-heading">Fakta Unik</h4>
        <p class="kuliner-modal-text">${esc(f.fact)}</p>
      </div>`;
    modal.showModal();
  }

  search.addEventListener("input", renderCards);
  [filterWilayah, filterKategori, filterPenyajian].forEach((select) => {
    select.addEventListener("change", renderCards);
  });

  grid.addEventListener("click", (e) => {
    const tombol = e.target.closest("[data-food]");
    if (tombol) bukaDetail(tombol.dataset.food);
  });

  // tutup popup kalau klik tombol x atau klik di luar kotaknya
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
  });

  loadData();

  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) loadData();
  });
});

// persebaran: daftar wilayah di kiri, detailnya di kanan
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("wilayahList");
  const detail = document.getElementById("wilayahDetail");
  if (!list || !detail) return;

  const { esc } = SaguUtil;
  const arrowIcon = '<svg class="wilayah-arrow" viewBox="0 0 12 20" aria-hidden="true"><path d="M2 2l8 8-8 8"/></svg>';

  let regions = [];
  let activeId = null; // awalnya belum ada wilayah yang dipilih
  let changeTimer;

  function renderList() {
    list.innerHTML = regions.map((r) => `
      <button type="button" class="wilayah-button ${r.id === activeId ? "active" : ""}" data-region="${esc(r.id)}" aria-pressed="${r.id === activeId}">
        <img class="wilayah-map" src="${esc(r.mapIcon)}" alt="">
        <span>${esc(r.name)}</span>
        ${arrowIcon}
      </button>`).join("");
  }

  function renderDetail() {
    const index = regions.findIndex((r) => r.id === activeId);
    const r = regions[index];

    if (!r) {
      detail.innerHTML = `
        <div class="wilayah-empty">
          <img src="assets/images/logo-sagu.png" alt="">
          <p>Pilih salah satu wilayah untuk melihat makanan khas dan fakta uniknya.</p>
        </div>`;
      return;
    }

    detail.innerHTML = `
      <img class="wilayah-image" src="${esc(r.image)}" alt="Suasana wilayah ${esc(r.name)}">
      <div class="wilayah-box">
        <p class="wilayah-badge">Wilayah ${index + 1} dari ${regions.length}</p>
        <h3 class="wilayah-title">${esc(r.name)}</h3>
        <p class="wilayah-text">${esc(r.description)}</p>

        <h4 class="wilayah-heading">Makanan Khas Sagu</h4>
        <div class="chip-list">${(r.foods || []).map((f) => `<span class="chip">${esc(f)}</span>`).join("")}</div>

        <h4 class="wilayah-heading">Fakta Unik</h4>
        <p class="wilayah-text">${esc(r.facts)}</p>
      </div>`;
  }

  function loadData() {
    regions = SaguStore.load().regions;
    if (!regions.some((r) => r.id === activeId)) activeId = null;
    renderList();
    renderDetail();
  }

  list.addEventListener("click", (e) => {
    const tombol = e.target.closest("[data-region]");
    if (!tombol) return;

    // klik wilayah yang lagi aktif = tutup detailnya, balik ke tampilan awal
    activeId = tombol.dataset.region === activeId ? null : tombol.dataset.region;
    renderList();

    // efek pudar dikit pas ganti wilayah
    detail.classList.add("is-changing");
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
      renderDetail();
      detail.classList.remove("is-changing");
    }, 180);
  });

  loadData();

  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) loadData();
  });
});

// fakta menarik: foto + teks, tombol ganti fakta, sama tombol like / dislike
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("faktaCard");
  if (!card) return;

  const text = document.getElementById("faktaText");
  const image = document.getElementById("faktaImage");
  const counter = document.getElementById("faktaCounter");
  const prev = document.getElementById("faktaPrev");
  const next = document.getElementById("faktaNext");
  const likeBtn = document.getElementById("faktaLike");
  const dislikeBtn = document.getElementById("faktaDislike");
  const likeCount = document.getElementById("faktaLikeCount");
  const dislikeCount = document.getElementById("faktaDislikeCount");

  // pilihan like / dislike pengunjung disimpen terpisah dari data dashboard
  // isinya kayak gini: { fc1: "like", fc4: "dislike" }
  const VOTE_KEY = "webSagu_factVotes";

  let facts = [];
  let index = 0;
  let changeTimer;

  function bacaVote() {
    try { return JSON.parse(localStorage.getItem(VOTE_KEY)) || {}; }
    catch { return {}; }
  }

  function simpanVote(votes) {
    try { localStorage.setItem(VOTE_KEY, JSON.stringify(votes)); }
    catch { /* kalau gagal ya udah, angkanya cuma ga kesimpen */ }
  }

  // muat foto fakta sebelum & sesudahnya biar pas diklik ga nunggu lama
  function muatTetangga() {
    [index - 1, index + 1].forEach((i) => {
      const f = facts[(i + facts.length) % facts.length];
      if (f && f.image) new Image().src = f.image;
    });
  }

  function renderVote() {
    const f = facts[index];
    const pilihan = bacaVote()[f.id];

    likeCount.textContent = (f.likes || 0) + (pilihan === "like" ? 1 : 0);
    dislikeCount.textContent = (f.dislikes || 0) + (pilihan === "dislike" ? 1 : 0);

    likeBtn.classList.toggle("active", pilihan === "like");
    dislikeBtn.classList.toggle("active", pilihan === "dislike");
    likeBtn.setAttribute("aria-pressed", pilihan === "like");
    dislikeBtn.setAttribute("aria-pressed", pilihan === "dislike");
  }

  function tampilkan() {
    const kosong = !facts.length;
    [prev, next, likeBtn, dislikeBtn].forEach((b) => (b.disabled = kosong));

    if (kosong) {
      text.textContent = "Belum ada fakta.";
      counter.textContent = "Fakta 0 dari 0";
      image.src = "assets/images/logo-sagu.png";
      likeCount.textContent = "0";
      dislikeCount.textContent = "0";
      return;
    }

    if (index >= facts.length) index = 0;
    const f = facts[index];

    text.textContent = f.text;
    counter.textContent = `Fakta ${index + 1} dari ${facts.length}`;
    image.src = f.image || "assets/images/logo-sagu.png";
    image.alt = f.text;
    prev.disabled = facts.length < 2;
    next.disabled = facts.length < 2;

    renderVote();
    muatTetangga();
  }

  function geser(arah) {
    if (facts.length < 2) return;
    index = (index + arah + facts.length) % facts.length;

    card.classList.add("is-changing");
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
      tampilkan();
      card.classList.remove("is-changing");
    }, 200);
  }

  // klik sekali = pilih, klik lagi tombol yang sama = batal
  function pilih(jenis, tombol) {
    const f = facts[index];
    if (!f) return;

    const votes = bacaVote();
    if (votes[f.id] === jenis) delete votes[f.id];
    else votes[f.id] = jenis;
    simpanVote(votes);
    renderVote();

    if (votes[f.id] === jenis) {
      tombol.classList.remove("pop");
      void tombol.offsetWidth; // biar animasinya bisa diulang
      tombol.classList.add("pop");
    }
  }

  function loadData() {
    facts = SaguStore.load().facts;
    tampilkan();
  }

  prev.addEventListener("click", () => geser(-1));
  next.addEventListener("click", () => geser(1));
  likeBtn.addEventListener("click", () => pilih("like", likeBtn));
  dislikeBtn.addEventListener("click", () => pilih("dislike", dislikeBtn));

  loadData();

  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) loadData();
    if (e.key === VOTE_KEY && facts.length) renderVote();
  });
});

// quiz
// jawaban benar -> hijau, bisa lanjut. jawaban salah -> merah, bisa coba lagi
// tapi poinnya cuma dapet kalau benar di percobaan pertama
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("quizCard");
  if (!card) return;

  const { esc } = SaguUtil;
  const huruf = ["A", "B", "C", "D"];

  let quizzes = [];
  let index = 0;
  let score = 0;
  let pernahSalah = false;
  let mode = null; // "next" | "retry" | "finish"

  const poin = () => Math.round(100 / Math.max(quizzes.length, 1));

  // acak urutan soal (fisher-yates), jadi tiap ulang quiz urutannya beda
  function acak(list) {
    const hasil = [...list];
    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }
    return hasil;
  }

  function mulaiUlang() {
    quizzes = acak(quizzes);
    index = 0;
    score = 0;
    pernahSalah = false;
    mode = null;
    renderSoal();
  }

  function renderSoal() {
    if (!quizzes.length) {
      card.innerHTML = `<p class="quiz-question">Belum ada pertanyaan quiz.</p>`;
      return;
    }

    const q = quizzes[index];
    const persen = (index / quizzes.length) * 100;

    card.innerHTML = `
      <div class="quiz-top">
        <span class="quiz-badge">Pertanyaan ${index + 1} dari ${quizzes.length}</span>
        <span class="quiz-score">Skor: ${score}</span>
      </div>
      <div class="quiz-progress"><span style="width: ${persen}%"></span></div>

      <p class="quiz-question">${esc(q.question)}</p>

      <div class="quiz-options">
        ${huruf.map((h) => `
          <button type="button" class="quiz-option" data-answer="${h}">
            <span class="quiz-letter">${h}</span>
            <span>${esc(q["option" + h])}</span>
          </button>`).join("")}
      </div>

      <div class="quiz-bottom">
        <p class="quiz-feedback" id="quizFeedback"></p>
        <button type="button" class="btn btn-primary" id="quizAction" hidden></button>
      </div>`;
  }

  function jawab(pilihan, tombol) {
    const q = quizzes[index];
    const benar = pilihan === q.correct;

    card.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
    tombol.classList.add(benar ? "benar" : "salah");

    if (benar && !pernahSalah) score += poin();
    if (!benar) pernahSalah = true;

    card.querySelector(".quiz-score").textContent = `Skor: ${score}`;

    const feedback = document.getElementById("quizFeedback");
    if (benar) {
      feedback.textContent = pernahSalah
        ? "Benar! Tapi poin cuma dihitung kalau benar di percobaan pertama."
        : "Benar! Jawaban kamu tepat.";
    } else {
      feedback.textContent = "Jawaban kamu kurang tepat, coba lagi ya.";
    }

    const terakhir = index === quizzes.length - 1;
    mode = benar ? (terakhir ? "finish" : "next") : "retry";

    const label = { next: "Pertanyaan Berikutnya →", finish: "Lihat Skor Akhir", retry: "Coba Lagi" };
    const action = document.getElementById("quizAction");
    action.textContent = label[mode];
    action.className = mode === "retry" ? "btn btn-outline" : "btn btn-primary";
    action.hidden = false;
    action.focus({ preventScroll: true });
  }

  function renderHasil() {
    const max = poin() * quizzes.length;
    const rasio = score / max;
    const pesan = rasio === 1 ? "Sempurna! Kamu benar-benar paham tentang sagu Nusantara."
      : rasio >= 0.6 ? "Bagus! Pengetahuanmu tentang sagu sudah cukup luas."
      : "Masih ada yang bisa dipelajari. Jelajahi lagi halaman ini lalu coba ulang quiznya.";

    card.innerHTML = `
      <div class="quiz-result">
        <p class="quiz-result-label">Skor Akhir Kamu</p>
        <p class="quiz-result-score">${score}<small>/${max}</small></p>
        <p class="quiz-result-text">${pesan}</p>
        <button type="button" class="btn btn-primary" data-restart>Ulangi Quiz</button>
      </div>`;
  }

  card.addEventListener("click", (e) => {
    const opsi = e.target.closest("[data-answer]");
    if (opsi && !opsi.disabled) jawab(opsi.dataset.answer, opsi);

    if (e.target.closest("[data-restart]")) mulaiUlang();

    if (e.target.closest("#quizAction")) {
      if (mode === "retry") renderSoal();
      if (mode === "next") {
        index++;
        pernahSalah = false;
        renderSoal();
      }
      if (mode === "finish") renderHasil();
    }
  });

  function loadData() {
    quizzes = SaguStore.load().quizzes;
    mulaiUlang();
  }

  loadData();

  window.addEventListener("storage", (e) => {
    if (e.key === SaguStore.DB_KEY) loadData();
  });
});
