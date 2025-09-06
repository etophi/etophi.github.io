// ===== EtoMusic Player =====
function initMusicPlayer() {
  const songs = [
    { title:"Lagu 1", id:"VIDEO_ID_1" },
    { title:"Lagu 2", id:"VIDEO_ID_2" },
    { title:"Lagu 3", id:"VIDEO_ID_3" },
    { title:"Lagu 4", id:"VIDEO_ID_4" },
    { title:"Lagu 5", id:"VIDEO_ID_5" }
  ];

  let player, currentIndex = 0;
  const songListEl = document.getElementById("song-list");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const themeToggle = document.getElementById("theme-toggle");

  // Render playlist
  songs.forEach((s,i)=>{
    const li = document.createElement("li");
    li.textContent = s.title;
    li.addEventListener("click", ()=> { loadSong(i); });
    songListEl.appendChild(li);
  });

  // Load YouTube IFrame API
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height:'390', width:'640', videoId:songs[currentIndex].id,
      events: { 'onStateChange': onPlayerStateChange }
    });
    updateActiveSong();
  };

  // Functions
  function loadSong(index){
    currentIndex = index;
    player.loadVideoById(songs[currentIndex].id);
    updateActiveSong();
  }

  function playPause(){
    if(player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo(); 
      playBtn.textContent="▶️ Play";
    } else {
      player.playVideo(); 
      playBtn.textContent="⏸️ Pause";
    }
  }

  function nextSong(){
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
  }

  function prevSong(){
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
  }

  function updateActiveSong(){
    Array.from(songListEl.children).forEach((li,i)=>{
      li.classList.toggle("active", i===currentIndex);
    });
    const activeLi = songListEl.children[currentIndex];
    if(activeLi) activeLi.scrollIntoView({behavior:"smooth", block:"nearest"});
  }

  function onPlayerStateChange(event){
    if(event.data === YT.PlayerState.ENDED){
      nextSong();
      player.playVideo();
    }
  }

  // Event listeners
  playBtn.addEventListener("click", playPause);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  themeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-theme");
  });
}

// Initialize
initMusicPlayer();
