// =======================
// Helper: Pages Data
// =======================
function loadPages() {
  return JSON.parse(localStorage.getItem("pages")) || {
    index: { title: "Beranda", content: "Selamat datang di website saya!" },
    about: { title: "Tentang", content: "Informasi tentang saya." },
    projects: { title: "Proyek", content: "Daftar proyek saya." },
    contact: { title: "Kontak", content: "Hubungi saya di sini." },
    download: { title: "Download", content: "File yang bisa diunduh." },
    webgis: { title: "WebGIS", content: "Peta interaktif proyek." }
  };
}

function savePages(pages) {
  localStorage.setItem("pages", JSON.stringify(pages));
}

// =======================
// Login Admin
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const msg = document.getElementById("login-message");

      // default: admin / 1234
      if (username === "admin" && password === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        window.location.href = "admin.html";
      } else {
        msg.textContent = "Username atau password salah!";
      }
    });
  }
});

// =======================
// CEK LOGIN ADMIN
// =======================
if(window.location.pathname.includes("admin.html") || window.location.pathname.includes("admin-add.html") || window.location.pathname.includes("admin-profile.html")) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if(isLoggedIn !== "true"){
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  }

  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn){
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
  }
}

// =======================
// Edit / Tambah Halaman
// =======================
const adminForm = document.getElementById("admin-form");
const pageSelect = document.getElementById("page-select");
if(adminForm && pageSelect){
  let pages = loadPages();

  function loadPage(key){
    titleInput.value = pages[key].title;
    contentInput.value = pages[key].content;
  }

  const titleInput = document.getElementById("title-input");
  const contentInput = document.getElementById("content-input");

  // populate select
  pageSelect.innerHTML = "";
  for(const key in pages){
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    pageSelect.appendChild(opt);
  }

  pageSelect.addEventListener("change", () => {
    loadPage(pageSelect.value);
  });

  loadPage(pageSelect.value);

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const key = pageSelect.value;
    pages[key] = { title: titleInput.value, content: contentInput.value };
    savePages(pages);
    alert("Perubahan tersimpan!");
  });
}

// =======================
// Statistik Kunjungan
// =======================
function trackVisit(pageName){
  let stats = JSON.parse(localStorage.getItem("siteStats")) || { total:0, pages:{} };
  stats.total++;
  stats.pages[pageName] = (stats.pages[pageName] || 0) + 1;
  localStorage.setItem("siteStats", JSON.stringify(stats));
}

function renderStats(){
  const stats = JSON.parse(localStorage.getItem("siteStats")) || { total:0, pages:{} };
  if(document.getElementById("total-visits"))
    document.getElementById("total-visits").textContent = stats.total;

  if(document.getElementById("page-stats")){
    const ul = document.getElementById("page-stats");
    ul.innerHTML = "";
    for(let p in stats.pages){
      const li = document.createElement("li");
      li.textContent = `${p}: ${stats.pages[p]} kunjungan`;
      ul.appendChild(li);
    }
  }

  if(document.getElementById("visitsChart") && typeof Chart !== "undefined"){
    const ctx = document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx, {
      type:"pie",
      data:{
        labels: Object.keys(stats.pages),
        datasets:[{
          data: Object.values(stats.pages),
          backgroundColor: ["#1a73e8","#e91e63","#ff9800","#4caf50","#9c27b0","#607d8b"]
        }]
      }
    });
  }
}

// =======================
// Profil Admin
// =======================
function loadProfile(){
  return JSON.parse(localStorage.getItem("profile")) || {
    name:"Andi Panguriseng",
    email:"andi@example.com",
    bio:"Halo, saya Andi. Ini halaman profil default saya.",
    photo:""
  };
}

function saveProfile(profile){
  localStorage.setItem("profile", JSON.stringify(profile));
}

function loadProfileForm(){
  const profile = loadProfile();

  if(document.getElementById("profile-name")) document.getElementById("profile-name").value = profile.name;
  if(document.getElementById("profile-email")) document.getElementById("profile-email").value = profile.email;
  if(document.getElementById("profile-bio")) document.getElementById("profile-bio").valu
