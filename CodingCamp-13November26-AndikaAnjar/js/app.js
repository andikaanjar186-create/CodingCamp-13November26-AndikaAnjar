// ===== Konfigurasi & data awal =====
const STORAGE = { tx: "ebv_transactions", cats: "ebv_categories", theme: "ebv_theme" };
const COLORS = ["#1f7a5a", "#e9a23b", "#4b7bec", "#d6456b", "#8e5bd6", "#2bb3b1", "#8a8f3a"];

// #fungsi $ : singkatan dari document.getElementById
const $ = (id) => document.getElementById(id);

// #fungsi load : baca data dari Local Storage, pakai fallback kalau kosong/rusak
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};

// #fungsi save : simpan data ke Local Storage dalam bentuk JSON
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let transactions = load(STORAGE.tx, []);
let categories = load(STORAGE.cats, ["Food", "Transport", "Fun"]);
let chart = null;

// #fungsi rupiah : ubah angka jadi format "$ 10"
const rupiah = (n) => "$ " + Number(n).toLocaleString("id-ID");

// #fungsi colorOf : ambil warna kategori berdasarkan urutannya
const colorOf = (cat) => COLORS[categories.indexOf(cat) % COLORS.length] || COLORS[0];

// #fungsi renderCategories : isi dropdown kategori di form dari array categories
function renderCategories() {
  $("category").innerHTML =
    '<option value="">Select category</option>' +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

// #fungsi sorted : kembalikan salinan transaksi yang sudah diurutkan sesuai dropdown sort
function sorted() {
  const list = [...transactions];
  const mode = $("sort").value;
  if (mode === "amount-desc") list.sort((a, b) => b.amount - a.amount);
  else if (mode === "amount-asc") list.sort((a, b) => a.amount - b.amount);
  else if (mode === "category") list.sort((a, b) => a.category.localeCompare(b.category));
  else list.sort((a, b) => b.id - a.id);
  return list;
}

// #fungsi renderList : tampilkan daftar transaksi (nama, kategori, jumlah, tombol hapus)
function renderList() {
  const ul = $("list");
  ul.innerHTML = "";
  sorted().forEach((t) => {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
      <span class="dot" style="background:${colorOf(t.category)}"></span>
      <div class="info"><strong></strong><small></small></div>
      <span class="amt">${rupiah(t.amount)}</span>
      <button class="del" aria-label="Delete">Delete</button>`;
    li.querySelector("strong").textContent = t.name;
    li.querySelector("small").textContent = t.category;
    li.querySelector(".del").addEventListener("click", () => removeTx(t.id));
    ul.appendChild(li);
  });
  $("listEmpty").hidden = transactions.length > 0;
}

// #fungsi renderTotal : jumlahkan semua transaksi dan tampilkan sebagai total balance
function renderTotal() {
  $("total").textContent = rupiah(transactions.reduce((s, t) => s + t.amount, 0));
}

// #fungsi renderChart : hitung total per kategori lalu gambar pie chart (Chart.js)
function renderChart() {
  const totals = {};
  transactions.forEach((t) => (totals[t.category] = (totals[t.category] || 0) + t.amount));
  const labels = Object.keys(totals);
  $("chartEmpty").hidden = labels.length > 0;
  $("chart").hidden = labels.length === 0;
  if (chart) chart.destroy();
  if (!labels.length || typeof Chart === "undefined") return;
  chart = new Chart($("chart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: labels.map((l) => totals[l]), backgroundColor: labels.map(colorOf), borderWidth: 0 }],
    },
    options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
  });
}

// #fungsi render : perbarui seluruh tampilan (total, daftar, chart) sekaligus
function render() {
  renderTotal();
  renderList();
  renderChart();
}

// #fungsi removeTx : hapus transaksi berdasarkan id, simpan, lalu render ulang
function removeTx(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save(STORAGE.tx, transactions);
  render();
}

// #fungsi submit form : validasi input, tambah transaksi baru, simpan, render ulang
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const amount = parseFloat($("amount").value);
  const category = $("category").value;
  if (!name || !amount || amount <= 0 || !category) {
    $("error").textContent = "Fill in the item name, a valid amount, and a category.";
    return;
  }
  $("error").textContent = "";
  transactions.push({ id: Date.now(), name, amount, category });
  save(STORAGE.tx, transactions);
  e.target.reset();
  render();
});

// #fungsi tambah kategori kustom : cek duplikat, simpan, perbarui dropdown
$("addCategory").addEventListener("click", () => {
  const value = $("newCategory").value.trim();
  if (!value) return;
  if (categories.some((c) => c.toLowerCase() === value.toLowerCase())) {
    $("error").textContent = "That category already exists.";
    return;
  }
  categories.push(value);
  save(STORAGE.cats, categories);
  $("newCategory").value = "";
  $("error").textContent = "";
  renderCategories();
  $("category").value = value;
});

// #fungsi sort : urutkan ulang daftar saat pilihan dropdown berubah
$("sort").addEventListener("change", renderList);

// #fungsi applyTheme : pasang tema (light/dark) dan ubah teks tombolnya
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("themeToggle").textContent = theme === "dark" ? "Light" : "Dark";
}

// #fungsi toggle tema : ganti light/dark dan simpan pilihannya
$("themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE.theme, next);
  applyTheme(next);
});

// ===== Dijalankan saat halaman dibuka =====
applyTheme(localStorage.getItem(STORAGE.theme) || "light");
renderCategories();
render();