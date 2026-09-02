Create a new Adobe Edge Delivery Services block by analysing an existing
component.

### Reference Information

Component CSS class:
[INSERT CLASS]
Example: page-title-hero

Reference page URL:
[INSERT URL]

Local EDS preview URL:
[INSERT URL]

Repository:
[INSERT PATH OR URL]

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
7. testing-blocks
8. code-review

Use docs-search and da-content whenever Adobe EDS guidance is required.

### Chrome DevTools MCP Discovery

Use Chrome DevTools MCP to:

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

### Validation

Use Chrome DevTools MCP to compare:

Reference Component
vs
New EDS Implementation

Validate:

- Layout
- Responsiveness
- Content behaviour
- Accessibility
- Console output
- Network requests

Classify differences as:

- Intentional EDS adaptation
- Accessibility improvement
- Authoring improvement
- Responsive improvement
- Defect

Fix defects before completion.

### Deliverables

Provide:

1. Analysis summary
2. Selected authoring pattern
3. Authoring example
4. Files created
5. Files modified
6. Browser inspection summary
7. Test results
8. Screenshot comparisons
9. Accessibility findings
10. Known limitations