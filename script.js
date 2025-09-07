// -------------------
// Profil
// -------------------
function loadProfile() {
  return JSON.parse(localStorage.getItem("profile")) || {
    name: "Andi Panguriseng",
    email: "andi@example.com",
    bio: "Halo, saya Andi. Ini adalah halaman profil default saya.",
    photo: ""
  };
}

function saveProfile(profile) {
  localStorage.setItem("profile", JSON.stringify(profile));
}

// Tampilkan form admin profile
function initProfileForm() {
  const form = document.getElementById("profile-form");
  if (!form) return;

  const nameInput = document.getElementById("profile-name");
  const emailInput = document.getElementById("profile-email");
  const bioInput = document.getElementById("profile-bio");
  const picInput = document.getElementById("profile-pic");
  const previewImg = document.getElementById("preview-img");

  // Load data lama
  const profile = loadProfile();
  if (profile.name) nameInput.value = profile.name;
  if (profile.email) emailInput.value = profile.email;
  if (profile.bio) bioInput.value = profile.bio;
  if (profile.photo) {
    previewImg.src = profile.photo;
    previewImg.style.display = "block";
  }

  // Preview foto
  picInput.addEventListener("change", () => {
    if (picInput.files && picInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
      };
      reader.readAsDataURL(picInput.files[0]);
    }
  });

  // Simpan data
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newProfile = {
      name: nameInput.value,
      email: emailInput.value,
      bio: bioInput.value,
      photo: previewImg.src || ""
    };
    saveProfile(newProfile);
    alert("Profil berhasil disimpan!");
  });
}

// Render profil di About
function renderProfile() {
  const profile = loadProfile();
  if (document.getElementById("about-photo") && profile.photo) {
    const photo = document.getElementById("about-photo");
    photo.src = profile.photo;
    photo.style.display = "block";
  }
  if (document.getElementById("about-extra")) {
    document.getElementById("about-extra").innerHTML = `
      <b>${profile.name}</b><br>
      <i>${profile.email}</i><br>
      <p>${profile.bio}</p>
    `;
  }
}

// Jalankan otomatis jika ada elemen terkait
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("profile-form")) initProfileForm();
  if (document.getElementById("about-extra")) renderProfile();
});
