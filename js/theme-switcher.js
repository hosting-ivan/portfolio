// Theme Switcher - Light/Dark slider only

(function() {
  const sliderButtons = document.querySelectorAll('.slider-button');
  const sliderTrack = document.querySelector('.slider-track');
  const sliderThumb = document.querySelector('.slider-thumb');
  const themeControls = document.querySelector('.theme-controls');

  let currentTheme = localStorage.getItem('colorTheme') || null;

  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');

    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    }

    sliderButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });

    if (sliderThumb) {
      sliderThumb.style.left = '';
      sliderThumb.classList.toggle('dark', theme === 'dark');
    }
  }

  // Apply saved theme, or default to light on all pages
  if (currentTheme) {
    applyTheme(currentTheme);
  } else {
    currentTheme = 'light';
    applyTheme('light');
  }

  // Slider button click
  sliderButtons.forEach(button => {
    button.addEventListener('click', function() {
      currentTheme = this.getAttribute('data-theme');
      applyTheme(currentTheme);
      localStorage.setItem('colorTheme', currentTheme);
    });

    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Slider track click
  if (sliderTrack) {
    sliderTrack.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      currentTheme = clickX < rect.width / 2 ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('colorTheme', currentTheme);
    });
  }

  // Drag support for slider thumb
  if (sliderThumb) {
    let isDragging = false;

    sliderThumb.addEventListener('mousedown', function(e) {
      isDragging = true;
      this.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging || !sliderTrack) return;
      const rect = sliderTrack.getBoundingClientRect();
      const clampedX = Math.max(2, Math.min(e.clientX - rect.left - 10, rect.width - 22));
      sliderThumb.style.left = clampedX + 'px';
    });

    document.addEventListener('mouseup', function(e) {
      if (!isDragging) return;
      isDragging = false;
      sliderThumb.classList.remove('dragging');
      const rect = sliderTrack.getBoundingClientRect();
      currentTheme = e.clientX - rect.left < rect.width / 2 ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('colorTheme', currentTheme);
    });

    sliderThumb.addEventListener('touchstart', function(e) {
      isDragging = true;
      this.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('touchmove', function(e) {
      if (!isDragging || !sliderTrack) return;
      const rect = sliderTrack.getBoundingClientRect();
      const clampedX = Math.max(2, Math.min(e.touches[0].clientX - rect.left - 10, rect.width - 22));
      sliderThumb.style.left = clampedX + 'px';
    });

    document.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      sliderThumb.classList.remove('dragging');
      const rect = sliderTrack.getBoundingClientRect();
      currentTheme = e.changedTouches[0].clientX - rect.left < rect.width / 2 ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('colorTheme', currentTheme);
    });
  }

  // Fade controls on scroll
  if (themeControls) {
    let ticking = false;

    themeControls.addEventListener('mouseenter', function() {
      this.style.opacity = '1';
    });

    themeControls.addEventListener('mouseleave', function() {
      if (window.scrollY > 100) this.style.opacity = '0.3';
    });

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          themeControls.style.opacity = window.scrollY > 100 ? '0.3' : '1';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
