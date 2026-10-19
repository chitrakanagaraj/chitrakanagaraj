# Violet — unofficial NYU program index

A personal frontend demo for browsing a curated sample of New York University programs. Search by keyword, filter by degree level, campus, and school, open a program for a short description, and save a shortlist in this browser.

This project is not affiliated with, endorsed by, or sponsored by New York University. The list is a study sample, not a complete catalog. Confirm requirements and deadlines on [nyu.edu](https://www.nyu.edu/academics.html).

## Run locally

```bash
cd nyu-project
npm install
npm test
npm run dev
```

Open http://localhost:5173.

## Stack

- React
- TypeScript
- Vite

Program data lives in `src/data/programs.ts`. Filtering and the shortlist cap are covered by `src/lib/filterPrograms.test.ts`.
