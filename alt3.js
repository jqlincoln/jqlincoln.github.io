// Approach: scale+translate with a subtle rotation using WA for a different feel
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
  z.style.transformOrigin='center center';
  z.innerHTML = `<div class='bark-etched'><h2>${content[t.dataset.key].title}</h2><ul>${content[t.dataset.key].items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
  root.appendChild(z);

  const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2;
  const dx = Math.round(window.innerWidth/2 - cx);
  const dy = Math.round(window.innerHeight/2 - cy);
  const scale = Math.max(window.innerWidth/rect.width, window.innerHeight/rect.height) * 1.03;

  // keyframes: translate then scale + small rotate
  const keyframes = [
    { transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
    { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(3deg)` }
  ];
  const anim = z.animate(keyframes, { duration: 800, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'forwards' });
  anim.onfinish = ()=>{ const be = z.querySelector('.bark-etched'); if(be){ be.style.display='block'; be.style.opacity='1'; } document.addEventListener('keydown', esc); z.addEventListener('click', close); };

  function esc(ev){ if(ev.key==='Escape') close(); }
  function close(){ document.removeEventListener('keydown', esc); const back = z.animate(keyframes.slice().reverse(), { duration: 350, easing: 'ease', fill: 'forwards' }); back.onfinish = ()=> root.innerHTML=''; }
});
