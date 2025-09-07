/* =======================
   DATA HALAMAN
======================= */
const defaultPages = {
  home: { title:"Halo, ini website saya!", content:"Selamat datang di portofolio saya." },
  about: { title:"Tentang Saya", content:"Halo! Nama saya Andi, sedang belajar membuat website." },
  projects: { title:"Proyek", content:"Proyek 1: Website\nProyek 2: Kalkulator\nProyek 3: Blog" },
  contact: { title:"Kontak", content:"Email: andi@example.com\nInstagram: @andi" },
  download: { title:"Download", content:"File tersedia di sini." },
  webgis: { title:"WebGIS", content:"Peta interaktif proyek saya." }
};

function loadPages() {
  const saved = localStorage.getItem("pages");
  return saved ? JSON.parse(saved) : defaultPages;
}
function savePages(pages){
  localStorage.setItem("pages", JSON.stringify(pages));
}

/* =======================
   RENDER HALAMAN PUBLIK
======================= */
function renderPage(pageKey, titleId, contentId){
  const pages = loadPages();
  if(pages[pageKey]){
    if(document.getElementById(titleId))
      document.getElementById(titleId).textContent = pages[pageKey].title;
    if(document.getElementById(contentId))
      document.getElementById(contentId).innerHTML = pages[pageKey].content.replace(/\n/g,"<br>");
  }
}
// Render default
renderPage("home","site-title","site-content");
renderPage("about","about-title","about-content");
renderPage("projects","projects-title","projects-content");
renderPage("contact","contact-title","contact-content");

/* =======================
   LOGIN / LOGOUT ADMIN
======================= */
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
    } else {
      document.getElementById("login-message").textContent="Username atau password salah!";
    }
  });
}

// Cek login di admin
if(window.location.pathname.includes("admin.html") || window.location.pathname.includes("admin-stats.html")){
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if(isLoggedIn!=="true"){
    alert("Silakan login!");
    window.location.href="login.html";
  } else {
    const logoutBtn = document.getElementById("logout-btn");
    if(logoutBtn){
      logoutBtn.addEventListener("click",()=>{
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.href="login.html";
      });
    }
  }
}

/* =======================
   ADMIN FORM EDIT HALAMAN
======================= */
const adminForm=document.getElementById("admin-form");
const pageSelect=document.getElementById("page-select");
if(adminForm && pageSelect){
  let pages = loadPages();

  function loadPageAdmin(p){
    document.getElementById("title-input").value=pages[p].title;
    document.getElementById("content-input").value=pages[p].content;
  }

  // isi awal
  loadPageAdmin(pageSelect.value);

  pageSelect.addEventListener("change",()=>{ loadPageAdmin(pageSelect.value); });

  // Simpan perubahan
  adminForm.addEventListener("submit",function(e){
    e.preventDefault();
    const p=pageSelect.value;
    pages[p].title=document.getElementById("title-input").value;
    pages[p].content=document.getElementById("content-input").value;
    savePages(pages);
    alert("Perubahan tersimpan untuk: "+p);
  });
}

/* =======================
   ADMIN TAMBAH HALAMAN BARU
======================= */
const newPageForm = document.getElementById("new-page-form");
if(newPageForm){
  newPageForm.addEventListener("submit",function(e){
    e.preventDefault();
    const key=document.getElementById("new-page-key").value.trim().toLowerCase();
    const title=document.getElementById("new-page-title").value.trim();
    const content=document.getElementById("new-page-content").value.trim();

    if(!key || !title){ alert("Isi nama & judul halaman!"); return; }

    let pages=loadPages();
    if(pages[key]){ alert("Halaman dengan nama ini sudah ada!"); return; }

    pages[key]={title:title,content:content};
    savePages(pages);

    alert("Halaman baru ditambahkan: "+title);
    window.location.reload();
  });
}

