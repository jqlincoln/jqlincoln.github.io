const DATA = {
  hobbies:{title:'Hobbies',items:['Placeholder: Kayaking','Placeholder: Woodworking','Placeholder: Drawing']},
  academics:{title:'Academics',items:['Placeholder: Courses','Placeholder: Papers','Placeholder: Labs']},
  work:{title:'Work',items:['Placeholder: Consulting','Placeholder: Design','Placeholder: Ops']}
}

document.addEventListener('click',e=>{
  const t = e.target.closest('.tree'); if(!t) return;
  const trunk = t.querySelector('.trunk'); const r = trunk.getBoundingClientRect();
  const root = document.getElementById('zoom-root'); root.innerHTML='';
  const z = document.createElement('div'); z.className='zoom-trunk'; z.style.left=(r.left + r.width/2)+'px'; z.style.top=(r.top + r.height/2)+'px'; z.style.width=r.width+'px'; z.style.height=r.height+'px'; z.style.transform='translate(-50%,-50%)';
  const key=t.dataset.key; z.innerHTML=`<div class='bark-etched'><h2>${DATA[key].title}</h2><ul>${DATA[key].items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
  root.appendChild(z); requestAnimationFrame(()=>{ z.style.transition='all 700ms cubic-bezier(.22,.9,.3,1)'; z.classList.add('fullscreen'); z.addEventListener('transitionend', ()=>{ document.addEventListener('keydown', esc); z.addEventListener('click', close); },{once:true}) });
  function esc(ev){ if(ev.key==='Escape') close(); }
  function close(){ document.removeEventListener('keydown', esc); z.classList.remove('fullscreen'); z.style.transition='all 350ms ease'; z.addEventListener('transitionend', ()=>root.innerHTML='',{once:true}); }
});
