// ===== DATA DEFAULT =====
const defaultPages = {
  home: { title:"Halo, ini website saya!", content:"Selamat datang di portofolio saya." },
  about: { title:"Tentang Saya", content:"Halo! Nama saya Andi, sedang belajar membuat website." },
  projects: { title:"Proyek", content:"Proyek 1: Website\nProyek 2: Kalkulator\nProyek 3: Blog" },
  contact: { title:"Kontak", content:"Email: andi@example.com\nInstagram: @andi" },
  download: { title:"Download", content:"File tersedia" },
  webgis: { title:"WebGIS", content:"Peta interaktif proyek" }
};
function loadPages(){
  const saved = localStorage.getItem("pages");
  return saved ? JSON.parse(saved) : defaultPages;
}
function savePages(pages){ localStorage.setItem("pages", JSON.stringify(pages)); }

// ===== RENDER NAVBAR DINAMIS =====
function renderNavbar(){
  const nav = document.getElementById("main-nav");
  if(!nav) return;
  nav.innerHTML = "";

  const pages = loadPages();
  const order = ["home","about","projects","contact","download","webgis"];
  const links = [];

  order.forEach(k=>{ if(pages[k]) links.push({key:k,label:pages[k].title}); });
  for(let k in pages){ if(!order.includes(k)) links.push({key:k,label:pages[k].title}); }

  links.forEach(l=>{
    const a=document.createElement("a");
    if(l.key==="home") a.href="index.html";
    else if(l.key==="about") a.href="about.html";
    else if(l.key==="projects") a.href="projects.html";
    else if(l.key==="contact") a.href="contact.html";
    else if(l.key==="download") a.href="download.html";
    else if(l.key==="webgis") a.href="webgis.html";
    else a.href=`page.html?key=${l.key}`;
    a.textContent=l.label;
    nav.appendChild(a);
  });

  const admin=document.createElement("a");
  admin.href="login.html"; admin.textContent="Admin";
  admin.style.marginLeft="auto"; admin.style.fontSize="12px";
  nav.appendChild(admin);
}
renderNavbar();

// ===== RENDER HALAMAN STATIS =====
function renderPage(pageKey, titleId, contentId){
  const pages = loadPages();
  if(!pages[pageKey]) return;
  if(document.getElementById(titleId)) document.getElementById(titleId).textContent = pages[pageKey].title;
  if(document.getElementById(contentId)) document.getElementById(contentId).innerHTML = pages[pageKey].content.replace(/\n/g,"<br>");
}
renderPage("home","site-title","site-content");
renderPage("about","about-title","about-content");
renderPage("projects","projects-title","projects-content");
renderPage("contact","contact-title","contact-content");

// ===== RENDER HALAMAN DINAMIS (page.html) =====
function renderDynamicPage(){
  const params=new URLSearchParams(window.location.search);
  const key=params.get("key");
  if(!key) return;
  const pages=loadPages();
  if(pages[key]){
    document.title=pages[key].title+" - Portofolio Andi";
    const t=document.getElementById("page-title");
    const c=document.getElementById("page-content");
    if(t) t.textContent=pages[key].title;
    if(c) c.innerHTML=pages[key].content.replace(/\n/g,"<br>");
  } else {
    const c=document.getElementById("page-content");
    if(c) c.innerHTML="<p>Halaman tidak ditemukan.</p>";
  }
}
renderDynamicPage();

// ===== LOGIN =====
const loginForm = document.getElementById("login-form");
if(loginForm){
  loginForm.addEventListener("submit",function(e){
    e.preventDefault();
    const user=document.getElementById("login-username").value;
    const pass=document.getElementById("login-password").value;
    const defaultUser="admin", defaultPass="1234";
    if(user===defaultUser && pass===defaultPass){
      localStorage.setItem("isLoggedIn","true");
      localStorage.setItem("username",user);
      window.location.href="admin.html";
    } else { document.getElementById("login-message").textContent="Username atau password salah!"; }
  });
}

