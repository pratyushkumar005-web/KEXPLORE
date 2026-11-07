'use strict';
/* ---------- Data ---------- */
const EVENTS = [
 {id:1,name:'After the Last Light Live',cat:'Music',date:'2026-11-13T19:30',venue:'Music Hall, Brooklyn',city:'Brooklyn',feat:true,c:['#e8772e','#5a1f0a'],desc:'An indie rock night with louder guitars, longer shadows and a room full of strangers singing together.'},
 {id:2,name:'Frontend Build Day',cat:'Tech',date:'2026-11-21T10:00',venue:'Innovation Hub, Bhubaneswar',city:'Bhubaneswar',feat:true,c:['#2c7be5','#0a2a5c'],desc:'A full-day hands-on workshop building a responsive site with HTML, CSS and JavaScript.'},
 {id:3,name:'Night Market Supper',cat:'Food',date:'2026-11-28T18:00',venue:'Old Mill Courtyard, Nashville',city:'Nashville',feat:false,c:['#d9a521','#6b3b05'],desc:'Twelve street-food stalls, one long table and live acoustic sets after dark.'},
 {id:4,name:'Linocut Printing Class',cat:'Workshop',date:'2026-12-03T14:00',venue:'Pinewood Studio, Chicago',city:'Chicago',feat:false,c:['#3aa17e','#0d3b2e'],desc:'Carve, ink and print your own poster. All tools and paper are provided.'},
 {id:5,name:'Open Source Hack Night',cat:'Tech',date:'2026-12-05T17:30',venue:'Cyber Park, Bhubaneswar',city:'Bhubaneswar',feat:true,c:['#7a4de0','#26104f'],desc:'Bring a laptop and an issue you want to fix. Mentors help you land your first pull request.'},
 {id:6,name:'Vinyl & Voices Listening Party',cat:'Music',date:'2026-12-12T20:00',venue:'Terminal West, Atlanta',city:'Atlanta',feat:false,c:['#c94b6a','#4a0f23'],desc:'Stream-free evening: a full album played on vinyl, followed by a Q&A with the band.'},
 {id:7,name:'Sourdough Basics',cat:'Food',date:'2026-12-14T11:00',venue:'Hearth Kitchen, Washington',city:'Washington',feat:false,c:['#c98a4b','#4a2a10'],desc:'Learn starters, folding and scoring, then take home a loaf and a jar of starter.'},
 {id:8,name:'Product Design Talks',cat:'Talk',date:'2027-01-09T16:00',venue:'Thalia Hall, Chicago',city:'Chicago',feat:false,c:['#2aa5b3','#0b3640'],desc:'Four short talks on designing for real people, followed by an open discussion.'}
];
const KEY='longway.registrations';
const $=s=>document.querySelector(s);
let cat='All', current=null, timer=null;

/* ---------- Helpers ---------- */
const d=e=>new Date(e.date);
const fmt=e=>d(e).toLocaleString('en-IN',{weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
const esc=s=>s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}};
const save=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch{}};
const art=e=>`--a:${e.c[0]};--b:${e.c[1]}`;

/* ---------- Render ---------- */
function card(e){
  const dt=d(e);
  return `<article class="card"><div class="art" style="${art(e)}"><span class="tag">${e.cat}</span>
    <div class="date"><small>${dt.toLocaleString('en',{month:'short'}).toUpperCase()}</small>${String(dt.getDate()).padStart(2,'0')}</div></div>
    <div class="card-b"><h3>${esc(e.name)}</h3><p><strong>${esc(e.venue)}</strong><br>${fmt(e)}</p><p>${esc(e.desc)}</p>
    <button class="btn" data-id="${e.id}">View details</button></div></article>`;
}
function render(){
  const q=$('#q').value.trim().toLowerCase();
  const list=EVENTS.filter(e=>(cat==='All'||e.cat===cat)&&(`${e.name} ${e.venue} ${e.cat} ${e.desc}`.toLowerCase().includes(q)));
  $('#grid').innerHTML=list.map(card).join('');
  $('#empty').hidden=list.length>0;
  $('#result').textContent=`${list.length} event${list.length===1?'':'s'} found`;
}
function init(){
  $('#featuredGrid').innerHTML=EVENTS.filter(e=>e.feat).map(card).join('');
  const cats=['All',...new Set(EVENTS.map(e=>e.cat))];
  $('#chips').innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}">${c}</button>`).join('');
  $('#event').innerHTML='<option value="">Choose an event</option>'+EVENTS.map(e=>`<option value="${e.id}">${esc(e.name)} — ${fmt(e)}</option>`).join('');
  render(); renderTickets(); tickNext();
}
function renderTickets(){
  const r=load(); $('#count').textContent=r.length;
  $('#tickets').innerHTML=r.length?r.map(t=>`<li><span><strong>${esc(t.event)}</strong><br><span class="muted">${esc(t.name)} · ${esc(t.email)}</span></span><span>${esc(t.ref)}</span></li>`).join(''):'<li class="muted">No registrations yet. Pick an event above to get your first ticket.</li>';
}

