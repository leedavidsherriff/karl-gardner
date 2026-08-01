(function () {
  var HOLD_MS = 8000; // dwell on the finished build before replaying

  var v = document.getElementById('modelVideo');
  if (!v) return;
  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  v.src = v.getAttribute(isMobile ? 'data-src-m' : 'data-src');

  // No native loop: finish, hold on the final frame, then go again.
  v.addEventListener('ended', function () {
    setTimeout(function () {
      v.currentTime = 0;
      v.play().catch(function () {});
    }, HOLD_MS);
  });

  v.addEventListener('playing', function () {
    v.__everPlayed = true;
    v.classList.add('qs-playing');
  });

  function still() {
    if (v.__everPlayed || v.__fellBack) return;
    v.__fellBack = true;
    var d = document.createElement('div');
    d.className = 'qs-noplay-still';
    d.style.backgroundImage = 'url("' + v.getAttribute('poster') + '")';
    v.parentElement.insertBefore(d, v);
    v.style.display = 'none';
  }

  var p = v.play();
  if (p) p.catch(still);
  setTimeout(function () { if (!v.__everPlayed) still(); }, 1800);

  ['pointerdown', 'touchstart', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, function () {
      if (v.__everPlayed) return;
      var s = document.querySelector('.qs-noplay-still');
      if (s) s.remove();
      v.style.display = '';
      v.__fellBack = false;
      v.play().catch(function () {});
    }, { passive: true });
  });
})();
