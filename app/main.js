// The deal finder: hash routes, live search, and filters that actually filter.
//   #/            the board, with search and filters
//   #/deal/<id>   one deal, with its verdict and cross-store comparison
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { deals } from './data.js';
import { deal, list, missing, rows } from './views.js';

const app = document.getElementById('app');
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);

const state = { q: '', category: 'All categories', store: 'All stores', minOff: '0', sort: 'off' };

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  let shown = deals.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (state.category !== 'All categories' && d.category !== state.category) return false;
    if (state.store !== 'All stores' && d.store !== state.store) return false;
    if (percentOff(d) < Number(state.minOff)) return false;
    return true;
  });
  const rank = { 'new-low': 0, strong: 1, good: 2, routine: 3 };
  if (state.sort === 'off') shown.sort((a, b) => percentOff(b) - percentOff(a) || b.was - b.price - (a.was - a.price));
  if (state.sort === 'save') shown.sort((a, b) => b.was - b.price - (a.was - a.price));
  if (state.sort === 'price') shown.sort((a, b) => a.price - b.price);
  if (state.sort === 'new') shown.sort((a, b) => rank[a.verdict] - rank[b.verdict] || percentOff(b) - percentOff(a));
  return shown;
}

function renderList() {
  const shown = applyFilters();
  const listEl = document.getElementById('deal-list');
  const countEl = document.getElementById('count');
  if (listEl) listEl.innerHTML = rows(shown);
  if (countEl) countEl.textContent = `${shown.length} of ${deals.length} deals`;
}

function wireControls() {
  const q = document.getElementById('q');
  const cat = document.getElementById('f-cat');
  const store = document.getElementById('f-store');
  const off = document.getElementById('f-off');
  const sort = document.getElementById('f-sort');
  if (!q) return;
  q.addEventListener('input', () => { state.q = q.value; renderList(); });
  cat.addEventListener('change', () => { state.category = cat.value; renderList(); });
  store.addEventListener('change', () => { state.store = store.value; renderList(); });
  off.addEventListener('change', () => { state.minOff = off.value; renderList(); });
  sort.addEventListener('change', () => { state.sort = sort.value; renderList(); });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | The Friday Ledger`;
    app.innerHTML = found ? deal(found, deals) : missing();
  } else {
    document.title = 'The Friday Ledger — Real Black Friday deals, checked today';
    app.innerHTML = list(applyFilters(), state, deals);
    wireControls();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
