# Zirui Wen Academic Homepage

This repository hosts the source for [https://wzrdl.github.io](https://wzrdl.github.io), built with the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme.

## Local Development

The al-folio maintainers recommend Docker for local development on Windows:

```bash
docker compose pull
docker compose up
```

Then open `http://localhost:8080`.

If Ruby and Bundler are already installed:

```bash
bundle install
bundle exec jekyll serve
```

## Content

- Main page: `_pages/about.md`
- Publications: `_bibliography/papers.bib`
- Projects: `_projects/`
- News: `_news/`
- CV data: `_data/cv.yml`
- CV PDF: `assets/pdf/CV_phd.pdf`

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and deploys `_site` to the `gh-pages` branch. In GitHub repository settings, Pages should use the `gh-pages` branch as the publishing source.
