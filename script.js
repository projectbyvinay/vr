document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.querySelector(".loader");
  setTimeout(()=>{if(loader){loader.style.opacity="0";loader.style.pointerEvents="none";setTimeout(()=>loader.remove(),350)}},850);

  const body=document.body;
  if(localStorage.getItem("couple-theme")==="dark") body.classList.add("dark-mode");
  document.querySelector(".theme-toggle")?.addEventListener("click",()=>{
    body.classList.toggle("dark-mode");
    localStorage.setItem("couple-theme",body.classList.contains("dark-mode")?"dark":"light");
  });

  document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>{
    const target=btn.dataset.scroll;
    if(target==="body") window.scrollTo({top:0,behavior:"smooth"});
    else document.querySelector(target)?.scrollIntoView({behavior:"smooth",block:"start"});
  }));

  const revealIO=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("visible");revealIO.unobserve(e.target)}
  }),{threshold:.12,rootMargin:"0px 0px -40px"});
  document.querySelectorAll(".reveal").forEach(el=>revealIO.observe(el));

  const scenes=[...document.querySelectorAll(".scene")];
  const nearIO=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle("is-near",e.isIntersecting)),{rootMargin:"180px 0px"});
  scenes.forEach(s=>nearIO.observe(s));

  let ticking=false;
  function parallax(){
    for(const s of scenes){
      if(!s.classList.contains("is-near")) continue;
      const r=s.getBoundingClientRect();
      const photo=s.querySelector(".photo");
      if(!photo) continue;
      const d=Number(s.dataset.depth||.08);
      const y=(r.top-window.innerHeight/2)*d;
      photo.style.transform=`scale(1.05) translate3d(0,${y.toFixed(1)}px,0)`;
    }
    ticking=false;
  }
  addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});
  addEventListener("resize",parallax,{passive:true});
  parallax();

  const lb=document.querySelector(".lightbox");
  const img=document.querySelector(".lightbox-image");
  const cap=document.querySelector(".lightbox-caption");
  const pics=[
    "https://projectbyvinay.github.io/vr/photos/1000774601.jpg",
    "https://projectbyvinay.github.io/vr/photos/1000774599.jpg",
    "https://projectbyvinay.github.io/vr/photos/1000774597.jpg"
  ];
  const names=["The smile","The pause","The laugh"];
  document.querySelectorAll("[data-lightbox]").forEach(card=>card.addEventListener("click",()=>{
    const i=Number(card.dataset.lightbox);
    img.style.backgroundImage=`url("${pics[i]}")`;
    cap.textContent=names[i];
    lb.classList.add("open");
    lb.setAttribute("aria-hidden","false");
  }));
  const close=()=>{lb.classList.remove("open");lb.setAttribute("aria-hidden","true")};
  document.querySelector(".lightbox-close")?.addEventListener("click",close);
  lb?.addEventListener("click",e=>{if(e.target===lb)close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});
});
