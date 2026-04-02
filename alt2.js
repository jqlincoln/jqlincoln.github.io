const content = {
  hobbies:{title:'Hobbies',items:['Placeholder: Skiing','Placeholder: Photography','Placeholder: Painting']},
  academics:{title:'Academics',items:['Placeholder: Degree','Placeholder: Thesis','Placeholder: Courses']},
  work:{title:'Work',items:['Placeholder: Job','Placeholder: Projects','Placeholder: Skills']}
}

document.addEventListener('click', (e)=>{
  const t = e.target.closest('.tree');
  if(!t) return;
  const trunk = t.querySelector('.trunk');
  const rect = trunk.getBoundingClientRect();
  const root = document.getElementById('zoom-root'); root.innerHTML='';
  const z = document.createElement('div'); z.className='zoom-trunk';
  z.style.left = (rect.left + rect.width/2)+'px'; z.style.top=(rect.top + rect.height/2)+'px';
  z.style.width = rect.width+'px'; z.style.height = rect.height+'px'; z.style.transform='translate(-50%,-50%)';
  const key = t.dataset.key; z.innerHTML = `<div class='bark-etched'><h2>${content[key].title}</h2><ul>${content[key].items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
  root.appendChild(z);
  requestAnimationFrame(()=>{ z.style.transition='all 650ms cubic-bezier(.22,.9,.3,1)'; z.classList.add('fullscreen'); z.addEventListener('transitionend', ()=>{ document.addEventListener('keydown', esc); z.addEventListener('click', close); },{once:true}) });
  function esc(ev){ if(ev.key==='Escape') close(); }
  function close(){ document.removeEventListener('keydown', esc); if(!z) return; z.classList.remove('fullscreen'); z.style.transition='all 300ms ease'; z.addEventListener('transitionend', ()=>root.innerHTML='',{once:true}) }
});