/* ---------- Countdown ---------- */
function parts(e){
  let s=Math.max(0,Math.floor((d(e)-Date.now())/1000));
  return [['days',86400],['hours',3600],['mins',60],['secs',1]].map(([l,n])=>{const v=Math.floor(s/n);s%=n;return [v,l]});
}
const box=p=>p.map(([v,l])=>`<div><b>${String(v).padStart(2,'0')}</b><span>${l}</span></div>`).join('');
function tickNext(){
  const e=EVENTS.filter(x=>d(x)>Date.now()).sort((a,b)=>d(a)-d(b))[0];
  if(!e){$('#next').innerHTML='<h3>No upcoming events</h3>';return}
  $('#next').innerHTML=`<p class="eyebrow">Next up</p><h3>${esc(e.name)}</h3><div class="count">${box(parts(e))}</div><button class="btn" data-id="${e.id}">Register</button>`;
}
setInterval(()=>{tickNext(); if(current&&$('#modal').open)$('#count-down').innerHTML=box(parts(current))},1000);

/* ---------- Modal ---------- */
function openEvent(id){
  current=EVENTS.find(e=>e.id===+id); const m=$('#modal');
  $('#mArt').style.cssText=art(current);
  $('#mTitle').textContent=current.name;
  $('#mMeta').textContent=`${current.cat} · ${fmt(current)} · ${current.venue}`;
  $('#mDesc').textContent=current.desc;
  $('#count-down').innerHTML=box(parts(current));
  $('#form').hidden=false; $('#done').hidden=true; $('#form').reset();
  $('#event').value=current.id; clearErrors();
  m.showModal();
}
const closeModal=()=>$('#modal').close();

/* ---------- Validation ---------- */
const rules={
  name:v=>/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v)?'':'Enter your full name (letters only, at least 2 characters).',
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'':'Enter a valid email, like name@example.com.',
  phone:v=>/^\d{10}$/.test(v.replace(/[\s-]/g,'').replace(/^(\+91|0)/,''))?'':'Enter a valid 10-digit phone number.',
  event:v=>v?'':'Choose the event you want to attend.'
};
function check(id){
  const el=$('#'+id), msg=rules[id](el.value.trim()), f=el.closest('.f');
  f.classList.toggle('bad',!!msg); f.classList.toggle('good',!msg); f.querySelector('small').textContent=msg;
  el.setAttribute('aria-invalid',!!msg); return !msg;
}
function clearErrors(){document.querySelectorAll('.f').forEach(f=>{f.classList.remove('bad','good');f.querySelector('small').textContent=''})}

$('#form').addEventListener('submit',ev=>{
  ev.preventDefault();
  const ok=Object.keys(rules).map(check).every(Boolean);
  if(!ok){ev.target.querySelector('.bad input,.bad select')?.focus();return}
  const e=EVENTS.find(x=>x.id===+$('#event').value), all=load();
  const email=$('#email').value.trim().toLowerCase();
  if(all.some(t=>t.email===email&&t.eventId===e.id)){
    const f=$('#email').closest('.f');f.classList.add('bad');f.querySelector('small').textContent='This email is already registered for this event.';return}
  const reg={ref:'LW-'+Math.random().toString(36).slice(2,8).toUpperCase(),eventId:e.id,event:e.name,name:$('#name').value.trim(),email,phone:$('#phone').value.trim()};
  all.push(reg); save(all); renderTickets();
  $('#doneMsg').textContent=`Thanks, ${reg.name.split(' ')[0]}. Your booking reference is ${reg.ref}. We've saved your spot for ${e.name} on ${fmt(e)}.`;
  $('#form').hidden=true; $('#done').hidden=false; $('#done').focus();
});
Object.keys(rules).forEach(id=>$('#'+id).addEventListener('blur',()=>check(id)));

/* ---------- Events ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-id]'); if(b)openEvent(b.dataset.id);
  const c=e.target.closest('.chip'); if(c){cat=c.textContent;document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===c));render()}
});
$('#q').addEventListener('input',render);
$('#reset').onclick=()=>{$('#q').value='';cat='All';document.querySelectorAll('.chip').forEach((x,i)=>x.setAttribute('aria-pressed',i===0));render()};
$('#close').onclick=$('#doneClose').onclick=closeModal;
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$('#menu').addEventListener('click',()=>$('#menu').classList.remove('open'));

/* Theme */
const root=document.documentElement;
try{const t=localStorage.getItem('longway.theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');root.dataset.theme=t}catch{}
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('longway.theme',t)}catch{}};

init();