// ===== CEK LOGIN UNTUK ADMIN =====
if(window.location.pathname.includes("admin.html") || window.location.pathname.includes("admin-stats.html")){
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if(isLoggedIn!=="true"){ alert("Silakan login!"); window.location.href="login.html"; }
  else {
    const logoutBtn = document.getElementById("logout-btn");
    if(logoutBtn) logoutBtn.addEventListener("click",()=>{ localStorage.removeItem("isLoggedIn"); localStorage.removeItem("username"); window.location.href="login.html"; });
  }
}

// ===== ADMIN: EDIT HALAMAN & TAMBAH BARU =====
const adminForm=document.getElementById("admin-form");
const pageSelect=document.getElementById("page-select");
if(adminForm && pageSelect){
  let pages=loadPages();
  function refreshSelect(){
    pageSelect.innerHTML="";
    for(let k in pages){
      const opt=document.createElement("option");
      opt.value=k; opt.textContent=k;
      pageSelect.appendChild(opt);
    }
    pageSelect.dispatchEvent(new Event("change"));
  }
  refreshSelect();

  pageSelect.addEventListener("change",()=>{
    const p=pageSelect.value;
    document.getElementById("title-input").value=pages[p].title;
    document.getElementById("content-input").value=pages[p].content;
  });

  adminForm.addEventListener("submit",function(e){
    e.preventDefault();
    const p=pageSelect.value;
    pages[p].title=document.getElementById("title-input").value;
    pages[p].content=document.getElementById("content-input").value;
    savePages(pages);
    alert("Perubahan tersimpan: "+p);
    renderNavbar();
  });

  // Tambah halaman baru
  const newPageForm=document.getElementById("new-page-form");
  if(newPageForm){
    newPageForm.addEventListener("submit",function(e){
      e.preventDefault();
      const key=document.getElementById("new-key").value.trim();
      const title=document.getElementById("new-title").value.trim();
      const content=document.getElementById("new-content").value.trim();
      if(pages[key]){ alert("Key sudah ada!"); return; }
      pages[key]={title,content};
      savePages(pages);
      alert("Halaman baru ditambahkan: "+key);
      refreshSelect();
      renderNavbar();
      newPageForm.reset();
    });
  }
}

// ===== TRACK KUNJUNGAN =====
function trackVisit(page){ 
  const stats=JSON.parse(localStorage.getItem("siteStats"))||{visits:0,pages:{}};
  stats.visits++; stats.pages[page]=stats.pages[page]?stats.pages[page]+1:1;
  localStorage.setItem("siteStats",JSON.stringify(stats));
}

// ===== RENDER STATISTIK =====
function renderStats(){
  const stats = JSON.parse(localStorage.getItem("siteStats"))||{visits:0,pages:{}};
  if(document.getElementById("total-visits")) document.getElementById("total-visits").textContent=stats.visits;
  const list=document.getElementById("page-stats"); 
  if(list){ 
    list.innerHTML=""; 
    for(let p in stats.pages){ 
      const li=document.createElement("li"); 
      li.textContent=`${p}: ${stats.pages[p]}`; 
      list.appendChild(li); 
    } 
  }
  const labels=Object.keys(stats.pages); const data=Object.values(stats.pages);
  if(labels.length>0 && document.getElementById("visitsChart")){
    const ctx=document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx,{type:"pie",data:{labels:labels,datasets:[{label:"Kunjungan per Halaman",data:data,backgroundColor:["#1a73e8","#ff7043","#66bb6a","#fbc02d","#8e24aa"],borderColor:"#fff",borderWidth:2}]},options:{responsive:true,plugins:{legend:{position:"bottom"}}}});
  }
}

// ===== UPLOAD / DOWNLOAD FILE =====
const fileList=document.getElementById("file-list");
if(fileList){
  function renderFiles(){
    fileList.innerHTML="";
    const files = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    files.forEach(f=>{
      const li=document.createElement("li");
      const a=document.createElement("a");
      a.href=f.data; a.download=f.name; a.textContent=f.name;
      li.appendChild(a); fileList.appendChild(li);
    });
  }
  renderFiles();
}
