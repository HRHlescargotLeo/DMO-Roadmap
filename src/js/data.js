/* ==========================================================================
   data.js — sample data for the DMO prototypes.

   Gilt names, operation dates and the 2026-27 remit figures come from
   dmo.gov.uk (publications list, 1 October 2026; remit revision of
   23 April 2026). Everything else — amounts in issue, ISINs, prices,
   auction results, PWLB rates — is SAMPLE data, invented to show the
   layout, and is labelled as such on every page.
   ========================================================================== */

/* Gilts in issue (sample). type: conventional | index-linked | green.
   ISINs are deliberately fake (GB00SMPL…). */
window.DMO_GILTS = [
  { id: 'tg29a', name: '0½% Treasury Gilt 2029', type: 'conventional', coupon: 0.5, redemption: '2029-01-31', firstIssue: '2020-10-21', amount: 37812, isin: 'GB00SMPL0101', price: 92.41 },
  { id: 'tg29b', name: '4⅛% Treasury Gilt 2029', type: 'conventional', coupon: 4.125, redemption: '2029-07-22', firstIssue: '2023-11-08', amount: 41250, isin: 'GB00SMPL0102', price: 100.87 },
  { id: 'tg31', name: '4% Treasury Gilt 2031', type: 'conventional', coupon: 4, redemption: '2031-10-22', firstIssue: '2024-06-05', amount: 39400, isin: 'GB00SMPL0103', price: 99.62 },
  { id: 'tg32', name: '4⅝% Treasury Gilt 2032', type: 'conventional', coupon: 4.625, redemption: '2032-06-07', firstIssue: '2025-09-17', amount: 33750, isin: 'GB00SMPL0104', price: 102.05 },
  { id: 'gg33', name: '0⅞% Green Gilt 2033', type: 'green', coupon: 0.875, redemption: '2033-07-31', firstIssue: '2021-09-21', amount: 33200, isin: 'GB00SMPL0105', price: 78.33 },
  { id: 'tg35', name: '4½% Treasury Gilt 2035', type: 'conventional', coupon: 4.5, redemption: '2035-03-07', firstIssue: '2024-01-10', amount: 42150, isin: 'GB00SMPL0106', price: 100.14 },
  { id: 'il35', name: '1⅛% Index-linked Treasury Gilt 2035', type: 'index-linked', coupon: 1.125, redemption: '2035-11-22', firstIssue: '2025-02-12', amount: 15600, isin: 'GB00SMPL0107', price: 97.18 },
  { id: 'tg36', name: '4⅞% Treasury Gilt 2036', type: 'conventional', coupon: 4.875, redemption: '2036-03-07', firstIssue: '2026-04-15', amount: 21900, isin: 'GB00SMPL0108', price: 101.36 },
  { id: 'il38', name: '1¾% Index-linked Treasury Gilt 2038', type: 'index-linked', coupon: 1.75, redemption: '2038-09-22', firstIssue: '2025-06-24', amount: 14200, isin: 'GB00SMPL0109', price: 98.02 },
  { id: 'tg40', name: '4¼% Treasury Gilt 2040', type: 'conventional', coupon: 4.25, redemption: '2040-12-07', firstIssue: '2008-03-11', amount: 38900, isin: 'GB00SMPL0110', price: 93.70 },
  { id: 'tg45', name: '4⅜% Treasury Gilt 2045', type: 'conventional', coupon: 4.375, redemption: '2045-01-31', firstIssue: '2025-05-14', amount: 18850, isin: 'GB00SMPL0111', price: 91.84 },
  { id: 'gg53', name: '1½% Green Gilt 2053', type: 'green', coupon: 1.5, redemption: '2053-07-31', firstIssue: '2021-10-21', amount: 31950, isin: 'GB00SMPL0112', price: 47.66 },
  { id: 'tg54', name: '4⅜% Treasury Gilt 2054', type: 'conventional', coupon: 4.375, redemption: '2054-07-31', firstIssue: '2023-10-03', amount: 30200, isin: 'GB00SMPL0113', price: 87.25 },
  { id: 'tg60', name: '4% Treasury Gilt 2060', type: 'conventional', coupon: 4, redemption: '2060-01-22', firstIssue: '2009-10-22', amount: 32400, isin: 'GB00SMPL0114', price: 80.91 },
  { id: 'il68', name: '0⅛% Index-linked Treasury Gilt 2068', type: 'index-linked', coupon: 0.125, redemption: '2068-03-22', firstIssue: '2015-03-25', amount: 14650, isin: 'GB00SMPL0115', price: 38.47 }
];

