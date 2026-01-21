// Lightbox behavior e pequenas interações
document.addEventListener('DOMContentLoaded', function () {
  // Atualiza ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  const cards = document.querySelectorAll('.card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxPrice = document.getElementById('lightboxPrice');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('closeBtn');

  function openLightbox(card) {
    const img = card.querySelector('img');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    const title = card.dataset.title || alt;
    const price = card.dataset.price || '';
    const desc = card.dataset.desc || '';

    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxTitle.textContent = title;
    lightboxPrice.textContent = price;
    lightboxDesc.textContent = desc;

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
