> ### 🔬 Minnesota Nanofabrication Club
> New here? Start at the club website — what we're building, current projects, and how to join:
> **https://minnesota-nanofabrication-club.github.io/club_website/**

---

# Minnesota Nanofabrication docs theme

The look of the club's mdBook documentation, kept apart from its content. It
follows the club website: black and white, one UV accent from the logo, IBM
Plex, hairlines, square corners.

It layers on top of mdBook's default theme through mdBook's own override
points, so it stays small and survives mdBook upgrades. It needs
**mdBook 0.5.x** (it styles the `#mdbook-*` element ids that 0.5 introduced).

| File | What it does |
|---|---|
| `head.hbs` | Extra `<head>` content. |
| `header.hbs` | The club header above mdBook's menu bar. Holds the website links (edit them here if the website moves). |
| `nanofab.css` | The whole reskin, loaded by `additional-css`. |
| `nanofab.js` | Part name above each title, "On this page" outline, code captions, Previous / Next cards, edit link, footer, progress line. Loaded by `additional-js`. |
| `fonts/` | IBM Plex, self-hosted (SIL OFL). `fonts/fonts.css` replaces mdBook's default fonts. |
| `favicon.png` | The club logo. |

## Using it in a book

Mount it as a git submodule at `theme/` (mdBook's default theme location),
and in the book's `book.toml`:

```toml
[output.html]
additional-css = ["theme/nanofab.css"]
additional-js = ["theme/nanofab.js"]
default-theme = "light"
preferred-dark-theme = "light"
```

Each book pins a theme commit and updates when it chooses:

```
cd theme && git pull && cd ..
git add theme && git commit -m "Update the docs theme"
```
