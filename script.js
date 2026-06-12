document.addEventListener('DOMContentLoaded',()=>{
(function(){const c=document.getElementById('particlesCanvas');if(!c)return;const x=c.getContext('2d');let w,h,p=[],m={x:0,y:0};
function r(){w=c.width=innerWidth;h=c.height=innerHeight};r();addEventListener('resize',r);
for(let i=0;i<80;i++){p.push({x:Math.random()*w,y:Math.random()*h,s:Math.random()*2+.5,sx:(Math.random()-.5)*.5,sy:(Math.random()-.5)*.5,o:Math.random()*.5+.1})}
addEventListener('mousemove',e=>{m.x=e.clientX;m.y=e.clientY});
(function a(){x.clearRect(0,0,w,h);p.forEach(p=>{p.x+=p.sx;p.y+=p.sy;if(p.x<0||p.x>w)p.sx*=-1;if(p.y<0||p.y>h)p.sy*=-1;x.beginPath();x.arc(p.x,p.y,p.s,0,Math.PI*2);x.fillStyle='rgba(0,212,170,'+p.o+')';x.fill()});requestAnimationFrame(a)})()})();

(function(){const c=document.getElementById('bubbleContainer');if(!c)return;for(let i=0;i<12;i++){const b=document.createElement('div');b.className='bubble-bg';const s=Math.random()*80+30;b.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*10+12)+'s;animation-delay:'+(Math.random()*15)+'s;';c.appendChild(b)}})();

const nav=document.getElementById('navbar'),nl=document.querySelectorAll('.nav-link'),nt=document.getElementById('navToggle'),nc=document.getElementById('navLinks');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>50);let cur='';document.querySelectorAll('section[id]').forEach(s=>{if(scrollY>=s.offsetTop-150)cur=s.getAttribute('id')});nl.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur))});
if(nt){nt.addEventListener('click',()=>{nt.classList.toggle('active');nc.classList.toggle('open')});nl.forEach(l=>l.addEventListener('click',()=>{nt.classList.remove('active');nc.classList.remove('open')}))}

const tt=document.getElementById('themeToggle'),h=document.documentElement;
const sv=localStorage.getItem('aquanexus-theme')||'dark';h.setAttribute('data-theme',sv);
if(tt)tt.addEventListener('click',()=>{const n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);localStorage.setItem('aquanexus-theme',n)});

const ho=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.stat-number').forEach(c=>{const t=parseInt(c.getAttribute('data-target'));if(!t)return;let v=0;(function u(){v+=t/40;if(v<t){c.textContent=Math.floor(v)+'+';requestAnimationFrame(u)}else c.textContent=t+'+'})()});ho.disconnect()}})},{threshold:.3});
const he=document.querySelector('.hero');if(he)ho.observe(he);

const po=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),(parseInt(e.target.getAttribute('data-delay')||'0'))*150);po.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.produto-card').forEach(c=>po.observe(c));

const f=document.getElementById('contatoForm');if(f)f.addEventListener('submit',e=>{e.preventDefault();const b=f.querySelector('.btn-submit');b.innerHTML='<i class="fas fa-check"></i> <span>Mensagem Enviada!</span>';b.style.background='linear-gradient(135deg,#22c55e,#16a34a)';setTimeout(()=>{b.innerHTML='<i class="fas fa-paper-plane"></i> <span>Enviar Mensagem</span>';b.style.background='';f.reset()},3000)});

