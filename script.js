const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

window.addEventListener("load",()=>{
  const loader=$(".loader"),bar=$(".loader-bar i");
  setTimeout(()=>bar.style.width="100%",80);
  setTimeout(()=>{loader.style.opacity="0";setTimeout(()=>loader.remove(),650)},1250);

  // Full-page top-to-bottom hearts.
  const hearts=$(".global-hearts");
  for(let i=0;i<34;i++){
    const h=document.createElement("span");
    h.className="heart";
    h.textContent=Math.random()>.28?"♡":"♥";
    h.style.left=Math.random()*100+"%";
    h.style.fontSize=(9+Math.random()*19)+"px";
    h.style.animationDuration=(8+Math.random()*11)+"s";
    h.style.animationDelay=(-Math.random()*15)+"s";
    h.style.setProperty("--drift",(Math.random()*180-90)+"px");
    hearts.appendChild(h);
  }

  $$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{
    const el=$(b.dataset.scroll);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }));

  const progress=$(".scroll-progress i"),chapter=$("#chapter"),scenes=$$(".scene");
  function update(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progress.style.width=Math.min(100,scrollY/max*100)+"%";
    let active="01";
    scenes.forEach(s=>{
      const r=s.getBoundingClientRect();
      if(r.top<innerHeight*.58&&r.bottom>innerHeight*.38) active=s.dataset.index;
    });
    chapter.textContent=active+" / 05";
  }
  addEventListener("scroll",update,{passive:true});update();

  let ticking=false;
  function parallax(){
    scenes.forEach(s=>{
      const p=s.querySelector(".photo"),r=s.getBoundingClientRect();
      if(!p)return;
      const n=(innerHeight-r.top)/(innerHeight+r.height);
      p.style.transform=`scale(1.07) translateY(${(n-.5)*70}px)`;
    });
    ticking=false;
  }
  addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});parallax();

  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelector(".scene-copy")?.animate(
          [{opacity:0,transform:"translateY(55px)"},{opacity:1,transform:"translateY(0)"}],
          {duration:900,easing:"cubic-bezier(.2,.8,.2,1)",fill:"forwards"}
        );
      }
    });
  },{threshold:.22});
  scenes.forEach(s=>io.observe(s));

  // Lightbox.
  const light=$(".lightbox"),img=$("#lightbox-img"),title=$("#lightbox-title");
  $$(".open-lightbox").forEach(b=>b.addEventListener("click",()=>{
    img.src=b.dataset.img;title.textContent=b.dataset.title||"our favourite frame";
    light.classList.add("show");light.setAttribute("aria-hidden","false");
  }));
  const close=()=>{light.classList.remove("show");light.setAttribute("aria-hidden","true")};
  $(".close-lightbox").addEventListener("click",close);
  light.addEventListener("click",e=>{if(e.target===light)close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});

  // Light / dark mode, saved between visits.
  const toggle=$("#themeToggle"),themeColor=$("#themeColor");
  const saved=localStorage.getItem("vr-theme");
  const setTheme=dark=>{
    document.body.classList.toggle("dark-mode",dark);
    toggle.setAttribute("aria-pressed",String(dark));
    toggle.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
    $(".toggle-label").textContent=dark?"light":"dark";
    themeColor.content=dark?"#100910":"#f7e7e2";
    localStorage.setItem("vr-theme",dark?"dark":"light");
  };
  setTheme(saved==="dark");
  toggle.addEventListener("click",()=>setTheme(!document.body.classList.contains("dark-mode")));

  // Ambient button: enhances the candle/video atmosphere without external audio.
  let ambient=false,timer;
  $("#sound").addEventListener("click",e=>{
    ambient=!ambient;
    e.currentTarget.textContent=ambient?"✦":"♫";
    document.body.style.filter=ambient?"saturate(1.08) brightness(1.02)":"none";
    clearInterval(timer);
    if(ambient) timer=setInterval(()=>{
      document.documentElement.style.setProperty("--pulse",Math.random()*.04);
    },1200);
  });
});
