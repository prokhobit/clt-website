/* CLT main nav — runs inline inside the Main Nav component (Code Embed). */

(()=>{const s=document.currentScript,n=s&&s.closest('.clt-mainnav');if(!n||n.dataset.ready)return;n.dataset.ready='1';
const m=n.querySelector('[popover]'),r=document.documentElement,bar=n.querySelector('.clt-mainnav__bar'),mq=matchMedia('(min-width:992px)'),k=p=>p.replace(/\/+$/,'')||'/';
try{if(!sessionStorage.getItem('clt-nav-intro')){n.classList.add('is-intro');sessionStorage.setItem('clt-nav-intro','1')}}catch(e){}
// Clearance for in-page UI (the Jump Nav docks at --clt-nav-offset; anchors land below it).
// Desktop: under the top bar. <=991px: the bar sits at the bottom, so just the top safe area.
const pr=document.createElement('div');pr.setAttribute('aria-hidden','true');pr.style.cssText='position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none';n.appendChild(pr);
const off=()=>{const v=mq.matches?Math.round((parseFloat(getComputedStyle(n).top)||16)+bar.offsetHeight+12):Math.round(12+pr.offsetHeight);r.style.setProperty('--clt-nav-offset',v+'px');r.style.scrollPaddingTop=v+'px'};
let q=0,sc=null;
const u=()=>{q=0;const y=scrollY,x=r.scrollHeight-innerHeight;n.style.setProperty('--clt-nav-progress',x>0?Math.min(1,Math.max(0,y/x)).toFixed(4):0);const on=y>24;if(on!==sc){sc=on;n.classList.toggle('is-scrolled',on)}};
addEventListener('scroll',()=>{if(!q){q=1;requestAnimationFrame(u)}},{passive:true});
const here=k(location.pathname),hide=()=>{try{m&&m.matches(':popover-open')&&m.hidePopover()}catch(e){}};
const links=[...n.querySelectorAll('.clt-mainnav__link')];
n.querySelectorAll('a[href]').forEach(a=>{a.addEventListener('click',hide);try{const t=new URL(a.getAttribute('href'),location.href);if(a.classList.contains('clt-mainnav__link')&&t.origin===location.origin&&k(t.pathname)===here&&!t.hash)a.setAttribute('aria-current','page')}catch(e){}});
links.forEach((a,i)=>a.style.setProperty('--i',i+1));
// Sliding glow (desktop): rests on the current page, glides to whatever is hovered or focused.
const L=n.querySelector('.clt-mainnav__links'),g=L&&L.querySelector('.clt-mainnav__glow');
const cur=()=>links.find(a=>a.getAttribute('aria-current')==='page'||a.classList.contains('w--current'));
const place=(a,now)=>{if(!g||!mq.matches)return;if(!a){g.style.opacity='0';return}
const go=()=>{g.style.width=a.offsetWidth+'px';g.style.transform='translateX('+a.offsetLeft+'px)'};
if(now||g.style.opacity!=='1'){g.style.transition='none';go();g.offsetWidth;g.style.transition=''}else go();g.style.opacity='1'};
const rest=()=>place(cur(),true);
if(g){n.classList.add('has-glow');
L.addEventListener('pointerover',e=>{const a=e.target.closest('.clt-mainnav__link');if(a)place(a)});
L.addEventListener('pointerleave',()=>place(cur()));
L.addEventListener('focusin',e=>{const a=e.target.closest('.clt-mainnav__link');if(a)place(a)});
L.addEventListener('focusout',e=>{if(!L.contains(e.relatedTarget))place(cur())});
document.fonts&&document.fonts.ready.then(rest)}
let rz=0;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(()=>{off();u();rest()})});
mq.addEventListener('change',e=>{if(e.matches)hide();off();rest()});
const b=n.querySelector('.clt-mainnav__toggle');if(m&&b){b.setAttribute('aria-expanded','false');m.addEventListener('toggle',e=>b.setAttribute('aria-expanded',String(e.newState==='open')))}
off();u();rest();addEventListener('load',()=>{off();rest()});
})();
