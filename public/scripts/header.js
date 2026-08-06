const initializeHeader = () => {
  const header = document.querySelector('[data-site-header]');
  if (!header || header.dataset.menuInitialized === 'true') return;

  const toggle = header.querySelector('.menu-toggle');
  const mobileNav = header.querySelector('.mobile-nav');
  if (!(toggle instanceof HTMLButtonElement) || !(mobileNav instanceof HTMLElement)) return;

  header.dataset.menuInitialized = 'true';

  const setMenuOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
    setMenuOpen(false);
    toggle.focus();
  });

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 0);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) setMenuOpen(false);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader, { once: true });
} else {
  initializeHeader();
}
