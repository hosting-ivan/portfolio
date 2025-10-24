// Lightbox functionality for portfolio pages
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Create lightbox HTML if it doesn't exist
  if (!document.getElementById('lightbox')) {
    const lightboxHTML = `
      <div class="lightbox-overlay" id="lightbox">
        <span class="lightbox-close" id="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img" src="" alt="">
        <video class="lightbox-content" id="lightbox-video" style="display: none;" autoplay loop muted playsinline>
          <source src="" type="video/webm">
        </video>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.getElementById('lightbox-close');

  // Get all images and videos
  const allImages = document.querySelectorAll('.image, .image2, .full-image, .media-box img, .collage-grid img, .primary-image img, .top-right-image img, .bottom-left-image img, .bottom-right-image img');
  const allVideos = document.querySelectorAll('.video, .video2, .full-video, .media-box video');

  // Add click handlers to images
  allImages.forEach(img => {
    img.addEventListener('click', function(e) {
      e.preventDefault();
      lightboxImg.src = this.src;
      lightboxImg.style.display = 'block';
      lightboxVideo.style.display = 'none';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Add click handlers to videos
  allVideos.forEach(video => {
    video.addEventListener('click', function(e) {
      e.preventDefault();
      const source = this.querySelector('source');
      if (source) {
        lightboxVideo.querySelector('source').src = source.src;
        lightboxVideo.load();
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
    });
  });

  // Close lightbox when clicking close button
  lightboxClose.addEventListener('click', closeLightbox);

  // Close lightbox when clicking overlay
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.querySelector('source').src = '';
    lightboxImg.src = '';
    document.body.style.overflow = ''; // Restore scrolling
  }
});
