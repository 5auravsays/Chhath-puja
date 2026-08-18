/* =========================================================================
   जय छठी मैया — Chhath Puja Festival Website
   script.js
   ========================================================================= */

/* ===========================================================================
   ⚙️  CONFIG — EDIT ONLY THIS SECTION TO CUSTOMISE YOUR WEBSITE
   =========================================================================== */
const CONFIG = {

  // 1️⃣ WEBSITE TITLE (shown in the browser tab)
  websiteTitle: "जय छठी मैया 🙏 | छठ पूजा 2026",

  // 2️⃣ 🖼️ BACKGROUND IMAGE — paste your Chhath Puja photo URL here.
  //    Example: "https://your-image-host.com/chhath-ghat.jpg"
  //    Leave as "" to keep the default gradient background.
  backgroundImageURL: "",

  // 3️⃣ 🎵 SPOTIFY PLAYLIST — paste your playlist / track / album link here.
  //    Any normal Spotify link works, for example:
  //    "https://open.spotify.com/playlist/37i9dQZF1DXxxxxxxxx"
  //    It is automatically converted into an embeddable player below —
  //    you do NOT need to change it to an "embed" link yourself.
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM",

  // 4️⃣ ⏳ COUNTDOWN TARGET — main Chhath Puja day (Sandhya Arghya, 15 Nov 2026).
  //    Format: "YYYY-MM-DDTHH:MM:SS" (24-hour clock, local time).
  countdownTargetDate: "2026-11-15T17:15:00",
  countdownLabel: "🌅 संध्या अर्घ्य - सूर्यास्त",

  // 5️⃣ 📸 GALLERY IMAGES — add / remove / replace freely.
  //    "src" = image URL, "caption" = short Hindi/English caption.
  galleryImages: [
    { src: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?q=80&w=1200&auto=format&fit=crop", caption: "घाट पर अर्घ्य की तैयारी" },
    { src: "https://images.unsplash.com/photo-1593113598332-cd59a93f9724?q=80&w=1200&auto=format&fit=crop", caption: "दीपों से सजा घाट" },
    { src: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1200&auto=format&fit=crop", caption: "नदी किनारे आस्था" },
    { src: "https://images.unsplash.com/photo-1617096070802-24a1a4fdc65d?q=80&w=1200&auto=format&fit=crop", caption: "सूर्योदय अर्घ्य" },
    { src: "https://images.unsplash.com/photo-1610375461369-d613b564f4c4?q=80&w=1200&auto=format&fit=crop", caption: "पारंपरिक प्रसाद" },
    { src: "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=1200&auto=format&fit=crop", caption: "छठ उत्सव" }
  ],

  // 6️⃣ 🎧 CUSTOM AUDIO PLAYLIST — only add music files you legally own
  //    or have permission to use. Leave the array empty ( [] ) to hide
  //    the custom player behaviour gracefully (UI will show "no songs").
  customAudioTracks: [
    // {
    //   title: "छठी मैया के गीत",
    //   artist: "लोक गायक",
    //   cover: "assets/cover1.jpg",
    //   src: "assets/song1.mp3"
    // },
  ]
};

/* ===========================================================================
   END OF CONFIG — no need to edit anything below this line
   =========================================================================== */

document.title = CONFIG.websiteTitle;

/* ---------------------------------------------------------------------------
   Apply background image (if provided)
   --------------------------------------------------------------------------- */
(function applyBackgroundImage(){
  if(CONFIG.backgroundImageURL && CONFIG.backgroundImageURL.trim() !== ""){
    const heroBg = document.getElementById("heroBg");
    heroBg.style.backgroundImage =
      `linear-gradient(180deg, rgba(6,16,26,.35), rgba(6,16,26,.75)), url("${CONFIG.backgroundImageURL}")`;
  }
})();

/* ---------------------------------------------------------------------------
   Spotify embed — convert any open.spotify.com link into an embeddable one
   --------------------------------------------------------------------------- */
(function setupSpotify(){
  const frame = document.getElementById("spotifyFrame");
  if(!frame || !CONFIG.spotifyPlaylistUrl) return;
  try{
    const url = new URL(CONFIG.spotifyPlaylistUrl);
    if(url.hostname.includes("open.spotify.com") && !url.pathname.startsWith("/embed")){
      url.pathname = "/embed" + url.pathname;
    }
    url.searchParams.set("theme", "0");
    frame.src = url.toString();
  }catch(e){
    console.warn("Invalid Spotify URL in CONFIG.spotifyPlaylistUrl", e);
  }
})();

/* ---------------------------------------------------------------------------
   Theme toggle (Day / Night) with localStorage persistence
   --------------------------------------------------------------------------- */
(function themeSetup(){
  const body = document.body;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("chhath-theme");

  if(saved){
    body.setAttribute("data-theme", saved);
  } else {
    // default: pick night, but respect system preference lightly
    body.setAttribute("data-theme", "night");
  }
  updateThemeIcon();

  btn.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "night" ? "day" : "night";
    body.setAttribute("data-theme", next);
    localStorage.setItem("chhath-theme", next);
    updateThemeIcon();
  });

  function updateThemeIcon(){
    const theme = body.getAttribute("data-theme");
    btn.textContent = theme === "night" ? "🌙" : "🌞";
  }
})();

