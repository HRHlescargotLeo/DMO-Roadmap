/* ==========================================================================
   dmo.js — behaviour for the UK DMO prototypes.

   Each init function looks for its page's root element and does nothing if
   it isn't there, so one file serves every page. Data comes from data.js
   (sample data, labelled as such on the pages).
   ========================================================================== */

(function () {
  'use strict';

  var GILTS = window.DMO_GILTS || [];
  var OPS = window.DMO_OPS || [];
  var RESULTS = window.DMO_RESULTS || {};
  var REMIT = window.DMO_REMIT || { rows: [] };
  var PWLB = window.DMO_PWLB || { terms: [], types: {} };
  var DATASETS = window.DMO_DATASETS || [];
  var MONTHS = window.DMO_MONTHS || [];
  var TODAY = '2026-10-01'; /* the prototypes are pinned to the review date */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function param(name) { return window.WF ? window.WF.param(name) : null; }
  function toast(msg) { if (window.WF) window.WF.toast(msg); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* GOV.UK date style: 29 September 2026 */
  function fmtDate(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function fmtShortDay(iso) {
    var d = new Date(iso + 'T12:00:00');
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()] + ' ' + fmtDate(iso);
  }
  function num(n, dp) {
    return Number(n).toLocaleString('en-GB', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  }
  function money(n, dp) { return '£' + num(n, dp === undefined ? 2 : dp); }
  function gilt(id) { for (var i = 0; i < GILTS.length; i++) { if (GILTS[i].id === id) return GILTS[i]; } return null; }
  function op(id) { for (var i = 0; i < OPS.length; i++) { if (OPS[i].id === id) return OPS[i]; } return null; }
  function opName(o) { var g = gilt(o.gilt); return g ? g.name : o.giltLabel; }
  function yearsBetween(a, b) { return (new Date(b) - new Date(a)) / (365.25 * 24 * 3600 * 1000); }
  function bucket(g, asOf) {
    var y = yearsBetween(asOf, g.redemption);
    return y < 7 ? 'short' : (y <= 15 ? 'medium' : 'long');
  }
  var BUCKET_LABEL = { short: 'Short (up to 7 years)', medium: 'Medium (7 to 15 years)', long: 'Long (over 15 years)' };
  var TYPE_LABEL = { conventional: 'Conventional', 'index-linked': 'Index-linked', green: 'Green' };

  /* Shows a GOV.UK style error summary and field errors.
     errors: [{ id: 'field-id', msg: 'text', field: wrapperElement }] */
  function showErrors(summary, errors) {
    $all('.field.has-error', summary.parentNode).forEach(function (f) { f.classList.remove('has-error'); });
    $all('.field-error[data-dyn]', summary.parentNode).forEach(function (e) { e.remove(); });
    $all('input.is-error', summary.parentNode).forEach(function (i) { i.classList.remove('is-error'); i.removeAttribute('aria-invalid'); });
    if (!errors.length) { summary.hidden = true; return; }
    var list = $('ul', summary);
    list.innerHTML = errors.map(function (e) { return '<li><a href="#' + e.id + '">' + esc(e.msg) + '</a></li>'; }).join('');
    errors.forEach(function (e) {
      var input = document.getElementById(e.id);
      if (input) { input.classList.add('is-error'); input.setAttribute('aria-invalid', 'true'); }
      if (e.field && !e.field.classList.contains('has-error')) {
        e.field.classList.add('has-error');
        var p = document.createElement('p');
        p.className = 'field-error';
        p.setAttribute('data-dyn', '');
        p.innerHTML = '<span class="visually-hidden">Error:</span> ' + esc(e.msg);
        var ref = $('.field-hint', e.field) || $('legend, label', e.field);
        if (ref) ref.parentNode.insertBefore(p, ref.nextSibling);
        else e.field.insertBefore(p, e.field.firstChild);
      }
    });
    summary.hidden = false;
    summary.focus();
    $all('a', summary).forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var t = document.getElementById(a.getAttribute('href').slice(1));
        if (t) t.focus();
      });
    });
  }

  /* ----------------------------------------------------------------------
     1. Gilts in issue (R10–R15)
     ---------------------------------------------------------------------- */
  function initGilts() {
    var app = document.getElementById('gilts-app');
    if (!app) return;
    var state = { asOf: '2026-09-30', sort: 'redemption', dir: 1 };
    var body = $('#gilts-body', app);
    var foot = $('#gilts-total', app);
    var count = $('#gilts-count', app);
    var q = $('#gilts-search', app);
    var mat = $('#gilts-maturity', app);
    var typeBoxes = $all('input[name="gilt-type"]', app);

    function rows() {
      var types = typeBoxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
      var term = (q.value || '').trim().toLowerCase();
      var list = GILTS.filter(function (g) {
        if (g.firstIssue > state.asOf || g.redemption <= state.asOf) return false;
        if (types.indexOf(g.type) === -1) return false;
        if (mat.value !== 'all' && bucket(g, state.asOf) !== mat.value) return false;
        if (term && (g.name.toLowerCase().indexOf(term) === -1 && g.isin.toLowerCase().indexOf(term) === -1)) return false;
        return true;
      });
      list.sort(function (a, b) {
        var k = state.sort, va = a[k], vb = b[k];
        if (k === 'name') { va = a.redemption; vb = b.redemption; }
        return (va > vb ? 1 : va < vb ? -1 : 0) * state.dir;
      });
      return list;
    }

    function render() {
      var list = rows();
      var total = 0;
      body.innerHTML = list.map(function (g) {
        total += g.amount;
        return '<tr>' +
          '<th scope="row">' + esc(g.name) + '<br><a href="gilt-value.html?gilt=' + g.id + '" class="wf-meta">Value a holding<span class="visually-hidden"> of ' + esc(g.name) + '</span></a></th>' +
          '<td class="mono">' + g.isin + '</td>' +
          '<td>' + TYPE_LABEL[g.type] + '</td>' +
          '<td>' + fmtDate(g.redemption) + '</td>' +
          '<td>' + fmtDate(g.firstIssue) + '</td>' +
          '<td class="n">' + num(g.amount) + '</td></tr>';
      }).join('') || '<tr><td colspan="6">No gilts match these filters. <button type="button" class="btn-link" data-reset>Clear filters</button></td></tr>';
      foot.textContent = num(total);
      count.textContent = 'Showing ' + list.length + ' of ' + GILTS.filter(function (g) { return g.firstIssue <= state.asOf && g.redemption > state.asOf; }).length + ' gilts';
      $all('th[data-sort]', app).forEach(function (th) {
        th.setAttribute('aria-sort', th.getAttribute('data-sort') === state.sort ? (state.dir === 1 ? 'ascending' : 'descending') : 'none');
      });
      renderChart(list);
      var reset = $('[data-reset]', body);
      if (reset) reset.addEventListener('click', clearFilters);
    }

    function renderChart(list) {
      var host = $('#gilts-chart', app);
      if (!host) return;
      var sums = { short: 0, medium: 0, long: 0 };
      list.forEach(function (g) { sums[bucket(g, state.asOf)] += g.amount; });
      var max = Math.max(sums.short, sums.medium, sums.long, 1);
      host.innerHTML = ['short', 'medium', 'long'].map(function (k) {
        return '<div class="hbar"><span>' + BUCKET_LABEL[k] + '</span><span class="track"><span class="fill" style="width:' + (sums[k] / max * 100).toFixed(1) + '%"></span></span><span class="val">£' + num(sums[k]) + 'm</span></div>';
      }).join('');
    }

    function clearFilters() {
      typeBoxes.forEach(function (b) { b.checked = true; });
      mat.value = 'all';
      q.value = '';
      render();
    }

    typeBoxes.forEach(function (b) { b.addEventListener('change', render); });
    mat.addEventListener('change', render);
    q.addEventListener('input', render);
    $('#gilts-clear', app).addEventListener('click', clearFilters);
    $all('th[data-sort] .sort-btn', app).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.parentNode.getAttribute('data-sort');
        state.dir = state.sort === k ? -state.dir : 1;
        state.sort = k;
        render();
      });
    });

    /* Date input with validation (R13) */
    var form = $('#cob-form', app);
    var summary = $('#cob-errors', app);
    var field = $('#cob-field', app);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = $('#cob-day', app).value.trim(), m = $('#cob-month', app).value.trim(), y = $('#cob-year', app).value.trim();
      var errs = [];
      if (!d && !m && !y) errs.push({ id: 'cob-day', msg: 'Enter the date you want gilts in issue for', field: field });
      else if (!d) errs.push({ id: 'cob-day', msg: 'Date must include a day', field: field });
      else if (!m) errs.push({ id: 'cob-month', msg: 'Date must include a month', field: field });
      else if (!/^\d{4}$/.test(y)) errs.push({ id: 'cob-year', msg: 'Year must include 4 numbers', field: field });
      var iso = null;
      if (!errs.length) {
        var dt = new Date(+y, +m - 1, +d);
        if (isNaN(dt) || dt.getDate() !== +d || dt.getMonth() !== +m - 1) errs.push({ id: 'cob-day', msg: 'Date must be a real date', field: field });
        else {
          iso = y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
          if (iso > '2026-09-30') errs.push({ id: 'cob-day', msg: 'Date must be 30 September 2026 or earlier', field: field });
          else if (iso < '1998-04-01') errs.push({ id: 'cob-year', msg: 'Date must be 1 April 1998 or later', field: field });
        }
      }
      showErrors(summary, errs);
      if (errs.length) return;
      /* Non-working days roll back to the previous working day */
      var dt2 = new Date(iso + 'T12:00:00');
      var note = '';
      while (dt2.getDay() === 0 || dt2.getDay() === 6) { dt2.setDate(dt2.getDate() - 1); note = ' (the previous working day)'; }
      state.asOf = dt2.getFullYear() + '-' + ('0' + (dt2.getMonth() + 1)).slice(-2) + '-' + ('0' + dt2.getDate()).slice(-2);
      $all('[data-asof]', app).forEach(function (el) { el.textContent = fmtDate(state.asOf) + (el.hasAttribute('data-asof-note') ? note : ''); });
      $('#gilts-latest', app).hidden = state.asOf === '2026-09-30';
      render();
      toast('Showing gilts in issue at close of business on ' + fmtDate(state.asOf));
    });
    $('#gilts-latest-link', app).addEventListener('click', function (e) {
      e.preventDefault();
      $('#cob-day', app).value = '30'; $('#cob-month', app).value = '9'; $('#cob-year', app).value = '2026';
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit'));
    });

    render();
  }

  /* ----------------------------------------------------------------------
     1b. Data catalogue (R16)
     ---------------------------------------------------------------------- */
  function initCatalogue() {
    var app = document.getElementById('cat-app');
    if (!app) return;
    var chips = $all('.chip[data-topic]', app);
    var input = $('#cat-search', app);
    var list = $('#cat-list', app);
    var count = $('#cat-count', app);
    var topic = 'All';
    function render() {
      var term = input.value.trim().toLowerCase();
      var items = DATASETS.filter(function (d) {
        if (topic !== 'All' && d.topic !== topic) return false;
        if (term && (d.name + ' ' + d.desc + ' ' + d.code).toLowerCase().indexOf(term) === -1) return false;
        return true;
      });
      count.textContent = items.length + (items.length === 1 ? ' dataset' : ' datasets');
      list.innerHTML = items.map(function (d) {
        return '<li><h3><a href="' + d.href + '">' + esc(d.name) + '</a></h3>' +
          '<p class="mb-0">' + esc(d.desc) + '</p>' +
          '<div class="cat-meta"><span>Topic: <b>' + d.topic + '</b></span><span>Updated: <b>' + d.freq.toLowerCase() + '</b></span><span>Last updated: <b>' + d.updated + '</b></span><span>Report code: <span class="code">' + d.code + '</span></span></div>' +
          '<div class="cat-meta"><span>Formats: HTML table, CSV, ODS, XLSX, PDF, API</span></div></li>';
      }).join('') || '<li><p class="mb-0">No datasets match. Try a different word, or <button type="button" class="btn-link" id="cat-reset">show all datasets</button>.</p></li>';
      var r = document.getElementById('cat-reset');
      if (r) r.addEventListener('click', function () { input.value = ''; setTopic('All'); });
    }
    function setTopic(t) {
      topic = t;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-topic') === t ? 'true' : 'false'); });
      render();
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { setTopic(c.getAttribute('data-topic')); }); });
    input.addEventListener('input', render);
    render();
  }

  /* ----------------------------------------------------------------------
     2. A single gilt operation (R20, R21)
     ---------------------------------------------------------------------- */
  function initOperation() {
    var app = document.getElementById('op-app');
    if (!app) return;
    var o = op(param('op')) || op('op-0929-tg36');
    var g = gilt(o.gilt);
    var res = RESULTS[o.id];
    var done = o.status === 'complete';
    var name = opName(o);
    var title = (o.method === 'Tender' ? 'Tender of ' : o.method === 'Syndication' ? 'Syndication of ' : 'Auction of ') + name;

    $all('[data-op="title"]', app).forEach(function (el) { el.textContent = title; });
    document.title = title + ' – UK DMO prototype';
    $('[data-op="status"]', app).innerHTML = done ? '<span class="tag solid">Result published</span>' : (o.status === 'consultation' ? '<span class="tag">Consultation open</span>' : '<span class="tag">Announced</span>');
    if (o.sample) $('[data-op="status"]', app).innerHTML += ' <span class="tag sample">Sample date</span>';

    var facts = [
      ['Gilt', name],
      ['ISIN', g ? '<span class="code">' + g.isin + '</span> <span class="tag sample">Sample</span>' : 'To be announced'],
      ['Method', o.method],
      ['Size', o.size],
      [o.method === 'Syndication' ? 'Pricing date' : 'Date', fmtShortDay(o.date)],
      ['Bidding window', o.method === 'Auction' ? '10:00am to 11:00am <span class="tag sample">Sample</span>' : 'See the announcement'],
      ['Redemption date', g ? fmtDate(g.redemption) : 'To be announced'],
      ['Settlement', o.method === 'Auction' ? 'The next working day <span class="tag sample">Sample</span>' : 'See the announcement']
    ];
    $('#op-facts', app).innerHTML = facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('');

    var annDate = new Date(o.date + 'T12:00:00'); annDate.setDate(annDate.getDate() - 7);
    var annIso = annDate.getFullYear() + '-' + ('0' + (annDate.getMonth() + 1)).slice(-2) + '-' + ('0' + annDate.getDate()).slice(-2);
    var steps = [
      { t: 'In the issuance calendar', w: 'Published with the quarterly calendar', d: true, p: 'Gilt and date confirmed in the calendar for this quarter.' },
      { t: 'Announced, with prospectus', w: fmtDate(annIso), d: o.status !== 'planned' && o.status !== 'consultation', p: 'Size confirmed and the prospectus published.' },
      { t: o.method === 'Syndication' ? 'Books open and pricing' : 'Bidding', w: fmtDate(o.date), d: done, p: o.method === 'Auction' ? 'Primary dealers bid on behalf of themselves and clients.' : 'See the announcement for the timetable.' },
      { t: 'Result', w: fmtDate(o.date), d: done, p: done ? 'Result published below, in this page.' : 'The result will appear on this page as soon as it is published, and by email to alert subscribers.' }
    ];
    if (o.method === 'Auction') steps.push({ t: 'Post-auction option facility', w: fmtDate(o.date), d: done, p: done ? 'Successful bidders took up the option; the amount is shown below.' : 'Successful bidders may buy up to an extra 25% of the amount they were allocated.' });
    $('#op-timeline', app).innerHTML = steps.map(function (s) {
      return '<li class="' + (s.d ? 'done' : '') + '"><h3>' + s.t + (s.d ? ' <span class="visually-hidden">(done)</span>' : '') + '</h3><span class="when">' + s.w + '</span><p>' + s.p + '</p></li>';
    }).join('');

    var resultHost = $('#op-result', app);
    if (done && res) {
      resultHost.innerHTML =
        '<p><span class="tag sample">Sample figures</span> The figures below are illustrative, not the published result.</p>' +
        '<div class="table-wrap"><table class="data-table mid"><caption>Result of the ' + o.method.toLowerCase() + ', ' + fmtDate(o.date) + '</caption><tbody>' +
        '<tr><th scope="row">Amount sold</th><td class="n">' + o.size + '</td></tr>' +
        '<tr><th scope="row">Cover (times covered)</th><td class="n">' + num(res.cover, 2) + '</td></tr>' +
        '<tr><th scope="row">Average accepted price</th><td class="n">£' + num(res.avgPrice, 3) + '</td></tr>' +
        '<tr><th scope="row">Lowest accepted price</th><td class="n">£' + num(res.lowPrice, 3) + '</td></tr>' +
        '<tr><th scope="row">Tail (basis points)</th><td class="n">' + num(res.tail, 1) + '</td></tr>' +
        '<tr><th scope="row">Average accepted yield</th><td class="n">' + num(res.avgYield, 3) + '%</td></tr>' +
        '<tr><th scope="row">Highest accepted yield</th><td class="n">' + num(res.highYield, 3) + '%</td></tr>' +
        '<tr><th scope="row">Bids at the lowest price allocated</th><td class="n">' + res.allocatedAtLowest + '%</td></tr>' +
        '<tr><th scope="row">Post-auction option taken up</th><td class="n">£' + num(res.paofTaken, 1) + ' million of £' + num(res.paofMax, 1) + ' million</td></tr>' +
        '</tbody></table></div>' +
        '<p class="wf-meta">Also available as <a href="#" data-toast="Sample: the result would download as CSV.">CSV<span class="visually-hidden"> (result of the ' + o.method.toLowerCase() + ')</span></a> and through the <a href="data-catalogue.html">data API</a>.</p>';
    } else if (done) {
      resultHost.innerHTML = '<p>The result for this operation is in the <a href="operations-calendar.html">results table</a>. <span class="tag sample">Sample page</span></p>';
    } else {
      resultHost.innerHTML = '<div class="inset"><p class="mb-0">The result will be published here on ' + fmtDate(o.date) + ', as soon as bidding closes. <a href="alerts.html">Get an email when it is published</a>.</p></div>';
    }

    var docs = [];
    if (o.status !== 'planned' && o.status !== 'consultation') {
      docs.push(['Announcement', 'PDF', '123KB', 'Accessible PDF', annIso]);
      docs.push(['Prospectus', 'PDF', '142KB', 'Accessible PDF', annIso]);
    }
    if (o.status === 'consultation') docs.push(['Consultation notice', 'PDF', '96.8KB', 'Accessible PDF', '2026-09-30']);
    if (done) {
      docs.push(['Result', 'PDF', '67.2KB', 'The HTML result above is the main version', o.date]);
      if (o.method === 'Auction') {
        docs.push(['Result of the post-auction option facility', 'PDF', '62.4KB', 'Accessible PDF', o.date]);
        docs.push(['Re-opening prospectus', 'PDF', '135KB', 'Accessible PDF', o.date]);
      }
    }
    $('#op-docs', app).innerHTML = docs.length ? docs.map(function (d) {
      return '<li class="attachment"><span class="wf-placeholder thumb">PDF</span><div><h3><a href="#" data-toast="Sample: the ' + d[0].toLowerCase() + ' PDF would open.">' + d[0] + ': ' + esc(title) + '</a></h3><p>' + d[1] + ', ' + d[2] + ' · Published ' + fmtDate(d[4]) + '</p><p class="access">' + d[3] + '</p></div></li>';
    }).join('') : '<li><p>Documents will appear here when the operation is announced.</p></li>';

    var others = OPS.filter(function (x) { return x.gilt === o.gilt && x.id !== o.id && o.gilt; });
    $('#op-related', app).innerHTML = others.map(function (x) { return '<li><a href="gilt-operation.html?op=' + x.id + '">' + x.method + ', ' + fmtDate(x.date) + '</a></li>'; }).join('') +
      '<li><a href="operations-calendar.html">All gilt operations</a></li><li><a href="gilts-in-issue.html">Gilts in issue</a></li>' + (g ? '<li><a href="gilt-value.html?gilt=' + g.id + '">Value a holding of this gilt</a></li>' : '');
  }

  /* ----------------------------------------------------------------------
     2b. Operations calendar (R22)
     ---------------------------------------------------------------------- */
  function initCalendar() {
    var app = document.getElementById('cal-app');
    if (!app) return;
    var method = $('#cal-method', app), type = $('#cal-type', app), past = $('#cal-past', app);
    var body = $('#cal-body', app), count = $('#cal-count', app);
    function status(o) {
      if (o.status === 'complete') return '<span class="tag solid">Result</span>';
      if (o.status === 'consultation') return '<span class="tag">Consultation</span>';
      if (o.status === 'announced') return '<span class="tag">Announced</span>';
      return '<span class="tag grey">Planned</span>';
    }
    function render() {
      var list = OPS.filter(function (o) {
        var g = gilt(o.gilt);
        if (!past.checked && o.date < TODAY) return false;
        if (method.value !== 'all' && o.method !== method.value) return false;
        if (type.value !== 'all' && (!g || g.type !== type.value)) return false;
        return true;
      });
      body.innerHTML = list.map(function (o) {
        var g = gilt(o.gilt);
        return '<tr><td>' + fmtShortDay(o.date) + (o.sample ? ' <span class="tag sample">Sample</span>' : '') + '</td><td>' + o.method + '</td><th scope="row"><a href="gilt-operation.html?op=' + o.id + '">' + esc(opName(o)) + '</a></th><td>' + (g ? TYPE_LABEL[g.type] : 'Conventional') + '</td><td class="n">' + o.size + '</td><td>' + status(o) + '</td></tr>';
      }).join('') || '<tr><td colspan="6">No operations match these filters.</td></tr>';
      count.textContent = list.length + (list.length === 1 ? ' operation' : ' operations');
    }
    [method, type, past].forEach(function (el) { el.addEventListener('change', render); });
    var copy = $('#ical-copy');
    if (copy) copy.addEventListener('click', function () {
      var input = $('#ical-url');
      var done = function () { toast('Calendar link copied'); };
      if (navigator.clipboard) navigator.clipboard.writeText(input.value).then(done, function () { input.select(); toast('Press Ctrl+C or Cmd+C to copy the link'); });
      else { input.select(); toast('Press Ctrl+C or Cmd+C to copy the link'); }
    });
    render();
  }

  /* ----------------------------------------------------------------------
     2c. Email alerts sign-up (R23)
     ---------------------------------------------------------------------- */
  function initAlerts() {
    var app = document.getElementById('alerts-app');
    if (!app) return;
    var panels = $all('.step-panel', app);
    var stepper = $all('.stepper li', app);
    var answers = {};
    function go(n, quiet) {
      panels.forEach(function (p, i) { p.hidden = i !== n; });
      stepper.forEach(function (li, i) { li.classList.toggle('current', i === Math.min(n, 3)); li.classList.toggle('done', i < n); if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      var h = $('h1, h2', panels[n]);
      if (h && !quiet) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }
    $all('[data-step-back]', app).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); go(+b.getAttribute('data-step-back')); }); });

    $('#alerts-1', app).addEventListener('submit', function (e) {
      e.preventDefault();
      var picked = $all('input[name="alert-topic"]:checked', app).map(function (c) { return c.nextElementSibling.firstChild.textContent.trim(); });
      showErrors($('#alerts-1-errors', app), picked.length ? [] : [{ id: 'topic-ops', msg: 'Select at least one topic', field: $('#alerts-1-field', app) }]);
      if (!picked.length) return;
      answers.topics = picked;
      go(1);
    });
    $('#alerts-2', app).addEventListener('submit', function (e) {
      e.preventDefault();
      var f = $('input[name="alert-freq"]:checked', app);
      showErrors($('#alerts-2-errors', app), f ? [] : [{ id: 'freq-now', msg: 'Select how often you want emails', field: $('#alerts-2-field', app) }]);
      if (!f) return;
      answers.freq = f.parentNode.querySelector('strong').textContent;
      go(2);
    });
    $('#alerts-3', app).addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#alert-email', app).value.trim();
      var err = !v ? 'Enter your email address' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter an email address in the correct format, like name@example.com' : null);
      showErrors($('#alerts-3-errors', app), err ? [{ id: 'alert-email', msg: err, field: $('#alerts-3-field', app) }] : []);
      if (err) return;
      answers.email = v;
      $('#check-topics', app).innerHTML = answers.topics.map(esc).join('<br>');
      $('#check-freq', app).textContent = answers.freq;
      $('#check-email', app).textContent = answers.email;
      go(3);
    });
    $('#alerts-4', app).addEventListener('submit', function (e) {
      e.preventDefault();
      $('#confirm-email', app).textContent = answers.email;
      go(4);
    });
    go(0, true);
  }

  /* ----------------------------------------------------------------------
     3. Remit at a glance (R30, R31)
     ---------------------------------------------------------------------- */
  function initRemit() {
    var app = document.getElementById('remit-app');
    if (!app) return;
    var sold = 0, planned = 0;
    $('#remit-body', app).innerHTML = REMIT.rows.map(function (r) {
      sold += r.sold; planned += r.planned;
      return '<tr><th scope="row">' + r.label + (r.note ? '<span class="wf-meta sub-note">' + r.note + '</span>' : '') + '</th><td class="n">' + num(r.planned, 1) + '</td><td class="n">' + num(r.sold, 1) + '</td><td class="n">' + num(r.planned - r.sold, 1) + '</td><td class="n">' + Math.round(r.sold / r.planned * 100) + '%</td></tr>';
    }).join('');
    $('#remit-foot', app).innerHTML = '<th scope="row">Total gross gilt sales</th><td class="n">' + num(planned, 1) + '</td><td class="n">' + num(sold, 1) + '</td><td class="n">' + num(planned - sold, 1) + '</td><td class="n">' + Math.round(sold / planned * 100) + '%</td>';
    $('#remit-bars', app).innerHTML = REMIT.rows.map(function (r) {
      return '<div class="hbar"><span>' + r.label + '</span><span class="track"><span class="fill" style="width:' + (r.sold / r.planned * 100).toFixed(1) + '%"></span></span><span class="val">' + num(r.sold, 1) + ' / ' + num(r.planned, 1) + '</span></div>';
    }).join('');
    $all('[data-remit-sold]', app).forEach(function (el) { el.textContent = '£' + num(sold, 1) + ' billion'; });
    $all('[data-remit-pct]', app).forEach(function (el) { el.textContent = Math.round(sold / planned * 100) + '%'; });
  }

  /* ----------------------------------------------------------------------
     3b. Homepage: next operations strip (R33)
     ---------------------------------------------------------------------- */
  function initHome() {
    var host = document.getElementById('home-ops');
    if (!host) return;
    var next = OPS.filter(function (o) { return o.date >= TODAY; }).slice(0, 4);
    host.innerHTML = next.map(function (o) {
      return '<li><span class="d">' + fmtShortDay(o.date) + '</span><a href="gilt-operation.html?op=' + o.id + '">' + esc(opName(o)) + '</a><span class="m">' + o.method + ' · ' + o.size + (o.sample ? ' · sample' : '') + '</span></li>';
    }).join('');
    var sold = 0;
    REMIT.rows.forEach(function (r) { sold += r.sold; });
    $all('[data-remit-sold]').forEach(function (el) { el.textContent = '£' + num(sold, 1) + 'bn'; });
  }

  /* ----------------------------------------------------------------------
     4. Purchase and Sale Service eligibility checker (R42)
     ---------------------------------------------------------------------- */
  function initEligibility() {
    var app = document.getElementById('elig-app');
    if (!app) return;
    var qs = $all('.q-panel', app);
    var outcome = $('#elig-outcome', app);
    var history = [];
    var answers = {};

    function show(id, quiet) {
      qs.forEach(function (p) { p.hidden = p.id !== id; });
      outcome.hidden = true;
      var p = document.getElementById(id);
      $('.q-progress', p).textContent = 'Question ' + (history.length + 1) + (answers.what === 'sell' ? ' of 3' : ' of 5');
      var h = $('h1', p);
      if (!quiet) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }
    function result(kind) {
      qs.forEach(function (p) { p.hidden = true; });
      outcome.hidden = false;
      $all('[data-outcome]', outcome).forEach(function (o) { o.hidden = o.getAttribute('data-outcome') !== kind; });
      $all('[data-pay]', outcome).forEach(function (pay) { pay.hidden = answers.amount !== 'over'; });
      var h = $('[data-outcome="' + kind + '"] h1', outcome); h.setAttribute('tabindex', '-1'); h.focus();
    }
    function next(id) {
      var v = answers[id];
      if (id === 'q-uk') return v === 'no' ? result('not-uk') : show('q-what');
      if (id === 'q-what') return v === 'sell' ? show('q-crest') : show('q-group');
      if (id === 'q-group') return show('q-crest');
      if (id === 'q-crest') {
        if (v === 'yes') return result('crest');
        return answers.what === 'sell' ? result('sell') : show('q-amount');
      }
      if (id === 'q-amount') return result(answers['q-group'] === 'yes' ? 'buy' : 'join');
    }
    qs.forEach(function (p) {
      $('form', p).addEventListener('submit', function (e) {
        e.preventDefault();
        var c = $('input[type="radio"]:checked', p);
        var summary = $('.error-summary', p);
        showErrors(summary, c ? [] : [{ id: $('input[type="radio"]', p).id, msg: p.getAttribute('data-error'), field: $('.field', p) }]);
        if (!c) return;
        answers[p.id] = c.value;
        if (p.id === 'q-what') answers.what = c.value;
        if (p.id === 'q-amount') answers.amount = c.value;
        history.push(p.id);
        next(p.id);
      });
    });
    $all('[data-elig-back]', app).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var prev = history.pop();
        if (prev) show(prev);
      });
    });
    $all('[data-elig-restart]', app).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        history = []; answers = {};
        $all('input[type="radio"]', app).forEach(function (r) { r.checked = false; });
        show('q-uk');
      });
    });
    show('q-uk', true);
  }

  /* ----------------------------------------------------------------------
     4b. What is my gilt worth? (R43)
     ---------------------------------------------------------------------- */
  function initGiltValue() {
    var app = document.getElementById('value-app');
    if (!app) return;
    var sel = $('#val-gilt', app), amt = $('#val-nominal', app), out = $('#val-result', app);
    sel.innerHTML = '<option value="">Choose a gilt</option>' + GILTS.slice().sort(function (a, b) { return a.redemption > b.redemption ? 1 : -1; }).map(function (g) { return '<option value="' + g.id + '">' + esc(g.name) + '</option>'; }).join('');
    var pre = param('gilt');
    if (pre && gilt(pre)) sel.value = pre;
    $('#val-form', app).addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = [];
      var raw = amt.value.replace(/[£,\s]/g, '');
      if (!sel.value) errs.push({ id: 'val-gilt', msg: 'Choose the gilt you hold', field: $('#val-gilt-field', app) });
      if (!raw) errs.push({ id: 'val-nominal', msg: 'Enter the nominal amount you hold', field: $('#val-nominal-field', app) });
      else if (!/^\d+(\.\d{1,2})?$/.test(raw)) errs.push({ id: 'val-nominal', msg: 'Nominal amount must be a number, like 5000', field: $('#val-nominal-field', app) });
      showErrors($('#val-errors', app), errs);
      if (errs.length) { out.hidden = true; return; }
      var g = gilt(sel.value), n = parseFloat(raw);
      $('[data-val="name"]', out).textContent = g.name;
      $('[data-val="value"]', out).textContent = money(n * g.price / 100);
      $('[data-val="price"]', out).textContent = '£' + num(g.price, 2) + ' per £100 nominal';
      $('[data-val="nominal"]', out).textContent = money(n);
      $('[data-val="interest"]', out).textContent = money(n * g.coupon / 100) + ' a year, paid in two halves';
      $('[data-val="redeem"]', out).textContent = fmtDate(g.redemption);
      $('[data-val="il"]', out).hidden = g.type !== 'index-linked';
      out.hidden = false;
      out.focus();
    });
    if (pre && gilt(pre)) $('#val-nominal', app).focus();
  }

  /* ----------------------------------------------------------------------
     5. PWLB rates and estimator (R50, R51)
     ---------------------------------------------------------------------- */
  function initPwlb() {
    var app = document.getElementById('pwlb-app');
    if (!app) return;
    var loanBtns = $all('[data-loan]', app);
    var rateSel = $('#pwlb-ratetype', app);
    var loan = 'maturity';
    function rateFor(type, i, rt) { return PWLB.types[type].certainty[i] + PWLB.margins[rt]; }
    function render() {
      var t = PWLB.types[loan];
      $('#pwlb-caption', app).textContent = t.label + ' loans: ' + rateSel.options[rateSel.selectedIndex].text.toLowerCase() + ', % a year';
      $('#pwlb-body', app).innerHTML = PWLB.terms.map(function (term, i) {
        var c = t.change[i];
        var ch = c === 0 ? 'No change' : (c > 0 ? '▲ up ' : '▼ down ') + num(Math.abs(c), 2);
        return '<tr><th scope="row">' + term + (term === 1 ? ' year' : ' years') + '</th><td class="n">' + num(rateFor(loan, i, rateSel.value), 2) + '</td><td class="n">' + ch + '</td></tr>';
      }).join('');
      loanBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-loan') === loan ? 'true' : 'false'); });
    }
    loanBtns.forEach(function (b) { b.addEventListener('click', function () { loan = b.getAttribute('data-loan'); render(); }); });
    rateSel.addEventListener('change', render);
    render();

    /* Estimator: rate interpolated from the table at the chosen term.
       PWLB repayments are half-yearly. */
    function interp(type, years, rt) {
      var T = PWLB.terms;
      if (years <= T[0]) return rateFor(type, 0, rt);
      for (var i = 1; i < T.length; i++) {
        if (years <= T[i]) {
          var a = rateFor(type, i - 1, rt), b = rateFor(type, i, rt);
          return a + (b - a) * (years - T[i - 1]) / (T[i] - T[i - 1]);
        }
      }
      return rateFor(type, T.length - 1, rt);
    }
    var est = $('#est-form', app);
    est.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = [];
      var A = parseFloat(($('#est-amount', app).value || '').replace(/[£,\s]/g, ''));
      var n = parseInt($('#est-term', app).value, 10);
      if (!(A > 0)) errs.push({ id: 'est-amount', msg: 'Enter how much you want to borrow, like 5000000', field: $('#est-amount-field', app) });
      if (!(n >= 1 && n <= 50)) errs.push({ id: 'est-term', msg: 'Term must be between 1 and 50 years', field: $('#est-term-field', app) });
      showErrors($('#est-errors', app), errs);
      var out = $('#est-result', app);
      if (errs.length) { out.hidden = true; return; }
      var type = $('input[name="est-type"]:checked', app).value;
      var rt = $('#est-ratetype', app).value;
      var r = interp(type, n, rt) / 100, i = r / 2, N = n * 2, first, totalInt;
      if (type === 'maturity') { first = A * i; totalInt = A * i * N; }
      else if (type === 'annuity') { first = A * i / (1 - Math.pow(1 + i, -N)); totalInt = first * N - A; }
      else { first = A / N + A * i; totalInt = A * i * (N + 1) / 2; }
      $('[data-est="rate"]', out).textContent = num(r * 100, 2) + '%';
      $('[data-est="first"]', out).textContent = money(first, 0);
      $('[data-est="interest"]', out).textContent = money(totalInt, 0);
      $('[data-est="total"]', out).textContent = money(A + totalInt, 0);
      $('[data-est="desc"]', out).textContent = PWLB.types[type].label + ' loan of ' + money(A, 0) + ' over ' + n + (n === 1 ? ' year' : ' years') + ', ' + rateSel.querySelector('option[value="' + rt + '"]').text.toLowerCase() + '.';
      $('[data-est="firstlabel"]', out).textContent = type === 'maturity' ? 'Each half-yearly interest payment' : (type === 'annuity' ? 'Each half-yearly payment' : 'First half-yearly payment (falls each time)');
      out.hidden = false;
      out.focus();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGilts();
    initCatalogue();
    initOperation();
    initCalendar();
    initAlerts();
    initRemit();
    initHome();
    initEligibility();
    initGiltValue();
    initPwlb();
  });
})();
