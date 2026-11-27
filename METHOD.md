# METHOD — how the deals were found, checked and verified

## The board

35 deals, checked on Black Friday itself, Friday 27 November 2026 (all check
times 06:30 UTC, i.e. 13:30 WIB). Stores: Amazon (22), Best Buy (6), Walmart (7).
Categories: Audio 6, TVs 5, Kitchen 5, Home 4, Smart home 4, Laptops 2, Toys 2,
Wearables 2, Tablets 1, Accessories 1, Fashion 1, Beauty 1, Gaming 1.

## Sources (each deal names its own on its page)

- 9to5Mac Black Friday live blogs, 20–25 Nov 2026 (AirPods Pro 3, AirPods Max 2, MacBook Air M5, Apple Watch SE 3, AirTag 2)
- 9to5Toys Day 6 Apple deals, 24 Nov 2026 (Apple Watch Series 12, $299 all-time low)
- CNN Underscored, 26 Nov 2026 (Dyson V8, V9, PencilVac, Airwrap, KitchenAid Deluxe)
- DealNews Best Buy TV deals, verified 26 Nov 2026 (TCL, Hisense, LG C6); DealNews Dyson deals, 25 Nov 2026 (V15)
- AppleInsider Black Friday OLED deals, 21 Nov 2026 (LG B6E, Samsung S84H, LG C6)
- Yahoo Shopping Black Friday roundup, 22 Nov 2026 (Dyson V9, Bose QuietComfort, Michael Kors)
- Koupon Walmart Black Friday kitchen deals, 23 Nov 2026 (KitchenAid Artisan, Ninja Flip, Ninja DualZone)
- Life With Mike and Angie Walmart deals, verified 24 Nov 2026 (KitchenAid Deluxe, Lodge Dutch oven)
- ComicBook Amazon Black Friday roundup, 19 Nov 2026 (Beats Solo 4, LEGO sets, Elden Ring)
- GlitchNDealz 50 live Amazon deals, 25 Nov 2026 (Blink Mini, Fire TV Stick 4K Max)
- The Bargain Boy Black Friday under $50, 26 Nov 2026 (Echo Dot Max, Ring 2K live check)
- MySavings Amazon Black Friday deals, updated 26 Nov 2026 (Ring Battery Doorbell 2K)
- Product Bible Apple Black Friday guide, 22 Nov 2026 (Beats Studio Pro)
- Mashable Black Friday deals, via Khanlist, 15 Nov 2026 (iPad A16)
- Inksight best Black Friday tech deals, prices checked 26 Nov 2026 (Sony WH-1000XM5 at Best Buy)

## What was deliberately left out

- PS5 consoles: no store cut the console in 2026 (checked 13 Nov and again in
  roundups on 26 Nov) — listing one at a discount would be invented. The gaming
  slot is a Switch 2 game instead.
- The Nintendo Switch 2 + Mario Kart bundle's "$50 off" claim: the bundle's
  list price is ambiguous across sources, so it was left out rather than listed
  on a shaky "was" price.
- Any price a source showed only before Black Friday Week, or that only one
  thin source carried without a store behind it.

## Verdicts

- New low (3): AirPods Pro 3 ($149, all-time low), Apple Watch Series 12 ($299,
  all-time low), AirTag 2 ($18, lowest ever). Each is called a low by its source.
- Strong deal (24): cuts of 30–77% or $100+ saved, corroborated by the source.
- Good price (7): solid 25–30% cuts on current models.
- Routine sale (1): iPad A16, 11% off — the smallest cut on the board, labelled
  honestly instead of dressed up.

## Verification run (local, before handover)

1. `node main.ts` twice into fresh output dirs; the two outputs compared
   byte for byte (dossier.json identical).
2. Served `app/` locally and rendered it in Chromium via Playwright at
   1280×800 (list, deal page, filtered view) and 390×844 (phone list).
3. Click-tested search ("dyson", "oled") and every filter (category, store,
   discount, sort); the deal counts change and the list re-renders.
4. Every deal link, price, discount arithmetic (price/was) and check time
   renders on its card and its detail page; all 4 screenshots are real renders
   of the site's own code, each under the 256 KiB cap.
