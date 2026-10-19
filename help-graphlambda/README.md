# GraphLambda help — maintenance notes

Entry point: `index.html`. Serve the parent `src/` directory with any static
HTTP server. The eight chapters reuse `../assets/css/help-shared.css` and
`../assets/js/help-shared.js`; the GraphLambda accent and small-screen header
rules are scoped to `body.help-graphlambda`.

## Content sources

Written against the local `Codes/GraphLambda` checkout at `89d9d25`:

- `packages/editor/src/App.tsx`, `nodes/Palette.tsx`, `inspector/Inspector.tsx`:
  toolbar, examples, property controls and the textual source interface.
- `packages/editor/src/examples/programs.ts`: the five complete examples.
- `ports/port-appearance.ts`, `wires/wire-appearance.ts`,
  `nodes/node-presentation.ts`: socket, wire and node notation.
- `docs/CALCULUS.md`, `TYPING.md`, `EDITING.md`, `DEBUGGER.md`,
  `UI-CONTROL-FLOW.md`, `UI-LAMBDA-BOUNDARIES.md`: language, typing, editing,
  execution and scope boundaries.

The public editor URL is https://g-l.l-workshop.my.id. Each chapter links to
it from the header and sidebar; Getting started also includes a direct link.
Local launch instructions remain available as an alternative.

## Screenshot provenance and verification

The six JPEGs in `assets/img/` are actual browser captures at 1600 × 1000 of
GraphLambda's existing `dist/index.html` bundle (file timestamp 2026-09-17),
served locally. No illustrative or generated program screenshots are used.
The source checkout contains merge-conflict markers, including in `App.tsx`
and `PortView.tsx`, so a fresh dev-server build could not be used. No
GraphLambda source files were modified to produce this help.

Executed checks:

- All eight pages in light and dark at widths 320, 375, 768, 1024 and 1440:
  no horizontal page overflow, clipped header controls, broken images,
  JavaScript errors or failed resource requests.
- Relative links, fragment targets, assets, unique IDs, one h1 per page and
  image alternative text.
- Mobile drawer opening and Escape closing; theme toggle and persistence
  between chapters.
- Existing bundle: seven textual recipes, arithmetic authoring from Empty,
  the disabled Run control on Empty, and a rejected ill-typed text draft
  preserving the installed graph.
- Existing bundle examples: Application → 6, Higher order → 11,
  Let sharing → 900, Letrec → 120.

These checks validate the help and the available bundle. They do not establish
that the conflicted source checkout currently builds.