/* ---------------------------------------------------------------------------
   Ambient sound control — NEVER autoplays; user must opt in
   --------------------------------------------------------------------------- */
(function soundSetup(){
  const btn = document.getElementById("soundToggle");
  let audioCtx = null;
  let playing = false;
  let ambientAudio = null;

  btn.addEventListener("click", () => {
    playing = !playing;
    btn.textContent = playing ? "🔊" : "🔇";

    if(playing){
      // Only starts on explicit user click — respects no-forced-autoplay rule.
      if(!ambientAudio){
        // No bundled ambient file by default; this hook is ready if you
        // add one later, e.g. ambientAudio = new Audio('assets/ambient.mp3');
      }
      if(ambientAudio) ambientAudio.play().catch(()=>{});
    } else {
      if(ambientAudio) ambientAudio.pause();
    }
  });
})();

/* ---------------------------------------------------------------------------
   Mobile nav toggle + sticky header shadow + active link highlight
   --------------------------------------------------------------------------- */
(function navSetup(){
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const header = document.getElementById("siteHeader");
  const links = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  // Highlight active section link on scroll
  const sections = [...links].map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = "#" + entry.target.id;
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => io.observe(s));
})();

/* ---------------------------------------------------------------------------
   Back-to-top button
   --------------------------------------------------------------------------- */
(function backToTop(){
  const btn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive:true });
  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
})();

/* ---------------------------------------------------------------------------
   Scroll reveal animations (IntersectionObserver, lightweight)
   --------------------------------------------------------------------------- */
(function revealSetup(){
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => io.observe(item));
})();

/* ---------------------------------------------------------------------------
   ⏳ Countdown to main Chhath Puja day
   --------------------------------------------------------------------------- */