/* Gilt operations. Names, dates and sizes for September and the 7 October
   tender come from DMO publications; later dates and all results are sample. */
window.DMO_OPS = [
  { id: 'op-0915-tg40', date: '2026-09-15', method: 'Tender', gilt: 'tg40', size: 'up to £750 million', status: 'complete' },
  { id: 'op-0915-tg29', date: '2026-09-15', method: 'Tender', gilt: 'tg29a', size: 'up to £1,250 million', status: 'complete' },
  { id: 'op-0922-tg32', date: '2026-09-22', method: 'Auction', gilt: 'tg32', size: '£4,750 million', status: 'complete' },
  { id: 'op-0929-tg36', date: '2026-09-29', method: 'Auction', gilt: 'tg36', size: '£4,250 million', status: 'complete' },
  { id: 'op-1006-il35', date: '2026-10-06', method: 'Auction', gilt: 'il35', size: '£1,250 million', status: 'announced', sample: true },
  { id: 'op-1007-tender', date: '2026-10-07', method: 'Tender', gilt: null, giltLabel: 'Conventional gilt (to be confirmed)', size: 'To be announced', status: 'consultation' },
  { id: 'op-1013-tg31', date: '2026-10-13', method: 'Auction', gilt: 'tg31', size: '£4,000 million', status: 'planned', sample: true },
  { id: 'op-1020-il38', date: '2026-10-20', method: 'Syndication', gilt: 'il38', size: 'Around £3,500 million', status: 'planned', sample: true },
  { id: 'op-1027-tg45', date: '2026-10-27', method: 'Auction', gilt: 'tg45', size: '£3,250 million', status: 'planned', sample: true },
  { id: 'op-1103-gg33', date: '2026-11-03', method: 'Auction', gilt: 'gg33', size: '£3,000 million', status: 'planned', sample: true },
  { id: 'op-1110-tg29b', date: '2026-11-10', method: 'Auction', gilt: 'tg29b', size: '£4,500 million', status: 'planned', sample: true },
  { id: 'op-1117-tg54', date: '2026-11-17', method: 'Auction', gilt: 'tg54', size: '£2,750 million', status: 'planned', sample: true }
];

/* Sample auction results, keyed by operation id. */
window.DMO_RESULTS = {
  'op-0929-tg36': { cover: 3.12, avgPrice: 101.362, lowPrice: 101.330, tail: 0.3, avgYield: 4.693, highYield: 4.697, allocatedAtLowest: 41, paofTaken: 1062.5, paofMax: 1062.5 },
  'op-0922-tg32': { cover: 2.94, avgPrice: 102.051, lowPrice: 102.020, tail: 0.5, avgYield: 4.271, highYield: 4.276, allocatedAtLowest: 36, paofTaken: 1187.5, paofMax: 1187.5 }
};

/* 2026-27 financing remit, revised 23 April 2026 (real figures, £ billion).
   "sold" figures are SAMPLE. */
window.DMO_REMIT = {
  revised: '2026-04-23',
  total: 246.2,
  rows: [
    { key: 'short', label: 'Short conventional', planned: 95.0, sold: 51.6 },
    { key: 'medium', label: 'Medium conventional', planned: 76.0, sold: 40.9, note: 'includes £12.0 billion of green gilts' },
    { key: 'long', label: 'Long conventional', planned: 22.4, sold: 11.8 },
    { key: 'il', label: 'Index-linked', planned: 23.0, sold: 11.2 },
    { key: 'unallocated', label: 'Unallocated', planned: 29.8, sold: 6.5 }
  ],
  tbill: 5.0,
  nfr: 251.2
};

