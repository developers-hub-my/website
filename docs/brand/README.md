# Brand master

`devhub-logo-master.ai` is the Adobe Illustrator master (`DH FINAL LOGO.ai`,
27 Nov 2024) from the company Drive. It opens as a PDF. Five artboards:

| Artboard | Content | Exported to |
|---|---|---|
| 1 | Brand board: palette (shades / tones / tints of `#46afe3`), midnight ground `#0f102d`, indigo `#2e3092` + cyan `#00aeef` bar, app icons, Helvetica | — (reference) |
| 2 | Colour lockup, grey `#a7a9ac` wordmark — light grounds | `public/brand/devhub-lockup.svg` |
| 3 | Mono lockup, white wordmark — dark grounds | `public/brand/devhub-lockup-mono.svg` |
| 4 | Colour mark | `public/brand/devhub-mark.svg`, `public/logo.png` |
| 5 | Mono mark — dark grounds | `public/brand/devhub-mark-mono.svg` |

The SVGs were exported with `pdftocairo -svg` and cropped to the artwork, with
the text outlined, so they need no font. Favicons, the apple-touch icon and the
192/512 manifest icons are rendered from the colour mark on white. Never redraw
or recolour the mark: re-export from this file.
