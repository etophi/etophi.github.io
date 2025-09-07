// ===== DATA HALAMAN =====
const defaultPages = {
  home: { title: "Halo, ini website saya!", content: "Selamat datang di portofolio saya." },
  about: { title: "Tentang Saya", content: "Halo! Nama saya Andi, sedang belajar membuat website." },
  projects: { title: "Proyek", content: "Proyek 1: Website\nProyek 2: Kalkulator\nProyek 3: Blog" },
  contact: { title: "Kontak", content: "Email: andi@example.com\nInstagram: @andi" },
  download: { title: "Download", content: "File tersedia di sini" },
  webgis: { title: "WebGIS", content: "Peta interaktif proyek" }
};
function loadPages() {
  const saved = localStorage.getItem("pages");
  return saved ? JSON.parse(saved) : defaultPages;
}
function savePages(pages) { localStorage.setItem("pages", JSON.stringify(pages)); }

// ===== RENDER NAVBAR DINAMIS =====
function renderNavbar() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const pages = loadPages();
  nav.innerHTML = "";

  // Tambah menu dari pages
  Object.keys(pages).forEach(key => {
    const a = document.createElement("a");
    a.href = key + ".html";
    a.textContent = pages[key].title;
    if (window.location.pathname.includes(key + ".html")) a.classList.add("active");
    nav.appendChild(a);
  });

  // Tambah link Admin di kanan
  const adminLink = document.createElement("a");
  adminLink.href = "login.html";
  adminLink.textContent = "Admin";
  adminLink.style.marginLeft = "auto";
  adminLink.style.fontSize = "12px";
  nav.appendChild(adminLink);
}
document.addEventListener("DOMContentLoaded", renderNavbar);

// ===== RENDER HALAMAN PUBLIK =====
function renderPage(pageKey, titleId, contentId) {
  const pages = loadPages();
  if (!pages[pageKey]) return;
  if (document.getElementById(titleId)) document.getElementById(titleId).textContent = pages[pageKey].title;
  if (document.getElementById(contentId)) document.getElementById(contentId).innerHTML = pages[pageKey].content.replace(/\n/g, "<br>");
}

// Panggil render untuk halaman bawaan
renderPage("home", "site-title", "site-content");
renderPage("about", "about-title", "about-content");
renderPage("projects", "projects-title", "projects-content");
renderPage("contact", "contact-title", "contact-content");
renderPage("download", "download-title", "download-content");
renderPage("webgis", "webgis-title", "webgis-content");

// ===== LOGIN =====
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    const defaultUser = "admin", defaultPass = "1234";
    if (user === defaultUser && pass === defaultPass) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user);
      window.location.href = "admin.html";
    } else {
      document.getElementById("login-message").textContent = "Username atau password salah!";
    }
  });
}

// ===== ADMIN CEK LOGIN =====
if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("admin-stats.html")) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    alert("Silakan login!");
    window.location.href = "login.html";
  } else {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
  }
}

// ===== ADMIN FORM EDIT =====
const adminForm = document.getElementById("admin-form");
const pageSelect = document.getElementById("page-select");
if (adminForm && pageSelect) {
  let pages = loadPages();

  // Isi dropdown dengan semua halaman
  function populatePageSelect() {
    pageSelect.innerHTML = "";
    Object.keys(pages).forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = pages[key].title;
      pageSelect.appendChild(opt);
    });
  }
  populatePageSelect();

  pageSelect.addEventListener("change", () => {
    const p = pageSelect.value;
    document.getElementById("title-input").value = pages[p].title;
    document.getElementById("content-input").value = pages[p].content;
  });
  pageSelect.dispatchEvent(new Event("change"));

  adminForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const p = pageSelect.value;
    pages[p].title = document.getElementById("title-input").value;
    pages[p].content = document.getElementById("content-input").value;
    savePages(pages);
    alert("Perubahan tersimpan: " + p);
    renderNavbar();
  });

  // ===== FORM TAMBAH HALAMAN =====
  const addForm = document.getElementById("add-page-form");
  if (addForm) {
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const key = document.getElementById("new-page-key").value.trim();
      const title = document.getElementById("new-page-title").value.trim();
      const content = document.getElementById("new-page-content").value.trim();
      if (!key || !title) {
        alert("Lengkapi semua field!");
        return;
      }
      if (pages[key]) {
        alert("Halaman dengan ID ini sudah ada!");
        return;
      }
      pages[key] = { title, content };
      savePages(pages);
      populatePageSelect();
      renderNavbar();
      alert("Halaman baru ditambahkan: " + title);

      addForm.reset();
    });
  }
}

// ===== TRACK KUNJUNGAN =====
function trackVisit(page) {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || { visits: 0, pages: {} };
  stats.visits++;
  stats.pages[page] = stats.pages[page] ? stats.pages[page] + 1 : 1;
  localStorage.setItem("siteStats", JSON.stringify(stats));
}

// ===== RENDER STATISTIK =====
function renderStats() {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || { visits: 0, pages: {} };
  if (document.getElementById("total-visits")) {
    document.getElementById("total-visits").textContent = stats.visits;
  }
  const list = document.getElementById("page-stats");
  if (list) {
    list.innerHTML = "";
    for (let p in stats.pages) {
      const li = document.createElement("li");
      li.textContent = `${p}: ${stats.pages[p]}`;
      list.appendChild(li);
    }
  }
  if (document.getElementById("visitsChart")) {
    const labels = Object.keys(stats.pages);
    const data = Object.values(stats.pages);
    if (labels.length > 0) {
      const ctx = document.getElementById("visitsChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            label: "Kunjungan per Halaman",
            data: data,
            backgroundColor: ["#1a73e8", "#ff7043", "#66bb6a", "#fbc02d", "#8e24aa"],
            borderColor: "#fff",
            borderWidth: 2
          }]
        },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
      });
    }
  }
}
