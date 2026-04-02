// Interactive zoom-into-trunk behavior
const data = {
  hobbies: { title: 'Hobbies', items: ['Placeholder: Ski touring', 'Placeholder: Mountain photography', 'Placeholder: Trail running'] },
  academics: { title: 'Academics', items: ['Placeholder: Degree X', 'Placeholder: Research Y', 'Placeholder: Projects'] },
  work: { title: 'Work', items: ['Placeholder: Role A', 'Placeholder: Company B', 'Placeholder: Achievements'] }
};

function createBarkHTML(category){
  const c = data[category];
  if(!c) return '<div></div>';
  let html = `<div class="bark-etched"><h2>${c.title}</h2><ul>`;
  c.items.forEach(i=> html += `<li>${i}</li>`);
  html += '</ul></div>';
  return html;
}

// handle clicks
document.addEventListener('click', (e)=>{
  const t = e.target.closest('.tree');
  if(!t) return;
  // prevent double clicks
  if(t.dataset.locked) return;
  t.dataset.locked = '1';

  const key = t.dataset.key;
  // find trunk rect inside svg and compute screen coords
  const trunk = t.querySelector('.trunk');
  const trunkBBox = trunk.getBoundingClientRect();

  // create zoom trunk element
  const zoomRoot = document.getElementById('zoom-root');
  zoomRoot.innerHTML = '';
  const z = document.createElement('div');
  z.className = 'zoom-trunk';
  // place at trunk center
  z.style.left = (trunkBBox.left + window.scrollX) + 'px';
  z.style.top = (trunkBBox.top + window.scrollY) + 'px';
  z.style.width = trunkBBox.width + 'px';
  z.style.height = trunkBBox.height + 'px';
  // small transform to center
  z.style.transform = 'translate(-50%,-50%) scale(1)';

  // add etched content inside
  z.innerHTML = createBarkHTML(key);

  zoomRoot.appendChild(z);

  // force reflow then animate to fullscreen
  requestAnimationFrame(()=>{
    // compute center offset transform so it animates smoothly
    z.style.transition = 'all 700ms cubic-bezier(.22,.9,.3,1)';
    // expand to cover viewport
    z.classList.add('fullscreen');

    // after transition, keep content visible and enable close
    z.addEventListener('transitionend', function onEnd(ev){
      z.removeEventListener('transitionend', onEnd);
      z.style.pointerEvents = 'auto';
      // make sure Close on click or Escape
      document.addEventListener('keydown', escClose);
      z.addEventListener('click', shrink);
    });
  });

  function escClose(e){ if(e.key==="Escape") shrink(); }

  function shrink(){
    // remove listeners
    document.removeEventListener('keydown', escClose);
    z.removeEventListener('click', shrink);
    // animate back
    z.classList.remove('fullscreen');
    z.style.transition = 'all 500ms ease';
    z.addEventListener('transitionend', function tidy(){
      // cleanup
      zoomRoot.innerHTML = '';
      delete t.dataset.locked;
      z.removeEventListener('transitionend', tidy);
    });
  }
});
