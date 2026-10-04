// script buat halaman admin-login.html dan admin-dashboard.html
// butuh data.js dimuat duluan
(() => {
  "use strict";

  const { esc, uid, pad } = SaguUtil;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Halaman Login
  const LoginPage = {
    init() {
      // redirect ke dashboard kalau uda login
      if (SaguAuth.session()) {
        location.replace("admin-dashboard.html");
        return;
      }

      const form = $("#loginForm");
      const error = $("#loginError");
      const pass = $("#password");
      const toggle = $("#togglePassword");

      // tombol lihat / sembunyikan password
      toggle.addEventListener("click", () => {
        const show = pass.type === "password";
        pass.type = show ? "text" : "password";
        toggle.textContent = show ? "Sembunyikan" : "Lihat";
        toggle.setAttribute("aria-pressed", String(show));
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = form.elements.namedItem("username").value.trim();
        const password = pass.value;

        if (SaguAuth.login(username, password)) {
          location.replace("admin-dashboard.html");
          return;
        }
        error.textContent = "Username atau password salah. Periksa lagi, lalu coba masuk.";
        error.hidden = false;
        pass.value = "";
        pass.focus();
      });
    }
  };

  // Dashboard
  let db = null;
  let currentView = "dashboard";

  const ADD_VALUE = "__tambah__"; // value khusus buat opsi "+ Tambah ..." di dropdown
  const MAX_UPLOAD_MB = 10;

  const REGION_FALLBACK = ["Papua", "Maluku", "Sulawesi", "Riau"];
  const unique = (list) => [...new Set(list.filter(Boolean))];
  const acak1sampai10 = () => Math.floor(Math.random() * 10) + 1;
  const regionOptions = () => {
    const base = db.regions.length ? db.regions.map((r) => r.name) : REGION_FALLBACK;
    return unique([...base, ...db.foodOptions.wilayah]);
  };

  const ICON = {
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
  };

  // daftar menu konten + isian form + kolom tabelnya
  // maxSize = ukuran maksimal gambar (px) setelah diupload, biar localStorage ga cepet penuh
  const MODULES = {
    aboutCards: {
      title: "Tentang Sagu",
      singular: "kartu",
      prefix: "ab",
      fields: [
        { name: "title", label: "Judul", type: "text", required: true },
        { name: "image", label: "Gambar", type: "image", required: true, maxSize: 1000,
          hint: "Pilih foto dari laptop, rasio 4:3 paling pas." },
        { name: "description", label: "Deskripsi", type: "textarea", required: true, wide: true }
      ],
      columns: [
        { key: "image", label: "Gambar", type: "thumb" },
        { key: "title", label: "Judul" },
        { key: "description", label: "Deskripsi", type: "clip" }
      ]
    },

    processingSteps: {
      title: "Proses Pengolahan",
      singular: "tahap",
      prefix: "st",
      reorder: true,
      noAdd: true,
      noDelete: true,
      fields: [
        { name: "title", label: "Nama tahap", type: "text", required: true, wide: true },
        { name: "icon", label: "Ikon lingkaran", type: "image", required: true, maxSize: 300,
          hint: "Ikon kecil, paling bagus SVG / PNG transparan." },
        { name: "image", label: "Foto tahap", type: "image", required: true, maxSize: 1200,
          hint: "Foto yang tampil di samping penjelasan." },
        { name: "description", label: "Penjelasan", type: "textarea", required: true, wide: true, rows: 6 }
      ],
      columns: [
        { key: "order", label: "No", type: "order" },
        { key: "icon", label: "Ikon", type: "thumb", round: true },
        { key: "title", label: "Tahap" },
        { key: "description", label: "Penjelasan", type: "clip" }
      ]
    },

    foods: {
      title: "Kuliner Sagu",
      singular: "kuliner",
      prefix: "fd",
      fields: [
        { name: "name", label: "Nama makanan", type: "text", required: true },
        { name: "region", label: "Wilayah", type: "select", options: regionOptions, required: true,
          addable: "wilayah", optionKey: "wilayah" },
        { name: "category", label: "Kategori", type: "select", options: () => db.foodOptions.kategori, required: true,
          addable: "kategori", optionKey: "kategori" },
        { name: "servingType", label: "Jenis penyajian", type: "select", options: () => db.foodOptions.penyajian, required: true,
          addable: "jenis penyajian", optionKey: "penyajian" },
        { name: "image", label: "Gambar", type: "image", required: true, wide: true, maxSize: 1000,
          hint: "Gunakan foto hidangan dengan rasio 4:3." },
        { name: "description", label: "Deskripsi singkat (tampil di kartu)", type: "textarea", required: true, wide: true, rows: 3 },
        { name: "ingredients", label: "Bahan utama", type: "list", required: true, wide: true,
          hint: "Pisahkan dengan koma" },
        { name: "preparation", label: "Cara pembuatan", type: "textarea", required: true, wide: true, rows: 3 },
        { name: "story", label: "Cerita budaya", type: "textarea", required: true, wide: true, rows: 3 },
        { name: "fact", label: "Fakta menarik", type: "textarea", required: true, wide: true, rows: 3 }
      ],
      columns: [
        { key: "image", label: "Gambar", type: "thumb" },
        { key: "name", label: "Nama" },
        { key: "region", label: "Wilayah" },
        { key: "category", label: "Kategori" },
        { key: "servingType", label: "Penyajian" }
      ]
    },

    regions: {
      title: "Persebaran",
      singular: "wilayah",
      prefix: "rg",
      fields: [
        { name: "name", label: "Nama wilayah", type: "text", required: true, wide: true },
        { name: "mapIcon", label: "Ikon peta", type: "image", required: true, maxSize: 400,
          hint: "Gambar peta kecil wilayahnya." },
        { name: "image", label: "Foto wilayah", type: "image", required: true, maxSize: 1200,
          hint: "Foto suasana wilayahnya." },
        { name: "description", label: "Deskripsi", type: "textarea", required: true, wide: true },
        { name: "foods", label: "Makanan khas", type: "list", required: true, wide: true,
          hint: "Pisahkan dengan koma, contoh: Papeda, Sagu Bakar" },
        { name: "facts", label: "Fakta unik", type: "textarea", required: true, wide: true }
      ],
      columns: [
        { key: "mapIcon", label: "Peta", type: "thumb" },
        { key: "name", label: "Wilayah" },
        { key: "foods", label: "Makanan khas", type: "list" },
        { key: "description", label: "Deskripsi", type: "clip", max: 70 }
      ]
    },

    facts: {
      title: "Fakta Menarik",
      singular: "fakta",
      prefix: "fc",
      // angka like/dislike awal buat fakta baru, acak 1 - 10
      defaults: () => ({ likes: acak1sampai10(), dislikes: acak1sampai10() }),
      fields: [
        { name: "text", label: "Isi fakta", type: "textarea", required: true, wide: true },
        { name: "image", label: "Gambar ilustrasi", type: "image", required: true, wide: true, maxSize: 1200,
          hint: "Gambar yang menggambarkan faktanya, rasio 3:2 paling pas (contoh 1536 x 1024)." },
        { name: "likes", label: "Jumlah like awal", type: "number", required: true,
          hint: "Angka awal tombol like di website." },
        { name: "dislikes", label: "Jumlah dislike awal", type: "number", required: true,
          hint: "Angka awal tombol dislike di website." }
      ],
      columns: [
        { key: "order", label: "No", type: "order" },
        { key: "image", label: "Gambar", type: "thumb", wide: true },
        { key: "text", label: "Fakta", type: "clip", max: 110 },
        { key: "likes", label: "Reaksi",
          format: (f) => `<span class="reactions">
            <span class="reaction"><img src="assets/icons/like.png" alt="Like" />${Number(f.likes) || 0}</span>
            <span class="reaction"><img src="assets/icons/dislike.png" alt="Dislike" />${Number(f.dislikes) || 0}</span></span>` }
      ]
    },

    quizzes: {
      title: "Quiz",
      singular: "pertanyaan",
      prefix: "qz",
      fields: [
        { name: "question", label: "Pertanyaan", type: "textarea", required: true, wide: true, rows: 3 },
        { name: "optionA", label: "Opsi A", type: "text", required: true },
        { name: "optionB", label: "Opsi B", type: "text", required: true },
        { name: "optionC", label: "Opsi C", type: "text", required: true },
        { name: "optionD", label: "Opsi D", type: "text", required: true },
        { name: "correct", label: "Jawaban benar", type: "select", options: ["A", "B", "C", "D"], required: true }
      ],
      columns: [
        { key: "order", label: "No", type: "order" },
        { key: "question", label: "Pertanyaan", type: "clip", max: 100 },
        { key: "correct", label: "Kunci",
          format: (q) => `<span class="answer-key">${esc(q.correct)}</span>${esc(q["option" + q.correct] || "")}` }
      ]
    }
  };

  // isian halaman pengaturan website
  const SETTINGS_FIELDS = [
    { name: "siteName", label: "Nama website", type: "text", required: true },
    { name: "tagline", label: "Tagline", type: "text", required: true, hint: "Tampil di bawah judul hero." },
    { name: "heroEyebrow", label: "Teks kecil di atas judul hero", type: "text", wide: true },
    { name: "heroDescription", label: "Deskripsi hero", type: "textarea", wide: true },
    { name: "footerText", label: "Teks footer", type: "textarea", required: true, wide: true },
    { name: "copyright", label: "Teks hak cipta", type: "text", wide: true },
    { name: "heroImage", label: "Gambar hero", type: "image", required: true, wide: true, maxSize: 1200,
      hint: "Foto besar di sisi kanan hero. berbentuk potret." },
    { name: "footerImageLeft", label: "Gambar footer kiri", type: "image", required: true, maxSize: 600,
      hint: "Dipotong jadi persegi." },
    { name: "footerImageRight", label: "Gambar footer kanan", type: "image", required: true, maxSize: 600,
      hint: "Dipotong jadi persegi." }
  ];

  // judul yang muncul di topbar
  const VIEW_META = {
    dashboard: { title: "Dashboard", group: "Ringkasan" },
    settings: { title: "Pengaturan Website", group: "Situs" }
  };
  Object.entries(MODULES).forEach(([key, mod]) => {
    VIEW_META[key] = { title: mod.title, group: "Konten" };
  });

  // ---------- fungsi bantu ----------
  const itemLabel = (item) => item.title || item.name || item.question || item.text || "(tanpa judul)";

  const clip = (text, max = 90) => {
    const s = String(text ?? "");
    return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;
  };

  const timeFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });
  const formatTime = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : timeFormatter.format(d);
  };

  // nama file buat ditampilin di samping tombol pilih gambar
  const imageName = (src) => {
    if (!src) return "Belum ada gambar";
    if (src.startsWith("data:")) return "Gambar dari laptop";
    return src.split("/").pop();
  };

  // semua perubahan disimpan lewat sini
  function persist(action, moduleTitle, detail, notify = true) {
    if (!SaguAuth.session()) {
      location.replace("admin-login.html");
      return false;
    }
    if (!SaguStore.save(db)) {
      // localStorage penuh, balikin data ke yang terakhir kesimpen
      db = SaguStore.load();
      Toast.show("Penyimpanan browser penuh. Coba pakai gambar yang lebih kecil atau hapus data yang tidak dipakai.", "error");
      Router.render();
      return false;
    }
    SaguLog.add(action, moduleTitle, detail);
    if (notify) Toast.show(`${detail}.`);
    return true;
  }

  // ubah file gambar jadi teks (data url) biar bisa disimpan di localStorage
  // gambarnya dikecilin dulu pake canvas supaya ukurannya ga kegedean
  function imageToDataURL(file, maxSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const original = reader.result;
        // svg & gif langsung aja, kalau lewat canvas gif nya jadi diem
        if (file.type === "image/svg+xml" || file.type === "image/gif") {
          resolve(original);
          return;
        }

        const img = new Image();
        img.onerror = () => reject(new Error("gambar tidak bisa dibaca"));
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

          // webp biar kecil tapi tetep bisa transparan
          let result = canvas.toDataURL("image/webp", 0.85);
          if (!result.startsWith("data:image/webp")) {
            result = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.85);
          }
          // kalau ternyata file aslinya udah kecil, pake yang asli aja
          resolve(scale === 1 && original.length < result.length ? original : result);
        };
        img.src = original;
      };
      reader.readAsDataURL(file);
    });
  }

  // isi form
  function fieldHTML(field, value, idPrefix = "f") {
    const id = `${idPrefix}_${field.name}`;
    const req = field.required ? "required" : "";
    const hint = field.hint ? `<small class="field__hint" id="${id}_hint">${esc(field.hint)}</small>` : "";
    const describedBy = field.hint ? `aria-describedby="${id}_hint"` : "";
    let control;

    switch (field.type) {
      case "textarea":
        control = `<textarea id="${id}" name="${field.name}" rows="${field.rows || 4}" ${req} ${describedBy}>${esc(value)}</textarea>`;
        break;

      case "list": {
        const text = Array.isArray(value) ? value.join(", ") : value || "";
        control = `<textarea id="${id}" name="${field.name}" rows="2" ${req} ${describedBy}>${esc(text)}</textarea>`;
        break;
      }

      case "select": {
        let options = typeof field.options === "function" ? field.options() : [...field.options];
        // nilai lama yang udah ga ada di pilihan tetep dimunculin
        if (value && !options.includes(value)) options = [value, ...options];
        control = `
          <select id="${id}" name="${field.name}" ${req} ${field.addable ? `data-addable data-prev="${esc(value || "")}"` : ""}>
            ${value ? "" : `<option value="" disabled selected>Pilih ${esc(field.label.toLowerCase())}</option>`}
            ${options.map((o) => `<option value="${esc(o)}" ${o === value ? "selected" : ""}>${esc(o)}</option>`).join("")}
            ${field.addable ? `<option value="${ADD_VALUE}">+ Tambah ${esc(field.addable)}</option>` : ""}
          </select>`;

        if (field.addable) {
          control += `
            <div class="field__add" hidden>
              <input type="text" data-add-input placeholder="Tulis ${esc(field.addable)} baru" aria-label="${esc(field.addable)} baru" />
              <button type="button" class="btn btn--primary btn--xs" data-add-save>Tambah</button>
              <button type="button" class="btn btn--outline btn--xs" data-add-cancel>Batal</button>
            </div>`;
        }
        break;
      }

      case "image": {
        const src = value || "";
        const preview = src
          ? `<span class="media field__preview"><img src="${esc(src)}" alt="" /></span>`
          : `<span class="media field__preview is-missing" data-missing="Belum ada gambar"><img alt="" /></span>`;
        control = `
          <div class="field__image">
            ${preview}
            <div class="field__upload">
              <input type="file" id="${id}" accept="image/*" class="field__file" data-upload="${field.name}" ${describedBy} />
              <label for="${id}" class="btn btn--outline btn--xs field__pick">${src ? "Ganti gambar" : "Pilih gambar"}</label>
              <span class="field__filename">${esc(imageName(src))}</span>
            </div>
            <input type="hidden" name="${field.name}" value="${esc(src)}" />
          </div>`;
        break;
      }

      case "number":
        control = `<input type="number" id="${id}" name="${field.name}" value="${esc(value ?? "")}" min="0" step="1" inputmode="numeric" ${req} ${describedBy} />`;
        break;

      default:
        control = `<input type="text" id="${id}" name="${field.name}" value="${esc(value)}" ${req} ${describedBy} />`;
    }

    return `
      <div class="field ${field.wide ? "field--wide" : ""}">
        <label for="${id}">${esc(field.label)}${field.required ? ' <span class="req" aria-hidden="true">*</span>' : ""}</label>
        ${control}
        ${hint}
      </div>`;
  }

  // cek isian wajib, isinya spasi doang juga dianggap kosong
  function validateForm(form, fields) {
    fields.forEach((f) => {
      if (f.type === "image") {
        const hidden = form.elements.namedItem(f.name);
        const file = form.querySelector(`[data-upload="${f.name}"]`);
        const empty = f.required && !hidden.value;
        file.setCustomValidity(empty ? "Pilih gambar dulu ya." : "");
        file.closest(".field").classList.toggle("is-invalid", empty);
        return;
      }
      const el = form.elements.namedItem(f.name);
      if (el && f.required) el.setCustomValidity(el.value.trim() ? "" : "Kolom ini wajib diisi.");
    });
    return form.reportValidity();
  }

  // ambil semua isi form jadi object, yang tipe list dipecah jadi array
  function collectValues(form, fields) {
    const data = new FormData(form);
    const values = {};
    fields.forEach((f) => {
      const raw = String(data.get(f.name) ?? "").trim();
      if (f.type === "list") values[f.name] = raw.split(",").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "number") values[f.name] = Math.max(0, parseInt(raw, 10) || 0);
      else values[f.name] = raw;
    });
    return values;
  }

  // dipanggil pas admin milih file di field gambar (form popup & halaman pengaturan)
  async function uploadImage(input, fields) {
    const file = input.files[0];
    if (!file) return;
    const box = input.closest(".field");
    const field = fields.find((f) => f.name === input.dataset.upload);
    const hidden = box.querySelector('input[type="hidden"]');
    const nameEl = box.querySelector(".field__filename");
    const preview = box.querySelector(".field__preview");
    const oldName = nameEl.textContent;

    if (!file.type.startsWith("image/")) {
      Toast.show("File yang dipilih bukan gambar.", "error");
      input.value = "";
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      Toast.show(`Ukuran gambar maksimal ${MAX_UPLOAD_MB} MB.`, "error");
      input.value = "";
      return;
    }

    nameEl.textContent = "Memproses gambar…";
    try {
      const dataUrl = await imageToDataURL(file, field?.maxSize || 1200);
      hidden.value = dataUrl;
      preview.classList.remove("is-missing");
      preview.querySelector("img").src = dataUrl;
      nameEl.textContent = file.name;
      box.querySelector(".field__pick").textContent = "Ganti gambar";
      input.setCustomValidity("");
      box.classList.remove("is-invalid");
    } catch (err) {
      console.error(err);
      nameEl.textContent = oldName;
      Toast.show("Gambar gagal dibaca, coba pilih file lain.", "error");
    } finally {
      input.value = ""; // biar file yang sama bisa dipilih lagi
    }
  }

  // ---------- toast, konfirmasi, form popup, sidebar ----------
  const Toast = {
    timer: null,
    show(message, type = "success") {
      const el = $("#toast");
      el.textContent = message;
      el.dataset.type = type;
      el.hidden = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { el.hidden = true; }, type === "error" ? 5000 : 3200);
    }
  };

  const Confirm = {
    // hasilnya true kalau admin klik ok
    ask(message, okLabel = "Hapus") {
      const dialog = $("#confirmModal");
      $("#confirmMessage").textContent = message;
      $("#confirmOk").textContent = okLabel;
      dialog.returnValue = "";
      dialog.showModal();
      return new Promise((resolve) => {
        dialog.addEventListener("close", () => resolve(dialog.returnValue === "ok"), { once: true });
      });
    }
  };

  const FormModal = {
    dialog: null,
    form: null,
    fields: [],
    onSubmit: null,
    busy: 0, // jumlah gambar yang lagi diproses

    init() {
      this.dialog = $("#formModal");
      this.form = $("#entityForm");

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.busy) {
          Toast.show("Tunggu sebentar, gambar masih diproses.", "error");
          return;
        }
        if (!validateForm(this.form, this.fields)) return;
        const values = collectValues(this.form, this.fields);
        this.dialog.close();
        this.onSubmit(values);
      });

      this.form.addEventListener("input", (e) => {
        e.target.setCustomValidity?.("");
      });

      this.form.addEventListener("change", (e) => {
        if (e.target.matches("[data-upload]")) this.handleUpload(e.target);
        if (e.target.matches("select[data-addable]")) this.handleSelect(e.target);
      });

      this.form.addEventListener("click", (e) => {
        const box = e.target.closest(".field");
        if (e.target.closest("[data-add-save]")) this.addOption(box);
        if (e.target.closest("[data-add-cancel]")) this.closeAddBox(box);
      });

      // enter di kotak tambah opsi jangan sampai ke-submit formnya
      this.form.addEventListener("keydown", (e) => {
        if (!e.target.matches("[data-add-input]")) return;
        if (e.key === "Enter") {
          e.preventDefault();
          this.addOption(e.target.closest(".field"));
        }
        if (e.key === "Escape") {
          e.preventDefault();
          this.closeAddBox(e.target.closest(".field"));
        }
      });

      this.dialog.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) this.dialog.close();
      });
    },

    open({ title, fields, values = {}, submitLabel = "Simpan", onSubmit }) {
      this.fields = fields;
      this.onSubmit = onSubmit;
      this.busy = 0;
      $("#formTitle").textContent = title;
      $("#formSubmit").textContent = submitLabel;
      $("#formFields").innerHTML = fields.map((f) => fieldHTML(f, values[f.name], "ef")).join("");
      this.dialog.showModal();
      this.form.querySelector("input:not([type=file]):not([type=hidden]), textarea, select")?.focus();
    },

    async handleUpload(input) {
      this.busy++;
      try { await uploadImage(input, this.fields); }
      finally { this.busy--; }
    },

    // kalau yang dipilih "+ Tambah ...", munculin kotak isian
    handleSelect(select) {
      const box = select.closest(".field");
      if (select.value !== ADD_VALUE) {
        select.dataset.prev = select.value;
        return;
      }
      select.value = select.dataset.prev || "";
      const addBox = box.querySelector(".field__add");
      addBox.hidden = false;
      addBox.querySelector("[data-add-input]").focus();
    },

    closeAddBox(box) {
      const addBox = box.querySelector(".field__add");
      addBox.hidden = true;
      addBox.querySelector("[data-add-input]").value = "";
      box.querySelector("select").focus();
    },

    addOption(box) {
      const select = box.querySelector("select[data-addable]");
      const input = box.querySelector("[data-add-input]");
      const field = this.fields.find((f) => f.name === select.name);
      const text = input.value.trim().replace(/\s+/g, " ");
      if (!text) {
        input.focus();
        return;
      }

      // kalau udah ada (beda huruf besar kecil doang) pilih yang lama aja
      const same = [...select.options].find((o) =>
        o.value && o.value !== ADD_VALUE && o.value.toLowerCase() === text.toLowerCase());

      if (same) {
        select.value = same.value;
      } else {
        db.foodOptions[field.optionKey].push(text);
        if (!persist("Tambah", "Kuliner Sagu", `Opsi ${field.addable} "${text}" ditambahkan`)) return;
        select.insertBefore(new Option(text, text), select.querySelector(`option[value="${ADD_VALUE}"]`));
        select.value = text;
      }

      select.dataset.prev = select.value;
      select.setCustomValidity("");
      this.closeAddBox(box);
    }
  };

  const Sidebar = {
    init() {
      this.el = $("#sidebar");
      this.toggle = $("#sidebarToggle");
      this.overlay = $("#sidebarOverlay");

      this.toggle.addEventListener("click", () =>
        this.el.classList.contains("is-open") ? this.close() : this.open()
      );
      this.overlay.addEventListener("click", () => this.close());
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.el.classList.contains("is-open")) this.close();
      });
    },
    open() {
      this.el.classList.add("is-open");
      this.overlay.hidden = false;
      this.toggle.setAttribute("aria-expanded", "true");
      this.toggle.setAttribute("aria-label", "Tutup menu");
    },
    close() {
      this.el.classList.remove("is-open");
      this.overlay.hidden = true;
      this.toggle.setAttribute("aria-expanded", "false");
      this.toggle.setAttribute("aria-label", "Buka menu");
    }
  };

  // ---------- halaman ringkasan dashboard ----------
  const DashboardView = {
    render() {
      const session = SaguAuth.session();
      const stats = Object.entries(MODULES).map(([key, mod]) => `
        <a class="stat" href="#${key}">
          <span class="stat__num">${db[key].length}</span>
          <span class="stat__label">${esc(mod.title)}</span>
        </a>`).join("");

      const activity = SaguLog.all().slice(0, 8);
      const activityHTML = activity.length
        ? `<ol class="activity">${activity.map((a) => `
            <li class="activity__item">
              <span class="activity__badge" data-type="${esc(a.action)}">${esc(a.action)}</span>
              <div class="activity__body">
                <p>${esc(a.detail)}</p>
                <small><span>${esc(a.module)}</span><time datetime="${esc(a.time)}">${formatTime(a.time)}</time></small>
              </div>
            </li>`).join("")}</ol>`
        : `<p class="empty-note">Belum ada aktivitas. Setiap perubahan yang disimpan akan tercatat di sini.</p>`;

      // hitung jumlah kuliner tiap wilayah buat grafik
      const names = unique([...regionOptions(), ...db.foods.map((f) => f.region)]);
      const counts = names.map((name) => ({ name, n: db.foods.filter((f) => f.region === name).length }));
      const max = Math.max(1, ...counts.map((c) => c.n));

      $("#view").innerHTML = `
        <section class="welcome">
          <div class="welcome__text">
            <p class="welcome__eyebrow">Selamat datang kembali</p>
            <h2 class="welcome__title">Halo, ${esc(session?.user || "admin")}!</h2>
            <p class="welcome__desc">Semua isi website ${esc(db.settings.siteName)} bisa kamu atur dari sini, mulai dari kartu tentang sagu sampai soal quiz.</p>
          </div>
          <img class="welcome__logo" src="assets/images/logo-sagu.png" alt="" />
        </section>

        <section class="stats" aria-label="Statistik konten">${stats}</section>

        <div class="dash-grid">
          <section class="panel dash-grid__activity">
            <div class="panel__head">
              <h2 class="panel__title">Aktivitas terbaru</h2>
              ${activity.length ? `<button type="button" class="btn btn--outline btn--xs" data-action="clear-log">Bersihkan</button>` : ""}
            </div>
            ${activityHTML}
          </section>

          <section class="panel">
            <h2 class="panel__title">Kuliner per wilayah</h2>
            <ul class="bars">
              ${counts.map((c) => `
                <li class="bar">
                  <span class="bar__label">${esc(c.name)}</span>
                  <span class="bar__track"><span class="bar__fill" style="width:${(c.n / max) * 100}%"></span></span>
                  <span class="bar__value">${c.n}</span>
                </li>`).join("")}
            </ul>
          </section>

          <section class="panel">
            <h2 class="panel__title">Kelola data</h2>
            <p class="panel__note">Simpan cadangan seluruh konten sebagai file JSON, atau pulihkan dari file cadangan.</p>
            <div class="data-tools">
              <button type="button" class="btn btn--primary btn--sm" data-action="export">Export JSON</button>
              <button type="button" class="btn btn--outline btn--sm" data-action="import">Import JSON</button>
              <button type="button" class="btn btn--danger btn--sm" data-action="reset">Kembalikan data awal</button>
            </div>
          </section>
        </div>`;
    }
  };

  // ---------- halaman tabel tiap menu konten ----------
  function cellHTML(col, item, index) {
    if (col.format) return col.format(item);
    const value = item[col.key];

    switch (col.type) {
      case "order":
        return `<span class="order-num">${pad(index + 1)}</span>`;
      case "thumb":
        return value
          ? `<span class="media thumb ${col.round ? "thumb--round" : ""} ${col.wide ? "thumb--wide" : ""}"><img src="${esc(value)}" alt="" /></span>`
          : `<span class="media thumb is-missing" data-missing="kosong"></span>`;
      case "clip":
        return esc(clip(value, col.max));
      case "list":
        return esc((value || []).join(", "));
      default:
        return esc(value);
    }
  }

  const ModuleView = {
    query: "",

    render(key) {
      const mod = MODULES[key];
      this.query = "";

      $("#view").innerHTML = `
        <section class="panel">
          <div class="panel__toolbar">
            <div class="admin-search">
              <label for="moduleSearch" class="sr-only">Cari ${esc(mod.singular)}</label>
              <input type="search" id="moduleSearch" class="input" placeholder="Cari ${esc(mod.singular)}…" autocomplete="off" />
            </div>
            ${mod.noAdd ? "" : `<button type="button" class="btn btn--primary btn--sm" data-action="add">+ Tambah ${esc(mod.singular)}</button>`}
          </div>

          ${mod.reorder ? `<p class="panel__note">Urutan di tabel ini sama dengan urutan tampil di website. Pakai tombol naik/turun untuk mengubahnya.</p>` : ""}

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  ${mod.columns.map((c) => `<th scope="col">${esc(c.label)}</th>`).join("")}
                  <th scope="col" class="data-table__actions">Aksi</th>
                </tr>
              </thead>
              <tbody id="moduleRows"></tbody>
            </table>
          </div>
          <p class="panel__count" id="moduleCount"></p>
        </section>`;

      // yang dirender ulang cuma isi tabel, biar kotak search nya ga kehilangan fokus
      $("#moduleSearch").addEventListener("input", (e) => {
        this.query = e.target.value.trim().toLowerCase();
        this.renderRows(key);
      });

      this.renderRows(key);
    },

    renderRows(key) {
      const mod = MODULES[key];
      const all = db[key];
      // data url gambar ga usah ikut dicari
      const searchText = (item) => Object.values(item).flat()
        .filter((v) => !String(v).startsWith("data:")).join(" ").toLowerCase();
      const rows = this.query ? all.filter((item) => searchText(item).includes(this.query)) : all;
      const tbody = $("#moduleRows");
      if (!tbody) return;

      $("#moduleCount").textContent = this.query
        ? `${rows.length} dari ${all.length} ${mod.singular} ditemukan`
        : `${all.length} ${mod.singular}`;

      if (!rows.length) {
        tbody.innerHTML = `
          <tr class="data-table__empty">
            <td colspan="${mod.columns.length + 1}">
              ${all.length
                ? "Tidak ada data yang cocok dengan pencarian."
                : `Belum ada ${esc(mod.singular)}. Klik "Tambah ${esc(mod.singular)}" untuk membuat yang pertama.`}
            </td>
          </tr>`;
        return;
      }

      // pas lagi nyari, tombol naik turun disembunyiin dulu
      const canReorder = mod.reorder && !this.query;

      tbody.innerHTML = rows.map((item) => {
        const index = all.indexOf(item);
        const label = esc(itemLabel(item));
        const id = esc(item.id);
        return `
          <tr>
            ${mod.columns.map((c) => `<td data-label="${esc(c.label)}">${cellHTML(c, item, index)}</td>`).join("")}
            <td class="data-table__actions" data-label="Aksi">
              <div class="row-actions">
                ${canReorder ? `
                  <button type="button" class="icon-btn" data-action="up" data-id="${id}" aria-label="Naikkan ${label}" ${index === 0 ? "disabled" : ""}>${ICON.up}</button>
                  <button type="button" class="icon-btn" data-action="down" data-id="${id}" aria-label="Turunkan ${label}" ${index === all.length - 1 ? "disabled" : ""}>${ICON.down}</button>` : ""}
                <button type="button" class="btn btn--outline btn--xs" data-action="edit" data-id="${id}" aria-label="Edit ${label}">Edit</button>
                ${mod.noDelete ? "" : `<button type="button" class="btn btn--danger btn--xs" data-action="delete" data-id="${id}" aria-label="Hapus ${label}">Hapus</button>`}
              </div>
            </td>
          </tr>`;
      }).join("");
    }
  };

  // ---------- halaman pengaturan website ----------
  const SettingsView = {
    render() {
      $("#view").innerHTML = `
        <section class="panel">
          <h2 class="panel__title">Identitas website</h2>
          <p class="panel__note">Perubahan di sini langsung dipakai di navbar, hero, dan footer website.</p>
          <form id="settingsForm" novalidate>
            <div class="form-grid">
              ${SETTINGS_FIELDS.map((f) => fieldHTML(f, db.settings[f.name], "sf")).join("")}
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary btn--sm">Simpan pengaturan</button>
            </div>
          </form>
        </section>`;

      const form = $("#settingsForm");
      let busy = 0; // jumlah gambar yang lagi diproses
      form.addEventListener("input", (e) => e.target.setCustomValidity?.(""));
      form.addEventListener("change", async (e) => {
        if (!e.target.matches("[data-upload]")) return;
        busy++;
        try { await uploadImage(e.target, SETTINGS_FIELDS); }
        finally { busy--; }
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (busy) {
          Toast.show("Tunggu sebentar, gambar masih diproses.", "error");
          return;
        }
        if (!validateForm(form, SETTINGS_FIELDS)) return;
        db.settings = { ...db.settings, ...collectValues(form, SETTINGS_FIELDS) };
        persist("Ubah", "Pengaturan", "Pengaturan website diperbarui");
      });
    }
  };

  // ---------- export, import, reset ----------
  const DataTools = {
    exportJSON() {
      const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sagu-nusantara-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      SaguLog.add("Export", "Data", "Seluruh konten diekspor ke JSON");
      Toast.show("File JSON berhasil diunduh.");
      if (currentView === "dashboard") DashboardView.render();
    },

    async importJSON(file) {
      try {
        const obj = JSON.parse(await file.text());
        const ok = await Confirm.ask(
          "Semua konten saat ini akan diganti dengan isi file ini. Lanjutkan import?",
          "Import"
        );
        if (!ok) return;
        db = SaguStore.importData(obj);
        SaguLog.add("Import", "Data", `Konten diimpor dari ${file.name}`);
        Toast.show("Import berhasil. Konten website sudah diperbarui.");
        Router.render();
      } catch (err) {
        const reason = err instanceof SyntaxError ? "file bukan JSON yang valid." : err.message;
        Toast.show(`Import gagal: ${reason}`, "error");
      }
    },

    async reset() {
      const ok = await Confirm.ask(
        "Semua perubahan akan hilang dan konten kembali seperti data awal. Lanjutkan?",
        "Kembalikan"
      );
      if (!ok) return;
      db = SaguStore.reset(); // log nya udah dicatat di dalam reset()
      Toast.show("Konten dikembalikan ke data awal.");
      Router.render();
    }
  };

  // ---------- semua klik tombol [data-action] masuk sini ----------
  async function handleAction(action, id) {
    switch (action) {
      case "export": return DataTools.exportJSON();
      case "import": return $("#importFile").click();
      case "reset": return DataTools.reset();
      case "clear-log":
        SaguLog.clear();
        return DashboardView.render();
    }

    const key = currentView;
    const mod = MODULES[key];
    if (!mod) return;
    if ((action === "add" && mod.noAdd) || (action === "delete" && mod.noDelete)) return;
    const list = db[key];
    const index = list.findIndex((x) => x.id === id);

    switch (action) {
      case "add":
        FormModal.open({
          title: `Tambah ${mod.singular}`,
          submitLabel: `Simpan ${mod.singular}`,
          fields: mod.fields,
          values: mod.defaults ? mod.defaults() : {},
          onSubmit: (values) => {
            // ambil ulang db[key], siapa tau db nya udah diganti pas form kebuka
            db[key].push({ id: uid(mod.prefix), ...values });
            persist("Tambah", mod.title, `${itemLabel(values)} ditambahkan`);
            ModuleView.renderRows(key);
          }
        });
        break;

      case "edit": {
        const item = list[index];
        if (!item) return;
        FormModal.open({
          title: `Edit ${mod.singular}`,
          submitLabel: "Simpan perubahan",
          fields: mod.fields,
          values: item,
          onSubmit: (values) => {
            const i = db[key].findIndex((x) => x.id === item.id);
            if (i < 0) {
              Toast.show("Data ini sudah tidak ada, mungkin sudah dihapus.", "error");
              return;
            }
            db[key][i] = { ...db[key][i], ...values };
            persist("Ubah", mod.title, `${itemLabel(values)} diperbarui`);
            ModuleView.renderRows(key);
          }
        });
        break;
      }

      case "delete": {
        const item = list[index];
        if (!item) return;
        const ok = await Confirm.ask(`Hapus ${mod.singular} "${itemLabel(item)}"? Tindakan ini tidak bisa dibatalkan.`);
        if (!ok) return;
        const i = db[key].findIndex((x) => x.id === item.id);
        if (i >= 0) db[key].splice(i, 1);
        persist("Hapus", mod.title, `${itemLabel(item)} dihapus`);
        ModuleView.renderRows(key);
        break;
      }

      case "up":
      case "down": {
        const target = action === "up" ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        persist("Urutkan", mod.title, `${itemLabel(list[target])} dipindah ke posisi ${target + 1}`, false);
        ModuleView.renderRows(key);
        // fokus balik ke tombol yang sama biar bisa diklik berkali-kali
        $(`[data-action="${action}"][data-id="${CSS.escape(id)}"]`)?.focus();
        break;
      }
    }
  }

  // ---------- pindah halaman pake #hash (#dashboard, #foods, dll) ----------
  const Router = {
    init() {
      window.addEventListener("hashchange", () => this.go());
      this.go();
    },

    go() {
      const view = location.hash.slice(1);
      currentView = VIEW_META[view] ? view : "dashboard";
      this.render();

      $$(".sidebar__link").forEach((link) => {
        if (link.dataset.view === currentView) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });

      Sidebar.close();
      window.scrollTo(0, 0);
      $("#view").focus({ preventScroll: true });
    },

    render() {
      const meta = VIEW_META[currentView];
      $("#viewTitle").textContent = meta.title;
      $("#viewCrumb").textContent = meta.group;
      document.title = `${meta.title} — Admin Sagu Nusantara`;

      if (currentView === "dashboard") DashboardView.render();
      else if (currentView === "settings") SettingsView.render();
      else ModuleView.render(currentView);
    }
  };

  const DashboardPage = {
    init() {
      const session = SaguAuth.session();
      if (!session) {
        location.replace("admin-login.html");
        return;
      }

      db = SaguStore.load();
      $("#userBadge").textContent = session.user;

      Sidebar.init();
      FormModal.init();

      $("#view").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (btn) handleAction(btn.dataset.action, btn.dataset.id);
      });

      $("#importFile").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) DataTools.importJSON(file);
        e.target.value = "";
      });

      $("#logoutBtn").addEventListener("click", () => {
        SaguLog.add("Logout", "Auth", `${session.user} keluar dari dashboard`);
        SaguAuth.logout();
        location.replace("admin-login.html");
      });

      // kalau data diubah dari tab admin lain, ikut update
      window.addEventListener("storage", (e) => {
        if (e.key !== SaguStore.DB_KEY) return;
        db = SaguStore.load();
        if (!FormModal.dialog.open) Router.render();
      });

      Router.init();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "login") LoginPage.init();
    else if (page === "dashboard") DashboardPage.init();
  });
})();
