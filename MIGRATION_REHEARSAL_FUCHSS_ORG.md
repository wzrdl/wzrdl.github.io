# v1.0 migration rehearsal: dfuchss/fuchss.org

This note records a real pre-v1 migration rehearsal for the public site repo [`dfuchss/fuchss.org`](https://github.com/dfuchss/fuchss.org), run on May 23, 2026. The goal was to test the customization path raised in [Discussion #3545](https://github.com/alshedivat/al-folio/discussions/3545) against a heavily customized site rather than only documenting the expected workflow.

## Test bed

- Source repo: `dfuchss/fuchss.org`
- Source commit: `254a366` on `main`
- Upstream tracking branch in that repo: `upstream` at `d527315c`
- Local v1 starter source: `al-folio` `v1.0-dev` after merging current `origin/main`
- Rehearsal copies:
  - Original clone: `/private/tmp/fuchss-org-v1-rehearsal`
  - Migrated copy: `/private/tmp/fuchss-org-v1-migrated`

The source site is a good stress test because it has custom content, `_layouts`, `_includes`, `_sass`, `_plugins`, `_modules/jekyll-socials`, workflows, CV/publication/repository pages, and Matrix `.well-known` files.

## Steps performed

1. Created a fresh v1 starter copy from `v1.0-dev`.
2. Copied site-owned content and overrides from `dfuchss/fuchss.org`: `_bibliography`, `_books`, `_data`, `_news`, `_pages`, `_projects`, `_teachings`, `assets`, `_includes`, `_layouts`, `_sass`, `_plugins`, `_modules`, `.well-known`, `.posts`, and `robots.txt`.
3. Kept the v1 `Gemfile`, then added the site's local `jekyll-socials` path gem plus its `feedjira` and `httparty` dependencies.
4. Merged the source `_config.yml` with the v1 runtime contract:
   - `theme: al_folio_core`
   - `al_folio.api_version: 1`
   - `al_folio.style_engine: tailwind`
   - bundled `al_*` plugin entries
   - `al_folio.compat.bootstrap.enabled: true`
   - the v1 `analytics` namespace
5. Ran the upgrade audit and build, then iterated on blocking findings only.

## Findings

The first audit produced 4 blocking findings. All were from old local overrides of `_includes/head.liquid` and `_includes/scripts.liquid` that loaded legacy Bootstrap, MDB, and jQuery runtime assets directly. Removing those two local overrides let `al_folio_core` own the v1 head/script runtime.

The source repo has no `_posts` directory; the starter sample `_posts` had to be removed from the migrated copy. The site keeps unpublished or disabled posts under `.posts`, which should not be treated as Jekyll posts unless the owner explicitly moves them back to `_posts`.

Several old local plugin/runtime files are now plugin-owned and should be removed during migration:

- `_plugins/google-scholar-citations.rb` and `_plugins/inspirehep-citations.rb` are owned by `al_citations`.
- `_plugins/external-posts.rb` is owned by `al_ext_posts`.
- `_plugins/hide-custom-bibtex.rb`, `_plugins/details.rb`, `_plugins/file-exists.rb`, and `_plugins/remove-accents.rb` are owned by the v1 core/plugin runtime.
- `assets/js/distillpub/**` is owned by `al_folio_distill`.
- `assets/js/search/**` is owned by `al_search`.

After removing those plugin-owned local files, `bundle exec al-folio upgrade audit --no-fail` reported:

- Blocking findings: 0
- Non-blocking findings: 92

The remaining non-blocking findings are legacy Bootstrap/jQuery markers in intentionally customized local templates and scripts. They are acceptable for v1.0 with `al_folio_bootstrap_compat` enabled, but should be migrated away before Bootstrap compatibility is removed.

## Build result

The migrated copy built successfully with:

```bash
/Users/maruan/.rbenv/shims/bundle install
/Users/maruan/.rbenv/shims/bundle exec al-folio upgrade audit --no-fail
/Users/maruan/.rbenv/shims/bundle exec jekyll build --trace
```

Generated pages verified in the build output:

- `_site/index.html`
- `_site/cv/index.html`
- `_site/publications/index.html`
- `_site/repositories/index.html`
- `_site/projects/index.html`
- `_site/.well-known/matrix/server`
- `_site/.well-known/matrix/client`
- `_site/.well-known/matrix/support`

For this local rehearsal, `third_party_libraries.download` was set to `false` to avoid requiring CDN access. The original site also has custom network-dependent build hooks for GitHub metadata, Simple Icons, and citation badges; those failed gracefully without blocking the local build when network access was unavailable.

## Migration guidance confirmed

This rehearsal supports the v1 customization model: a heavily customized site does not need to fork every v1 gem. The working path is to keep site-specific content and intentional local overrides in the starter repo, remove old copied runtime/plugin files that v1 gems now own, enable Bootstrap compatibility for legacy markup, and fork/pin a plugin only when changing plugin-owned behavior itself.
