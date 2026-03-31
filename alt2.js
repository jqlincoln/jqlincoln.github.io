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

function showContent(category) {
  const overlay = document.getElementById('content-overlay');
  const globeContent = document.getElementById('globe-content');
  const content = categoryContent[category];

  if (!content) return;

  let html = `<h2>${content.title}</h2>`;
  html += '<ul>';
  content.items.forEach(item => {
    html += `<li>${item}</li>`;
  });
  html += '</ul>';

  globeContent.innerHTML = html;
  overlay.classList.add('active');
}

function closeContent() {
  const overlay = document.getElementById('content-overlay');
  overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('content-overlay');
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeContent();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContent();
    }
  });
});
