const D=[
{id:1,n:"Classic Milk Tea",c:"milk", img:'images/Classic-Milk-Tea-Boba.jpg',d:"Assam black tea, fresh milk, brown sugar pearls.",p:[350,450]},
{id:2,n:"Brown Sugar Boba",c:"milk", img:'images/Brown-sugar-boba.jpg',d:"Warm tiger-striped syrup, cold milk, extra pearls.",p:[420,520]},
{id:3,n:"Taro Cloud",c:"milk", img:'images/taro-boba.jfif',d:"Purple-free taro paste, whipped milk, coconut jelly.",p:[400,500]},
{id:4,n:"Thai Tea",c:"milk", img:'images/thai-tea.jfif',d:"Spiced tea with condensed milk. Sweet and bold.",p:[380,480]},
{id:5,n:"Mango Passion",c:"fruit", img:'images/mango-passionfruit-boba.jpg',d:"Fresh mango, passion fruit, green tea, popping pearls.",p:[380,480]},
{id:6,n:"Lychee Green Tea",c:"fruit", img:'images/green-tea-boba.jpg',d:"Light jasmine green tea with lychee and aloe.",p:[360,460]},
{id:7,n:"Kenya Coffee Boba",c:"special", img:'images/kenyan-coffee-boba.jfif',d:"Cold brew from Kenyan beans, oat milk, pearls.",p:[400,500]},
{id:8,n:"Mandazi & Milk Tea",c:"special", img:'images/mandazi-and-tea.jfif',d:"Classic milk tea with two warm mandazi.",p:[550,650]}
];
const cup='<svg viewBox="0 0 60 90"><path d="M8 20h44l-6 60q-1 6-7 6H21q-6 0-7-6z" fill="#F6F1E9" opacity=".9"/><rect x="4" y="12" width="52" height="9" rx="4.5" fill="#0D0907"/><rect x="29" y="0" width="4" height="30" rx="2" fill="#0D0907" transform="rotate(8 31 15)"/><g fill="#0D0907"><circle cx="21" cy="76" r="4"/><circle cx="31" cy="77" r="4"/><circle cx="40" cy="76" r="4"/><circle cx="26" cy="68" r="4"/><circle cx="36" cy="68" r="4"/></g></svg>';
const fmt=n=>'KES '+n.toLocaleString('en-KE');
let cart=[],cat='all';
try{cart=JSON.parse(localStorage.getItem('pp_cart')||'[]').filter(i=>D.some(d=>d.id==i.id)&&i.q>0)}catch(e){cart=[]}
const $=s=>document.querySelector(s);

/* menu */
function render(){
 $('#grid').innerHTML=D.filter(x=>cat=='all'||x.c==cat).map(x=>`
 <article class="card" data-id="${x.id}"><div class="dot" style="background:${x.t}">${x.img?`<img src="${x.img}" alt="${x.n}" loading="lazy" style="width:100%;height:100%;object-fit:contain">`:cup}</div>
 <h3>${x.n}</h3><p>${x.d}</p>
 <div class="row"><div class="size" role="group" aria-label="Size"><button aria-pressed="true" data-s="0">Regular</button><button aria-pressed="false" data-s="1">Large</button></div><span class="price">${fmt(x.p[0])}</span></div>
 <button class="add">Add to order</button></article>`).join('');
}
if($('#grid')){
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;cat=b.dataset.c;
 document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-pressed',t==b));render()};
$('#grid').onclick=e=>{
 const card=e.target.closest('.card');if(!card)return;const x=D.find(d=>d.id==card.dataset.id);
 const sb=e.target.closest('.size button');
 if(sb){card.querySelectorAll('.size button').forEach(b=>b.setAttribute('aria-pressed',b==sb));card.querySelector('.price').textContent=fmt(x.p[sb.dataset.s]);return}
 const a=e.target.closest('.add');
 if(a){const s=+card.querySelector('.size [aria-pressed=true]').dataset.s;
  const l=cart.find(i=>i.id==x.id&&i.s==s);l?l.q++:cart.push({id:x.id,s,q:1});
  a.textContent='Added';a.classList.add('ok');setTimeout(()=>{a.textContent='Add to order';a.classList.remove('ok')},900);upd()}
};
$('#grid').addEventListener('pointermove',e=>{
 const c=e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();
 const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
 c.style.transform=`perspective(700px) rotateY(${px*7}deg) rotateX(${-py*7}deg)`});
$('#grid').addEventListener('pointerout',e=>{const c=e.target.closest('.card');if(c)c.style.transform=''});
}

