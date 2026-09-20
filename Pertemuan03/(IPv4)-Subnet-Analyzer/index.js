document.addEventListener("DOMContentLoaded", () => {
  // Menjalankan seluruh kode setelah html selesai loading nya

  // Mengambil elemen elemen HTML yang akan dipakai berulang kali.
  //1. Input Analyzer
  const analyzerInput = document.getElementById("analyzer-ip-address");
  const analyzeButton = document.getElementById("btn-analyze");
  const clearAnalyzerButton = document.getElementById("btn-clear-analyzer");
  const analyzerResult = document.getElementById("resultAnalyzer");

  //2. Subnet Calculator
  const radioSelect = document.getElementsByName("network-class");
  const subnetSelect = document.getElementById("subnet-select");
  const calculatorInput = document.getElementById("ip-address");
  const calculateButton = document.getElementById("btn-calculate");
  const clearCalculatorButton = document.getElementById("btn-clear");
  const calculatorMessage = document.getElementById("calculator-message");
  const subnetResult = document.getElementById("resultSubnet");

  // Mengubah tulisan pada satu sel tabel berdasarkan id. Semacam fungsi helper untuk mengisi hasil ke html lebih pendek??
  function isiHasil(id, nilai) {
    document.getElementById(id).textContent = nilai;
  }

  function kelasDipilih() {
    for (let i = 0; i < radioSelect.length; i++) {
      if (radioSelect[i].checked) {
        return radioSelect[i].value;
      }
    }
  }

  // Memeriksa format IPv4 dan mengembalikan array oktet apabila valid.
  function ambilOktet(ipAddress) {
    const bagianIp = ipAddress.trim().split("."); // Hapus whitespace akhir dan awal. pisahin juga string nya berdasarkan titik.

    if (bagianIp.length !== 4) {
      // Kalau panjang nya lebih dari 4 oktet
      return null;
    }

    const oktet = [];

    for (let i = 0; i < bagianIp.length; i++) {
      // Hanya angka bulat 0 sampai 255 yang diperbolehkan.
      if (bagianIp[i] === "" || !/^\d+$/.test(bagianIp[i])) {
        // /^\d+$/, Regex yang kita ingin samain dengan bagianIp kita.
        return null;
      }

      // Ubah string ke number
      const angka = Number(bagianIp[i]);

      if (angka < 0 || angka > 255) {
        // Range
        return null;
      }

      oktet.push(angka); // Masukin ke array oktet
    }

    return oktet;
  }

  // Mengubah satu oktet desimal menjadi 8 digit biner.
  function keBiner(oktet) {
    let biner = oktet.toString(2); // Basis 2

    while (biner.length < 8) {
      // Looping untuk biner yang panjang digit nya kurang.
      biner = "0" + biner;
    }

    return biner;
  }

  // Ini buat mengubah seluruh IP ke biner lalu kita simpan di array hasil
  function ipKeBiner(oktet) {
    const hasil = [];

    for (let i = 0; i < oktet.length; i++) {
      hasil.push(keBiner(oktet[i]));
    }

    return hasil.join("."); // Kita gabungkan array nya dengan titik sebagai pemisah
  }

  // Informasi Kelas
  function informasiKelas(oktetPertama) {
    if (oktetPertama === 0) {
      return {
        nama: "Special: 0.0.0.0 network",
        range: "0.0.0.0 - 0.255.255.255",
        subnetMask: "-",
        jumlahNetworkOktet: 0,
      };
    }

    if (oktetPertama >= 1 && oktetPertama <= 126) {
      return {
        nama: "Class A",
        range: "1.0.0.1 - 126.255.255.254",
        subnetMask: "255.0.0.0 /8",
        jumlahNetworkOktet: 1,
      };
    }

    if (oktetPertama === 127) {
      return {
        nama: "Special: Loopback",
        range: "127.0.0.0 - 127.255.255.255",
        subnetMask: "-",
        jumlahNetworkOktet: 0,
      };
    }

    if (oktetPertama >= 128 && oktetPertama <= 191) {
      return {
        nama: "Class B",
        range: "128.0.0.1 - 191.255.255.254",
        subnetMask: "255.255.0.0 /16",
        jumlahNetworkOktet: 2,
      };
    }

    if (oktetPertama >= 192 && oktetPertama <= 223) {
      return {
        nama: "Class C",
        range: "192.0.0.1 - 223.255.255.254",
        subnetMask: "255.255.255.0 /24",
        jumlahNetworkOktet: 3,
      };
    }

    if (oktetPertama <= 239) {
      return {
        nama: "Class D (Multicast)",
        range: "224.0.0.0 - 239.255.255.255",
        subnetMask: "-",
        jumlahNetworkOktet: 0,
      };
    }

    return {
      nama: "Class E (Reserved)",
      range: "240.0.0.0 - 255.255.255.255",
      subnetMask: "-",
      jumlahNetworkOktet: 0,
    };
  }

  function tampilkanAnalyzer() {
    // Masukin inputan user ke function ambilOktet lalu return nya simpan di oktet.
    const oktet = ambilOktet(analyzerInput.value);

    // Batasan apabila tidak ada IP yang diinput
    if (oktet === null) {
      alert("Masukkan IPv4 yang valid, contoh: 192.168.1.10");
      analyzerResult.hidden = true;
      return;
    }

    const infoKelas = informasiKelas(oktet[0]); // Ini cari informasi kelas menggunakan oktet pertama
    const network = oktet.slice(); // Buat array baru terpisah agar yang default ga keganti

    // Host ID dibuat 0 untuk mendapatkan network address kelas default.
    for (let i = infoKelas.jumlahNetworkOktet; i < 4; i++) {
      network[i] = 0;
    }

    const networkAddress =
      infoKelas.jumlahNetworkOktet === 0 ? "-" : network.join(".");

    isiHasil("analyzer-res-ip", oktet.join("."));
    isiHasil("analyzer-res-class", infoKelas.nama);
    isiHasil("analyzer-res-network", networkAddress);
    isiHasil("analyzer-res-binary", ipKeBiner(oktet));
    analyzerResult.hidden = false; // Div Hidden tar jadi false / terlihat
  }

  function ipKeAngka(oktet) {
    return oktet[0] * 16777216 + oktet[1] * 65536 + oktet[2] * 256 + oktet[3]; // Ini digunakan untuk mempermudah perhitungan subnetting
  }

  // Ini kebalikkannya, kita ingin membuat Angka IP tadi di ubah menjadi sebuah IP address
  function angkaKeIp(angka) {
    const oktetPertama = Math.floor(angka / 16777216);
    angka = angka % 16777216;
    const oktetKedua = Math.floor(angka / 65536);
    angka = angka % 65536;
    const oktetKetiga = Math.floor(angka / 256);
    const oktetKeempat = angka % 256;

    return [oktetPertama, oktetKedua, oktetKetiga, oktetKeempat];
  }

  // Membuat subnet mask or CIDR
  function subnetMask(prefix) {
    const mask = [];
    let sisaBitNetwork = prefix;

    for (let i = 0; i < 4; i++) {
      const bitDiOktetIni = Math.min(sisaBitNetwork, 8);
      let nilaiOktet = 0;

      // Rumus konversi biner ke desimal
      for (let j = 0; j < bitDiOktetIni; j++) {
        nilaiOktet += Math.pow(2, 7 - j); // Bit ke-i untuk 2^7-j
      }

      mask.push(nilaiOktet);
      sisaBitNetwork -= bitDiOktetIni;
    }

    return mask;
  }

  function tipeIp(oktet) {
    if (oktet[0] === 10) {
      return "Private";
    }

    if (oktet[0] === 172 && oktet[1] >= 16 && oktet[1] <= 31) {
      return "Private";
    }

    if (oktet[0] === 192 && oktet[1] === 168) {
      return "Private";
    } else return "Public";
  }

  function tampilkanCalculator() {
    const oktet = ambilOktet(calculatorInput.value);
    const prefix = Number(subnetSelect.value);

    if (oktet === null) {
      calculatorMessage.textContent =
        "Masukkan IPv4 yang valid, contoh: 192.168.1.10.";
      calculatorMessage.hidden = false;
      subnetResult.hidden = true;
      return;
    }

    const kelas = kelasDipilih();

    if (kelas == "A" && (oktet[0] < 1 || oktet[0] > 126)) {
      calculatorMessage.textContent =
        "IP " +
        oktet.join(".") +
        " tidak dapat diproses karena berada di luar range Class A (1.0.0.0 - 126.255.255.255).";
      calculatorMessage.hidden = false;
      subnetResult.hidden = true;
      return;
    }

    if (kelas == "B" && (oktet[0] < 128 || oktet[0] > 191)) {
      calculatorMessage.textContent =
        "IP " +
        oktet.join(".") +
        " tidak dapat diproses karena berada di luar range Class B (128.0.0.0 - 191.255.255.255).";
      calculatorMessage.hidden = false;
      subnetResult.hidden = true;
      return;
    }

    if (kelas == "C" && (oktet[0] < 192 || oktet[0] > 223)) {
      calculatorMessage.textContent =
        "IP " +
        oktet.join(".") +
        " tidak dapat diproses karena berada di luar range Class C (192.0.0.0 - 223.255.255.255).";
      calculatorMessage.hidden = false;
      subnetResult.hidden = true;
      return;
    }

    const totalHost = Math.pow(2, 32 - prefix);

    const ipDalamAngka = ipKeAngka(oktet);
    const angkaNetwork = Math.floor(ipDalamAngka / totalHost) * totalHost;
    const angkaBroadcast = angkaNetwork + totalHost - 1;

    const network = angkaKeIp(angkaNetwork);
    const broadcast = angkaKeIp(angkaBroadcast);
    const mask = subnetMask(prefix);

    // Calculating usable host.
    const usableHost = prefix >= 31 ? 0 : totalHost - 2;
    let hostRange = "-";

    // Build host range
    if (usableHost > 0) {
      hostRange =
        angkaKeIp(angkaNetwork + 1).join(".") +
        " - " +
        angkaKeIp(angkaBroadcast - 1).join(".");
    }

    // Ini DOM untuk masukin hasil nya ke output yang akan ditampilkan
    isiHasil("res-ip", oktet.join("."));
    isiHasil("res-network", network.join("."));
    isiHasil("res-range", hostRange);
    isiHasil("res-broadcast", broadcast.join("."));
    isiHasil("res-total-hosts", totalHost);
    isiHasil("res-usable-hosts", usableHost);
    isiHasil("res-netmask", mask.join("."));
    isiHasil("res-binary-netmask", ipKeBiner(mask));
    isiHasil("res-class", informasiKelas(oktet[0]).nama);
    isiHasil("res-cidr", oktet.join(".") + "/" + prefix);
    isiHasil("res-type", tipeIp(oktet));
    isiHasil("res-binary-id", ipKeBiner(oktet));
    calculatorMessage.hidden = true;
    subnetResult.hidden = false;
  }

  // Event Listener

  analyzeButton.addEventListener("click", tampilkanAnalyzer);
  calculateButton.addEventListener("click", tampilkanCalculator);

  clearAnalyzerButton.addEventListener("click", function () {
    analyzerInput.value = "";
    analyzerResult.hidden = true;
  });

  clearCalculatorButton.addEventListener("click", function () {
    calculatorInput.value = "";
    subnetSelect.value = "24";
    calculatorMessage.hidden = true;
    subnetResult.hidden = true;
  });
});
