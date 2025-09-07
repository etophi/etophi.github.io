/* ===== DATA HALAMAN DEFAULT ===== */
const defaultPages = {
  home: { title: "Halo, ini website saya!", content: "Selamat datang di portofolio saya." },
  about: { title: "Tentang Saya", content: "Halo! Nama saya Andi, sedang belajar membuat website." },
  projects: { title: "Proyek", content: "Proyek 1: Website\nProyek 2: Kalkulator\nProyek 3: Blog" },
  contact: { title: "Kontak", content: "Email: andi@example.com\nInstagram: @andi" },
  download: { title: "Download", content: "File tersedia" },
  webgis: { title: "WebGIS", content: "Peta interaktif proyek" }
};

/* ===== SIMPAN & AMBIL PAGES ===== */
function loadPages() {
  const saved = localStorage.getItem("pages");
  return saved ? JSON.parse(saved) : defaultPages;
}
function savePages(pages) {
  localStorage.setItem("pages", JSON.stringify(pages));
}

/* ===== SIMPAN & AMBIL MENUS ===== */
function loadMenus() {
  const saved = localStorage.getItem("menus");
  return saved ? JSON.parse(saved) : ["home", "about", "projects", "contact", "download", "webgis"];
}
function saveMenus(menus) {
  localStorage.setItem("menus", JSON.stringify(menus));
}

/* ===== RENDER NAVBAR DINAMIS ===== */
function renderNavbar() {
  const menus = loadMenus();
  const pages = loadPages();
  const navs = document.querySelectorAll("nav");
  navs.forEach(nav => {
    nav.innerHTML = ""; // kosongkan dulu
    menus.forEach(m => {
      const a = document.createElement("a");
      a.href = m + ".html";
      a.textContent = pages[m]?.title || m;
      if (window.location.pathname.includes(m + ".html")) a.classList.add("active");
      nav.appendChild(a);
    });
    // tombol admin di kanan
    const adminLink = document.createElement("a");
    adminLink.href = "login.html";
    adminLink.textContent = "Admin";
    adminLink.style.marginLeft = "auto";
    adminLink.style.fontSize = "12px";
    nav.appendChild(adminLink);
  });
}
renderNavbar();

/* ===== RENDER HALAMAN PUBLIK ===== */
function renderPage(pageKey, titleId, contentId) {
  const pages = loadPages();
  if (document.getElementById(titleId)) document.getElementById(titleId).textContent = pages[pageKey].title;
  if (document.getElementById(contentId)) document.getElementById(contentId).innerHTML = pages[pageKey].content.replace(/\n/g, "<br>");
}

/* ===== LOGIN ===== */
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("login-username").value.trim();
    const pass = document.getElementById("login-password").value.trim();
    if (user === "admin" && pass === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user);
      window.location.href = "admin.html";
    } else {
      document.getElementById("login-message").textContent = "⚠️ Username atau password salah!";
    }
  });
}

/* ===== CEK LOGIN DI HALAMAN ADMIN ===== */
if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("admin-stats.html")) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  } else {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.href = "login.html";
      });
    }
  }
}

/* ===== ADMIN FORM ===== */
const adminForm = document.getElementById("admin-form");
const pageSelect = document.getElementById("page-select");
if (adminForm && pageSelect) {
  let pages = loadPages();
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
}

/* ===== TAMBAH MENU BARU ===== */
const addMenuForm = document.getElementById("add-menu-form");
if (addMenuForm) {
  addMenuForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const key = document.getElementById("new-menu-key").value.trim().toLowerCase();
    const title = document.getElementById("new-menu-title").value.trim();
    const content = document.getElementById("new-menu-content").value.trim();

    if (!key || !title) {
      alert("Nama menu dan judul wajib diisi!");
      return;
    }
    let pages = loadPages();
    let menus = loadMenus();

    if (pages[key]) {
      alert("Menu dengan nama ini sudah ada!");
      return;
    }

    // simpan ke localStorage
    pages[key] = { title: title, content: content };
    menus.push(key);
    savePages(pages);
    saveMenus(menus);

    alert("Menu baru berhasil ditambahkan!");
    renderNavbar();

    // reset form
    addMenuForm.reset();
  });
}

/* ===== TRACK VISIT ===== */
function trackVisit(page) {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || { visits: 0, pages: {} };
  stats.visits++;
  stats.pages[page] = stats.pages[page] ? stats.pages[page] + 1 : 1;
  localStorage.setItem("siteStats", JSON.stringify(stats));
}

/* ===== RENDER STATISTIK ===== */
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
    const ctx = document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(stats.pages),
        datasets: [{
          data: Object.values(stats.pages),
          backgroundColor: ["#1a73e8", "#ff7043", "#66bb6a", "#fbc02d", "#8e24aa"],
          borderColor: "#fff",
          borderWidth: 2
        }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }
}
