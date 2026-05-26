/* ══════════════════════════════════════════
   script.js — Galería Fotográfica
   · Filtros por categoría
   · Lightbox con navegación
   · Animaciones por scroll (IntersectionObserver)
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Datos de fotos para el lightbox ───
     El orden debe coincidir con data-index en el HTML.
     Al agregar una foto nueva, añade un objeto al final de este array. */
  const photos = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90', title: 'Amanecer en los Andes', desc: 'Boyacá, Colombia · 2025' },
    { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=90', title: 'Penumbra',              desc: 'Estudio · Bogotá · 2025' },
    { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=90', title: 'Noche Urbana',          desc: 'Medellín · 2024' },
    { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=90', title: 'Niebla del Quindío',    desc: 'Eje Cafetero · 2024' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90', title: 'Geometría Oculta',      desc: 'Serie Abstracta · 2025' },
    { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1400&q=90', title: 'Mirada Quieta',         desc: 'Estudio · Cali · 2025' },
    { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=90', title: 'Líneas y Sombra',      desc: 'Bogotá · 2024' },
    { src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1400&q=90', title: 'Crepúsculo',           desc: 'Costa Pacífica · 2024' },
    { src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&q=90', title: 'Reflejos',             desc: 'Serie Luz · 2025' },
  ];

  /* ─── Referencias DOM ─── */
  const grid       = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbTitle    = document.getElementById('lbTitle');
  const lbDesc     = document.getElementById('lbDesc');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  let currentIndex = 0;
  let visibleIndices = []; // índices visibles según filtro activo

  /* ────────────────────────────────────────
     FILTROS
  ──────────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const items  = grid.querySelectorAll('.photo-item');

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });

      buildVisibleIndices(filter);
    });
  });

  function buildVisibleIndices(filter) {
    const items = grid.querySelectorAll('.photo-item');
    visibleIndices = [];
    items.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        visibleIndices.push(Number(item.querySelector('.photo-expand').dataset.index));
      }
    });
  }
  buildVisibleIndices('all'); // inicializar

  /* ────────────────────────────────────────
     LIGHTBOX
  ──────────────────────────────────────── */
  function openLightbox(index) {
    currentIndex = index;
    const photo = photos[index];
    if (!photo) return;

    lbImg.src     = photo.src;
    lbImg.alt     = photo.title;
    lbTitle.textContent = photo.title;
    lbDesc.textContent  = photo.desc;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function navigateLightbox(dir) {
    const pos = visibleIndices.indexOf(currentIndex);
    let next  = pos + dir;
    if (next < 0) next = visibleIndices.length - 1;
    if (next >= visibleIndices.length) next = 0;
    openLightbox(visibleIndices[next]);
  }

  // Botones de expandir en cada foto
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.photo-expand');
    if (!btn) return;
    openLightbox(Number(btn.dataset.index));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigateLightbox(-1));
  lbNext.addEventListener('click',  () => navigateLightbox(1));

  // Cerrar al hacer click fuera de la imagen
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLightbox(-1);
    if (e.key === 'ArrowRight')  navigateLightbox(1);
  });

  /* ────────────────────────────────────────
     ANIMACIONES DE ENTRADA (scroll)
  ──────────────────────────────────────── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // escalonado suave
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  grid.querySelectorAll('.photo-item').forEach(item => observer.observe(item));

  /* ────────────────────────────────────────
     MENÚ MÓVIL (toggle simple)
  ──────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav   = document.querySelector('.site-nav');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.style.display === 'flex';
      siteNav.style.display = open ? 'none' : 'flex';
      siteNav.style.flexDirection = 'column';
      siteNav.style.position = 'absolute';
      siteNav.style.top = '72px';
      siteNav.style.right = '20px';
      siteNav.style.background = 'var(--surface)';
      siteNav.style.padding = '20px 28px';
      siteNav.style.border = '1px solid var(--border)';
      siteNav.style.borderRadius = '4px';
    });
  }

});
