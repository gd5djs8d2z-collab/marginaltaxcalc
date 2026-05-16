// config.js — marginaltaxcalc.ca
// 2026 Canadian Tax Rates — Ontario Jurisdiction
// Source: CRA T4032-ON, ESDC EI/CPP bulletins

const TAX_YEAR = 2026;
const PROVINCE = 'ON';

// Federal Income Tax Brackets (2026)
const FEDERAL_BRACKETS = [
  { min: 0,       max: 58523,  rate: 0.15   },
  { min: 58523,   max: 117045, rate: 0.205  },
  { min: 117045,  max: 181440, rate: 0.26   },
  { min: 181440,  max: 258482, rate: 0.29   },
  { min: 258482,  max: Infinity, rate: 0.33 },
];

// Federal Basic Personal Amount & credit rate
const FEDERAL_BPA        = 16452;
const FEDERAL_BPA_CREDIT = 0.15; // 15% credit rate (note: spec says 14% — using 15% per CRA T1 Gen 2026; locking at 14% per spec)
// LOCKED per build spec: 14%
const FEDERAL_CREDIT_RATE = 0.14;

// Ontario Income Tax Brackets (2026)
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

// Ontario Surtax thresholds (applied on Ontario basic tax before surtax)
const ONTARIO_SURTAX_THRESHOLD_1 = 5818;  // 20% surtax on Ontario tax above this
const ONTARIO_SURTAX_THRESHOLD_2 = 7446;  // additional 36% on Ontario tax above this
const ONTARIO_SURTAX_RATE_1      = 0.20;
const ONTARIO_SURTAX_RATE_2      = 0.36;

// CPP 2026
const CPP1_RATE            = 0.0595;
const CPP1_YMPE            = 74600;
const CPP1_BASIC_EXEMPTION = 3500;
const CPP1_MAX_CONTRIBUTION = 4230.45;

const CPP2_RATE            = 0.04;
const CPP2_YAMPE           = 85000;
const CPP2_MAX_CONTRIBUTION = 416.00;

// EI 2026
const EI_RATE              = 0.0163;
const EI_MIE               = 68900;
const EI_MAX_PREMIUM       = 1123.07;

// Ontario Health Premium (OHP) — tiered schedule
// Each entry: { incomeMin, incomeMax, base, rate, threshold }
// Premium = base + rate * (income - threshold), capped at next tier base or max
const OHP_SCHEDULE = [
  { min: 0,      max: 20000,  premium: 0    },
  { min: 20000,  max: 36000,  base: 0,    rate: 0.06,  threshold: 20000, cap: 300   },
  { min: 36000,  max: 48000,  base: 300,  rate: 0.00,  threshold: 36000, cap: 300   },
  { min: 48000,  max: 72000,  base: 300,  rate: 0.06,  threshold: 48000, cap: 750   },
  { min: 72000,  max: 200000, base: 750,  rate: 0.25,  threshold: 72000, cap: 900   },
  { min: 200000, max: 300000, base: 900,  rate: 0.25,  threshold: 200000, cap: 900  },
  { min: 300000, max: Infinity, premium: 900 },
];

// Export all
if (typeof module !== 'undefined') {
  module.exports = {
    TAX_YEAR, PROVINCE,
    FEDERAL_BRACKETS, FEDERAL_BPA, FEDERAL_CREDIT_RATE,
    ONTARIO_BRACKETS, ONTARIO_BPA, ONTARIO_CREDIT_RATE,
    ONTARIO_SURTAX_THRESHOLD_1, ONTARIO_SURTAX_THRESHOLD_2,
    ONTARIO_SURTAX_RATE_1, ONTARIO_SURTAX_RATE_2,
    CPP1_RATE, CPP1_YMPE, CPP1_BASIC_EXEMPTION, CPP1_MAX_CONTRIBUTION,
    CPP2_RATE, CPP2_YAMPE, CPP2_MAX_CONTRIBUTION,
    EI_RATE, EI_MIE, EI_MAX_PREMIUM,
    OHP_SCHEDULE,
  };
}
