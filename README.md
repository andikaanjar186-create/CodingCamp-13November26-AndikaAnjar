# Expense & Budget Visualizer

A simple browser-based web app for recording daily expenses, categorizing them, and visualizing spending distribution with a pie chart. All data is stored locally in the browser — no server or internet connection required.

---

## Features

- **Transaction form** — add expenses with an item name, amount (Rp), and category
- **Transaction list** — scrollable list of all recorded transactions with a delete button per item
- **Total balance** — running total of all expenses, updated automatically on every change
- **Pie chart** — visual breakdown of spending by category using Chart.js
- **Custom categories** — add your own categories beyond the defaults (Food, Transport, Fun)
- **Sorting** — sort the list by newest, highest/lowest amount, or category name
- **Dark mode** — toggle between light and dark themes, with preference saved across sessions

---

## Tech Stack

| Component | Details |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (no frameworks) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN |
| Storage | Web Storage API (`localStorage`) |

---

## Folder Structure

```
expense-budget-visualizer/
├── index.html        # Main application page
├── css/
│   └── style.css     # All styles & light/dark theme variables
└── js/
    └── app.js        # App logic (transactions, chart, storage)
```

---

## Getting Started

No installation or build tools needed.

1. Clone or download this repository
2. Open `index.html` directly in your browser

```bash
# Or serve it locally with a simple dev server (optional)
npx serve .
```

> Chart.js is loaded from a CDN, so an internet connection is needed the first time you open the app. All transaction data is stored locally after that.
