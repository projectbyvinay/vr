document.addEventListener("DOMContentLoaded",()=>{
const loader=document.querySelector(".loader");setTimeout(()=>{if(loader){loader.style.opacity=0;setTimeout(()=>loader.remove(),450)}},850);
const body=document.body;if(localStorage.getItem("couple-theme")==="dark")body.classList.add("dark-mode");
document.querySelector(".theme-toggle")?.addEventListener("click",()=>{body.classList.toggle("dark-mode");localStorage.setItem("couple-theme",body.classList.contains("dark-mode")?"dark":"light")});
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.15});
document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
const scenes=document.querySelectorAll(".scene");let ticking=false;
function parallax(){scenes.forEach(s=>{let r=s.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;let p=s.querySelector(".photo"),d=+(s.dataset.depth||.12);if(p)p.style.transform=`scale(1.05) translate3d(0,${(r.top-innerHeight/2)*d}px,0)`});ticking=false}
addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});parallax();
const lb=document.querySelector(".lightbox"),img=document.querySelector(".lightbox-image"),cap=document.querySelector(".lightbox-caption");
const pics=["https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1400&q=90","https://images.unsplash.com/photo-1515894203077-9cd36032142f?auto=format&fit=crop&w=1400&q=90","https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90"],names=["The smile","The pause","The laugh"];
document.querySelectorAll("[data-lightbox]").forEach(c=>c.addEventListener("click",()=>{let i=+c.dataset.lightbox;img.style.backgroundImage=`url("${pics[i]}")`;cap.textContent=names[i];lb.classList.add("open")}));
const close=()=>lb.classList.remove("open");document.querySelector(".lightbox-close").onclick=close;lb.onclick=e=>{if(e.target===lb)close()};addEventListener("keydown",e=>{if(e.key==="Escape")close()});
});