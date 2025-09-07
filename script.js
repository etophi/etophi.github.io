// -------------------
// Helper: Pages Data
// -------------------
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

// -------------------
// Login Admin
// -------------------
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

// -------------------
// Statistik Kunjungan
// -------------------
function trackVisit(pageName) {
  let stats = JSON.parse(localStorage.getItem("siteStats")) || { total: 0, pages: {} };
  stats.total++;
  stats.pages[pageName] = (stats.pages[pageName] || 0) + 1;
  localStorage.setItem("siteStats", JSON.stringify(stats));
}

function renderStats() {
  const stats = JSON.parse(localStorage.getItem("siteStats")) || { total: 0, pages: {} };
  if (document.getElementById("total-visits")) {
    document.getElementById("total-visits").textContent = stats.total;
  }
  if (document.getElementById("page-stats")) {
    const ul = document.getElementById("page-stats");
    ul.innerHTML = "";
    for (let p in stats.pages) {
      const li = document.createElement("li");
      li.textContent = `${p}: ${stats.pages[p]} kunjungan`;
      ul.appendChild(li);
    }
  }
  if (document.getElementById("visitsChart") && typeof Chart !== "undefined") {
    const ctx = document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(stats.pages),
        datasets: [{
          data: Object.values(stats.pages),
          backgroundColor: ["#1a73e8", "#e91e63", "#ff9800", "#4caf50", "#9c27b0", "#607d8b"]
        }]
      }
    });
  }
}

// -------------------
// Navbar Responsive
// -------------------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }
});

// === DATA PROFIL ===
function loadProfile(){
  return JSON.parse(localStorage.getItem("profile")) || {
    name: "Andi Panguriseng",
    email: "andi@example.com",
    bio: "Halo, saya Andi. Ini adalah halaman profil default saya."
  };
}

function saveProfile(profile){
  localStorage.setItem("profile", JSON.stringify(profile));
}

// ===== PROFIL =====
function loadProfileForm(){
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  if(savedProfile.photo){
    const img = document.getElementById("preview-img");
    img.src = savedProfile.photo;
    img.style.display = "block";
  }
  if(savedProfile.name) document.getElementById("profile-name").value = savedProfile.name;
  if(savedProfile.email) document.getElementById("profile-email").value = savedProfile.email;
  if(savedProfile.bio) document.getElementById("profile-bio").value = savedProfile.bio;

  const photoInput = document.getElementById("profile-photo");
  photoInput.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = function(e){
        document.getElementById("preview-img").src = e.target.result;
        document.getElementById("preview-img").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  const form = document.getElementById("profile-form");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    const profile = {
      photo: document.getElementById("preview-img").src,
      name: document.getElementById("profile-name").value,
      email: document.getElementById("profile-email").value,
      bio: document.getElementById("profile-bio").value
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profil berhasil disimpan!");
  });
}

function renderProfile(){
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  if(savedProfile.photo){
    const photo = document.getElementById("about-photo");
    photo.src = savedProfile.photo;
    photo.style.display = "block";
  }
  if(savedProfile.name || savedProfile.email || savedProfile.bio){
    document.getElementById("about-extra").innerHTML =
      `<b>${savedProfile.name || ""}</b><br>
       <i>${savedProfile.email || ""}</i><br>
       <p>${savedProfile.bio || ""}</p>`;
  }
}
