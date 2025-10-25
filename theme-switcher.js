// Theme Switcher
// Homepage: Gradient toggle + Light/Dark slider
// Project pages: Light/Dark slider only

(function() {
  const isHomepage = window.location.pathname === '/' ||
                     window.location.pathname.endsWith('index.html') ||
                     document.querySelector('nav.div1') !== null;

  // Get elements
  const gradientToggle = document.getElementById('gradient-toggle');
  const sliderButtons = document.querySelectorAll('.slider-button');
  const sliderTrack = document.querySelector('.slider-track');
  const sliderThumb = document.querySelector('.slider-thumb');
  const themeControls = document.querySelector('.theme-controls');

  // Get saved preferences
  let gradientEnabled = localStorage.getItem('gradientEnabled') !== 'false';
  let currentTheme = localStorage.getItem('colorTheme') || null;

  // Initialize homepage gradient toggle
  if (isHomepage && gradientToggle) {
    // Set initial state
    if (!gradientEnabled) {
      document.body.classList.add('gradient-off');
      gradientToggle.classList.remove('active');
    } else {
      gradientToggle.classList.add('active');
    }

    // Gradient toggle click handler
    gradientToggle.addEventListener('click', function() {
      gradientEnabled = !gradientEnabled;

      if (gradientEnabled) {
        document.body.classList.remove('gradient-off', 'theme-light', 'theme-dark');
        this.classList.add('active');
      } else {
        document.body.classList.add('gradient-off');
        this.classList.remove('active');
        // Default to light when gradient is off
        if (!currentTheme) {
          currentTheme = 'light';
        }
        applyTheme(currentTheme);
      }

      localStorage.setItem('gradientEnabled', gradientEnabled);
    });

    // Keyboard support for gradient toggle
    gradientToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Apply initial theme
  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');

    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // Update slider UI
    sliderButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update slider thumb position
    if (sliderThumb) {
      // Clear any inline styles from dragging to allow CSS classes to work
      sliderThumb.style.left = '';

      if (theme === 'dark') {
        sliderThumb.classList.add('dark');
      } else {
        sliderThumb.classList.remove('dark');
      }
    }
  }

  // Apply saved theme based on page and gradient state
  if (isHomepage) {
    // On homepage: only apply color theme if gradient is disabled
    if (!gradientEnabled && currentTheme) {
      applyTheme(currentTheme);
    } else {
      // Show gradient - just set slider visual state to light
      sliderButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === 'light') {
          btn.classList.add('active');
        }
      });
    }
  } else {
    // On project pages: always apply saved theme or default to light
    if (currentTheme) {
      applyTheme(currentTheme);
    } else {
      currentTheme = 'light';
      applyTheme('light');
    }
  }

  // Slider button click handlers
  sliderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      currentTheme = theme;
      applyTheme(theme);
      localStorage.setItem('colorTheme', theme);

      // On homepage, turn off gradient when a color theme is selected
      if (isHomepage && gradientEnabled && gradientToggle) {
        gradientEnabled = false;
        document.body.classList.add('gradient-off');
        gradientToggle.classList.remove('active');
        localStorage.setItem('gradientEnabled', 'false');
      }
    });

    // Keyboard support
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Slider track click handler
  if (sliderTrack) {
    sliderTrack.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTheme = clickX < rect.width / 2 ? 'light' : 'dark';

      currentTheme = newTheme;
      applyTheme(newTheme);
      localStorage.setItem('colorTheme', newTheme);

      // On homepage, turn off gradient when a color theme is selected
      if (isHomepage && gradientEnabled && gradientToggle) {
        gradientEnabled = false;
        document.body.classList.add('gradient-off');
        gradientToggle.classList.remove('active');
        localStorage.setItem('gradientEnabled', 'false');
      }
    });
  }

  // Drag functionality for slider thumb
  if (sliderThumb) {
    let isDragging = false;
    let startX = 0;

    sliderThumb.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      this.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging || !sliderTrack) return;

      const rect = sliderTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clampedX = Math.max(2, Math.min(x - 10, rect.width - 22));

      // Update thumb position without transition during drag
      sliderThumb.style.left = clampedX + 'px';
    });

    document.addEventListener('mouseup', function(e) {
      if (!isDragging) return;

      isDragging = false;
      sliderThumb.classList.remove('dragging');

      // Snap to nearest position
      const rect = sliderTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTheme = x < rect.width / 2 ? 'light' : 'dark';

      currentTheme = newTheme;
      applyTheme(newTheme);
      localStorage.setItem('colorTheme', newTheme);

      // On homepage, turn off gradient when a color theme is selected
      if (isHomepage && gradientEnabled && gradientToggle) {
        gradientEnabled = false;
        document.body.classList.add('gradient-off');
        gradientToggle.classList.remove('active');
        localStorage.setItem('gradientEnabled', 'false');
      }
    });

    // Touch support for mobile
    sliderThumb.addEventListener('touchstart', function(e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      this.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('touchmove', function(e) {
      if (!isDragging || !sliderTrack) return;

      const rect = sliderTrack.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const clampedX = Math.max(2, Math.min(x - 10, rect.width - 22));

      sliderThumb.style.left = clampedX + 'px';
    });

    document.addEventListener('touchend', function(e) {
      if (!isDragging) return;

      isDragging = false;
      sliderThumb.classList.remove('dragging');

      // Snap to nearest position
      const rect = sliderTrack.getBoundingClientRect();
      const x = e.changedTouches[0].clientX - rect.left;
      const newTheme = x < rect.width / 2 ? 'light' : 'dark';

      currentTheme = newTheme;
      applyTheme(newTheme);
      localStorage.setItem('colorTheme', newTheme);

      // On homepage, turn off gradient when a color theme is selected
      if (isHomepage && gradientEnabled && gradientToggle) {
        gradientEnabled = false;
        document.body.classList.add('gradient-off');
        gradientToggle.classList.remove('active');
        localStorage.setItem('gradientEnabled', 'false');
      }
    });
  }

  // Scroll fade effect
  if (themeControls) {
    let ticking = false;

    function updateControlsOpacity() {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        themeControls.style.opacity = '0.3';
      } else {
        themeControls.style.opacity = '1';
      }

      // Show on hover even when faded
      themeControls.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
      });

      themeControls.addEventListener('mouseleave', function() {
        if (window.scrollY > 100) {
          this.style.opacity = '0.3';
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateControlsOpacity);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
