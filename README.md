# Long Way Events

A modern, fully responsive event management website where users can explore upcoming events, view details and register for the ones they like. Built with plain **HTML5, CSS3 and JavaScript** (no frameworks or build tools).

- **Live site:** https://kexplore-three.vercel.app/
- **Repository:** https://github.com/pratyushkumar005-web/KEXPLORE

## Problem statement
Build a visually appealing event platform with a hero section, featured and upcoming events, search and category filters, an event details view, and a registration form with JavaScript validation and a confirmation message. The site must work on mobile, tablet and desktop.

## Features
- Hero section introducing the platform, with a live countdown to the next event
- Featured events section and a full "All upcoming events" grid
- Event cards showing name, date, venue, category, short description and a coloured cover
- Search by name, venue, category or description
- Category filter chips (All, Music, Tech, Food, Workshop, Talk) that work together with search
- Event details dialog with full description, venue and date
- Registration form: name, email, phone number and selected event
- JavaScript validation with inline error messages, then a confirmation screen with a booking reference
- Fully responsive layout
- Dark / light mode, remembered between visits and defaulting to the system setting
- Countdown timers (hero and event dialog) updating every second
- Animations: hero heading entrance, card hover, dialog pop-in, smooth scrolling
- Local Storage registration management: saved tickets, duplicate prevention and a "My tickets" list with a live counter in the navbar

## Tech stack
| Area | Used |
|---|---|
| Structure | HTML5 (semantic elements, `<dialog>`) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser Local Storage |
| Fonts | Google Fonts: Big Shoulders Display, DM Sans |
| Version control | Git and GitHub |

## Implementation

### 1. Event data
All events live in one array, `EVENTS`, at the top of `script.js`. Each object has an `id`, `name`, `cat` (category), `date` (ISO string), `venue`, `desc`, a `feat` flag for featured events and two colours `c` used for the card cover. To add an event, add one object. The cards, category chips, dropdown and countdowns update automatically.

### 2. Rendering
`card(e)` returns the HTML for one event card. `render()` filters `EVENTS` by the selected category and the search text, then rebuilds the grid, the result count and the "no results" state. User-facing text goes through `esc()` to escape HTML characters.

### 3. Search and filter
The search input fires `render()` on every keystroke. Category chips set the `cat` variable and call `render()`. A card is shown only if it matches **both** the category and the search text. A "Show all events" button resets both.

### 4. Event details
Clicking a card button opens a native `<dialog>` with `showModal()`. This gives a backdrop, focus trapping and Esc-to-close for free. The dialog fills itself from the selected event and preselects that event in the registration form.

### 5. Countdown timers
`parts(e)` converts the time left until an event into days, hours, minutes and seconds. A single `setInterval` updates the hero countdown (the soonest future event) and the dialog countdown every second.

### 6. Form validation
Validation rules live in a `rules` object. Each rule returns an empty string when valid, or an error message.

| Field | Rule |
|---|---|
| Name | 2 to 60 characters, letters, spaces, apostrophes, dots and hyphens |
| Email | Must match `name@domain.tld` |
| Phone | 10 digits, with an optional `+91` or `0` prefix, spaces and hyphens ignored |
| Event | An event must be selected |

Fields are checked when the user leaves them (`blur`) and again on submit. Invalid fields get a red border and message, valid ones a green border. On a failed submit, focus moves to the first invalid field.

### 7. Registration and Local Storage
On a valid submit, a registration object is created with a random reference like `LW-4K9P2X`, the event, name, email and phone. It is appended to the array stored under the key `longway.registrations`. The same email cannot register twice for the same event. The confirmation message replaces the form, and the "My tickets" section and navbar counter update immediately. Reads and writes are wrapped in `try/catch`, so the site still works if storage is blocked.

### 8. Theme
The theme is set with `data-theme` on `<html>`. CSS variables such as `--bg`, `--panel` and `--text` change per theme, so no component needs separate dark styles. The choice is saved under `longway.theme`.




