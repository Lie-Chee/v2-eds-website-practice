Create a new Adobe Edge Delivery Services block by analysing an existing
component.

### Reference Information

Name of the block:
[INSERT NAME]

Component CSS class (optional; use with a reference page URL):
[INSERT CLASS]
Example: page-title-hero

Reference page URL (optional):
[INSERT URL OR LEAVE BLANK]

Figma design reference (optional):
[INSERT FIGMA URL OR LEAVE BLANK]

At least one reference is required. If neither a reference page URL nor a
Figma design reference is provided, stop and ask the user to provide one
before continuing.

If a Figma design reference is provided, use only the Figma MCP for reference
discovery. Do not use Chrome DevTools MCP, even if a reference page URL is
also provided.

### Required Workflow

Use the locally installed Adobe EDS skills.

Follow this workflow:

1. content-driven-development
2. analyze-and-plan
3. block-inventory
4. block-collection-and-party
5. content-modeling
6. building-blocks
7. code-review

Skip `testing-blocks`. Do not open, inspect, or validate a local preview
URL. The user will test the implementation manually.

Use docs-search and da-content whenever Adobe EDS guidance is required.

### Reference Discovery

Choose the applicable discovery workflow based on the supplied reference.
Figma takes precedence when both reference types are provided.

#### Reference page URL

Use this workflow only when a reference page URL is provided and no Figma
design reference is provided. Use Chrome DevTools MCP on the reference page
only. Do not use it to inspect or validate the local EDS implementation.

1. Open the reference page.
2. Locate the component using the supplied CSS selector. If no selector was
   provided, inspect the page and identify the component before continuing.
3. Capture:
   - Rendered DOM
   - Computed styles
   - Layout structure
   - Responsive behaviour
   - Images
   - Links
   - Variants
   - Animations, transitions, and scroll effects, if present
   - Console messages
   - Relevant network requests

4. Inspect:
   - Mobile
   - Tablet
   - Desktop

5. Capture screenshots for all tested breakpoints.

#### Figma design reference

If a Figma reference is provided, use the Figma MCP design-to-code workflow
to inspect the referenced component or frame. Do not use Chrome DevTools MCP
for reference discovery or implementation validation.

Capture:

- Design structure and component hierarchy
- Component properties and variants
- Typography, colors, spacing, and layout
- Images, icons, and other assets
- Responsive or layout constraints
- Interaction and motion details, if present

Use the Figma output as a design reference to adapt to this repository. Reuse
the project's existing blocks, patterns, and Datacom style tokens rather than
copying generated code verbatim.

### Analysis

Determine:

- Component purpose
- Required content
- Optional content
- Variants
- Responsive behaviour
- Accessibility requirements
- Performance considerations

Do not assume the CSS class should become the block name.

Use content-modeling to determine whether the correct solution is:

- Default content
- Auto-blocking
- Section style
- Existing block variant
- New block

Explain the decision.

### Motion and animation (optional)

Only if the reference component has visible motion:

- Identify animations, transitions, scroll effects, and other motion
- Document triggers, timing, and affected elements
- Replicate equivalent motion in the block implementation where practical
- Respect `prefers-reduced-motion` where motion is implemented
- Note any animation intentionally omitted and why

If the reference component has no meaningful motion, skip this section.

### Existing Project Assessment

Use block-inventory to determine:

- Whether a similar block already exists
- Whether the component can reuse an existing block
- Whether a variant should be added instead

Prefer reuse before creating a new block.

### Authoring Model

Design a document authoring model.

Provide:

- Example document structure
- Block table structure if needed
- Variant strategy
- Optional fields
- Required fields

Add the authoring example to a JSDoc-style file header comment in the block's
JavaScript file, following the pattern used in `blocks/hero/hero.js`. The
comment must include:

- A short description of the block and its variants
- A complete authoring table example
- A compact or minimum example when useful
- Required and optional content rules
- Relevant formatting instructions for authors
- An HTML table equivalent when it improves clarity

Ensure authors never need to enter:

- CSS classes
- HTML
- DOM structure
- Pixel values

### Implementation

Implement the block using repository conventions.

Requirements:

- Defensive decoration
- Semantic HTML
- Scoped CSS
- Responsive layout
- Accessible markup
- Minimal JavaScript
- No unnecessary dependencies

### Manual Testing Handoff

Do not run browser validation against a local preview.

Provide a concise manual test checklist for the user, including:

- Suggested test content path
- Variants to verify
- Key behaviours to check
- Responsive breakpoints to review
- Accessibility checks to perform
- Animation and motion checks, if applicable

### Deliverables

Provide:

1. Analysis summary
2. Selected authoring pattern
3. Authoring example
4. Files created
5. Files modified
6. Reference inspection summary
7. Manual test checklist
8. Known limitations