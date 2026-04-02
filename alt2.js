// Approach: use Web Animations API to animate left/top/width/height for a hardware-accelerated, frame-driven zoom
const content = {
  hobbies:{title:'Hobbies',items:['Placeholder: Skiing','Placeholder: Photography','Placeholder: Painting']},
  academics:{title:'Academics',items:['Placeholder: Degree','Placeholder: Thesis','Placeholder: Courses']},
  work:{title:'Work',items:['Placeholder: Job','Placeholder: Projects','Placeholder: Skills']}
}

document.addEventListener('click', (e)=>{
  const t = e.target.closest('.tree'); if(!t) return;
  const trunk = t.querySelector('.trunk'); if(!trunk) return;
  const rect = trunk.getBoundingClientRect();
  const root = document.getElementById('zoom-root'); root.innerHTML='';
  const z = document.createElement('div'); z.className='zoom-trunk';
  z.style.position='absolute'; z.style.left = rect.left+'px'; z.style.top = rect.top+'px';
  z.style.width = rect.width+'px'; z.style.height = rect.height+'px'; z.style.overflow='hidden';
  z.innerHTML = `<div class='bark-etched'><h2>${content[t.dataset.key].title}</h2><ul>${content[t.dataset.key].items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
  root.appendChild(z);

  const final = {left: '0px', top: '0px', width: window.innerWidth+'px', height: window.innerHeight+'px'};
  const frames = [
    { left: z.style.left, top: z.style.top, width: z.style.width, height: z.style.height, offset:0 },
    { left: final.left, top: final.top, width: final.width, height: final.height, offset:1 }
  ];
  const anim = z.animate(frames, { duration: 700, easing: 'cubic-bezier(.22,.9,.3,1)', fill: 'forwards' });
  anim.onfinish = ()=>{ const be = z.querySelector('.bark-etched'); if(be){ be.style.display='block'; be.style.opacity='1'; } document.addEventListener('keydown', esc); z.addEventListener('click', close); };

  function esc(ev){ if(ev.key==='Escape') close(); }
  function close(){ document.removeEventListener('keydown', esc); const back = z.animate(frames.slice().reverse(), { duration: 350, easing: 'ease', fill: 'forwards' }); back.onfinish = ()=> root.innerHTML=''; }
});
