// Theme Switcher
// Cycles between: animated (gradient), light, dark
// All themes available on all pages
// Project pages: animated theme shows white background (no gradient)

(function() {
  const themes = ['animated', 'light', 'dark'];
  const themeIcons = {
    'animated': 'gradient',
    'light': 'sunny',
    'dark': 'bedtime'
  };

  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');

  // Check if we're on homepage or project page
  const isHomepage = window.location.pathname === '/' ||
                     window.location.pathname.endsWith('index.html') ||
                     document.querySelector('.parent') !== null &&
                     document.querySelector('nav.div1') !== null;

  // Get saved theme
  let currentThemeIndex = 0;
  const savedTheme = localStorage.getItem('portfolioTheme');

  // Logic for initial theme
  if (savedTheme && themes.includes(savedTheme)) {
    currentThemeIndex = themes.indexOf(savedTheme);
  }

  // Apply theme on page load
  function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-animated');

    // Apply new theme class
    if (theme === 'animated') {
      document.body.classList.add('theme-animated');
    } else if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // Update icon (Material Symbols)
    themeIcon.textContent = themeIcons[theme];

    // Update aria-label
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[nextThemeIndex];
    themeButton.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  }

  // Apply saved theme immediately
  applyTheme(themes[currentThemeIndex]);

  // Theme toggle click handler
  themeButton.addEventListener('click', function() {
    // Cycle through all 3 themes
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    const newTheme = themes[currentThemeIndex];

    // Apply theme
    applyTheme(newTheme);

    // Save to localStorage
    localStorage.setItem('portfolioTheme', newTheme);
  });

  // Keyboard support
  themeButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });

  // Scroll fade effect
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateButtonOpacity() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      themeButton.style.opacity = '0.3';
    } else {
      themeButton.style.opacity = '1';
    }

    // Show on hover even when faded
    themeButton.addEventListener('mouseenter', function() {
      this.style.opacity = '1';
    });

    themeButton.addEventListener('mouseleave', function() {
      if (window.scrollY > 100) {
        this.style.opacity = '0.3';
      }
    });

    ticking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(updateButtonOpacity);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