/* =======================
   RENDER NAVBAR DINAMIS
======================= */
function renderNavbar(){
  const navs = document.querySelectorAll("nav");
  const pages = loadPages();
  const menus = [
    {key:"home", label:"Beranda", link:"index.html"},
    {key:"about", label:"Tentang", link:"about.html"},
    {key:"projects", label:"Proyek", link:"projects.html"},
    {key:"contact", label:"Kontak", link:"contact.html"},
    {key:"download", label:"Download", link:"download.html"},
    {key:"webgis", label:"WebGIS", link:"webgis.html"}
  ];

  // tambahkan halaman baru
  for(let k in pages){
    if(!menus.find(m=>m.key===k)){
      menus.push({key:k, label:pages[k].title, link:`page.html?page=${k}`});
    }
  }

  navs.forEach(nav=>{
    nav.innerHTML = "";
    menus.forEach(m=>{
      const a = document.createElement("a");
      a.href = m.link;
      a.textContent = m.label;
      if(window.location.href.includes(m.link)) a.classList.add("active");
      nav.appendChild(a);
    });

    // tombol admin
    const adminLink = document.createElement("a");
    adminLink.href="login.html";
    adminLink.textContent="Admin";
    adminLink.style.marginLeft="auto";
    adminLink.style.fontSize="12px";
    nav.appendChild(adminLink);
  });
}
renderNavbar();

/* =======================
   TRACK KUNJUNGAN
======================= */
function trackVisit(page){
  const stats=JSON.parse(localStorage.getItem("siteStats"))||{visits:0,pages:{}};
  stats.visits++;
  stats.pages[page]=stats.pages[page]?stats.pages[page]+1:1;
  localStorage.setItem("siteStats",JSON.stringify(stats));
}

/* =======================
   RENDER STATISTIK
======================= */
function renderStats(){
  const stats = JSON.parse(localStorage.getItem("siteStats"))||{visits:0,pages:{}};
  if(document.getElementById("total-visits"))
    document.getElementById("total-visits").textContent=stats.visits;

  const list=document.getElementById("page-stats");
  if(list){
    list.innerHTML="";
    for(let p in stats.pages){
      const li=document.createElement("li");
      li.textContent=`${p}: ${stats.pages[p]}`;
      list.appendChild(li);
    }
  }

  const labels=Object.keys(stats.pages);
  const data=Object.values(stats.pages);
  if(labels.length>0 && document.getElementById("visitsChart")){
    const ctx=document.getElementById("visitsChart").getContext("2d");
    new Chart(ctx,{
      type:"pie",
      data:{
        labels:labels,
        datasets:[{label:"Kunjungan per Halaman",data:data,
          backgroundColor:["#1a73e8","#ff7043","#66bb6a","#fbc02d","#8e24aa","#29b6f6"],
          borderColor:"#fff",borderWidth:2}]
      },
      options:{responsive:true,plugins:{legend:{position:"bottom"}}}
    });
  }
}

/* =======================
   UPLOAD / DOWNLOAD FILE
======================= */
const uploadForm=document.getElementById("upload-form");
if(uploadForm){
  const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"))||[];
  const uploadedList = document.getElementById("uploaded-list");

  function renderUploaded(){
    uploadedList.innerHTML="";
    uploadedFiles.forEach(f=>{
      const li=document.createElement("li");
      const a=document.createElement("a");
      a.href=f.data;
      a.download=f.name;
      a.textContent=f.name;
      li.appendChild(a);
      uploadedList.appendChild(li);
    });
  }
  renderUploaded();

  uploadForm.addEventListener("submit",function(e){
    e.preventDefault();
    const fileInput=document.getElementById("upload-input");
    if(fileInput.files.length>0){
      const file=fileInput.files[0];
      const reader=new FileReader();
      reader.onload=function(evt){
        uploadedFiles.push({name:file.name,data:evt.target.result});
        localStorage.setItem("uploadedFiles",JSON.stringify(uploadedFiles));
        renderUploaded();
        fileInput.value="";
      }
      reader.readAs
