[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/yansz54/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/yansz54/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# The Friday Ledger — a real Black Friday deal finder

A static deal-finder site for Black Friday 2026: **35 real deals** at Amazon, Best Buy and Walmart, each with its product, store, sale price, usual price, discount, a link to the store, and the time its price was checked — plus an honest verdict on whether it is really a deal (new low, strong deal, good price, or routine sale).

## How it works

- `app/` — the site, plain static files with no build step. Open `app/index.html` in a browser (or serve `app/` with any static server).
- Search, and filters by category, store and discount, all live. Sort by biggest discount, biggest saving, lowest price, or new lows first.
- Every deal has its own page (`#/deal/<id>`) with the verdict and its evidence, the check time and source, and — where the same product is cheaper or dearer elsewhere — a cross-store comparison.
- `screenshots/` — renders of the site running, desktop and phone.
- `main.ts` — the hand-in program (Node 22, standard library only): copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## How the deals were checked

Every deal was found and checked by the agent on Black Friday itself, Friday 27 November 2026, by reading the price in a deals source that names the store (9to5Mac, CNN Underscored, DealNews, AppleInsider, Yahoo Shopping, and others — each deal names its source on its page). No price, product or link is listed that no store or deals source showed when it was checked. See `METHOD.md` for the full list of sources and the checks run.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Serve `out/app` (or `app/`) with any static server and open `index.html`.

## License

MIT — see `LICENSE`.
