/* title letters */
const title=document.getElementById('title');
[..."Monsoon"].forEach((c,i)=>{const s=document.createElement('span');s.textContent=c;s.style.setProperty('--i',i);s.setAttribute('aria-hidden','true');title.appendChild(s)});

/* rain canvas */
const cv=document.getElementById('rain'),cx=cv.getContext('2d'),amt=document.getElementById('amt');
let W,H,drops=[],splash=[],wind=0.15,tw=0.15,dpr=Math.min(devicePixelRatio||1,2);
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){const r=cv.getBoundingClientRect();W=cv.width=r.width*dpr;H=cv.height=r.height*dpr}
function mk(){return{x:Math.random()*W*1.3-W*.15,y:Math.random()*-H,l:(10+Math.random()*22)*dpr,v:(12+Math.random()*14)*dpr,a:.2+Math.random()*.5}}
function sync(){const n=+amt.value;while(drops.length<n)drops.push(mk());drops.length=n}
function frame(){
  cx.clearRect(0,0,W,H);wind+=(tw-wind)*.04;
  cx.lineWidth=1.2*dpr;
  for(const d of drops){
    const dx=wind*d.l*1.6;
    cx.strokeStyle=`rgba(190,225,235,${d.a})`;
    cx.beginPath();cx.moveTo(d.x,d.y);cx.lineTo(d.x+dx,d.y+d.l);cx.stroke();
    d.y+=d.v;d.x+=wind*d.v*1.6;
    if(d.y>H*.97){if(Math.random()<.5)splash.push({x:d.x,y:H*.97,r:1,a:.5});Object.assign(d,mk(),{y:-20})}
  }
  for(let i=splash.length-1;i>=0;i--){const s=splash[i];s.r+=.9*dpr;s.a-=.03;if(s.a<=0){splash.splice(i,1);continue}
    cx.strokeStyle=`rgba(190,225,235,${s.a})`;cx.beginPath();cx.ellipse(s.x,s.y,s.r*2,s.r*.5,0,0,6.3);cx.stroke()}
  if(!still)requestAnimationFrame(frame)
}
size();sync();
if(still){drops.forEach(d=>d.y=Math.random()*H);frame()}else requestAnimationFrame(frame);
addEventListener('resize',()=>{size();sync()});
amt.addEventListener('input',sync);
document.querySelector('.hero').addEventListener('pointermove',e=>{tw=(e.clientX/innerWidth-.5)*1.2});
const fl=document.getElementById('flash');
function bolt(){fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go')}
document.getElementById('thunder').addEventListener('click',bolt);
if(!still)setInterval(()=>{if(amt.value>450&&Math.random()<.5)bolt()},7000);

/* scroll: progress bar + timeline fill */
const drift=document.getElementById('drift'),tl=document.getElementById('tl'),fill=document.getElementById('fill'),stops=[...tl.querySelectorAll('.stop')];
function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  drift.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  const r=tl.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));
  fill.style.height=`calc((100% - .8rem) * ${p})`;
  stops.forEach(s=>{const b=s.getBoundingClientRect();s.classList.toggle('on',b.top<innerHeight*.65)})
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* bars reveal */
const bars=document.getElementById('bars');
new IntersectionObserver((es,o)=>{es.forEach(e=>{if(e.isIntersecting){bars.classList.add('in');bars.querySelectorAll('i').forEach(i=>i.style.height=i.parentElement.style.getPropertyValue('--h'));o.disconnect()}})},{threshold:.4}).observe(bars);
const note=document.getElementById('note');
bars.querySelectorAll('.bar').forEach(b=>b.addEventListener('click',()=>{
  bars.querySelectorAll('.bar').forEach(x=>x.setAttribute('aria-pressed','false'));
  b.setAttribute('aria-pressed','true');note.textContent=b.dataset.t}));

/* flip cards */
document.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')!=='true')));
