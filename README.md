# Abdullahi Mohamed — Portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript — no build step.

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Structure
```
index.html          All sections (Hero, About, Skills, Experience, Projects,
                    Education, Certificates, References, Contact)
css/style.css       Design tokens, layout, animations, dark/light themes
js/main.js          Preloader, typing effect, particles, scroll reveal,
                    counters, project filters, theme toggle, contact form
assets/img/         Profile photo
assets/docs/        CV and certificate PDFs (downloadable from the site)
```

## Editing content
- Text for every section lives in `index.html`.
- Typing-effect roles: the `roles` array in `js/main.js`.
- Colors: the `--primary`, `--primary-2` and `--accent` tokens at the top of `css/style.css`.

## Deploy
Push the folder to a GitHub repo and enable **GitHub Pages**, or drag the folder into Netlify / Vercel.
