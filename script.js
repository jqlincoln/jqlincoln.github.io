// Interactive tree content system
const contentData = {
  academics: {
    title: "Academics",
    items: [
      "Bachelor of Science in Computer Science",
      "University of Mountain Views - 2020-2024",
      "GPA: 3.8/4.0",
      "Relevant Coursework: Data Structures, Algorithms, Web Development"
    ]
  },
  work: {
    title: "Work Experience",
    items: [
      "Software Engineer at Peak Technologies",
      "Full Stack Developer - 2024-Present",
      "Developed mountain trail mapping application",
      "Led team of 5 developers on cloud migration project"
    ]
  },
  hobbies: {
    title: "Hobbies",
    items: [
      "Backcountry skiing and snowboarding",
      "Rock climbing and mountaineering",
      "Trail running in alpine environments",
      "Photography of mountain landscapes",
      "Building custom hiking gear"
    ]
  }
};

function showContent(category) {
  const overlay = document.getElementById('content-overlay');
  const barkText = document.getElementById('bark-text');

  // Clear previous content
  barkText.innerHTML = '';

  // Add content for the selected category
  const data = contentData[category];
  if (data) {
    barkText.innerHTML = `
      <h2>${data.title}</h2>
      <ul>
        ${data.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }

  // Show overlay with animation
  overlay.classList.add('active');

  // Add click outside to close
  overlay.addEventListener('click', function closeOnOutside(e) {
    if (e.target === overlay) {
      closeContent();
      overlay.removeEventListener('click', closeOnOutside);
    }
  });
}

function closeContent() {
  const overlay = document.getElementById('content-overlay');
  overlay.classList.remove('active');
}

// Add keyboard support for accessibility
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeContent();
  }
});

// Add subtle tree animations on page load
document.addEventListener('DOMContentLoaded', function() {
  const trees = document.querySelectorAll('.tree');

  trees.forEach((tree, index) => {
    // Stagger the initial animation
    setTimeout(() => {
      tree.style.animation = 'growIn 0.8s ease-out forwards';
    }, index * 200);
  });
});

// Add CSS animation for tree growth
const style = document.createElement('style');
style.textContent = `
  @keyframes growIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);