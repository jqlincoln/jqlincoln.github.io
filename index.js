const DATA = {
  hobbies: {
    title: 'Hobbies',
    description: 'Creative and outdoor activities that keep me curious, grounded, and energized.',
    items: [
      {
        title: 'Skiing',
        text: 'I enjoy mountain trips focused on skill building and fresh air.',
        linkText: 'View winter notes',
        linkHref: '#about'
      },
      {
        title: 'Photography',
        text: 'I capture people, places, and details that tell a story clearly.',
        linkText: 'See visual approach',
        linkHref: '#about'
      },
      {
        title: 'Painting',
        text: 'Painting helps me experiment with color, composition, and patience.',
        linkText: 'Read creative process',
        linkHref: '#about'
      }
    ]
  },
  academics: {
    title: 'Academics',
    description: 'Learning goals and milestones that shaped how I solve real problems.',
    items: [
      {
        title: 'Degree Focus',
        text: 'Strong foundation in structured thinking, communication, and execution.',
        linkText: 'Explore background',
        linkHref: '#about'
      },
      {
        title: 'Thesis Work',
        text: 'Long-form project work with research, iteration, and clear outcomes.',
        linkText: 'See project style',
        linkHref: '#about'
      },
      {
        title: 'Course Highlights',
        text: 'Coursework that combines analysis, creativity, and practical delivery.',
        linkText: 'Read examples',
        linkHref: '#about'
      }
    ]
  },
  work: {
    title: 'Work',
    description: 'Hands-on projects where I turn ideas into useful outcomes for people.',
    items: [
      {
        title: 'Core Role',
        text: 'Delivering dependable work with clear communication from start to finish.',
        linkText: 'See working style',
        linkHref: '#contact'
      },
      {
        title: 'Projects',
        text: 'Building and improving projects with a focus on clarity and impact.',
        linkText: 'View examples',
        linkHref: '#contact'
      },
      {
        title: 'Skills in Practice',
        text: 'Balancing planning, design, and execution in day-to-day collaboration.',
        linkText: 'Start a conversation',
        linkHref: '#contact'
      }
    ]
  }
}

const KEYS = Object.keys(DATA)
const BASE_SCALE = 1

const state = {
  activeKey: null,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const stage = document.getElementById('scene-stage')
const treeNodes = Array.from(document.querySelectorAll('.tree'))
const chipNodes = Array.from(document.querySelectorAll('[data-select-key]'))
const detailTitle = document.getElementById('detail-title')
const detailBody = document.getElementById('detail-body')
const detailList = document.getElementById('detail-list')
const resetViewButton = document.getElementById('reset-view')

function focusScale() {
  if (window.innerWidth < 680) return 1.85
  if (window.innerWidth < 980) return 2
  return 2.25
}

function renderDetail(key) {
  if (!key || !DATA[key]) {
    detailTitle.textContent = 'Choose a tree to begin'
    detailBody.textContent = 'Select Hobbies, Academics, or Work and the scene will zoom in automatically while this panel shows the details.'
    detailList.innerHTML = ''
    return
  }

  const item = DATA[key]
  detailTitle.textContent = item.title
  detailBody.textContent = item.description
  detailList.innerHTML = item.items
    .map(function(entry) {
      return [
        '<article class="detail-item">',
        '<h3>' + entry.title + '</h3>',
        '<p>' + entry.text + '</p>',
        '<a href="' + entry.linkHref + '">' + entry.linkText + '</a>',
        '</article>'
      ].join('')
    })
    .join('')
}

function setSelectionVisuals(key) {
  treeNodes.forEach(function(node) {
    const isActive = node.dataset.key === key
    node.classList.toggle('is-active', isActive)
    node.setAttribute('aria-current', isActive ? 'true' : 'false')
  })

  chipNodes.forEach(function(node) {
    node.classList.toggle('is-active', node.dataset.selectKey === key)
    node.setAttribute('aria-pressed', node.dataset.selectKey === key ? 'true' : 'false')
  })
}

function applyZoomForTree(treeNode) {
  if (!treeNode) {
    stage.style.transform = 'translate(0px, 0px) scale(' + BASE_SCALE + ')'
    return
  }

  const scale = focusScale()
  const cx = parseFloat(treeNode.dataset.cx)
  const cy = parseFloat(treeNode.dataset.cy)
  const viewCenterX = 800
  const viewCenterY = 560
  const tx = viewCenterX - cx * scale
  const ty = viewCenterY - cy * scale

  if (state.reducedMotion) {
    stage.style.transitionDuration = '0.01ms'
  } else {
    stage.style.transitionDuration = '760ms'
  }

  stage.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')'
}

function syncHash(key) {
  const target = key ? '#'+ key : '#'
  if (window.location.hash !== target) {
    history.replaceState(null, '', target)
  }
}

function selectKey(key, options) {
  const shouldFocusPanel = options && options.focusPanel
  if (!key || !DATA[key]) {
    state.activeKey = null
    setSelectionVisuals(null)
    renderDetail(null)
    applyZoomForTree(null)
    syncHash(null)
    return
  }

  state.activeKey = key
  const treeNode = document.querySelector('.tree[data-key="' + key + '"]')
  setSelectionVisuals(key)
  renderDetail(key)
  applyZoomForTree(treeNode)
  syncHash(key)

  if (shouldFocusPanel) {
    const detailsPanel = document.getElementById('details-panel')
    detailsPanel.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }
}

function resetSelection() {
  selectKey(null)
}

function cycleSelection(direction) {
  const currentIndex = state.activeKey ? KEYS.indexOf(state.activeKey) : 0
  const nextIndex = (currentIndex + direction + KEYS.length) % KEYS.length
  selectKey(KEYS[nextIndex])
}

chipNodes.forEach(function(chip) {
  chip.addEventListener('click', function() {
    selectKey(chip.dataset.selectKey, { focusPanel: window.innerWidth < 980 })
  })
})

treeNodes.forEach(function(treeNode) {
  treeNode.addEventListener('click', function() {
    selectKey(treeNode.dataset.key, { focusPanel: window.innerWidth < 980 })
  })

  treeNode.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectKey(treeNode.dataset.key, { focusPanel: true })
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      cycleSelection(1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      cycleSelection(-1)
    }
  })
})

resetViewButton.addEventListener('click', resetSelection)

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    resetSelection()
  }
})

window.addEventListener('resize', function() {
  if (!state.activeKey) return
  const activeNode = document.querySelector('.tree[data-key="' + state.activeKey + '"]')
  applyZoomForTree(activeNode)
})

window.addEventListener('hashchange', function() {
  const hash = window.location.hash.replace('#', '')
  if (DATA[hash]) {
    selectKey(hash)
    return
  }
  resetSelection()
})

const initialHash = window.location.hash.replace('#', '')
if (DATA[initialHash]) {
  selectKey(initialHash)
} else {
  resetSelection()
}