/* cart */
function upd(){
 try{localStorage.setItem('pp_cart',JSON.stringify(cart))}catch(e){}
 const n=cart.reduce((a,i)=>a+i.q,0),t=cart.reduce((a,i)=>a+i.q*D.find(d=>d.id==i.id).p[i.s],0);
 $('#count').textContent=n;$('#total').textContent=fmt(t);$('#go').disabled=!n;
 $('#items').innerHTML=n?cart.map((i,k)=>{const x=D.find(d=>d.id==i.id);return `<div class="li"><div><strong>${x.n}</strong><small>${i.s?'Large':'Regular'} · ${fmt(x.p[i.s])}</small>
 <div class="qty"><button data-k="${k}" data-d="-1" aria-label="Remove one">−</button>${i.q}<button data-k="${k}" data-d="1" aria-label="Add one">+</button></div></div><strong>${fmt(x.p[i.s]*i.q)}</strong></div>`}).join(''):'<p class="empty">Nothing here yet. Pick a drink from the menu.</p>';
}
$('#items').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const i=cart[b.dataset.k];i.q+=+b.dataset.d;if(i.q<1)cart.splice(b.dataset.k,1);upd()};
const tog=o=>{$('#cart').classList.toggle('open',o);$('#veil').classList.toggle('on',o)};
$('#open').onclick=()=>tog(true);$('#close').onclick=$('#veil').onclick=()=>tog(false);
document.addEventListener('keydown',e=>e.key=='Escape'&&tog(false));
$('#go').onclick=()=>{cart=[];upd();$('#items').innerHTML='<p class="empty">Order received. We will confirm your pickup time by phone shortly.</p>'};

/* hero photo parallax + cursor glow */
const hb=$('#herobg');
addEventListener('pointermove',e=>{
 document.documentElement.style.setProperty('--x',e.clientX+'px');document.documentElement.style.setProperty('--y',e.clientY+'px');
 const px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5;
 if(hb)hb.style.transform=`translate(${-px*30}px,${-py*20}px) scale(1.04)`});

/* marquee, hours, reveal */
if($('#mq'))$('#mq').innerHTML=('<span>Brown sugar pearls</span><span>·</span><span>Made to order</span><span>·</span><span>Kenyan coffee</span><span>·</span><span>From KES 350</span><span>·</span>').repeat(6);
const days=[["Mon – Thu","10:00 – 21:00"],["Fri – Sat","10:00 – 23:00"],["Sunday","12:00 – 20:00"]];
const w=new Date().getDay(),ti=w==0?2:w>=5?1:0;
if($('#hours'))$('#hours').innerHTML=days.map((d,i)=>`<li class="${i==ti?'today':''}"><span>${d[0]}</span><span>${d[1]}</span></li>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),io.unobserve(e.target))),{threshold:.2});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
if($('#grid'))render();
upd();
/* mobile nav */
const bg=$('#burger'),nl=$('nav ul');
if(bg){const cl=()=>{nl.classList.remove('open');bg.setAttribute('aria-expanded','false')};
 bg.onclick=()=>{const o=nl.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
 nl.addEventListener('click',e=>{if(e.target.closest('a'))cl()});
 addEventListener('resize',()=>innerWidth>820&&cl())}
