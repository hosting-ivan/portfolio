// Lightbox functionality for portfolio pages
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Create lightbox HTML if it doesn't exist
  if (!document.getElementById('lightbox')) {
    const lightboxHTML = `
      <div class="lightbox-overlay" id="lightbox">
        <span class="lightbox-close" id="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img" src="" alt="">
        <video class="lightbox-content" id="lightbox-video" style="display: none;" autoplay loop muted playsinline controls>
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
  const allVideos = document.querySelectorAll('.video, .video2, .full-video, .media-box video, .image-grid video');

  // Add click handlers to images
  allImages.forEach(img => {
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      lightboxImg.src = this.src;
      lightboxImg.style.display = 'block';
      lightboxVideo.style.display = 'none';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Add click handlers to videos
  allVideos.forEach(video => {
    // Make sure video is clickable
    video.style.cursor = 'zoom-in';
    video.style.pointerEvents = 'auto';

    video.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

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

        // Play the video once it's ready
        lightboxVideo.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
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
  }
});
