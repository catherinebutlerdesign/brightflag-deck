# Brightflag interview deck

HTML presentation of the SoftwareOne subscriptions case study, built with React, Tailwind and shadcn/ui.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (port 5179 from the session's launch config). For a static copy, `npm run build` writes `dist/`, which any static host can serve. Opening `dist/index.html` straight from disk won't run the live slides, because browsers block the embedded prototype on `file://`.

## Hosted version

Every push to `main` builds the deck and publishes it to GitHub Pages at https://catherinebutlerdesign.github.io/brightflag-deck/ (`.github/workflows/pages.yml`). The site is public even though the repo is private, so the hosted build leaves out the speaker notes. Run the deck locally to present with notes.

The deck needs an internet connection for the Inter font, and the live slides need it for React and the icon font the prototype loads from CDNs.

## Presenting

| Key | Action |
| --- | --- |
| → / Space / PageDown | Next slide |
| ← / PageUp | Previous slide |
| P | Presenter view in its own window: notes, timer, current and next slide |
| N | Speaker notes below the slide (handy for rehearsing on one screen) |
| T | Start or stop the timer (also starts on the first →) |
| G or Esc | Slide overview |
| F | Full screen |
| ⌘P | Save as PDF (one slide per page, live slides show a still) |

`#/7` in the URL jumps to slide 7.

### The script

The speaker notes are a full script, about 18 minutes of speech that fills the 28.5-minute plan once you add pauses and your own stories. In the notes:

- plain text is what you say
- *italic boxes* are stage directions
- **teal lines** take you into the next slide
- **highlighted [brackets]** are gaps only you can fill: your own examples, scope calls and collaboration story

Edit it in `src/slides/index.tsx`.

### Screen sharing with private notes

1. Open the deck and press **P**. The presenter view opens in a separate window.
2. In Zoom, Teams or Meet, share **only the deck's window or tab**, not your whole screen.
3. Keep the presenter view on your side. Arrow keys, a clicker or its Next button move both windows together.

LIVE slides run only in the deck window, so click their step buttons there. The presenter view shows a still of them.

## Live slides

Slides marked **LIVE** embed the real prototype (`public/prototype/`). The numbered buttons drive each flow through the prototype's own UI, and you can also click around freely. **Restart** reloads clean sample data. They're optional: skip them with → if you're short on time.

A clicker's PageUp/PageDown always moves slides. Arrow keys move slides once nothing inside the prototype is focused.

## Where things live

- `src/slides/`: slide content (`story`, `design`, `close`, `live`) and `index.tsx`, the running order with timings and speaker notes.
- `src/deck/`: the deck shell (`Deck.tsx`), shared slide parts (`kit.tsx`) and the live embed (`Live.tsx`).
- `public/screens/`: prototype captures used on the static slides (full-size PNGs are in `../brightflag-screens/`).
- `public/prototype/`: copies of the desktop and iPhone prototypes. After changing the prototype repo, copy the built HTML files here again.
