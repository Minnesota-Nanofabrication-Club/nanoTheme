/* =====================================================================
   Minnesota Nanofabrication docs theme: the few things CSS can't do.
   Loaded by additional-js in the book's book.toml. Without it the book
   still reads fine; these only add to it.

     - the "On this page" outline on the right, following your scroll
     - a caption bar with the language on each code block
     - Previous / Next cards and an "Edit this page" link
     - the footer, and the reading-progress line under the header
     - the theme button as a one-click light / dark switch
   ===================================================================== */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // the sidebar link for a URL, if there is one
  function sidebarLink(href) {
    var abs = new URL(href, location.href).href.replace(/#.*$/, '');
    return $$('#mdbook-sidebar a[href]').filter(function (a) { return a.href.replace(/#.*$/, '') === abs; })[0];
  }

  // a sidebar link's text without mdBook's chapter number ("3.1.")
  function linkText(a) {
    var c = a.cloneNode(true);
    $$('strong', c).forEach(function (n) { n.remove(); });
    return c.textContent.trim();
  }

  function progress() {
    var bar = document.getElementById('nf-progress');
    if (!bar) return;
    function upd() {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    }
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
  }

  function outline(content, main) {
    var layout = document.createElement('div');
    layout.className = 'nf-layout';
    content.parentNode.insertBefore(layout, content);
    layout.appendChild(content);

    var heads = $$('h2, h3', main);
    if (heads.length < 2) return;
    var toc = document.createElement('aside');
    toc.className = 'nf-toc';
    toc.innerHTML = '<p>On this page</p><nav aria-label="On this page">' + heads.map(function (h) {
      return '<a class="nf-' + h.tagName.toLowerCase() + '" href="#' + h.id + '">' + esc(h.textContent.trim()) + '</a>';
    }).join('') + '</nav>';
    layout.appendChild(toc);

    var links = $$('a', toc);
    function spy() {
      var line = 160, cur = heads[0];
      heads.forEach(function (h) { if (h.getBoundingClientRect().top < line) cur = h; });
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id); });
    }
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  function codeCaptions(main) {
    $$('pre', main).forEach(function (pre) {
      if (pre.closest('.nf-code')) return;
      var code = $('code', pre), m = code && code.className.match(/language-(\S+)/);
      var fig = document.createElement('figure');
      fig.className = 'nf-code';
      fig.innerHTML = '<figcaption>' + esc(m ? m[1] : 'code') + '</figcaption>';
      pre.parentNode.insertBefore(fig, pre);
      fig.appendChild(pre);
    });
  }

  function pager(main) {
    function card(rel, cls, label) {
      var a = $('.nav-wide-wrapper a[rel~="' + rel + '"]') || $('.nav-wrapper a[rel~="' + rel + '"]');
      if (!a) return '';
      var s = sidebarLink(a.getAttribute('href'));
      var title = s ? linkText(s) : label;
      return '<a class="' + cls + '" href="' + esc(a.getAttribute('href')) + '"><small>' + label + '</small><b>' + esc(title) + '</b></a>';
    }
    var html = card('prev', 'nf-prev', 'Previous') + card('next', 'nf-next', 'Next');
    if (html) {
      var nav = document.createElement('nav');
      nav.className = 'nf-pager';
      nav.setAttribute('aria-label', 'Previous and next page');
      nav.innerHTML = html;
      main.appendChild(nav);
    }
    var edit = $('#mdbook-menu-bar a[rel="edit"]');
    if (edit) {
      var p = document.createElement('p');
      p.className = 'nf-edit';
      p.innerHTML = '<span>Something wrong or missing?</span><a href="' + esc(edit.href) + '">Edit this page on GitHub ↗</a>';
      main.appendChild(p);
    }
  }

  function footer() {
    var page = $('.page');
    if (!page || $('.nf-footer', page)) return;
    var site = $('.nf-links .nf-cta');
    var repo = $('#mdbook-menu-bar a[aria-label="Git repository"]');
    var f = document.createElement('footer');
    f.className = 'nf-footer';
    f.innerHTML =
      '<div class="nf-footer-top">' +
        '<span class="nf-brand"><span class="nf-mark" aria-hidden="true"></span><span class="nf-brand-text"><b>Minnesota Nanofabrication Club</b><small>Documentation</small></span></span>' +
        '<nav aria-label="Footer">' +
          (site ? '<a href="' + esc(site.href) + '">Club website</a>' : '') +
          (repo ? '<a href="' + esc(repo.href) + '">GitHub</a>' : '') +
        '</nav>' +
      '</div>' +
      '<p class="nf-legal">This group is a Registered Student Organization and is independent from the University of Minnesota.</p>';
    page.appendChild(f);
  }

  // mdBook's theme button opens a menu of five themes. Here it just
  // flips between light and dark ("coal"), through mdBook's own menu
  // items so the choice is saved the usual way. Light is the default.
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
  function themeSwitch() {
    var btn = document.getElementById('mdbook-theme-toggle');
    if (!btn) return;
    var root = document.documentElement;
    function dark() { return /\b(coal|navy|ayu)\b/.test(root.className); }
    function paint() {
      var d = dark();
      btn.innerHTML = '<span class="fa-svg">' + (d ? SUN : MOON) + '</span>';
      btn.title = d ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', btn.title);
      btn.removeAttribute('aria-haspopup');
      btn.removeAttribute('aria-expanded');
    }
    btn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      var item = document.getElementById(dark() ? 'mdbook-theme-light' : 'mdbook-theme-coal');
      if (item) item.click();
      paint();
    }, true);
    paint();
  }

  ready(function () {
    themeSwitch();
    var content = document.getElementById('mdbook-content');
    var main = content && $('main', content);
    progress();
    if (main) {
      outline(content, main);
      codeCaptions(main);
      pager(main);
    }
    footer();
  });
})();
