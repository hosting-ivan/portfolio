// Lightbox functionality for portfolio pages
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Create lightbox HTML if it doesn't exist
  if (!document.getElementById('lightbox')) {
    const lightboxHTML = `
      <div class="lightbox-overlay" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close image viewer">&times;</button>
        <img class="lightbox-content" id="lightbox-img" src="" alt="">
        <video class="lightbox-content" id="lightbox-video" style="display: none;" autoplay loop muted playsinline controls aria-label="Video player">
        </video>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  let lastFocusedElement = null;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.getElementById('lightbox-close');

  // Get all images and videos
  const allImages = document.querySelectorAll('.image, .image2, .full-image, .media-box img, .collage-grid img, .primary-image img, .top-right-image img, .bottom-left-image img, .bottom-right-image img');
  const allVideos = document.querySelectorAll('.video, .video2, .full-video, .media-box video, .image-grid video');

  // Add click handlers to images
  allImages.forEach(img => {
    // Add keyboard support
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Open image in lightbox: ' + (img.alt || 'Portfolio image'));

    const openImage = function(e) {
      e.preventDefault();
      e.stopPropagation();
      lastFocusedElement = document.activeElement;
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt || 'Portfolio image';
      lightboxImg.style.display = 'block';
      lightboxVideo.style.display = 'none';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Focus the close button for keyboard accessibility
      setTimeout(() => lightboxClose.focus(), 100);
    };

    img.addEventListener('click', openImage);
    img.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openImage.call(this, e);
      }
    });
  });

  // Add click handlers to videos
  allVideos.forEach(video => {
    // Make sure video is clickable
    video.style.cursor = 'zoom-in';
    video.style.pointerEvents = 'auto';
    video.setAttribute('tabindex', '0');
    video.setAttribute('role', 'button');
    video.setAttribute('aria-label', 'Open video in lightbox');

    const openVideo = function(e) {
      e.preventDefault();
      e.stopPropagation();
      lastFocusedElement = document.activeElement;

      // Get video source - try multiple methods
      let videoSrc = '';
      const source = this.querySelector('source');

      if (source) {
        videoSrc = source.src || source.getAttribute('src');
      }

      // Fallback to video's currentSrc or src
      if (!videoSrc) {
        videoSrc = this.currentSrc || this.src;
      }

      if (videoSrc) {
        // Set src directly on video element
        lightboxVideo.src = videoSrc;
        lightboxVideo.load();

        // Show lightbox and play video
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus the close button for keyboard accessibility
        setTimeout(() => lightboxClose.focus(), 100);

        // Play the video once it's ready
        lightboxVideo.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      }
    };

    video.addEventListener('click', openVideo);
    video.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideo.call(this, e);
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
    lightboxVideo.src = '';
    lightboxImg.src = '';
    document.body.style.overflow = ''; // Restore scrolling

    // Restore focus to the element that opened the lightbox
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }
});
