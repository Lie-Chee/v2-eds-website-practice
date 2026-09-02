# Components

Guidance for implementing UI from Figma into EDS blocks.

## Datacom components from Figma

When a **Datacom component** is requested and a **Figma design link** is provided, use style tokens **solely** from the `/* Datacom | Global style tokens */` section in `styles/styles.css`. Do not take colors, spacing, typography, or breakpoints from raw Figma values when a matching global token exists.

### Trigger

This rule applies when:

1. The user asks to create or implement a Datacom component (block), and
2. A Figma URL or file link is passed to the agent.

### Required workflow

1. Open the Figma design (Figma MCP: `get_design_context`, `get_variable_defs`, or equivalent).
2. Open `styles/styles.css` at `/* Datacom | Global style tokens */` (through end of file).
3. Map every visual property to a token from that section only.
4. In `blocks/*/*.css`, use the underlying custom property via `var(--…)` — not `@` LESS aliases, not hex/rgb from Figma.

If Figma exposes a variable whose name matches a global token alias (e.g. `color/datacom-blue-base`, `spacing-layout-06`), use that token. If no alias exists, flag the gap before inventing a new value; do not silently hard-code from Figma.

### Source of truth

```css
/* Datacom | Global style tokens */
```

That section lists Datacom aliases (e.g. `@color-datacom-blue-base`, `@font-24-size`, `@spacing-layout-04`, `@screen-medium`, `@cmp-section-padding-top-desktop`). Each alias points at a CSS custom property defined in `:root` under `/* Datacom | Run time variables */`.

**Only** tokens defined in the Global style tokens section are valid for Datacom Figma implementations. Do not use unrelated `:root` vars (e.g. generic EDS `--link-color`, `--body-font-size-m`) unless the global token section explicitly references them.

### Token families (name-based detection)

Datacom tokens in Figma often use these naming patterns:

- **Colors** — `color/datacom-blue-base`, `color-midnight-blue-minus-1`, `color-electric-blue`, `color-accent-pink-40`, `primary-01-100`, `secondary-04-080`
- **Typography** — `font-24-size`, `font-h-3-line-height`, `typography-font-family-400`, `typography-font-family-v2-600`, `letter-spacing-large`
- **Spacing** — `spacing-layout-04`, `spacing-padding-06`, `text-indent`
- **Layout** — `max-width-desktop`, `header-height`, `cmp-section-padding-*`, `cmp-content-padding-*`
- **Breakpoints** — `@screen-medium`, `@breakpoint-tablet` (use token pixel values, not ad-hoc breakpoints)

### How to implement in block CSS

EDS has no LESS build step.

| Global token alias | Block CSS |
| --- | --- |
| `@color-datacom-blue-base` | `var(--color-datacom-blue-base)` |
| `@font-24-size` | `var(--font-24-size)` |
| `@spacing-layout-04` | `var(--spacing-layout-04)` |
| `@typography-font-family-600` | `var(--typography-font-family-600)` |

**Do**

- Use only `/* Datacom | Global style tokens */` for Datacom + Figma work.
- Match Figma token names to the closest global alias, then use its `var(--…)` target.
- Prefer semantic tokens (`--color-action-blue`, `--spacing-layout-06`) when the global section provides them.
- Scope styles to the block (e.g. `.hero`, `.cards`).
- Pair typography size and line-height tokens as Figma text styles do.

**Do not**

- Paste hex/rgb values from Figma when a global token exists.
- Use Figma MCP output literal colors/spacing instead of mapped tokens.
- Introduce new `--color-*` or spacing variables in block CSS; extend `styles/styles.css` only when a token is genuinely missing from the global set.
- Use `@color-*` LESS syntax in block files.

### Examples

Figma fill: `color/datacom-blue-base` on a card title.

```css
.cards .card-title {
  color: var(--color-datacom-blue-base);
}
```

Figma spacing: `spacing-layout-06` between card rows.

```css
.cards .card-row + .card-row {
  margin-top: var(--spacing-layout-06);
}
```
