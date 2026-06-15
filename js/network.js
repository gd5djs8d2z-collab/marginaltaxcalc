// network.js — ontariomarginaltaxcalc.ca
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

  // ── Network tools — Ontario cluster (8 members) ──────────────────────────
  var NETWORK_TOOLS = [
    {
      name: 'OntarioTakeHomeCalc.ca',
      label: 'OntarioTakeHomeCalc.ca — Estimate your Ontario net pay after all deductions',
      url: 'https://ontariotakehomecalc.ca',
      desc: 'Estimate your Ontario net pay after all deductions',
      live: true,
    },
    {
      name: 'OntarioIncomeTaxCalc.ca',
      label: 'OntarioIncomeTaxCalc.ca — Calculate your combined federal and Ontario income tax',
      url: 'https://ontarioincometaxcalc.ca',
      desc: 'Calculate your combined federal and Ontario income tax',
      live: true,
    },
    {
      name: 'OntarioBonusTaxCalc.ca',
      label: 'OntarioBonusTaxCalc.ca — Calculate the tax on your Ontario bonus',
      url: 'https://ontariobonustaxcalc.ca',
      desc: 'Calculate the tax on your Ontario bonus',
      live: true,
    },
    {
      name: 'OntarioRaiseCalc.ca',
      label: 'OntarioRaiseCalc.ca — Calculate the impact of a raise on your take-home pay',
      url: 'https://ontarioraisecalc.ca',
      desc: 'Calculate the impact of a raise on your take-home pay',
      live: true,
    },
    {
      name: 'OntarioCommissionTaxCalc.ca',
      label: 'OntarioCommissionTaxCalc.ca — Calculate the tax on your Ontario commission income',
      url: 'https://ontariocommissiontaxcalc.ca',
      desc: 'Calculate the tax on your Ontario commission income',
      live: true,
    },
    {
      name: 'OntarioSeverancePayCalc.ca',
      label: 'OntarioSeverancePayCalc.ca — Estimate your Ontario severance pay entitlements',
      url: 'https://ontarioseverancepaycalc.ca',
      desc: 'Estimate your Ontario severance pay entitlements',
      live: true,
    },
    {
      name: 'OntarioTerminationPayCalc.ca',
      label: 'OntarioTerminationPayCalc.ca — Calculate your Ontario termination pay',
      url: 'https://ontarioterminationpaycalc.ca',
      desc: 'Calculate your Ontario termination pay',
      live: true,
    },
    {
      name: 'OntarioSelfEmployedTaxCalc.ca',
      label: 'OntarioSelfEmployedTaxCalc.ca — Estimate your Ontario self-employment tax',
      url: 'https://ontarioselfemployedtaxcalc.ca',
      desc: 'Estimate your Ontario self-employment tax',
      live: true,
    },
  ];

  var CURRENT_HOST = window.location.hostname.replace(/^www\./, '');

  // ── Footer — 3-column: PAGES / LEGAL / RELATED TOOLS ─────────────────────
  function renderFooter() {
    var container = document.getElementById('network-footer');
    if (!container) return;

    var tools = NETWORK_TOOLS.filter(function (t) {
      return t.live && t.url.indexOf(CURRENT_HOST) === -1;
    });

    var toolLinks = '';
    tools.forEach(function (t) {
      toolLinks += '<a href="' + t.url + '" rel="noopener">' + t.label + '</a>';
    });

    container.innerHTML =
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<div class="logo">\uD83C\uDF41 Ontario Marginal Tax Calc</div>' +
          '<p>Free Ontario marginal tax rate calculator for 2026. Estimates only. Not tax advice.</p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>PAGES</h4>' +
          '<a href="index.html">Home</a>' +
          '<a href="faq.html">FAQ</a>' +
          '<a href="about.html">About</a>' +
          '<a href="contact.html">Contact</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>LEGAL</h4>' +
          '<a href="privacy-policy.html">Privacy Policy</a>' +
          '<a href="disclaimer.html">Disclaimer</a>' +
          '<a href="terms.html">Terms of Use</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>RELATED TOOLS</h4>' +
          toolLinks +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>\u00a9 2026 Ontario Marginal Tax Calc \u2014 Estimates only. Not tax or legal advice. \u00b7 <a href="privacy-policy.html">Privacy Policy</a> \u00b7 <a href="disclaimer.html">Disclaimer</a> \u00b7 <a href="terms.html">Terms</a> \u00b7 <a href="contact.html">Contact</a> \u00b7 <a href="faq.html">FAQ</a></span>' +
        '<span>Ontario, Canada</span>' +
      '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFooter();
  });

})();
