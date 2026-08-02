// A quiet gold-leaf pill.
//
// For ordinary visitors it says "Request an appointment" and points at the
// form. Rules, so it never nags:
//   · never over a hero — the hero has its own call to action
//   · never while the appointment form is on screen
//   · on pages with no hero, wait until the visitor has actually scrolled
//
// For KARL, arriving from his private reveal page (?lee=1), it becomes the
// way back to Lee instead. He must never be handed a button that emails
// himself, and he must not have to hunt for the tab he came from.
(function () {
  if (document.querySelector('.sticky-cta')) return;

  var REVEAL = '/hello#seen';
  var MARK = 'kg_from_lee';

  // The marker rides in on the URL, then persists for the visit so it
  // survives him clicking through to the Work and Collection pages.
  var fromLee = /[?&]lee=1\b/.test(location.search);
  try {
    if (fromLee) sessionStorage.setItem(MARK, '1');
    else fromLee = sessionStorage.getItem(MARK) === '1';
  } catch (e) {
    /* private mode — fall back to the URL alone */
  }

  var onIndex = !!document.getElementById('contact');
  var a = document.createElement('a');
  a.className = 'sticky-cta' + (fromLee ? ' is-lee' : '');
  if (fromLee) {
    a.href = REVEAL;
    a.textContent = 'Back to Lee';
  } else {
    a.href = onIndex ? '#contact' : './index.html#contact';
    a.textContent = 'Request an appointment';
  }
  document.body.appendChild(a);

  var hero = document.querySelector('.hero, .model-hero');
  var form = document.querySelector('.appointment');

  var heroVisible = !!hero;
  var formVisible = false;
  var scrolled = false;

  function update() {
    // Karl's chip ignores the appointment form — that form is not for him.
    var blocked = heroVisible || (formVisible && !fromLee);
    var gate = hero ? true : scrolled;
    a.classList.toggle('is-shown', !blocked && gate);
  }

  if ('IntersectionObserver' in window) {
    if (hero) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { heroVisible = e.isIntersecting; });
        update();
      }, { threshold: 0.12 }).observe(hero);
    }
    if (form) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { formVisible = e.isIntersecting; });
        update();
      }, { threshold: 0.18 }).observe(form);
    }
  } else {
    heroVisible = false;
  }

  function onScroll() {
    scrolled = window.scrollY > 320;
    update();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  update();
})();
