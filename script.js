// ===== DATA HALAMAN =====
const defaultPages = {
  home: { title: "Halo, ini website saya!", content: "Selamat datang di portofolio saya." },
  about: { title: "Tentang Saya", content: "Halo! Nama saya Andi, sedang belajar membuat website." },
  projects: { title: "Proyek", content: "Proyek 1: Website\nProyek 2: Kalkulator\nProyek 3: Blog" },
  contact: { title: "Kontak", content: "Email: andi@example.com\nInstagram: @andi" }
};

function loadPages() {
  const saved = localStorage.getItem("pages");
  return saved ? JSON.parse(saved) : defaultPages;
}
function savePages(pages) {
  localStorage.setItem("pages", JSON.stringify(pages));
}

// ===== RENDER HALAMAN PUBLIK =====
function renderPage(pageKey, titleId, contentId) {
  const pages = loadPages();
  if (document.getElementById(titleId))
    document.getElementById(titleId).textContent = pages[pageKey].title;
  if (document.getElementById(contentId))
    document.getElementById(contentId).innerHTML = pages[pageKey].content.replace(/\n/g, "<br>");
}
renderPage("home", "site-title", "site-content");
renderPage("about", "about-title", "about-content");
renderPage("projects", "projects-title", "projects-content");
renderPage("contact", "contact-title", "contact-content");

// ===== LOGIN =====
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    const defaultUser = "admin",
      defaultPass = "1234";
    if (user === defaultUser && pass === defaultPass) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user);
      window.location.href = "admin.html";
    } else {
      document.getElementById("login-message").textContent =
        "Username atau password salah!";
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
    if (logoutBtn)
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.href = "login.html";
      });
  }
}

// ===== ADMIN FORM EDIT HALAMAN =====
const adminForm = document.getElementById("admin-form");
const pageSelect = document.getElementById("page-select");
if (adminForm && pageSelect) {
  let pages = loadPages();

  function loadPageToForm(key) {
    document.getElementById("title-input").value = pages[key].title;
    document.getElementById("content-input").value = pages[key].content;
  }

  pageSelect.addEventListener("change", () => {
    const p = pageSelect.value;
    loadPageToForm(p);
  });

  // langsung isi default saat load admin.html
  if (pageSelect.value) {
    loadPageToForm(pageSelect.value);
  }

  adminForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const p = pageSelect.value;
    pages[p].title = document.getElementById("title-input").value;
    pages[p].content = document.getElementById("content-input").value;
    savePages(pages);
    alert("✅ Perubahan tersimpan: " + p);
    renderNavbar();
  });
}

// ===== NAVBAR DINAMIS =====
function renderNavbar() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const pages = loadPages();
  let links = `
    <a href="index.html"${location.pathname.includes("index.html") ? " class='active'" : ""}>Beranda</a>
    <a href="about.html"${location.pathname.includes("about.html") ? " class='active'" : ""}>Tentang</a>
    <a href="projects.html"${location.pathname.includes("projects.html") ? " class='active'" : ""}>Proyek</a>
    <a href="contact.html"${location.pathname.includes("contact.html") ? " class='active'" : ""}>Kontak</a>
    <a href="download.html"${location.pathname.includes("download.html") ? " class='active'" : ""}>Download</a>
    <a href="webgis.html"${location.pathname.includes("webgis.html") ? " class='active'" : ""}>WebGIS</a>
    <a href="music.html"${location.pathname.includes("music.html") ? " class='active'" : ""}>Musik</a>
    <a href="login.html" style="margin-left:auto;font-size:12px;">Admin</a>
  `;
  nav.innerHTML = links;
}
renderNavbar();

// ===== TRACK KUNJUNGAN =====
function trackVisit(page) {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || {
    visits: 0,
    pages: {}
  };
  stats.visits++;
  stats.pages[page] = stats.pages[page] ? stats.pages[page] + 1 : 1;
  localStorage.setItem("siteStats", JSON.stringify(stats));
}

// ===== RENDER STATISTIK =====
function renderStats() {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || {
    visits: 0,
    pages: {}
  };
  document.getElementById("total-visits").textContent = stats.visits;
  const list = document.getElementById("page-stats");
  if (list) {
    list.innerHTML = "";
    for (let p in stats.pages) {
      const li = document.createElement("li");
      li.textContent = `${p}: ${stats.pages[p]}`;
      list.appendChild(li);
    }
  }
  const labels = Object.keys(stats.pages);
  const data = Object.values(stats.pages);
  if (labels.length > 0 && document.getElementById("visitsChart")) {
    const ctx = document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Kunjungan per Halaman",
            data: data,
            backgroundColor: [
              "#1a73e8",
              "#ff7043",
              "#66bb6a",
              "#fbc02d",
              "#8e24aa"
            ],
            borderColor: "#fff",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }
}

// ===== UPLOAD / DOWNLOAD FILE =====
const uploadForm = document.getElementById("upload-form");
if (uploadForm) {
  const uploadedFiles =
    JSON.parse(localStorage.getItem("uploadedFiles")) || [];
  const uploadedList = document.getElementById("uploaded-list");
  function renderUploaded() {
    uploadedList.innerHTML = "";
    uploadedFiles.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f.name;
      uploadedList.appendChild(li);
    });
  }
  renderUploaded();
  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const fileInput = document.getElementById("upload-input");
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function (evt) {
        uploadedFiles.push({ name: file.name, data: evt.target.result });
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
        renderUploaded();
        fileInput.value = "";
      };
      reader.readAsDataURL(file);
    }
  });
}
