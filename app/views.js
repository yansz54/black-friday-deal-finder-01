// HTML for each page, built from the deal data. Every value is escaped before it goes into the page.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
const save = (d) => d.was - d.price;

const VERDICTS = {
  "new-low": { label: "New low", cls: "v-new", hint: "Lowest price tracked" },
  strong: { label: "Strong deal", cls: "v-strong", hint: "Deep cut" },
  good: { label: "Good price", cls: "v-good", hint: "Solid discount" },
  routine: { label: "Routine sale", cls: "v-routine", hint: "Small cut" },
};

export function verdictPill(d) {
  const v = VERDICTS[d.verdict] || VERDICTS.good;
  return `<span class="verdict ${v.cls}" title="${escape(v.hint)}">${escape(v.label)}</span>`;
}

export function card(d) {
  return `<article class="card">
  <div class="card-top"><span class="cat">${escape(d.category)}</span>${verdictPill(d)}</div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="store">${escape(d.store)}</p>
  <p class="price-row"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">−${percentOff(d)}%</span></p>
  <p class="save">You save ${usd(save(d))}</p>
  <p class="card-foot"><a class="deal-link" href="#/deal/${encodeURIComponent(d.id)}">Why this deal &rsaquo;</a><a class="store-link" href="${escape(d.url)}" target="_blank" rel="noopener">Shop at ${escape(d.store)} &nearr;</a></p>
</article>`;
}

export function rows(deals) {
  if (deals.length === 0) {
    return `<li class="empty"><strong>No deal matches.</strong><br>Try clearing a filter or searching for something else — every deal on this board is live and checked.</li>`;
  }
  return deals.map((d) => `<li>${card(d)}</li>`).join('');
}

export function list(deals, state, all) {
  const totalSave = all.reduce((s, d) => s + save(d), 0);
  const avgOff = Math.round(all.reduce((s, d) => s + percentOff(d), 0) / all.length);
  const newLows = all.filter((d) => d.verdict === 'new-low').length;
  const cats = [...new Set(all.map((d) => d.category))].sort();
  const stores = [...new Set(all.map((d) => d.store))].sort();
  const catOpts = ['All categories', ...cats].map((c) => `<option${state.category === c ? ' selected' : ''}>${escape(c)}</option>`).join('');
  const storeOpts = ['All stores', ...stores].map((s) => `<option${state.store === s ? ' selected' : ''}>${escape(s)}</option>`).join('');
  const discOpts = [
    ['0', 'Any discount'],
    ['25', '25% off or more'],
    ['40', '40% off or more'],
    ['50', '50% off or more'],
  ].map(([v, l]) => `<option value="${v}"${state.minOff === v ? ' selected' : ''}>${escape(l)}</option>`).join('');
  const sortOpts = [
    ['off', 'Biggest discount first'],
    ['save', 'Biggest saving first'],
    ['price', 'Lowest price first'],
    ['new', 'New lows first'],
  ].map(([v, l]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${escape(l)}</option>`).join('');
  const shown = deals.length;
  return `<section class="hero">
  <p class="kicker">Black Friday &middot; Friday 27 November 2026 &middot; prices checked today</p>
  <h1>Real Black Friday deals, checked today.</h1>
  <p class="lede">Every price below was read at the store or in a deals source that names the store, on Black Friday itself. Each deal carries an honest verdict: a new low, a strong deal, a good price — or a routine sale.</p>
  <dl class="stats">
    <div><dt>Deals checked</dt><dd>${all.length}</dd></div>
    <div><dt>Average cut</dt><dd>${avgOff}% off</dd></div>
    <div><dt>Total savings</dt><dd>${usd(Math.round(totalSave))}</dd></div>
    <div><dt>New lows</dt><dd>${newLows}</dd></div>
  </dl>
</section>
<section class="controls" aria-label="Find a deal">
  <label class="search">Search <input id="q" type="search" placeholder="Try “AirPods”, “OLED”, “Dyson”…" value="${escape(state.q)}"></label>
  <label>Category <select id="f-cat">${catOpts}</select></label>
  <label>Store <select id="f-store">${storeOpts}</select></label>
  <label>Discount <select id="f-off">${discOpts}</select></label>
  <label>Sort <select id="f-sort">${sortOpts}</select></label>
  <p class="count" id="count">${shown} of ${all.length} deals</p>
</section>
<ul class="deals" id="deal-list">${rows(deals)}</ul>
<section class="how">
  <h2>How to read this board</h2>
  <ul>
    <li><span class="verdict v-new">New low</span> — the lowest price the source has tracked for that product.</li>
    <li><span class="verdict v-strong">Strong deal</span> — a deep cut in dollars or percent.</li>
    <li><span class="verdict v-good">Good price</span> — a solid discount; buy it if you want it.</li>
    <li><span class="verdict v-routine">Routine sale</span> — a small cut; only buy if you need it now.</li>
  </ul>
  <p>Prices move fast on Black Friday. Every deal shows when its price was checked and where it was read — check the price at the store before you pay.</p>
</section>`;
}

export function deal(d, all) {
  const v = VERDICTS[d.verdict] || VERDICTS.good;
  const also = (d.alsoAt || []).map((a) => `<tr><td>${escape(a.store)}</td><td>${usd(a.price)}</td><td>${a.price > d.price ? '+' + usd(a.price - d.price) + ' more' : a.price < d.price ? usd(d.price - a.price) + ' cheaper' : 'Same price'}</td></tr>`).join('');
  const compare = also
    ? `<h2>Same product, other stores</h2>
<table class="compare"><thead><tr><th>Store</th><th>Price</th><th>Against this deal</th></tr></thead><tbody>
<tr class="here"><td>${escape(d.store)}</td><td>${usd(d.price)}</td><td>This deal</td></tr>${also}</tbody></table>
<p class="fine">Other-store prices come from the same sources that showed this deal, checked the same day.</p>`
    : '';
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <p class="card-top"><span class="cat">${escape(d.category)}</span>${verdictPill(d)}</p>
  <h1>${escape(d.title)}</h1>
  <p class="price-row big"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">−${percentOff(d)}%</span></p>
  <p class="save big">You save ${usd(save(d))} off the usual ${usd(d.was)}</p>
  <p class="verdict-line"><strong>${escape(v.label)}.</strong> ${escape(d.note)}</p>
  <dl class="facts">
    <div><dt>Store</dt><dd>${escape(d.store)}</dd></div>
    <div><dt>Category</dt><dd>${escape(d.category)}</dd></div>
    <div><dt>Price checked</dt><dd>${day(d.checked)}</dd></div>
    <div><dt>Read in</dt><dd>${escape(d.source)}</dd></div>
  </dl>
  <p><a class="cta" href="${escape(d.url)}" target="_blank" rel="noopener">Shop it at ${escape(d.store)} &nearr;</a></p>
  ${compare}
</article>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