/* PWLB rates (SAMPLE), % a year, by maturity. Two sets: 9:30am and 12:30pm. */
window.DMO_PWLB = {
  published: '1 October 2026, 9:30am',
  previous: '30 September 2026, 12:30pm',
  terms: [1, 5, 10, 15, 20, 25, 30, 40, 50],
  types: {
    maturity: { label: 'Maturity', certainty: [4.81, 4.92, 5.34, 5.71, 5.96, 6.03, 6.02, 5.88, 5.61], change: [-0.02, -0.03, -0.01, 0.00, 0.01, 0.01, 0.02, 0.02, 0.01] },
    eip: { label: 'Equal instalments of principal (EIP)', certainty: [4.79, 4.85, 5.02, 5.21, 5.39, 5.52, 5.61, 5.70, 5.71], change: [-0.02, -0.02, -0.03, -0.02, -0.01, 0.00, 0.00, 0.01, 0.01] },
    annuity: { label: 'Annuity', certainty: [4.79, 4.86, 5.05, 5.26, 5.45, 5.58, 5.66, 5.73, 5.72], change: [-0.02, -0.02, -0.02, -0.01, -0.01, 0.00, 0.01, 0.01, 0.01] }
  },
  /* Margins over the certainty rate (sample assumptions for the prototype). */
  margins: { certainty: 0, standard: 0.20, hra: -0.40 }
};

/* Data catalogue. Report codes are the DMO's own; descriptions and formats
   are as proposed. */
window.DMO_DATASETS = [
  { name: 'Gilts in issue', code: 'D1A', topic: 'Gilts', freq: 'Every working day', updated: '30 September 2026', href: 'gilts-in-issue.html', desc: 'Every gilt in issue on a given date, with ISIN, coupon, redemption date and nominal amount.' },
  { name: 'Results of gilt operations', code: 'D2.1E', topic: 'Operations', freq: 'After each operation', updated: '29 September 2026', href: 'operations-calendar.html', desc: 'Auctions, syndications and tenders, with cover, prices and yields.' },
  { name: 'Redemption details', code: 'D1C', topic: 'Gilts', freq: 'When a gilt redeems', updated: '7 September 2026', href: '#', desc: 'Final amount outstanding of each redeemed gilt and its redemption date.' },
  { name: 'Future redemptions profile', code: 'D8B', topic: 'Gilts', freq: 'Monthly', updated: '1 September 2026', href: '#', desc: 'Total gilts in market hands due to redeem in each future financial year.' },
  { name: 'Historical prices and yields', code: 'D10A', topic: 'Prices and yields', freq: 'Every working day', updated: '30 September 2026', href: '#', desc: 'Reference prices and yields for every gilt, back to 1998.' },
  { name: 'Purchase and Sale Service prices', code: 'D10B', topic: 'Prices and yields', freq: 'Every working day', updated: '30 September 2026', href: 'gilt-value.html', desc: 'Daily prices used by the retail Purchase and Sale Service.' },
  { name: 'Index-linked gilts: index ratios', code: 'D4H', topic: 'Gilts', freq: 'Every working day', updated: '30 September 2026', href: '#', desc: 'Index ratios and reference RPI values for index-linked gilts.' },
  { name: 'Turnover', code: 'D6', topic: 'Market activity', freq: 'Quarterly', updated: '31 July 2026', href: '#', desc: 'Secondary market turnover by gilt type and maturity.' },
  { name: 'Gross and net issuance', code: 'D2.2', topic: 'Operations', freq: 'Annual', updated: '30 April 2026', href: 'remit.html', desc: 'Gilt issuance by type and maturity in each financial year since 1998-99.' },
  { name: 'Treasury bill tender results', code: 'D3', topic: 'Money markets', freq: 'Weekly', updated: '25 September 2026', href: '#', desc: 'Weekly Treasury bill tenders: amounts, cover and yields.' },
  { name: 'Standing repo facility use', code: 'D2.1PROF5', topic: 'Money markets', freq: 'When used', updated: '18 September 2026', href: '#', desc: 'Each use of the standing and special repo facilities.' },
  { name: 'PWLB interest rates', code: 'PWLB', topic: 'Local authority lending', freq: 'Twice each working day', updated: '1 October 2026', href: 'pwlb-rates.html', desc: 'Fixed, variable and NLF rates for loans to local authorities.' }
];

window.DMO_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
