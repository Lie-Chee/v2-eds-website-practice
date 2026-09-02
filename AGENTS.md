# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

This project uses Adobe Edge Delivery Services with a document authoring flow.

Use the locally installed Adobe Edge Delivery Services skills and Chrome
DevTools MCP when analysing, implementing, testing, or reviewing blocks.

## Workflow

For block development, start with the `content-driven-development` skill.

Use the necessary skills in this sequence:

1. `content-driven-development`
2. `analyze-and-plan`
3. `block-inventory`
4. `block-collection-and-party`
5. `content-modeling`
6. `building-blocks`
7. `testing-blocks`
8. `code-review`

Use these supporting skills when necessary:

- `docs-search`
- `da-content`
- `find-test-content`
- `aem-cli`

Do not invoke `building-blocks` as the starting point when
`content-driven-development` is available.

Before implementation:

1. Read the existing block JavaScript and CSS.
2. Inspect related block variants and section styles.
3. Inspect relevant auto-blocking logic.
4. Inspect the authored content.
5. Inspect the `.plain.html` response.
6. Run the local preview.
7. Inspect the rendered component with Chrome DevTools MCP.
8. Define or confirm the authoring model.
9. Create or locate representative test content.

Compare these three representations before changing decoration logic:

1. Authored document content
2. Backend-generated `.plain.html`
3. Final decorated browser DOM

Do not infer the authoring model from the final browser DOM alone.

## Skill usage

### `content-driven-development`

Use this as the primary workflow for:

- Creating a block
- Modifying a block
- Adding or changing a block variant
- Changing auto-blocking
- Changing core EDS scripts or styles
- Changing the content model
- Recreating a component from another site or design

Follow the complete content-driven development workflow.

Do not begin implementation until the content model and representative test
content have been identified.

### `analyze-and-plan`

Use this skill to establish:

- Component purpose
- Existing behaviour
- Required content
- Optional content
- Component variants
- Responsive behaviour
- Accessibility requirements
- Authoring requirements
- Performance requirements
- Acceptance criteria
- Files likely to change
- Behaviour that must be preserved

Separate directly observed behaviour from proposed improvements.

Do not invent fields, variants, interactions, or configuration options that
are not supported by requirements, authored content, existing code, a design,
or an inspected reference page.

### `block-inventory`

Use this skill before creating a new block.

Check whether the requirement can be met by:

1. Default content
2. A section style
3. An existing block
4. An existing block variant
5. A safe extension of an existing block
6. A new dedicated block

Do not create a new block when an existing pattern reasonably provides the
required content model and behaviour.

### `block-collection-and-party`

Use this skill to find comparable Edge Delivery Services implementations.

Reference implementations may be used to identify established patterns, but
review them before adopting them.

Check:

- Authoring model compatibility
- Repository conventions
- Accessibility
- Browser compatibility
- Performance
- Dependencies
- Licensing
- Testing approach

Do not copy reference code without adapting and validating it for this
repository.

### `content-modeling`

Use this skill before implementing a new block or materially changing the
structure of an existing block.

Evaluate whether the component should use:

- Default document content
- Auto-blocked document content
- A section style
- A variant of an existing block
- A dedicated block

Prefer the simplest model that gives authors the required control.

Do not expose implementation details to authors, including:

- Arbitrary CSS class names
- DOM instructions
- Pixel dimensions
- JavaScript configuration
- Internal selectors
- Repository paths

Authors may omit or add cells. The selected model and its decoration must
handle supported authoring variations defensively.

Create or locate test content that covers:

- Minimum supported content
- Typical content
- Long text
- Missing optional content
- Images, when supported
- Links or calls to action, when supported
- Every supported variant
- Mobile and desktop rendering

### `building-blocks`

Use this skill through the `content-driven-development` workflow.

Follow the block conventions already present in the repository.

For a block named `example`, the normal structure is:

```text
blocks/
  example/
    example.js
    example.css
```

When creating or modifying block CSS, use the Datacom global style tokens
defined in `styles/styles.css` starting at the `/* Datacom | Global style
tokens */` section. Read that section before writing styles.

- Use these tokens for colors, typography, spacing, layout, and breakpoints
- Do not hard-code values when a matching token exists
- In block CSS files, reference the underlying CSS custom property with
  `var(--token-name)` (for example, `@color-datacom-blue-base` maps to
  `var(--color-datacom-blue-base)`)
- Prefer semantic tokens such as `@color-cta`, `@spacing-layout-04`, and
  `@font-24-size` over raw pixel or hex values
- Use the Datacom breakpoint tokens (`@screen-medium`, `@screen-large`, and
  related values) for responsive behaviour instead of arbitrary breakpoints