(function countdownSetup(){
  const target = new Date(CONFIG.countdownTargetDate).getTime();
  const els = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMinutes"),
    s: document.getElementById("cdSeconds"),
    msg: document.getElementById("countdownMsg")
  };

  function pad(n){ return String(n).padStart(2,"0"); }

  function tick(){
    const now = Date.now();
    const diff = target - now;

    if(diff <= 0){
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = "00";
      els.msg.textContent = "🙏 छठ पूजा 2026 सम्पन्न हुई — छठी मैया का आशीर्वाद सब पर बना रहे!";
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
    els.msg.textContent = CONFIG.countdownLabel || "";
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ---------------------------------------------------------------------------
   ✨ Ambient sparkle particles (site-wide, lightweight)
   --------------------------------------------------------------------------- */
(function sparkleSetup(){
  const layer = document.getElementById("ambientLayer");
  const isSmall = window.innerWidth < 640;
  const count = isSmall ? 12 : 22;

  for(let i=0;i<count;i++){
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random()*100 + "vw";
    s.style.bottom = "-10px";
    s.style.animationDuration = (10 + Math.random()*14) + "s";
    s.style.animationDelay = (Math.random()*14) + "s";
    s.style.opacity = (0.3 + Math.random()*0.5).toFixed(2);
    layer.appendChild(s);
  }
})();

/* ---------------------------------------------------------------------------
   🪔🌸 Floating diyas & flowers in the hero
   --------------------------------------------------------------------------- */
(function heroFloaters(){
  const wrap = document.getElementById("heroFloaters");
  const icons = ["🪔","🌸","✨","🪔","🌼"];
  const isSmall = window.innerWidth < 640;
  const count = isSmall ? 8 : 14;

  for(let i=0;i<count;i++){
    spawnFloater();
  }

  function spawnFloater(){
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = icons[Math.floor(Math.random()*icons.length)];
    el.style.left = Math.random()*100 + "%";
    el.style.setProperty("--drift", (Math.random()*80-40) + "px");
    el.style.animationDuration = (9 + Math.random()*8) + "s";
    el.style.animationDelay = (Math.random()*8) + "s";
    el.style.fontSize = (1.1 + Math.random()*1) + "rem";
    wrap.appendChild(el);
  }
})();

/* ---------------------------------------------------------------------------
   🌊 Ghat section floating diyas / flowers drifting across the water
   --------------------------------------------------------------------------- */
(function ghatFloaters(){
  const wrap = document.getElementById("ghatFloaters");
  const icons = ["🪔","🌸","🪔","🌼"];
  const count = window.innerWidth < 640 ? 5 : 9;

  for(let i=0;i<count;i++){
    const el = document.createElement("span");
    el.textContent = icons[Math.floor(Math.random()*icons.length)];
    el.style.top = (15 + Math.random()*55) + "%";
    el.style.animationDuration = (14 + Math.random()*10) + "s";
    el.style.animationDelay = (Math.random()*10) + "s";
    wrap.appendChild(el);
  }
})();

/* ---------------------------------------------------------------------------
   ☀️ Arghya scene — tiny diyas floating in the reflection water
   --------------------------------------------------------------------------- */
(function arghyaDiyas(){
  const wrap = document.getElementById("arghyaDiyas");
  const count = 6;
  for(let i=0;i<count;i++){
    const el = document.createElement("span");
    el.className = "mini-diya";
    el.textContent = "🪔";
    el.style.left = (8 + Math.random()*84) + "%";
    el.style.animationDelay = (Math.random()*3) + "s";
    wrap.appendChild(el);
  }
})();

/* ---------------------------------------------------------------------------
   🪔 Interactive "Light a Diya" button
   --------------------------------------------------------------------------- */
(function interactiveDiya(){
  const btn = document.getElementById("lightDiyaBtn");
  const stage = document.getElementById("diyaStage");
  const MAX_DIYAS = 18; // performance cap

  btn.addEventListener("click", () => {
    // Remove oldest if too many, to limit DOM growth
    while(stage.children.length >= MAX_DIYAS){
      stage.removeChild(stage.firstChild);
    }
    const diya = document.createElement("span");
    diya.className = "lit-diya";
    diya.textContent = "🪔";
    diya.style.left = (10 + Math.random()*80) + "%";
    stage.appendChild(diya);

    diya.addEventListener("animationend", () => {
      diya.remove();
    });
  });
})();

/* ---------------------------------------------------------------------------
   📸 Gallery + Lightbox
   --------------------------------------------------------------------------- */
(function gallerySetup(){
  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let currentIndex = 0;
  const images = CONFIG.galleryImages || [];

  images.forEach((img, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item reveal";
    item.innerHTML = `<img src="${img.src}" alt="${img.caption || 'Chhath Puja'}" loading="lazy">`;

    // Tap effect for mobile (touch), hover already handled in CSS
    item.addEventListener("touchstart", () => {
      item.classList.add("tapped");
    }, { passive:true });

    item.addEventListener("click", () => openLightbox(i));
    grid.appendChild(item);

    // Re-observe for reveal animation since added after initial observer run
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    io.observe(item);
  });

  function openLightbox(index){
    currentIndex = index;
    lbImage.src = images[currentIndex].src;
    lbImage.alt = images[currentIndex].caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  function showNext(){
    currentIndex = (currentIndex + 1) % images.length;
    lbImage.src = images[currentIndex].src;
  }
  function showPrev(){
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImage.src = images[currentIndex].src;
  }

  lbClose.addEventListener("click", closeLightbox);
  lbNext.addEventListener("click", showNext);
  lbPrev.addEventListener("click", showPrev);
  lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if(!lightbox.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowRight") showNext();
    if(e.key === "ArrowLeft") showPrev();
  });
})();

/* ---------------------------------------------------------------------------
   🎧 Custom HTML5 audio player (for legally owned music only)
   --------------------------------------------------------------------------- */
(function customPlayerSetup(){
  const tracks = CONFIG.customAudioTracks || [];
  const playerCard = document.getElementById("customPlayer");

  if(!tracks.length){
    // Gracefully hide the custom player if no tracks are configured
    playerCard.style.display = "none";
    return;
  }

  const audio = document.getElementById("audioEl");
  const playBtn = document.getElementById("playerPlay");
  const prevBtn = document.getElementById("playerPrev");
  const nextBtn = document.getElementById("playerNext");
  const seek = document.getElementById("playerSeek");
  const volume = document.getElementById("playerVolume");
  const currentEl = document.getElementById("playerCurrent");
  const durationEl = document.getElementById("playerDuration");
  const coverEl = document.getElementById("playerCover");
  const titleEl = document.getElementById("playerTitle");
  const artistEl = document.getElementById("playerArtist");
  const listEl = document.getElementById("playlistUL");

  let currentTrack = 0;
  let isPlaying = false;

  function fmtTime(sec){
    if(isNaN(sec)) return "0:00";
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,"0");
    return `${m}:${s}`;
  }

  function loadTrack(index){
    currentTrack = (index + tracks.length) % tracks.length;
    const t = tracks[currentTrack];
    audio.src = t.src;
    coverEl.src = t.cover || "";
    titleEl.textContent = t.title || "गीत";
    artistEl.textContent = t.artist || "";
    [...listEl.children].forEach((li,i) => li.classList.toggle("active", i === currentTrack));
  }

  function renderPlaylist(){
    listEl.innerHTML = "";
    tracks.forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>🎵 ${t.title || "गीत " + (i+1)}</span><span>${t.artist || ""}</span>`;
      li.addEventListener("click", () => { loadTrack(i); playAudio(); });
      listEl.appendChild(li);
    });
  }

  function playAudio(){
    audio.play().then(() => {
      isPlaying = true;
      playBtn.textContent = "⏸️";
    }).catch(()=>{});
  }
  function pauseAudio(){
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶️";
  }

  playBtn.addEventListener("click", () => isPlaying ? pauseAudio() : playAudio());
  prevBtn.addEventListener("click", () => { loadTrack(currentTrack - 1); if(isPlaying) playAudio(); });
  nextBtn.addEventListener("click", () => { loadTrack(currentTrack + 1); if(isPlaying) playAudio(); });

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = fmtTime(audio.duration);
    seek.max = audio.duration || 0;
  });
  audio.addEventListener("timeupdate", () => {
    currentEl.textContent = fmtTime(audio.currentTime);
    seek.value = audio.currentTime;
  });
  audio.addEventListener("ended", () => { loadTrack(currentTrack + 1); playAudio(); });

  seek.addEventListener("input", () => { audio.currentTime = seek.value; });
  volume.addEventListener("input", () => { audio.volume = volume.value / 100; });
  audio.volume = 0.8;

  renderPlaylist();
  loadTrack(0);
})();
