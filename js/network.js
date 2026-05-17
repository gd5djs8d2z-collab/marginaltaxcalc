// network.js — marginaltaxcalc.ca
// Ontario Payroll cluster — related tools & GA4 injection

(function () {
  'use strict';

  // ── GA4 — single-injection guard ──────────────────────────────────────────
  (function () {
    if (!window.__GA4_LOADED) {
      window.__GA4_LOADED = true;
      var id = 'G-W4SWZ1YRS2';
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', id);
    }
  })();

  // ── Network tools — Ontario Payroll cluster only ───────────────────────────
  var NETWORK_TOOLS = [
    {
      name: 'Ontario Take Home Calc',
      url: 'https://ontariotakehomecalc.ca',
      desc: 'See your full net pay after all deductions — income tax, CPP, EI, and OHP.',
      live: true,
    },
    {
      name: 'Ontario Income Tax Calc',
      url: 'https://ontarioincometaxcalc.ca',
      desc: 'Calculate your combined federal and Ontario income tax for 2026.',
      live: true,
    },
    {
      name: 'Ontario Raise Calc',
      url: 'https://ontarioraisecalc.ca',
      desc: 'Find out how much of a raise you actually keep after taxes in Ontario.',
      live: true,
    },
  ];

  var CURRENT_HOST = window.location.hostname.replace(/^www\./, '');

  // ── Related tools (main page) ─────────────────────────────────────────────
  function renderRelatedTools() {
    var container = document.getElementById('related-tools-list');
    if (!container) return;

    var tools = NETWORK_TOOLS.filter(function (t) {
      return t.live && t.url.indexOf(CURRENT_HOST) === -1;
    });

    if (tools.length === 0) {
      container.parentElement && (container.parentElement.style.display = 'none');
      return;
    }

    var html = '';
    tools.forEach(function (t) {
      html +=
        '<a href="' + t.url + '" class="tool-card" rel="noopener">' +
        '<span class="tool-name">' + t.name + '</span>' +
        '<span class="tool-desc">' + t.desc + '</span>' +
        '</a>';
    });
    container.innerHTML = html;
  }

  // ── Footer — 3-column: PAGES / LEGAL / RELATED TOOLS ─────────────────────
  function renderFooter() {
    var container = document.getElementById('network-footer');
    if (!container) return;

    var tools = NETWORK_TOOLS.filter(function (t) {
      return t.live && t.url.indexOf(CURRENT_HOST) === -1;
    });

    var toolLinks = '';
    tools.forEach(function (t) {
      toolLinks += '<a href="' + t.url + '" rel="noopener">' + t.name + '</a>';
    });

    container.innerHTML =
      '<div class="footer-grid">' +
        '<div class="footer-col">' +
          '<div class="footer-brand-name">Marginal Tax Calc</div>' +
          '<p>Free Ontario marginal tax rate calculator for 2026. Combines federal and provincial brackets, CPP, EI, and surtax.</p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Pages</h4>' +
          '<a href="index.html">Home</a>' +
          '<a href="faq.html">FAQ</a>' +
          '<a href="about.html">About</a>' +
          '<a href="contact.html">Contact</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Legal</h4>' +
          '<a href="privacy-policy.html">Privacy Policy</a>' +
          '<a href="disclaimer.html">Disclaimer</a>' +
          '<a href="terms.html">Terms of Use</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Related Tools</h4>' +
          toolLinks +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>\u00a9 2026 marginaltaxcalc.ca \u2014 For general information only. Not tax advice.</span>' +
        '<span>Ontario, Canada</span>' +
      '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderRelatedTools();
    renderFooter();
  });

})();
