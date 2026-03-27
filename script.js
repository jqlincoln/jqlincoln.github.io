// Content database for each tree category
const categoryContent = {
  academics: {
    title: 'Academics',
    items: [
      'Placeholder: Where learning peaks.',
      'Placeholder: Courses & projects.',
      'Placeholder: Academic achievements.'
    ]
  },
  work: {
    title: 'Work Experience',
    items: [
      'Placeholder: Professional ascent.',
      'Placeholder: Skills & roles.',
      'Placeholder: Career milestones.'
    ]
  },
  hobbies: {
    title: 'Hobbies',
    items: [
      'Placeholder: Trail and snow sports.',
      'Placeholder: Creative mountain hobbies.',
      'Placeholder: Outdoor adventures.'
    ]
  }
};

// Show content overlay with zoomed trunk
function showContent(category) {
  const overlay = document.getElementById('content-overlay');
  const barkText = document.getElementById('bark-text');
  const content = categoryContent[category];

  if (!content) return;

  // Build HTML for bark text
  let html = `<h2>${content.title}</h2>`;
  html += '<ul>';
  content.items.forEach(item => {
    html += `<li>${item}</li>`;
  });
  html += '</ul>';

  barkText.innerHTML = html;
  
  // Show overlay with animation
  overlay.classList.add('active');
  
  // Add rustle animation to the tree being clicked
  event.target.closest('.tree').style.animation = 'none';
  setTimeout(() => {
    event.target.closest('.tree').style.animation = '';
  }, 10);
}

// Close content overlay
function closeContent() {
  const overlay = document.getElementById('content-overlay');
  overlay.classList.remove('active');
}

// Close on overlay click (outside the trunk)
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('content-overlay');
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeContent();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContent();
    }
  });
});
