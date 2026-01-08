# Front-End Preservation Review

> **STATUS:** PRODUCTION LOCKED
> **POLICY:** "If it works, don't touch it."

## 1. Appreciation of Current State
The compiled codebase (`index.html`, `css/*.css`, `js/*.js`) functions correctly across devices. The layout logic, based on standard flow and `IntersectionObserver`, is stable. No refactoring is required or permitted.

## 2. Zero-Risk Preservation Strategies

### Documentation Practices
*   **"Load Bearing" Comments:** Identify implementation details that are implicitly coupled.
    *   *Action:* Add comments near class definitions like `.reveal-item` or `.faq-item` in HTML:
        `<!-- CLASS USED BY JS for ScrollReveal - DO NOT RENAME -->`
    *   *Action:* In CSS files, mark specific magic numbers (e.g., specific margins or z-indices) with:
        `/* LAYOUT CRITICAL - PRESERVES MOBILE ALIGNMENT */`
*   **Read-Only README:** Create a `README.md` that explicitly states the "No Refactor" policy at the very top.

### Locking Fragile Sections
*   **Script Order Protection:** The script loading order at the bottom of `index.html` is critical (DataStore `app.js` must likely load before the inline logic).
    *   *Strategy:* Wrap these in comments:
        ```html
        <!-- CRITICAL DEPENDENCY ORDER: START -->
        <script src="js/app.js"></script>
        <script>...</script>
        <!-- CRITICAL DEPENDENCY ORDER: END -->
        ```
*   **HTML Structure Locks:** For complex grids like `.services-grid` or `.gallery-grid`:
    *   *Strategy:* Add a comment at the parent container:
        `<!-- GRID LAYOUT: Changing direct children count or order may break responsive wrap -->`

### Safe Extension Strategies
*   **The "Append-Only" Rule:** never modify existing CSS rules to change a look.
    *   *Strategy:* If a new visual flair is absolutely needed, create `css/extensions.css` and load it **last** in `<head>`.
*   **New Content Injection:** When adding new keys to `DataStore` or new HTML sections:
    *   *Strategy:* Copy-paste an existing successful block (e.g., a `.service-card`) exactly, changing only inner text/images. Do not attempt to "optimize" the HTML structure of the new card.

### Non-Visual Performance Flags
*   **Image Dimension Attributes:** (Safe to add) Ensure `<img>` tags have `width` and `height` attributes to prevent layout shifts (CLS) during loading, provided they match the rendered aspect ratio.
*   **Preconnects:** (Safe to add) Adding `<link rel="preconnect">` for fonts or external domains in `<head>` does not touch layout.

### Testing Discipline
*   **Visual Baseline:** Before touching *anything* (even text), take full-page screenshots of Mobile (375px), Tablet (768px), and Desktop (1440px).
*   **The "Scroll Test":** Verify that `IntersectionObserver` animations trigger correctly on all viewports after any text update. changing content length can sometimes break scroll thresholds.

## 3. Explicit Prohibitions (Do Not Do)
*   **No CSS Cleanup:** Do not remove "unused" classes. They might be used by dynamic JS logic you haven't seen yet.
*   **No Semantic Refactors:** Do not change `<div>` to `<article>` or `<section>` "for better SEO" if strictly not requested. It carries risk of breaking CSS selectors targeting specific tags.
*   **No Framework Adoption:** Do not suggest moving to React, Vue, or Tailwind. The current vanilla stack is the most durable.
*   **No "Modern" CSS:** Do not replace `float` or `flex` with `grid` just to be modern.
