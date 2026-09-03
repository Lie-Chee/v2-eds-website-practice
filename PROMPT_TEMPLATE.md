Create a new Adobe Edge Delivery Services block by analysing an existing
component.

### Reference Information

Name of the block:
[INSERT NAME]

Component CSS class:
[INSERT CLASS]
Example: page-title-hero

Reference page URL:
[INSERT URL]

Design reference (optional):
[INSERT FIGMA OR SCREENSHOT]

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

### Chrome DevTools MCP Discovery

Use Chrome DevTools MCP on the reference page only. Do not use it to inspect
or validate the local EDS implementation.

1. Open the reference page.
2. Locate the component using the CSS selector:

   .[INSERT CLASS]

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
6. Reference page inspection summary
7. Manual test checklist
8. Known limitations