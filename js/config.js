// config.js — ontariomarginaltaxcalc.ca
// 2026 Canadian Tax Rates — Ontario Jurisdiction
// Source: authority-pack.json (CRA T4127, Ontario Taxation Act, ESDC)
// Jurisdiction Firewall: Ontario + Federal ONLY

const TAX_YEAR = 2026;
const PROVINCE = 'ON';

// Federal Income Tax Brackets (2026)
// Rate reduction: lowest bracket 14% (legislated July 2025, applies full 2026)
// 4th bracket effective rate 29.29% includes BPA phase-out adjustment
const FEDERAL_BRACKETS = [
  { min: 0,       max: 58523,  rate: 0.14    },
  { min: 58523,   max: 117045, rate: 0.205   },
  { min: 117045,  max: 181440, rate: 0.26    },
  { min: 181440,  max: 258482, rate: 0.2929  },
  { min: 258482,  max: Infinity, rate: 0.33  },
];

// Federal Basic Personal Amount (variable for 2026)
// BPA phases down from max ($16,452) to min ($14,829) for net income $181,440–$258,482
const FEDERAL_BPA_MAX      = 16452;
const FEDERAL_BPA_MIN      = 14829;
const FEDERAL_BPA_PHASEOUT_START = 181440;
const FEDERAL_BPA_PHASEOUT_END   = 258482;
const FEDERAL_CREDIT_RATE = 0.14;

// Ontario Income Tax Brackets (2026)
// $150,000 and $220,000 thresholds are NOT indexed
const ONTARIO_BRACKETS = [
  { min: 0,       max: 53891,  rate: 0.0505 },
  { min: 53891,   max: 107785, rate: 0.0915 },
  { min: 107785,  max: 150000, rate: 0.1116 },
  { min: 150000,  max: 220000, rate: 0.1216 },
  { min: 220000,  max: Infinity, rate: 0.1316 },
];

// Ontario Basic Personal Amount & credit rate
const ONTARIO_BPA         = 12989;
const ONTARIO_CREDIT_RATE = 0.0505;

// Ontario Surtax thresholds (applied on Ontario base tax BEFORE BPA credit deduction)
// Authority pack: surtax = max(0, ON_tax - 5818) × 0.20 + max(0, ON_tax - 7446) × 0.36
// Note: surtax is calculated BEFORE deducting dividend tax credits (changed since 2014)
const ONTARIO_SURTAX_THRESHOLD_1 = 5818;
const ONTARIO_SURTAX_THRESHOLD_2 = 7446;
const ONTARIO_SURTAX_RATE_1      = 0.20;
const ONTARIO_SURTAX_RATE_2      = 0.36;

// CPP 2026 — estimated from 2025 base + indexation (NEEDS_CONFIRMATION per authority pack)
const CPP1_RATE            = 0.0595;
const CPP1_YMPE            = 71200;
const CPP1_BASIC_EXEMPTION = 3500;
const CPP1_MAX_CONTRIBUTION = Math.round((CPP1_YMPE - CPP1_BASIC_EXEMPTION) * CPP1_RATE * 100) / 100;  // 4028.15 — self-consistent with YMPE

const CPP2_RATE            = 0.04;
const CPP2_YAMPE           = 81500;
const CPP2_MAX_CONTRIBUTION = Math.round((CPP2_YAMPE - CPP1_YMPE) * CPP2_RATE * 100) / 100;  // 412.00 — self-consistent with YAMPE

// EI 2026 — estimated from 2025 (NEEDS_CONFIRMATION per authority pack)
const EI_RATE              = 0.0164;
const EI_MIE               = 65700;
const EI_MAX_PREMIUM       = 1077.48;

// Ontario Health Premium (OHP) — tiered schedule per authority pack
// Brackets directly from Ontario Taxation Act, 2007 Division C
const OHP_SCHEDULE = [
  { min: 0,      max: 20000,  premium: 0    },
  { min: 20000,  max: 25000,  base: 0,    rate: 0.06,  threshold: 20000, cap: 300   },
  { min: 25000,  max: 36000,  premium: 300 },
  { min: 36000,  max: 38500,  base: 300,  rate: 0.06,  threshold: 36000, cap: 450   },
  { min: 38500,  max: 48000,  premium: 450 },
  { min: 48000,  max: 48600,  base: 450,  rate: 0.25,  threshold: 48000, cap: 600   },
  { min: 48600,  max: 72000,  premium: 600 },
  { min: 72000,  max: 72600,  base: 600,  rate: 0.25,  threshold: 72000, cap: 750   },
  { min: 72600,  max: 200000, premium: 750 },
  { min: 200000, max: 200600, base: 750,  rate: 0.25,  threshold: 200000, cap: 900  },
  { min: 200600, max: Infinity, premium: 900 },
];

// Export all
if (typeof module !== 'undefined') {
  module.exports = {
    TAX_YEAR, PROVINCE,
    FEDERAL_BRACKETS, FEDERAL_BPA_MAX, FEDERAL_BPA_MIN,
    FEDERAL_BPA_PHASEOUT_START, FEDERAL_BPA_PHASEOUT_END,
    FEDERAL_CREDIT_RATE,
    ONTARIO_BRACKETS, ONTARIO_BPA, ONTARIO_CREDIT_RATE,
    ONTARIO_SURTAX_THRESHOLD_1, ONTARIO_SURTAX_THRESHOLD_2,
    ONTARIO_SURTAX_RATE_1, ONTARIO_SURTAX_RATE_2,
    CPP1_RATE, CPP1_YMPE, CPP1_BASIC_EXEMPTION, CPP1_MAX_CONTRIBUTION,
    CPP2_RATE, CPP2_YAMPE, CPP2_MAX_CONTRIBUTION,
    EI_RATE, EI_MIE, EI_MAX_PREMIUM,
    OHP_SCHEDULE,
  };
}
