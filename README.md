# Long Way Events

A responsive event management website built with plain **HTML5, CSS3 and JavaScript** (no frameworks). Visitors can browse upcoming events, search and filter them, read event details, and register through a validated form. The visual style follows the Hollow Pines template: dusk-orange on night pine, big condensed headlines and a pine-line skyline.

**Live site:** _add your Netlify / Vercel / GitHub Pages link_
**Repository:** _add your GitHub link_

## Features
- Hero section with a live countdown to the next event
- Featured events plus a full event grid with image-style cards (name, date, venue, description)
- Search by name, venue or topic, combined with category filters
- Event details dialog with its own countdown timer
- Registration form (name, email, phone, event) with JavaScript validation, inline error messages and a confirmation screen
- Registrations saved in **Local Storage** (duplicate email per event is blocked) and shown under "My tickets"
- Dark / light mode that remembers your choice and respects the system setting
- Responsive layout for mobile, tablet and desktop; keyboard focus styles, ARIA labels and reduced-motion support

## Project structure
```
index.html   page structure and the event dialog
style.css    design tokens, layout, responsive rules, themes
script.js    event data, rendering, filters, countdowns, validation, storage
```

## How it works
- `EVENTS` in `script.js` is the single source of data. Add an object there and the cards, filters and registration dropdown update automatically.
- `rules` holds the validation functions: name (letters, 2+ chars), email (regex), phone (10 digits, optional +91 or 0 prefix) and a required event.
- Registrations are stored under the `longway.registrations` key; the theme under `longway.theme`.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
- **GitHub Pages:** Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the repository; no build step is needed.

## Git workflow
```
git init
git add .
git commit -m "Add event management site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
