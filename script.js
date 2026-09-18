const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

window.addEventListener("load",()=>{
  const loader=$(".loader"), bar=$(".loader-bar i");
  setTimeout(()=>bar.style.width="100%",80);
  setTimeout(()=>{loader.style.opacity="0";setTimeout(()=>loader.remove(),650)},1250);

  const hearts=$(".hearts");
  for(let i=0;i<26;i++){
    const h=document.createElement("span");h.className="heart";
    h.style.left=Math.random()*100+"%";h.style.animationDuration=(7+Math.random()*9)+"s";
    h.style.animationDelay=(-Math.random()*12)+"s";h.style.fontSize=(10+Math.random()*20)+"px";
    hearts.appendChild(h);
  }

  $$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{
    const el=$(b.dataset.scroll); if(el) el.scrollIntoView({behavior:"smooth"});
  }));

  const progress=$(".scroll-progress i"), chapter=$("#chapter");
  const scenes=$$(".scene");
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(scrollY/max*100)+"%";
    let active="01";
    scenes.forEach(s=>{
      const r=s.getBoundingClientRect();
      if(r.top<innerHeight*.58 && r.bottom>innerHeight*.38) active=s.dataset.index;
    });
    chapter.textContent=active+" / 05";
  };
  addEventListener("scroll",update,{passive:true});update();

  // Lightweight cinematic parallax, no library required.
  let ticking=false;
  const parallax=()=>{
    scenes.forEach(s=>{
      const p=s.querySelector(".photo"), r=s.getBoundingClientRect();
      const progress=(innerHeight-r.top)/(innerHeight+r.height);
      p.style.transform=`scale(1.07) translateY(${(progress-.5)*70}px)`;
    });
    ticking=false;
  };
  addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});parallax();

  // Intersection reveal.
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

  // Image lightbox.
  const light=$(".lightbox"), img=$("#lightbox-img"), title=$("#lightbox-title");
  $$(".open-lightbox").forEach(b=>b.addEventListener("click",()=>{
    img.src=b.dataset.img;title.textContent=b.dataset.title||"our favourite frame";
    light.classList.add("show");light.setAttribute("aria-hidden","false");
  }));
  const close=()=>{light.classList.remove("show");light.setAttribute("aria-hidden","true")};
  $(".close-lightbox").addEventListener("click",close);light.addEventListener("click",e=>{if(e.target===light)close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});

  // Ambient mode: creates a subtle visual pulse without requiring an external audio file.
  let ambient=false, timer;
  $("#sound").addEventListener("click",e=>{
    ambient=!ambient;e.currentTarget.textContent=ambient?"✦":"♫";
    document.body.style.transition="filter .5s";
    document.body.style.filter=ambient?"saturate(1.08) brightness(1.02)":"none";
    clearInterval(timer);
    if(ambient) timer=setInterval(()=>{
      document.documentElement.style.setProperty("--pulse",Math.random()*.04+"");
    },1200);
  });
});
