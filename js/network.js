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

  // ── Network tools ─────────────────────────────────────────────────────────
  var NETWORK_TOOLS = [
    {
      name: 'Ontario Take Home Calculator',
      url: 'https://ontariotakehomecalc.ca',
      desc: 'See your full net pay after all deductions — income tax, CPP, EI, and OHP.',
      live: true,
    },
    {
      name: 'Ontario Income Tax Calculator',
      url: 'https://ontarioincometaxcalc.ca',
      desc: 'Calculate your combined federal and Ontario income tax for 2026.',
      live: true,
    },
    {
      name: 'Ontario Raise Calculator',
      url: 'https://ontarioraisecalc.ca',
      desc: 'Find out how much of a raise you actually keep after taxes in Ontario.',
      live: true,
    },
    {
      name: 'CPP Calculator',
      url: 'https://cppcalc.ca',
      desc: 'Calculate your Canada Pension Plan contributions including CPP2 for 2026.',
      live: true,
    },
    {
      name: 'EI Calculator Canada',
      url: 'https://eicalc.ca',
      desc: 'Calculate your Employment Insurance premium for the 2026 tax year.',
      live: true,
    },
    {
      name: 'Marginal Tax Calculator',
      url: 'https://marginaltaxcalc.ca',
      desc: 'Calculate your marginal tax rate on additional income in Ontario for 2026.',
      live: true,
    },
  ];

  var CURRENT_HOST = window.location.hostname.replace(/^www\./, '');

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

  function renderFooterTools() {
    var container = document.getElementById('footer-tools-list');
    if (!container) return;

    var tools = NETWORK_TOOLS.filter(function (t) {
      return t.live && t.url.indexOf(CURRENT_HOST) === -1;
    });

    var html = '';
    tools.forEach(function (t) {
      html += '<li><a href="' + t.url + '" rel="noopener">' + t.name + '</a></li>';
    });
    container.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderRelatedTools();
    renderFooterTools();
  });

})();
