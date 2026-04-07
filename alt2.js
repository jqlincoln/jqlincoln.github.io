// ─── Hi-res bark texture via canvas ──────────────────────────────────────────
// 1024×1024 procedural bark — sharp at any zoom level

function generateBarkTexture() {
  const SIZE = 1024
  const c = document.createElement('canvas')
  c.width = SIZE; c.height = SIZE
  const ctx = c.getContext('2d')

  // Lighter warm base
  const bg = ctx.createLinearGradient(0, 0, SIZE, 0)
  bg.addColorStop(0,    '#5a2e0e')
  bg.addColorStop(0.15, '#8c4e22')
  bg.addColorStop(0.35, '#a85e2a')
  bg.addColorStop(0.5,  '#9a5224')
  bg.addColorStop(0.65, '#b06030')
  bg.addColorStop(0.85, '#8c4e22')
  bg.addColorStop(1,    '#5a2e0e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Vertical bark ridges
  for (let i = 0; i < 42; i++) {
    const x = (i / 42) * SIZE + (Math.random() - 0.5) * 18
    const w = 3 + Math.random() * 12
    const light = Math.random()
    ctx.beginPath()
    ctx.moveTo(x, 0)
    for (let y = 0; y <= SIZE; y += 36) {
      ctx.lineTo(x + (Math.random() - 0.5) * 7, y)
    }
    ctx.lineWidth = w
    ctx.strokeStyle = light > 0.55
      ? `rgba(210,140,70,${0.1 + Math.random() * 0.2})`
      : `rgba(20,8,2,${0.12 + Math.random() * 0.22})`
    ctx.stroke()
  }

  // Horizontal fissures
  for (let i = 0; i < 55; i++) {
    const y = Math.random() * SIZE
    const len = 25 + Math.random() * 160
    let cx2 = Math.random() * SIZE
    ctx.beginPath()
    ctx.moveTo(cx2, y)
    for (let s = 0; s < len; s += 10) {
      cx2 += (Math.random() - 0.38) * 10
      ctx.lineTo(cx2, y + (Math.random() - 0.5) * 3.5)
    }
    ctx.lineWidth = 0.4 + Math.random() * 1.4
    ctx.strokeStyle = `rgba(15,6,2,${0.18 + Math.random() * 0.28})`
    ctx.stroke()
  }

  // Fine grain noise
  const imageData = ctx.getImageData(0, 0, SIZE, SIZE)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 22
    d[i]   = Math.max(0, Math.min(255, d[i]   + n))
    d[i+1] = Math.max(0, Math.min(255, d[i+1] + n * 0.55))
    d[i+2] = Math.max(0, Math.min(255, d[i+2] + n * 0.18))
  }
  ctx.putImageData(imageData, 0, 0)

  return c.toDataURL('image/png')
}

// Inject into SVG pattern + backdrop
const barkDataURL = generateBarkTexture()
document.getElementById('bark-pattern-img').setAttribute('href', barkDataURL)
document.getElementById('bark-backdrop').setAttribute('fill', '#8c4e22')

// ─── Content ──────────────────────────────────────────────────────────────────
// (kept for reference; actual display is now SVG text on each trunk)
const content = {
  hobbies:  { title: 'Hobbies',   items: ['Skiing', 'Photography', 'Painting'] },
  academics:{ title: 'Academics', items: ['Degree', 'Thesis',      'Courses']  },
  work:     { title: 'Work',      items: ['Job',    'Projects',    'Skills']   }
}

// ─── Scene refs ───────────────────────────────────────────────────────────────
const scene    = document.getElementById('main-scene')
const zoomRoot = document.getElementById('zoom-root')

// ─── Helpers ──────────────────────────────────────────────────────────────────
function svgToViewport(svgX, svgY) {
  const pt = scene.createSVGPoint()
  pt.x = svgX; pt.y = svgY
  return pt.matrixTransform(scene.getScreenCTM())
}

function zoomSceneTo(svgX, svgY, scale, durationMs) {
  const target = svgToViewport(svgX, svgY)
  const cx = window.innerWidth  / 2
  const cy = window.innerHeight / 2
  const tx = cx - target.x
  const ty = cy - target.y
  scene.style.transition      = 'transform ' + durationMs + 'ms cubic-bezier(0.16, 1, 0.3, 1)'
  scene.style.transformOrigin = target.x + 'px ' + target.y + 'px'
  scene.style.transform       = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')'
}

function resetScene(durationMs) {
  scene.style.transition = 'transform ' + (durationMs || 500) + 'ms cubic-bezier(.4,0,.2,1)'
  scene.style.transform  = 'none'
}

// ─── State ────────────────────────────────────────────────────────────────────
let isZoomed = false
let activeTree = null

// ─── Click handler ────────────────────────────────────────────────────────────
document.addEventListener('click', function(e) {

  // If already zoomed, any click closes
  if (isZoomed) return

  const tree = e.target.closest('.tree')
  if (!tree) return

  isZoomed = true
  activeTree = tree
  activeTree.classList.add('tree-selected')

  const treeKey = tree.dataset.key
  const treeContent = content[treeKey] || { title: '', items: [] }
  const trunkCx = parseFloat(tree.dataset.trunkCx)
  const trunkCy = parseFloat(tree.dataset.trunkCy)

  // Zoom the whole scene — text lives inside SVG so it zooms with it
  scene.style.filter = 'brightness(1.05)'
  zoomSceneTo(trunkCx, trunkCy, 35, 900)

  // Show a subtle close hint after zoom settles
  zoomRoot.innerHTML = ''
  const panel = document.createElement('div')
  panel.className = 'bark-panel'
  panel.innerHTML =
    '<div class="details-card">' +
      '<h2 class="details-title">' + treeContent.title + '</h2>' +
      '<ul class="details-list">' +
        treeContent.items.map(function(item) { return '<li>' + item + '</li>' }).join('') +
      '</ul>' +
      '<p class="details-footer">click anywhere or press esc to close</p>' +
    '</div>'
  zoomRoot.appendChild(panel)

  requestAnimationFrame(function() {
    requestAnimationFrame(function() { panel.classList.add('visible') })
  })

  // Wire up close on next tick so this click doesn't immediately trigger it
  setTimeout(function() {
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
  }, 50)

  function onKey(ev) { if (ev.key === 'Escape') close() }

  function close() {
    document.removeEventListener('click', close)
    document.removeEventListener('keydown', onKey)

    if (activeTree) {
      activeTree.classList.remove('tree-selected')
      activeTree = null
    }

    // Fade hint out
    panel.classList.remove('visible')

    scene.style.filter = 'brightness(1)'
    resetScene(600)
    setTimeout(function() {
      zoomRoot.innerHTML = ''
      isZoomed = false
    }, 620)
  }
})
