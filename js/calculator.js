// calculator.js — marginaltaxcalc.ca
// Ontario Marginal Tax Calculator 2026
// Computes marginal tax rate on additional income, net kept, and effective rate

(function () {
  'use strict';

  // ── Helpers ────────────────────────────────────────────────────────────────

  function calcBracketTax(income, brackets) {
    let tax = 0;
    for (const b of brackets) {
      if (income <= b.min) break;
      const taxable = Math.min(income, b.max) - b.min;
      tax += taxable * b.rate;
    }
    return tax;
  }

  function calcOntarioBasicTax(income) {
    return calcBracketTax(income, ONTARIO_BRACKETS);
  }

  function calcOntarioSurtax(ontarioBasicTax) {
    let surtax = 0;
    if (ontarioBasicTax > ONTARIO_SURTAX_THRESHOLD_1) {
      surtax += (ontarioBasicTax - ONTARIO_SURTAX_THRESHOLD_1) * ONTARIO_SURTAX_RATE_1;
    }
    if (ontarioBasicTax > ONTARIO_SURTAX_THRESHOLD_2) {
      surtax += (ontarioBasicTax - ONTARIO_SURTAX_THRESHOLD_2) * ONTARIO_SURTAX_RATE_2;
    }
    return surtax;
  }

  function calcOntarioTax(income) {
    const basic = calcOntarioBasicTax(income);
    const bpaCredit = ONTARIO_BPA * ONTARIO_CREDIT_RATE;
    const netBasic = Math.max(0, basic - bpaCredit);
    const surtax = calcOntarioSurtax(netBasic);
    return { basic, bpaCredit, netBasic, surtax, total: netBasic + surtax };
  }

  function calcFederalTax(income) {
    const gross = calcBracketTax(income, FEDERAL_BRACKETS);
    const bpaCredit = FEDERAL_BPA * FEDERAL_CREDIT_RATE;
    const net = Math.max(0, gross - bpaCredit);
    return { gross, bpaCredit, net };
  }

  function calcCPP(income) {
    // CPP1
    const cpp1Eligible = Math.min(Math.max(0, income - CPP1_BASIC_EXEMPTION), CPP1_YMPE - CPP1_BASIC_EXEMPTION);
    const cpp1 = Math.min(cpp1Eligible * CPP1_RATE, CPP1_MAX_CONTRIBUTION);

    // CPP2 — on earnings between YMPE and YAMPE
    const cpp2Eligible = Math.max(0, Math.min(income, CPP2_YAMPE) - CPP1_YMPE);
    const cpp2 = Math.min(cpp2Eligible * CPP2_RATE, CPP2_MAX_CONTRIBUTION);

    return { cpp1, cpp2, total: cpp1 + cpp2 };
  }

  function calcEI(income) {
    const premium = Math.min(income * EI_RATE, EI_MAX_PREMIUM);
    return { premium };
  }

  function calcOHP(income) {
    for (const tier of OHP_SCHEDULE) {
      if (income >= tier.min && income < tier.max) {
        if (tier.premium !== undefined) return tier.premium;
        const raw = tier.base + (income - tier.threshold) * tier.rate;
        return Math.min(raw, tier.cap);
      }
    }
    // Last tier (300k+)
    const last = OHP_SCHEDULE[OHP_SCHEDULE.length - 1];
    return last.premium;
  }

  // ── Marginal rate detection ─────────────────────────────────────────────────
  // Returns the bracket rate at a specific income point

  function getMarginalBracketRate(income, brackets) {
    let rate = brackets[0].rate;
    for (const b of brackets) {
      if (income > b.min) rate = b.rate;
      else break;
    }
    return rate;
  }

  // ── Core calculation ────────────────────────────────────────────────────────

  function calculate(currentIncome, additionalIncome) {
    if (currentIncome < 0 || additionalIncome <= 0) return null;

    const newIncome = currentIncome + additionalIncome;

    // Tax at current income
    const fedCurrent  = calcFederalTax(currentIncome);
    const ontCurrent  = calcOntarioTax(currentIncome);
    const cppCurrent  = calcCPP(currentIncome);
    const eiCurrent   = calcEI(currentIncome);
    const ohpCurrent  = calcOHP(currentIncome);

    const totalTaxCurrent = fedCurrent.net + ontCurrent.total + cppCurrent.total + eiCurrent.premium + ohpCurrent;

    // Tax at new income
    const fedNew  = calcFederalTax(newIncome);
    const ontNew  = calcOntarioTax(newIncome);
    const cppNew  = calcCPP(newIncome);
    const eiNew   = calcEI(newIncome);
    const ohpNew  = calcOHP(newIncome);

    const totalTaxNew = fedNew.net + ontNew.total + cppNew.total + eiNew.premium + ohpNew;

    // Incremental taxes on the additional income
    const fedIncremental  = fedNew.net - fedCurrent.net;
    const ontIncremental  = ontNew.total - ontCurrent.total;
    const ontSurtaxIncremental = ontNew.surtax - ontCurrent.surtax;
    const cppIncremental  = cppNew.total - cppCurrent.total;
    const eiIncremental   = eiNew.premium - eiCurrent.premium;
    const ohpIncremental  = ohpNew - ohpCurrent;

    const totalIncremental = fedIncremental + ontIncremental + cppIncremental + eiIncremental + ohpIncremental;
    const marginalRate = totalIncremental / additionalIncome;

    // Marginal bracket rates at the top of current income
    const fedBracketRate = getMarginalBracketRate(currentIncome + 1, FEDERAL_BRACKETS);
    const ontBracketRate = getMarginalBracketRate(currentIncome + 1, ONTARIO_BRACKETS);

    // Net kept
    const netKept = additionalIncome - totalIncremental;

    // Effective rate on new total income
    const effectiveRate = newIncome > 0 ? totalTaxNew / newIncome : 0;

    return {
      currentIncome,
      additionalIncome,
      newIncome,

      // Marginal breakdown
      fedBracketRate,
      ontBracketRate,
      ontSurtaxIncremental,
      cppIncremental,
      eiIncremental,
      ohpIncremental,
      fedIncremental,
      ontIncremental,
      totalIncremental,
      marginalRate,

      // Net
      netKept,

      // Effective
      effectiveRate,
      totalTaxNew,
    };
  }

  // ── Formatting ──────────────────────────────────────────────────────────────

  function fmt(n, decimals = 2) {
    return n.toLocaleString('en-CA', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function fmtDollar(n) {
    return '$' + fmt(Math.abs(n), 2);
  }

  function fmtPct(n) {
    return (n * 100).toFixed(2) + '%';
  }

  // ── DOM ─────────────────────────────────────────────────────────────────────

  function getEl(id) { return document.getElementById(id); }

  function showError(msg) {
    const el = getEl('error-msg');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function hideError() {
    const el = getEl('error-msg');
    if (el) el.style.display = 'none';
  }

  function renderResults(r) {
    getEl('results').style.display = 'block';

    // Header summary
    getEl('res-marginal-rate').textContent   = fmtPct(r.marginalRate);
    getEl('res-net-kept').textContent        = fmtDollar(r.netKept);
    getEl('res-effective-rate').textContent  = fmtPct(r.effectiveRate);
    getEl('res-total-tax').textContent       = fmtDollar(r.totalTaxNew);

    // Breakdown
    getEl('bd-fed-bracket').textContent      = fmtPct(r.fedBracketRate);
    getEl('bd-ont-bracket').textContent      = fmtPct(r.ontBracketRate);
    getEl('bd-ont-surtax').textContent       = r.ontSurtaxIncremental > 0
      ? '+' + fmtDollar(r.ontSurtaxIncremental)
      : '$0.00';
    getEl('bd-cpp').textContent              = r.cppIncremental > 0
      ? fmtDollar(r.cppIncremental)
      : '$0.00';
    getEl('bd-ei').textContent               = r.eiIncremental > 0
      ? fmtDollar(r.eiIncremental)
      : '$0.00';
    getEl('bd-ohp').textContent              = r.ohpIncremental > 0
      ? fmtDollar(r.ohpIncremental)
      : '$0.00';
    getEl('bd-fed-tax').textContent          = fmtDollar(r.fedIncremental);
    getEl('bd-ont-tax').textContent          = fmtDollar(r.ontIncremental);
    getEl('bd-total').textContent            = fmtDollar(r.totalIncremental);

    // Sanity bar
    const keptPct = Math.max(0, Math.min(100, (r.netKept / r.additionalIncome) * 100));
    const taxPct  = 100 - keptPct;
    const barKept = getEl('bar-kept');
    const barTax  = getEl('bar-tax');
    if (barKept) barKept.style.width = keptPct.toFixed(1) + '%';
    if (barTax)  barTax.style.width  = taxPct.toFixed(1) + '%';
    const barKeptLabel = getEl('bar-kept-label');
    const barTaxLabel  = getEl('bar-tax-label');
    if (barKeptLabel) barKeptLabel.textContent = 'You keep ' + keptPct.toFixed(1) + '%';
    if (barTaxLabel)  barTaxLabel.textContent  = 'Tax ' + taxPct.toFixed(1) + '%';
  }

  function handleSubmit(e) {
    e.preventDefault();
    hideError();

    const currentRaw     = getEl('input-current').value.replace(/[^0-9.]/g, '');
    const additionalRaw  = getEl('input-additional').value.replace(/[^0-9.]/g, '');

    const currentIncome    = parseFloat(currentRaw) || 0;
    const additionalIncome = parseFloat(additionalRaw) || 0;

    if (additionalIncome <= 0) {
      showError('Please enter an additional income amount greater than $0.');
      return;
    }
    if (currentIncome < 0) {
      showError('Current income cannot be negative.');
      return;
    }
    if (currentIncome + additionalIncome > 10000000) {
      showError('Income values seem unusually large. Please check your entries.');
      return;
    }

    const result = calculate(currentIncome, additionalIncome);
    if (!result) {
      showError('Unable to calculate. Please check your inputs.');
      return;
    }

    renderResults(result);
    getEl('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Number formatting on inputs ─────────────────────────────────────────────

  function formatInputOnBlur(inputEl) {
    const raw = parseFloat(inputEl.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(raw)) {
      inputEl.value = raw.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  }

  function stripFormatOnFocus(inputEl) {
    const raw = inputEl.value.replace(/[^0-9.]/g, '');
    inputEl.value = raw;
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    const form = getEl('tax-form');
    if (form) form.addEventListener('submit', handleSubmit);

    ['input-current', 'input-additional'].forEach(function (id) {
      const el = getEl(id);
      if (!el) return;
      el.addEventListener('blur',  function () { formatInputOnBlur(el); });
      el.addEventListener('focus', function () { stripFormatOnFocus(el); });
    });
  });

})();