(function(){const c=document.getElementById('gameCanvas');if(!c)return;const x=c.getContext('2d');let fish=[],food=[],score=0,time=30,running=0,ti=null,af=null;
const se=document.getElementById('gameScore'),fe=document.getElementById('gameFish'),te=document.getElementById('gameTimer'),sb=document.getElementById('startGameBtn');
class F{constructor(){this.x=Math.random()*(c.width-60)+30;this.y=Math.random()*(c.height-60)+30;this.sz=Math.random()*14+12;this.sx=(Math.random()-.5)*2;this.sy=(Math.random()-.5)*1.2;this.c1='hsl('+(Math.random()*60+140)+',70%,50%)';this.c2='hsl('+(Math.random()*60+160)+',60%,40%)';this.fed=0;this.w=Math.random()*6;this.d=1}
update(){this.w+=.02;this.x+=this.sx;this.y+=this.sy+Math.sin(this.w)*.5;if(this.x<20||this.x>c.width-20){this.sx*=-1;this.d*=-1}if(this.y<20||this.y>c.height-20)this.sy*=-1;if(!this.fed&&food.length>0){let cl=null,md=200;food.forEach(f=>{const d=Math.hypot(f.x-this.x,f.y-this.y);if(d<md){md=d;cl=f}});if(cl){const dx=cl.x-this.x,dy=cl.y-this.y,d=Math.hypot(dx,dy);if(d>5){this.sx+=dx/d*.08;this.sy+=dy/d*.08;const s=Math.hypot(this.sx,this.sy);if(s>3){this.sx=this.sx/s*3;this.sy=this.sy/s*3}this.d=dx>0?1:-1}else{this.fed=1;const i=food.indexOf(cl);if(i>-1)food.splice(i,1);score+=10;u();setTimeout(()=>{this.fed=0},2000)}}}this.sx*=.99;this.sy*=.99}
draw(){x.save();x.translate(this.x,this.y);x.scale(this.d,1);x.fillStyle=this.c1;x.beginPath();x.ellipse(0,0,this.sz,this.sz*.6,0,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(-this.sz*.7,0);x.lineTo(-this.sz*1.3,-this.sz*.5);x.lineTo(-this.sz*1.3,this.sz*.5);x.closePath();x.fillStyle=this.c2;x.fill();x.beginPath();x.arc(this.sz*.4,-this.sz*.1,this.sz*.2,0,Math.PI*2);x.fillStyle='#fff';x.fill();x.beginPath();x.arc(this.sz*.5,-this.sz*.1,this.sz*.1,0,Math.PI*2);x.fillStyle='#111';x.fill();x.restore()}}
class FD{constructor(x,y){this.x=x;this.y=y;this.l=1}update(){this.y+=.3;this.l-=.003}draw(){x.beginPath();x.arc(this.x,this.y,4,0,Math.PI*2);x.fillStyle='rgba(245,158,11,'+this.l+')';x.fill()}}
function bg(){const g=x.createLinearGradient(0,0,0,c.height);g.addColorStop(0,'rgba(0,212,170,0.08)');g.addColorStop(.6,'rgba(0,212,170,0.03)');g.addColorStop(1,'rgba(10,14,23,0.6)');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.fillStyle='rgba(0,212,170,0.08)';x.beginPath();x.ellipse(c.width/2,c.height-10,c.width*.5,20,0,0,Math.PI*2);x.fill()}
function init(n){fish=[];for(let i=0;i<n;i++)fish.push(new F())}
function u(){if(se)se.textContent=score;if(fe)fe.textContent=fish.length;if(te)te.textContent=time+'s'}
function go(){running=0;if(ti){clearInterval(ti);ti=null}if(af){cancelAnimationFrame(af);af=null}x.fillStyle='rgba(0,0,0,0.5)';x.fillRect(0,0,c.width,c.height);x.fillStyle='#fff';x.font='bold 40px Inter,sans-serif';x.textAlign='center';x.fillText('Game Over!',c.width/2,c.height/2-30);x.font='24px Inter,sans-serif';x.fillStyle='#00d4aa';x.fillText('Final: '+score,c.width/2,c.height/2+30);if(sb){sb.innerHTML='<i class="fas fa-redo"></i> <span>Jogar</span>';sb.disabled=0}}
function loop(){x.clearRect(0,0,c.width,c.height);bg();fish.forEach(f=>{f.update();f.draw()});food=food.filter(f=>f.l>0&&f.y<c.height);food.forEach(f=>{f.update();f.draw()});af=requestAnimationFrame(loop)}
function st(){if(ti)clearInterval(ti);ti=setInterval(()=>{time--;u();if(time<=0){clearInterval(ti);ti=null;go()}},1000)}
function sg(){score=0;time=30;running=1;food=[];init(5);if(sb){sb.innerHTML='<i class="fas fa-spinner fa-spin"></i> <span>Jogando...</span>';sb.disabled=1}u();if(af)cancelAnimationFrame(af);st();loop()}
c.addEventListener('click',e=>{if(!running)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)*(c.width/r.width),y=(e.clientY-r.top)*(c.height/r.height);for(let i=0;i<3;i++)food.push(new FD(x+(Math.random()-.5)*20,y+(Math.random()-.5)*10))});
if(sb)sb.addEventListener('click',sg);init(5);!function a(){x.clearRect(0,0,c.width,c.height);bg();fish.forEach(f=>{f.update();f.draw()});af=requestAnimationFrame(a)}()})();

document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){e.preventDefault();const t=document.querySelector(this.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'})})});
console.log('AquaNexus pronto!')})